import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { checkVisaWithGemini } from "@/lib/gemini";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";
import { VisaCheckInput, VisaCheckInputSchema } from "@/lib/visa-schema";
import { getVerifiedFallback } from "@/lib/verified-fallbacks";

export const runtime = "nodejs";
export const maxDuration = 60;

const FRIENDLY_ERROR = "ببورە، لە ئێستادا ناتوانین پشکنینەکە تەواو بکەین. تکایە دووبارە هەوڵ بدەوە یان پەیوەندی بە ئێمە بکە.";

async function withTimeout<T>(promise: Promise<T>, milliseconds: number): Promise<T> {
  let timeout: ReturnType<typeof setTimeout>;
  const deadline = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => reject(new Error("Gemini request timed out")), milliseconds);
  });

  try {
    return await Promise.race([promise, deadline]);
  } finally {
    clearTimeout(timeout!);
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const limit = checkRateLimit(ip);

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "ژمارەی پشکنینەکانت بۆ ئەم کاتژمێرە تەواو بووە. تکایە دواتر هەوڵ بدەوە." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) },
      },
    );
  }

  let input: VisaCheckInput | undefined;
  try {
    const body = await request.json();
    input = VisaCheckInputSchema.parse(body);
    const result = await withTimeout(checkVisaWithGemini(input), 55_000);

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store",
        "X-RateLimit-Remaining": String(limit.remaining),
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "هەندێک زانیاری دروست نییە. تکایە خانەکان دووبارە بپشکنەوە." },
        { status: 400 },
      );
    }

    if (input) {
      const fallback = getVerifiedFallback(input);
      if (fallback) {
        return NextResponse.json(fallback, {
          headers: {
            "Cache-Control": "public, max-age=3600",
            "X-Data-Source": "verified-official-fallback",
            "X-RateLimit-Remaining": String(limit.remaining),
          },
        });
      }
    }

    console.error("Visa check failed:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: FRIENDLY_ERROR }, { status: 503 });
  }
}
