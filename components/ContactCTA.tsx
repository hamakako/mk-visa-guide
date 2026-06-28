import { MessageCircle, PhoneCall } from "lucide-react";

export function ContactCTA() {
  return (
    <div className="no-print relative overflow-hidden rounded-4xl bg-brand-navy p-6 text-white shadow-soft sm:p-8">
      <div className="absolute -left-12 -top-16 h-44 w-44 rounded-full bg-brand-teal/25 blur-2xl" />
      <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <span className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-brand-sky">ئێمە لەگەڵتین</span>
          <h3 className="text-2xl font-bold">دەتەوێت MK Business and Travel یارمەتیت بدات؟</h3>
          <p className="mt-2 max-w-xl leading-8 text-white/75">تیمەکەمان دەتوانێت لە ئامادەکردنی بەڵگەنامە و پرۆسەی داواکاریی ڤیزا یارمەتیت بدات.</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a href="https://wa.me/9647500229292" target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-teal px-5 py-3 font-bold text-brand-navy transition hover:bg-brand-sky">
            <MessageCircle className="h-5 w-5" /> پەیوەندی بە واتسئاپ
          </a>
          <a href="tel:+9647500229292" className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-3 font-bold transition hover:bg-white/10" dir="ltr">
            <PhoneCall className="h-5 w-5" /> 0750 022 9292
          </a>
        </div>
      </div>
    </div>
  );
}
