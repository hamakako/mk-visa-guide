import { GoogleGenAI } from "@google/genai";
import { countryLabel } from "@/lib/countries";
import {
  VisaCheckInput,
  VisaResult,
  VisaResultSchema,
  visaResultJsonSchema,
} from "@/lib/visa-schema";

const SYSTEM_PROMPT = `
تۆ یاریدەدەرێکی توێژینەوەی یاساکانی ڤیزایت بۆ ئاژانسی گەشتیاریی کوردی MK Business and Travel.

یاساکانی کارکردن:
1. تەنها بە کوردیی سۆرانیی ڕوون و سادە وەڵام بدەوە، جگە لە ناوی فەرمیی وڵات، دامەزراوە و جۆری ڤیزا.
2. پێش وەڵامدانەوە، یاساکانی ئێستای گەشت و ڤیزا بە Google Search بە وردی بپشکنە.
3. سەرچاوەی حکومی، فەرمانگەی کۆچبەری، باڵیۆزخانە، کۆنسوڵگەری، VFS/TLS/BLS و پۆرتاڵی فەرمی لە پێشینەدا دابنێ. IATA، هێڵی ئاسمانی و ڕێنمایی گەشت تەنها وەک سەرچاوەی یارمەتیدەر بەکاربهێنە.
4. نەتەوەی پاسپۆرت، وڵاتی نیشتەجێبوونی ئێستا، ڤیزا و مۆڵەتی نیشتەجێبوونی کارپێکراو، مەبەستی گەشت، ماوەی مانەوە و ترانزیت هەموویان لەبەرچاو بگرە.
5. هیچ یاسا، بەروار، تێچوو یان ماوەیەک داهێنان مەکە. ئەگەر سەرچاوەی باوەڕپێکراو نەدۆزرایەوە، status بکە uncertain و confidence بکە low.
6. ئەگەر تێچوو یان ماوەی پرۆسەکە دیار نییە، بە ڕوونی بڵێ دیار نییە. لە دوای هەر خەملاندنێک بنووسە: «پێویستە دووبارە لەلایەن باڵیۆزخانە/فەرمانگە پشتڕاست بکرێتەوە».
7. ئەگەر ڤیزای شینگن/ئەمریکا/بەریتانیا/کەنەدا/ئوسترالیا یان مۆڵەتی نیشتەجێبوونی GCC کاریگەری هەیە، مەرجە وردەکان ڕوون بکەوە؛ ئەگەر کاریگەریی پشتڕاستکراو نییە، ئەوەش بڵێ.
8. لە warnings_ku هەمیشە ئەم ئاگادارییە یان هاوشێوەیەکی ڕوونی دابنێ: «یاساکانی ڤیزا دەگۆڕێن؛ پێش کڕینی بلیت یان حجزکردن، زانیارییەکە لەلایەن باڵیۆزخانە یان فەرمانگەی فەرمی پشتڕاست بکەرەوە.»
9. تەنها JSONـی دروست و گونجاو لەگەڵ شێمای داواکراو بگەڕێنەوە؛ هیچ دەقێک لە دەرەوەی JSON مەنووسە.
`;

const purposeLabels: Record<VisaCheckInput["purpose"], string> = {
  tourism: "گەشتیاری",
  business: "کاروبار",
  family: "سەردانی خێزان",
  study: "خوێندن",
  medical: "چارەسەری پزیشکی",
  transit: "ترانزیت",
};

const conditionLabels: Record<keyof VisaCheckInput["conditions"], string> = {
  schengenVisa: "ڤیزای شینگنی کارپێکراو هەیە",
  usaVisa: "ڤیزای ئەمریکای کارپێکراو هەیە",
  ukVisa: "ڤیزای بەریتانیای کارپێکراو هەیە",
  canadaVisa: "ڤیزای کەنەدای کارپێکراو هەیە",
  australiaVisa: "ڤیزای ئوسترالیای کارپێکراو هەیە",
  gccResidency: "مۆڵەتی نیشتەجێبوونی GCC هەیە",
  euResidency: "مۆڵەتی نیشتەجێبوونی یەکێتی ئەوروپا/شینگن هەیە",
  ukResidency: "مۆڵەتی نیشتەجێبوونی بەریتانیا هەیە",
  westernResidency: "مۆڵەتی نیشتەجێبوونی ئەمریکا/کەنەدا/ئوسترالیا هەیە",
  otherResidencePermit: "مۆڵەتی نیشتەجێبوونی وڵاتێکی تر هەیە",
  previousRefusals: "پێشتر ڤیزای ڕەتکراوەتەوە",
};

