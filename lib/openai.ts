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
2. پێش وەڵامدانەوە، بە ئامرازی web search یاساکانی ئێستای گەشت و ڤیزا بە وردی بپشکنە.
3. سەرچاوەی حکومی، فەرمانگەی کۆچبەری، باڵیۆزخانە، کۆنسوڵگەری، VFS/TLS/BLS و پۆرتاڵی فەرمی لە پێشینەدا دابنێ. IATA، هێڵی ئاسمانی و ڕێنمایی گەشت تەنها وەک سەرچاوەی یارمەتیدەر بەکاربهێنە.
4. نەتەوەی پاسپۆرت، وڵاتی نیشتەجێبوونی ئێستا، ڤیزا و مۆڵەتی نیشتەجێبوونی کارپێکراو، مەبەستی گەشت، ماوەی مانەوە و ترانزیت هەموویان لەبەرچاو بگرە.
5. هیچ یاسا، بەروار، تێچوو یان ماوەیەک داهێنان مەکە. ئەگەر سەرچاوەی باوەڕپێکراو نەدۆزرایەوە، status بکە uncertain و confidence بکە low.
6. ئەگەر تێچوو یان ماوەی پرۆسەکە دیار نییە، بە ڕوونی بڵێ دیار نییە. لە دوای هەر خەملاندنێک بنووسە: «پێویستە دووبارە لەلایەن باڵیۆزخانە/فەرمانگە پشتڕاست بکرێتەوە».
7. ئەگەر ڤیزای شینگن/ئەمریکا/بەریتانیا/کەنەدا/ئوسترالیا یان مۆڵەتی نیشتەجێبوونی GCC کاریگەری هەیە، مەرجە وردەکان ڕوون بکەوە؛ ئەگەر کاریگەریی پشتڕاستکراو نییە، ئەوەش بڵێ.
8. لە warnings_ku هەمیشە ئەم ئاگادارییە یان هاوشێوەیەکی ڕوونی دابنێ: «یاساکانی ڤیزا دەگۆڕێن؛ پێش کڕینی بلیت یان حجزکردن، زانیارییەکە لەلایەن باڵیۆزخانە یان فەرمانگەی فەرمی پشتڕاست بکەرەوە.»
9. لە sources تەنها URLـی ڕاستەقینەی ئەو سەرچاوانە دابنێ کە لە web searchـەکەدا بەکارهاتوون.
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

type SearchSource = { title: string; url: string; publisher: string };
type OpenAIErrorBody = { error?: { message?: string; code?: string; type?: string } };

class OpenAIRequestError extends Error {
  constructor(message: string, readonly status?: number, readonly code?: string) {
    super(message);
  }
}

function isSafeHttpUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function normalizeUrl(url: string) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return url;
  }
}

function publisherFromUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "سەرچاوەی وێب";
  }
}

function responseText(payload: unknown) {
  if (!payload || typeof payload !== "object") return "";
  const root = payload as { output_text?: unknown; output?: unknown };
  if (typeof root.output_text === "string") return root.output_text;
  if (!Array.isArray(root.output)) return "";

  for (const item of root.output) {
    if (!item || typeof item !== "object") continue;
    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      if (part && typeof part === "object" && (part as { type?: unknown }).type === "output_text") {
        const text = (part as { text?: unknown }).text;
        if (typeof text === "string") return text;
      }
    }
  }
  return "";
}

function webSources(payload: unknown) {
  if (!payload || typeof payload !== "object") return [] as SearchSource[];
  const output = (payload as { output?: unknown }).output;
  if (!Array.isArray(output)) return [] as SearchSource[];

  const sources: SearchSource[] = [];
  const addSource = (value: unknown) => {
    if (!value || typeof value !== "object") return;
    const source = value as { url?: unknown; title?: unknown };
    if (typeof source.url !== "string" || !isSafeHttpUrl(source.url)) return;
    sources.push({
      title: typeof source.title === "string" && source.title ? source.title : publisherFromUrl(source.url),
      url: source.url,
      publisher: publisherFromUrl(source.url),
    });
  };

  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const record = item as { type?: unknown; action?: unknown; content?: unknown };
    if (record.type === "web_search_call" && record.action && typeof record.action === "object") {
      const actionSources = (record.action as { sources?: unknown }).sources;
      if (Array.isArray(actionSources)) actionSources.forEach(addSource);
    }
    if (!Array.isArray(record.content)) continue;
    for (const part of record.content) {
      if (!part || typeof part !== "object") continue;
      const annotations = (part as { annotations?: unknown }).annotations;
      if (Array.isArray(annotations)) annotations.forEach(addSource);
    }
  }

  return sources.filter((source, index, all) =>
    all.findIndex((candidate) => normalizeUrl(candidate.url) === normalizeUrl(source.url)) === index,
  );
}

function isRetryable(error: unknown) {
  if (!(error instanceof OpenAIRequestError)) return false;
  if (error.code === "insufficient_quota") return false;
  return error.status === 408 || error.status === 409 || error.status === 429 || (error.status !== undefined && error.status >= 500);
}

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function checkVisaWithOpenAI(input: VisaCheckInput): Promise<VisaResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

  const model = process.env.OPENAI_MODEL || "gpt-5.4-mini";
  const requestBody = {
    model,
    instructions: SYSTEM_PROMPT,
    input: buildPrompt(input),
    tools: [{ type: "web_search", search_context_size: "medium" }],
    tool_choice: "auto",
    include: ["web_search_call.action.sources"],
    reasoning: { effort: "low" },
    max_output_tokens: 3500,
    text: {
      verbosity: "low",
      format: {
        type: "json_schema",
        name: "visa_result",
        strict: true,
        schema: visaResultJsonSchema,
      },
    },
  };

  let payload: unknown;
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(52_000),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({})) as OpenAIErrorBody;
        throw new OpenAIRequestError(
          body.error?.message || `OpenAI request failed (${response.status})`,
          response.status,
          body.error?.code || body.error?.type,
        );
      }

      payload = await response.json();
      lastError = undefined;
      break;
    } catch (error) {
      lastError = error;
      if (!isRetryable(error) || attempt === 2) throw error;
      await wait(800 * 2 ** attempt);
    }
  }
  if (lastError) throw lastError;

  const text = responseText(payload);
  if (!text) throw new Error("OpenAI returned an empty response");
  const parsed = VisaResultSchema.parse(JSON.parse(text));
  const searchedSources = webSources(payload);
  const searchedByUrl = new Map(searchedSources.map((source) => [normalizeUrl(source.url), source]));
  const groundedSources = parsed.sources
    .filter((source) => isSafeHttpUrl(source.url))
    .flatMap((source) => {
      const verified = searchedByUrl.get(normalizeUrl(source.url));
      return verified ? [{ ...source, url: verified.url }] : [];
    })
    .filter((source, index, all) => all.findIndex((candidate) => normalizeUrl(candidate.url) === normalizeUrl(source.url)) === index)
    .slice(0, 12);

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
