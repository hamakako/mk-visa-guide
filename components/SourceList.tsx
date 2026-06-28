import { ExternalLink, Link2 } from "lucide-react";
import { VisaResult } from "@/lib/visa-schema";

export function SourceList({ sources }: { sources: VisaResult["sources"] }) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-sky/20 text-brand-navy"><Link2 className="h-5 w-5" /></span>
        <h3 className="text-xl font-bold text-brand-navy">سەرچاوەکان</h3>
      </div>
      {sources.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {sources.map((source, index) => (
            <a
              key={`${source.url}-${index}`}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition hover:-translate-y-0.5 hover:border-brand-sky hover:bg-white hover:shadow-card"
            >
              <span className="min-w-0">
                <span className="block font-bold leading-7 text-slate-800">{source.title}</span>
                <span className="mt-1 block text-xs text-slate-500">{source.publisher}</span>
              </span>
              <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-brand-teal transition group-hover:text-brand-navy" />
            </a>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">سەرچاوەیەکی ڕاستەوخۆ بەردەست نەبوو؛ ئەم وەڵامە پێویستە بە فەرمی پشتڕاست بکرێتەوە.</p>
      )}
    </section>
  );
}
