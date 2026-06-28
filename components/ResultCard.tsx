"use client";

import {
  AlertCircle,
  BadgeCheck,
  CalendarClock,
  CircleDollarSign,
  ClipboardList,
  FileCheck2,
  Info,
  PlaneTakeoff,
  Printer,
  Share2,
  Sparkles,
} from "lucide-react";
import { ContactCTA } from "@/components/ContactCTA";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { SourceList } from "@/components/SourceList";
import { VisaResult } from "@/lib/visa-schema";

const statusMap: Record<VisaResult["status"], { label: string; style: string }> = {
  visa_free: { label: "ڤیزا پێویست نییە", style: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  visa_required: { label: "ڤیزا پێویستە", style: "bg-rose-100 text-rose-800 border-rose-200" },
  evisa_available: { label: "ڤیزای ئەلیکترۆنی بەردەستە", style: "bg-sky-100 text-sky-800 border-sky-200" },
  visa_on_arrival: { label: "ڤیزا لە کاتی گەیشتن", style: "bg-violet-100 text-violet-800 border-violet-200" },
  transit_only: { label: "تەنها ڤیزای ترانزیت", style: "bg-orange-100 text-orange-800 border-orange-200" },
  uncertain: { label: "پێویستە پشتڕاست بکرێتەوە", style: "bg-amber-100 text-amber-800 border-amber-200" },
};

const confidenceLabels: Record<VisaResult["confidence"], string> = {
  high: "دڵنیایی بەرز",
  medium: "دڵنیایی مامناوەند",
  low: "دڵنیایی کەم",
};

function ListSection({ title, items, icon: Icon }: { title: string; items: string[]; icon: typeof ClipboardList }) {
  if (!items.length) return null;
  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-sky/20 text-brand-navy"><Icon className="h-5 w-5" /></span>
        <h3 className="text-xl font-bold text-brand-navy">{title}</h3>
      </div>
      <ul className="list-disc space-y-2 pr-5 text-slate-700">
        {items.map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    </section>
  );
}

export function ResultCard({ result }: { result: VisaResult }) {
  const status = statusMap[result.status];

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: "ئەنجامی پشکنینی ڤیزا", text: result.summary_ku, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(`${result.summary_ku}\n${window.location.href}`);
      alert("بەستەرەکە لەبەرگیرایەوە.");
    }
  };

  return (
    <article id="visa-result" className="result-content mt-8 space-y-6 rounded-4xl border border-white bg-white p-5 shadow-soft sm:p-8 lg:p-10">
      <div className="flex flex-col gap-5 border-b border-slate-100 pb-7 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-3 flex items-center gap-2 text-sm font-bold text-brand-teal"><Sparkles className="h-4 w-4" /> ئەنجامی پشکنین</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-base font-bold ${status.style}`}>
              {result.status === "uncertain" ? <AlertCircle className="h-5 w-5" /> : <BadgeCheck className="h-5 w-5" />}
              {status.label}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">{confidenceLabels[result.confidence]}</span>
          </div>
        </div>
        <div className="no-print flex gap-2">
          <button onClick={() => window.print()} className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-brand-sky hover:text-brand-navy">
            <Printer className="h-4 w-4" /> چاپکردن
          </button>
          <button onClick={share} className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-brand-sky hover:text-brand-navy">
            <Share2 className="h-4 w-4" /> هاوبەشکردن
          </button>
        </div>
      </div>

      <section className="rounded-3xl bg-gradient-to-l from-brand-navy to-[#2a1b96] p-6 text-white sm:p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10"><PlaneTakeoff className="h-5 w-5 text-brand-sky" /></span>
          <h2 className="text-xl font-bold">کورتەی وەڵام</h2>
        </div>
        <p className="mt-4 text-lg leading-9 text-white/90">{result.summary_ku}</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-100 bg-slate-50/55 p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-sky/20 text-brand-navy"><Info className="h-5 w-5" /></span>
            <h3 className="text-xl font-bold text-brand-navy">پێویستی ڤیزا</h3>
          </div>
          <p className="text-slate-700">{result.visa_requirement_ku}</p>
        </section>
        <section className="rounded-3xl border border-slate-100 bg-slate-50/55 p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-sky/20 text-brand-navy"><CalendarClock className="h-5 w-5" /></span>
            <h3 className="text-xl font-bold text-brand-navy">کات و تێچووی خەملێنراو</h3>
          </div>
          <p className="flex gap-2 text-slate-700"><CalendarClock className="mt-1 h-4 w-4 shrink-0 text-brand-teal" /> {result.estimated_processing_time_ku}</p>
          <p className="mt-2 flex gap-2 text-slate-700"><CircleDollarSign className="mt-1 h-4 w-4 shrink-0 text-brand-teal" /> {result.estimated_fee_ku}</p>
          <p className="mt-3 text-xs leading-6 text-slate-500">پێویستە دووبارە لەلایەن باڵیۆزخانە/فەرمانگە پشتڕاست بکرێتەوە.</p>
        </section>
      </div>

      <div className="grid gap-8 border-y border-slate-100 py-8 lg:grid-cols-2">
        <ListSection title="چۆنیەتی داواکردن" items={result.application_steps_ku} icon={ClipboardList} />
        <ListSection title="بەڵگەنامە پێویستەکان" items={result.required_documents_ku} icon={FileCheck2} />
      </div>

      <ListSection title="تێبینی تایبەت بە بارودۆخی تۆ" items={result.special_conditions_ku} icon={Sparkles} />
      <ListSection title="تێبینییە گرنگەکان" items={result.important_notes_ku} icon={Info} />
      <SourceList sources={result.sources} />

      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
        <span className="rounded-full bg-slate-100 px-3 py-1.5">دوا پشکنین: <bdi>{result.last_checked_date}</bdi></span>
        <span className="rounded-full bg-slate-100 px-3 py-1.5">ئەنجامەکە تایبەتە بە زانیارییە دیاریکراوەکان</span>
      </div>

      <DisclaimerBox warnings={result.warnings_ku} />
      <ContactCTA />
    </article>
  );
}
