import { Search, ShieldCheck } from "lucide-react";

export function LoadingThinking() {
  return (
    <div role="status" aria-live="polite" className="mt-8 overflow-hidden rounded-4xl border border-brand-sky/30 bg-white p-6 shadow-card sm:p-9">
      <div className="flex flex-col items-center text-center sm:flex-row sm:text-right">
        <div className="relative mb-5 ml-0 grid h-20 w-20 shrink-0 place-items-center rounded-full bg-brand-sky/20 sm:mb-0 sm:ml-6">
          <span className="absolute inset-0 animate-ping rounded-full bg-brand-sky/15" />
          <Search className="relative h-8 w-8 animate-pulse text-brand-navy" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-brand-navy">تکایە چاوەڕێ بکە...</h3>
          <p className="mt-2 leading-8 text-slate-600">یاساکانی ڤیزا بە وردی دەپشکنین و سەرچاوە فەرمییەکان بەراورد دەکەین.</p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-brand-teal sm:justify-start">
            <ShieldCheck className="h-4 w-4" /> وردەکارییەکان بە وردی دەپشکنین
            <span className="flex gap-1" dir="ltr">
              {[0, 1, 2].map((item) => <span key={item} className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-teal" style={{ animationDelay: `${item * 120}ms` }} />)}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-7 space-y-3">
        <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
        <div className="h-3 w-4/5 animate-pulse rounded-full bg-slate-100" />
        <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-100" />
      </div>
    </div>
  );
}
