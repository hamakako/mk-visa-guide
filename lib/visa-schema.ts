import { z } from "zod";

export const travelPurposes = ["tourism", "business", "family", "study", "medical", "transit"] as const;

export const VisaCheckInputSchema = z.object({
  passportNationality: z.string().trim().min(2).max(3),
  destinationCountry: z.string().trim().min(2).max(3),
  currentResidence: z.string().trim().min(2).max(3),
  purpose: z.enum(travelPurposes),
  stayLength: z.coerce.number().int().min(1).max(365),
  conditions: z.object({
    schengenVisa: z.boolean(),
    usaVisa: z.boolean(),
    ukVisa: z.boolean(),
    canadaVisa: z.boolean(),
    australiaVisa: z.boolean(),
    gccResidency: z.boolean(),
    euResidency: z.boolean(),
    ukResidency: z.boolean(),
    westernResidency: z.boolean(),
    otherResidencePermit: z.boolean(),
    previousRefusals: z.boolean(),
  }),
  otherResidencePermitCountry: z.string().trim().max(3).optional(),
}).superRefine((data, ctx) => {
  if (data.conditions.otherResidencePermit && !data.otherResidencePermitCountry) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["otherResidencePermitCountry"],
      message: "وڵاتی مۆڵەتی نیشتەجێبوون هەڵبژێرە.",
    });
  }
});

export const VisaResultSchema = z.object({
  status: z.enum(["visa_free", "visa_required", "evisa_available", "visa_on_arrival", "transit_only", "uncertain"]),
  confidence: z.enum(["high", "medium", "low"]),
  summary_ku: z.string().min(1),
  visa_requirement_ku: z.string().min(1),
  application_steps_ku: z.array(z.string()),
  required_documents_ku: z.array(z.string()),
  special_conditions_ku: z.array(z.string()),
  estimated_processing_time_ku: z.string(),
  estimated_fee_ku: z.string(),
  important_notes_ku: z.array(z.string()),
  warnings_ku: z.array(z.string()),
  sources: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
    publisher: z.string(),
  })).max(12),
  last_checked_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type VisaCheckInput = z.infer<typeof VisaCheckInputSchema>;
export type VisaResult = z.infer<typeof VisaResultSchema>;

export const visaResultJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    status: { type: "string", enum: ["visa_free", "visa_required", "evisa_available", "visa_on_arrival", "transit_only", "uncertain"] },
    confidence: { type: "string", enum: ["high", "medium", "low"] },
    summary_ku: { type: "string" },
    visa_requirement_ku: { type: "string" },
    application_steps_ku: { type: "array", items: { type: "string" } },
    required_documents_ku: { type: "array", items: { type: "string" } },
    special_conditions_ku: { type: "array", items: { type: "string" } },
    estimated_processing_time_ku: { type: "string" },
    estimated_fee_ku: { type: "string" },
    important_notes_ku: { type: "array", items: { type: "string" } },
    warnings_ku: { type: "array", items: { type: "string" } },
    sources: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          url: { type: "string" },
          publisher: { type: "string" },
        },
        required: ["title", "url", "publisher"],
      },
    },
    last_checked_date: { type: "string" },
  },
  required: [
    "status", "confidence", "summary_ku", "visa_requirement_ku", "application_steps_ku",
    "required_documents_ku", "special_conditions_ku", "estimated_processing_time_ku",
    "estimated_fee_ku", "important_notes_ku", "warnings_ku", "sources", "last_checked_date",
  ],
} as const;
