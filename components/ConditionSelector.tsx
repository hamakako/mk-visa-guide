"use client";

import { Check } from "lucide-react";
import { VisaCheckInput } from "@/lib/visa-schema";

type ConditionKey = keyof VisaCheckInput["conditions"];

const options: Array<{ key: ConditionKey; label: string }> = [
  { key: "schengenVisa", label: "ڤیزای شینگنی کارپێکراوم هەیە" },
  { key: "usaVisa", label: "ڤیزای ئەمریکای کارپێکراوم هەیە" },
  { key: "ukVisa", label: "ڤیزای بەریتانیای کارپێکراوم هەیە" },
  { key: "canadaVisa", label: "ڤیزای کەنەدای کارپێکراوم هەیە" },
  { key: "australiaVisa", label: "ڤیزای ئوسترالیای کارپێکراوم هەیە" },
  { key: "gccResidency", label: "مۆڵەتی نیشتەجێبوونی GCCـم هەیە" },
  { key: "euResidency", label: "مۆڵەتی نیشتەجێبوونی ئەوروپا/شینگنم هەیە" },
  { key: "ukResidency", label: "مۆڵەتی نیشتەجێبوونی بەریتانیام هەیە" },
  { key: "westernResidency", label: "مۆڵەتی نیشتەجێبوونی ئەمریکا/کەنەدا/ئوسترالیام هەیە" },
  { key: "otherResidencePermit", label: "مۆڵەتی نیشتەجێبوونی وڵاتێکی ترم هەیە" },
  { key: "previousRefusals", label: "پێشتر ڤیزام ڕەتکراوەتەوە" },
];

type Props = {
  value: VisaCheckInput["conditions"];
  onChange: (value: VisaCheckInput["conditions"]) => void;
};

export function ConditionSelector({ value, onChange }: Props) {
  return (
    <fieldset>
      <legend className="mb-2 text-lg font-bold text-brand-navy">بارودۆخی تایبەت</legend>
      <p className="mb-4 text-sm leading-7 text-slate-500">هەر ئەو بژاردانە دیاری بکە کە لە ئێستادا کارپێکراون و پەیوەندیدارن.</p>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {options.map((option) => {
          const checked = value[option.key];
          return (
            <label
              key={option.key}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${
                checked ? "border-brand-teal bg-brand-sky/15 text-brand-navy" : "border-slate-200 bg-white hover:border-brand-sky"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange({ ...value, [option.key]: event.target.checked })}
                className="sr-only"
              />
              <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${checked ? "border-brand-navy bg-brand-navy" : "border-slate-300"}`}>
                {checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
              </span>
              <span className="text-sm font-bold leading-6">{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
