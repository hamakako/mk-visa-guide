import { Header } from "@/components/Header";
import { VisaGuide } from "@/components/VisaGuide";
import { ShieldCheck, Sparkles, BadgeCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="page-shell noise">
      <Header />

      <section className="mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-6 lg:px-8 lg:pb-16 lg:pt-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-sky/40 bg-white/75 px-4 py-2 text-sm font-bold text-brand-navy shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-brand-teal" />
            ڕێنماییەکی زیرەک و سادە بۆ گەشتەکەت
          </div>
          <h1 className="text-balance text-4xl font-bold leading-[1.35] text-brand-navy sm:text-5xl lg:text-6xl">
            پشکنینی ڤیزا بۆ گەشتەکەت
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-9 text-slate-600 sm:text-xl">
            نەتەوەی پاسپۆرت و وڵاتی مەبەست هەڵبژێرە، ئێمە بە زمانی کوردی پێت دەڵێین ڤیزا پێویستە یان نا.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-bold text-slate-600">
            <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-brand-teal" /> زانیارییەکان بە وردی دەپشکنرێن</span>
            <span className="flex items-center gap-2"><BadgeCheck className="h-5 w-5 text-brand-teal" /> سەرچاوەی فەرمی لە پێشینەدایە</span>
          </div>
        </div>
      </section>

      <VisaGuide />

      <footer className="mt-16 border-t border-slate-200/70 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-center text-sm text-slate-500 sm:px-6 md:flex-row md:text-right lg:px-8">
          <p>© {new Date().getFullYear()} MK Business and Travel — هەموو مافەکان پارێزراون.</p>
          <p>گراند سویس هۆتێل، نهۆمی زەوی، پیرمام، هەولێر</p>
        </div>
      </footer>
    </main>
  );
}
