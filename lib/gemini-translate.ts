import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { VisaResult, VisaResultSchema } from "@/lib/visa-schema";

const VisaTranslationSchema = z.object({
  summary_ku: z.string().min(1),
  visa_requirement_ku: z.string().min(1),
  application_steps_ku: z.array(z.string()),
  required_documents_ku: z.array(z.string()),
  special_conditions_ku: z.array(z.string()),
  estimated_processing_time_ku: z.string(),
  estimated_fee_ku: z.string(),
  important_notes_ku: z.array(z.string()),
  warnings_ku: z.array(z.string()),
});

const translationJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary_ku: { type: "string" },
    visa_requirement_ku: { type: "string" },
    application_steps_ku: { type: "array", items: { type: "string" } },
    required_documents_ku: { type: "array", items: { type: "string" } },
    special_conditions_ku: { type: "array", items: { type: "string" } },
    estimated_processing_time_ku: { type: "string" },
    estimated_fee_ku: { type: "string" },
    important_notes_ku: { type: "array", items: { type: "string" } },
    warnings_ku: { type: "array", items: { type: "string" } },
  },
  required: [
    "summary_ku",
    "visa_requirement_ku",
    "application_steps_ku",
    "required_documents_ku",
    "special_conditions_ku",
    "estimated_processing_time_ku",
    "estimated_fee_ku",
    "important_notes_ku",
    "warnings_ku",
  ],
} as const;

function removeInlineCitations(text: string) {
  return text
    .replace(/\s*\(\[[^\]]+\]\(https?:\/\/[^)]+\)\)/g, "")
    .replace(/\s*\[[^\]]+\]\(https?:\/\/[^)]+\)/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function cleanTranslationInput(result: VisaResult) {
  return {
    summary_ku: removeInlineCitations(result.summary_ku),
    visa_requirement_ku: removeInlineCitations(result.visa_requirement_ku),
    application_steps_ku: result.application_steps_ku.map(removeInlineCitations),
    required_documents_ku: result.required_documents_ku.map(removeInlineCitations),
    special_conditions_ku: result.special_conditions_ku.map(removeInlineCitations),
    estimated_processing_time_ku: removeInlineCitations(result.estimated_processing_time_ku),
    estimated_fee_ku: removeInlineCitations(result.estimated_fee_ku),
    important_notes_ku: result.important_notes_ku.map(removeInlineCitations),
    warnings_ku: result.warnings_ku.map(removeInlineCitations),
  };
}

export async function improveVisaSoraniWithGemini(result: VisaResult): Promise<VisaResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_TRANSLATION_MODEL || "gemini-2.5-flash";
  const sourceText = cleanTranslationInput(result);
  const response = await ai.models.generateContent({
    model,
    contents: `
ئەم زانیارییەی ڤیزا لەلایەن سیستەمی توێژینەوەوە پشتڕاست کراوەتەوە. تەنها زمانەکەی چاک بکە.

ئەرک:
- هەموو دەقەکان بە کوردیی سۆرانیی سروشتی، پیشەیی و زۆر ڕوون دابڕێژەوە.
- هیچ یاسا، مەرج، ژمارە، بەروار، ماوە، نرخ، ناوی وڵات یان ناوی دامەزراوەیەک مەگۆڕە.
- هیچ زانیارییەک زیاد یان کەم مەکە و هیچ بڕیارێکی نوێی ڤیزا مەدە.
- وشە فەرمییە نێودەوڵەتییەکان وەک Schengen، e-Visa، VFS، Embassy و Visa دەتوانیت بە شێوەی ناسراو بهێڵیتەوە.
- لینک، Markdown یان citation لە ناو دەقەکان مەنووسە؛ سەرچاوەکان لە بەشێکی جیاوازدا پیشان دەدرێن.
- تەنها JSONـی گونجاو بە شێمای داواکراو بگەڕێنەوە.

دەقی سەرچاوە:
${JSON.stringify(sourceText)}
`,
    config: {
      temperature: 0.1,
      responseMimeType: "application/json",
      responseJsonSchema: translationJsonSchema,
    },
  });

  if (!response.text) throw new Error("Gemini returned an empty translation");
  const translated = VisaTranslationSchema.parse(JSON.parse(response.text));
  return VisaResultSchema.parse({ ...result, ...translated });
}
