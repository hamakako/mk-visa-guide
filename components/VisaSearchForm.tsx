"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, SearchCheck } from "lucide-react";
import { ConditionSelector } from "@/components/ConditionSelector";
import { CountrySelect } from "@/components/CountrySelect";
import { VisaCheckInput } from "@/lib/visa-schema";

const initialConditions: VisaCheckInput["conditions"] = {
  schengenVisa: false,
  usaVisa: false,
  ukVisa: false,
  canadaVisa: false,
  australiaVisa: false,
  gccResidency: false,
  euResidency: false,
  ukResidency: false,
  westernResidency: false,
  otherResidencePermit: false,
  previousRefusals: false,
};

type Props = {
  loading: boolean;
  onSubmit: (input: VisaCheckInput) => void;
};

export function VisaSearchForm({ loading, onSubmit }: Props) {
  const [form, setForm] = useState<VisaCheckInput>({
    passportNationality: "IQ",
    destinationCountry: "",
    currentResidence: "IQ",
    purpose: "tourism",
    stayLength: 7,
    conditions: initialConditions,
    otherResidencePermitCountry: undefined,
  });
  const [error, setError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.destinationCountry) {
      setError("تکایە وڵاتی مەبەست هەڵبژێرە.");
      return;
    }
    if (form.conditions.otherResidencePermit && !form.otherResidencePermitCountry) {
      setError("تکایە وڵاتی مۆڵەتی نیشتەجێبوونەکەت هەڵبژێرە.");
      return;
    }
    setError("");
    onSubmit(form);
  };

  return (
    <form id="search-form" onSubmit={submit} className="rounded-4xl border border-white bg-white/95 p-5 shadow-soft sm:p-8 lg:p-10">
      <div className="mb-7 flex items-start gap-4 border-b border-slate-100 pb-6">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-navy text-white shadow-lg shadow-brand-navy/15">
          <SearchCheck className="h-6 w-6" />
        </span>
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">زانیاریی گەشتەکەت</h2>
          <p className="mt-1 text-sm leading-7 text-slate-500">خانەکان پڕ بکەرەوە تا وەڵامێکی گونجاو بە بارودۆخی خۆت وەربگریت.</p>
        </div>
      </div>

      <div className="form-grid">
        <CountrySelect
          label="نەتەوەی پاسپۆرت"
          value={form.passportNationality}
          onChange={(passportNationality) => setForm({ ...form, passportNationality })}
          required
        />
        <CountrySelect
          label="وڵاتی مەبەست"
          value={form.destinationCountry}
          onChange={(destinationCountry) => setForm({ ...form, destinationCountry })}
          placeholder="وڵاتی مەبەست هەڵبژێرە"
          required
        />
        <CountrySelect
          label="وڵاتی نیشتەجێبوونی ئێستا"
          value={form.currentResidence}
          onChange={(currentResidence) => setForm({ ...form, currentResidence })}
          required
        />
        <div>
          <label htmlFor="purpose" className="field-label">مەبەستی گەشت <span className="text-rose-500">*</span></label>
          <select
            id="purpose"
            value={form.purpose}
            onChange={(event) => setForm({ ...form, purpose: event.target.value as VisaCheckInput["purpose"] })}
            className="field-control appearance-none bg-[linear-gradient(45deg,transparent_50%,#777_50%),linear-gradient(135deg,#777_50%,transparent_50%)] bg-[position:calc(1rem)_50%,calc(1.35rem)_50%] bg-[size:5px_5px,5px_5px] bg-no-repeat pl-10"
          >
            <option value="tourism">گەشتیاری</option>
            <option value="business">کاروبار</option>
            <option value="family">سەردانی خێزان</option>
            <option value="study">خوێندن</option>
            <option value="medical">چارەسەری پزیشکی</option>
            <option value="transit">ترانزیت</option>
          </select>
        </div>
        <div>
          <label htmlFor="stay" className="field-label">ماوەی مانەوە <span className="text-rose-500">*</span></label>
          <div className="relative">
            <input
              id="stay"
              type="number"
              inputMode="numeric"
              min={1}
              max={365}
              value={form.stayLength}
              onChange={(event) => setForm({ ...form, stayLength: Number(event.target.value) })}
              className="field-control pl-16"
              required
            />
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">ڕۆژ</span>
          </div>
        </div>
      </div>

      <div className="my-8 h-px bg-slate-100" />
      <ConditionSelector value={form.conditions} onChange={(conditions) => setForm({ ...form, conditions })} />

      {form.conditions.otherResidencePermit && (
        <div className="mt-5 max-w-lg rounded-2xl bg-brand-cream/35 p-4">
          <CountrySelect
            label="وڵاتی مۆڵەتی نیشتەجێبوون"
            value={form.otherResidencePermitCountry || ""}
            onChange={(otherResidencePermitCountry) => setForm({ ...form, otherResidencePermitCountry })}
            required
          />
        </div>
      )}

      {error && <p role="alert" className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-8 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-brand-navy px-6 py-4 text-lg font-bold text-white shadow-xl shadow-brand-navy/15 transition hover:-translate-y-0.5 hover:bg-[#251991] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-64"
      >
        {loading ? "لە پشکنین‌دایە..." : "پشکنینی ڤیزا"}
        <ArrowLeft className="h-5 w-5" />
      </button>
    </form>
  );
}
