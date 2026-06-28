"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { countries, getCountry } from "@/lib/countries";

type Props = {
  label: string;
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
  required?: boolean;
};

export function CountrySelect({ label, value, onChange, placeholder = "وڵات هەڵبژێرە", required }: Props) {
  const id = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = getCountry(value);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return countries;
    return countries.filter((country) =>
      `${country.name} ${country.english} ${country.code}`.toLocaleLowerCase().includes(needle),
    );
  }, [query]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const choose = (code: string) => {
    onChange(code);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label id={`${id}-label`} className="field-label">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <button
        type="button"
        aria-labelledby={`${id}-label`}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
        className="field-control flex items-center justify-between gap-3 text-right"
      >
        <span className={selected ? "flex min-w-0 items-center gap-3" : "text-slate-400"}>
          {selected ? (
            <>
              <span className="text-xl" aria-hidden>{selected.flag}</span>
              <span className="truncate">{selected.name} <span className="text-sm text-slate-400">({selected.english})</span></span>
            </>
          ) : placeholder}
        </span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-soft">
          <div className="relative mb-2">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => event.key === "Escape" && setOpen(false)}
              placeholder="گەڕان بە ناوی وڵات..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-3 pr-10 outline-none focus:border-brand-teal"
            />
          </div>
          <ul role="listbox" className="country-menu max-h-64 overflow-y-auto p-1">
            {filtered.length ? filtered.map((country) => (
              <li key={country.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === country.code}
                  onClick={() => choose(country.code)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right transition hover:bg-brand-sky/15"
                >
                  <span className="text-xl" aria-hidden>{country.flag}</span>
                  <span className="min-w-0 flex-1 truncate">{country.name} <span className="text-sm text-slate-400">{country.english}</span></span>
                  {value === country.code && <Check className="h-4 w-4 text-brand-navy" />}
                </button>
              </li>
            )) : (
              <li className="px-3 py-8 text-center text-sm text-slate-500">هیچ وڵاتێک نەدۆزرایەوە.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
