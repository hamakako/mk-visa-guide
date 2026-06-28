import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { checkVisaWithOpenAI } from "@/lib/openai";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";
import { VisaCheckInput, VisaCheckInputSchema } from "@/lib/visa-schema";
import { getVerifiedFallback } from "@/lib/verified-fallbacks";
import {
  clearPendingVisaResult,
  consumeDailyAiBudget,
  getCachedVisaResult,
  getPendingVisaResult,
  setCachedVisaResult,
  setPendingVisaResult,
  visaCacheKey,
} from "@/lib/free-quota";

export const runtime = "nodejs";
export const maxDuration = 60;

const FRIENDLY_ERROR = "ببورە، لە ئێستادا ناتوانین پشکنینەکە تەواو بکەین. تکایە دووبارە هەوڵ بدەوە یان پەیوەندی بە ئێمە بکە.";
const DAILY_LIMIT_ERROR = "سنووری پاراستنی ڕۆژانەی پشکنینە نوێکان بۆ ئەمڕۆ تەواو بووە. ئەنجامە پاشەکەوتکراوەکان هێشتا بەردەستن؛ تکایە سبەی دووبارە هەوڵ بدەوە.";

async function withTimeout<T>(promise: Promise<T>, milliseconds: number): Promise<T> {
  let timeout: ReturnType<typeof setTimeout>;
  const deadline = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => reject(new Error("AI request timed out")), milliseconds);
  });

  try {
    return await Promise.race([promise, deadline]);
  } finally {
    clearTimeout(timeout!);
  }
}

export async function POST(request: NextRequest) {
  let input: VisaCheckInput | undefined;
  let key = "";
  let ownsPendingRequest = false;
  try {
    const body = await request.json();
    input = VisaCheckInputSchema.parse(body);
    key = visaCacheKey(input);

    const cached = getCachedVisaResult(key);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { "Cache-Control": "private, max-age=300", "X-Visa-Cache": "HIT" },
      });
    }

    // Official curated answers do not consume the small AI allowance.
    const verified = getVerifiedFallback(input);
    if (verified) {
      setCachedVisaResult(key, verified);
      return NextResponse.json(verified, {
        headers: { "Cache-Control": "private, max-age=300", "X-Visa-Cache": "VERIFIED" },
      });
    }

    const existingRequest = getPendingVisaResult(key);
    if (existingRequest) {
      const result = await existingRequest;
      return NextResponse.json(result, {
        headers: { "Cache-Control": "private, max-age=300", "X-Visa-Cache": "COALESCED" },
      });
    }

    const ip = getClientIp(request.headers);
    const limit = checkRateLimit(ip);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "ژمارەی پشکنینە نوێیەکانت بۆ ئەم کاتژمێرە تەواو بووە. ئەنجامە پاشەکەوتکراوەکان هێشتا بەردەستن." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) } },
      );
    }

    const budget = consumeDailyAiBudget();
    if (!budget.allowed) {
      return NextResponse.json({ error: DAILY_LIMIT_ERROR }, { status: 429 });
    }

    const task = withTimeout(checkVisaWithOpenAI(input), 55_000).then((result) => {
      setCachedVisaResult(key, result);
      return result;
    });
    setPendingVisaResult(key, task);
    ownsPendingRequest = true;
    const result = await task;

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "private, max-age=300",
        "X-Visa-Cache": "MISS",
        "X-Daily-AI-Remaining": String(budget.remaining),
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

    console.error("Visa check failed:", error instanceof Error ? error.message : "Unknown error");
    const message = error instanceof Error ? error.message : "";
    if (/quota|insufficient_quota|429/i.test(message)) {
      return NextResponse.json({ error: DAILY_LIMIT_ERROR }, { status: 429 });
    }
    return NextResponse.json({ error: FRIENDLY_ERROR }, { status: 503 });
  } finally {
    if (key && ownsPendingRequest) clearPendingVisaResult(key);
  }
}