function buildPrompt(input: VisaCheckInput) {
  const activeConditions = Object.entries(input.conditions)
    .filter(([, enabled]) => enabled)
    .map(([key]) => `- ${conditionLabels[key as keyof VisaCheckInput["conditions"]]}`);

  return `
ئەم داواکارییە بپشکنە:
- نەتەوەی پاسپۆرت: ${countryLabel(input.passportNationality)}
- وڵاتی مەبەست: ${countryLabel(input.destinationCountry)}
- وڵاتی نیشتەجێبوونی ئێستا: ${countryLabel(input.currentResidence)}
- مەبەستی گەشت: ${purposeLabels[input.purpose]}
- ماوەی مانەوە: ${input.stayLength} ڕۆژ
- بارودۆخە تایبەتەکان:
${activeConditions.length ? activeConditions.join("\n") : "- هیچ بارودۆخێکی تایبەت دیاری نەکراوە"}
${input.otherResidencePermitCountry ? `- وڵاتی مۆڵەتی نیشتەجێبوونی تر: ${countryLabel(input.otherResidencePermitCountry)}` : ""}

بەرواری پشکنین: ${new Date().toISOString().slice(0, 10)}
سەرچاوە فەرمییە بەکارهاتووەکان بە وردی دیاری بکە.
`;
}

type GroundingChunk = { web?: { title?: string; uri?: string } };

function isSafeHttpUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function parseJsonResponse(text: string) {
  const trimmed = text.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("Gemini did not return a JSON object");
  return JSON.parse(trimmed.slice(start, end + 1));
}

function isQuotaError(error: unknown) {
  const value = error as { status?: number; message?: string };
  return value?.status === 429 || /quota|RESOURCE_EXHAUSTED/i.test(value?.message || "");
}

function isTemporaryServiceError(error: unknown) {
  const value = error as { status?: number; message?: string };
  return [500, 502, 503, 504].includes(value?.status || 0) || /UNAVAILABLE|high demand|temporar/i.test(value?.message || "");
}

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function checkVisaWithGemini(input: VisaCheckInput): Promise<VisaResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
  const fallbackModel = process.env.GEMINI_FALLBACK_MODEL || "gemini-2.5-flash-lite";
  const generate = async (request: Parameters<typeof ai.models.generateContent>[0]) => {
    let lastError: unknown;
    for (let attempt = 0; attempt < 4; attempt += 1) {
      try {
        return await ai.models.generateContent(request);
      } catch (error) {
        lastError = error;
        if (!isTemporaryServiceError(error) || attempt === 3) throw error;
        await wait(800 * 2 ** attempt);
      }
    }
    throw lastError;
  };

  // One grounded call: search current rules and return JSON text for strict server validation.
  let activeModel = model;
  let response;
  const requestFor = (selectedModel: string) => ({
    model: selectedModel,
    contents: `${buildPrompt(input)}\n\nشێمای JSON کە دەبێت بە تەواوی پەیڕەو بکرێت:\n${JSON.stringify(visaResultJsonSchema)}`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      tools: [{ googleSearch: {} }],
      temperature: 0.1,
    },
  });

  try {
    response = await generate(requestFor(activeModel));
  } catch (error) {
    if (!isQuotaError(error) || fallbackModel === activeModel) throw error;
    activeModel = fallbackModel;
    response = await generate(requestFor(activeModel));
  }

  if (!response.text) throw new Error("Gemini returned an empty grounded response");
  const parsed = VisaResultSchema.parse(parseJsonResponse(response.text));

  const chunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? []) as GroundingChunk[];
  const groundedSources = chunks
    .filter((chunk): chunk is { web: { title?: string; uri: string } } => Boolean(chunk.web?.uri && isSafeHttpUrl(chunk.web.uri)))
    .map((chunk) => ({
      title: chunk.web.title || "سەرچاوەی گەڕانی گووگڵ",
      url: chunk.web.uri,
      publisher: chunk.web.title || "سەرچاوەی وێب",
    }))
    .filter((source, index, all) => all.findIndex((item) => item.url === source.url) === index)
    .slice(0, 12);

  // A confident visa answer without a verifiable URL is not safe to present as settled.
  if (groundedSources.length === 0) {
    return {
      ...parsed,
      status: "uncertain",
      confidence: "low",
      summary_ku: "نەتوانرا سەرچاوەیەکی فەرمی و باوەڕپێکراو بۆ ئەم حاڵەتە پشتڕاست بکرێتەوە.",
      warnings_ku: [
        ...parsed.warnings_ku,
        "ئەم زانیارییە پێویستە لەلایەن باڵیۆزخانە یان فەرمانگەی فەرمی پشتڕاست بکرێتەوە.",
      ],
      sources: [],
    };
  }

  return { ...parsed, sources: groundedSources };
}
