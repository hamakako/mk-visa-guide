import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-white/80 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="#" aria-label="سەرەتا" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            width={900}
            height={520}
            alt="MK Business and Travel"
            priority
            className="h-12 w-[84px] object-contain sm:h-14 sm:w-[97px]"
          />
          <div className="hidden border-r border-slate-200 pr-3 sm:block" dir="ltr">
            <p className="text-sm font-bold leading-tight text-brand-navy">MK Business</p>
            <p className="text-xs text-slate-500">and Travel</p>
          </div>
        </a>

        <div className="hidden items-center gap-6 text-sm text-slate-600 lg:flex">
          <a href="tel:+9647500229292" className="flex items-center gap-2 transition hover:text-brand-navy" dir="ltr">
            <Phone className="h-4 w-4 text-brand-teal" /> 0750 022 9292
          </a>
          <a href="mailto:ops@mkebl.com" className="flex items-center gap-2 transition hover:text-brand-navy" dir="ltr">
            <Mail className="h-4 w-4 text-brand-teal" /> ops@mkebl.com
          </a>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-brand-teal" /> پیرمام، هەولێر
          </span>
        </div>

        <a
          href="https://wa.me/9647500229292"
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-brand-navy px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#24178f]"
        >
          پەیوەندی
        </a>
      </div>
    </header>
  );
}
