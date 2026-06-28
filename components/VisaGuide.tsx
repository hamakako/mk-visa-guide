"use client";

import { useRef, useState } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { LoadingThinking } from "@/components/LoadingThinking";
import { ResultCard } from "@/components/ResultCard";
import { VisaSearchForm } from "@/components/VisaSearchForm";
import { VisaCheckInput, VisaResult, VisaResultSchema } from "@/lib/visa-schema";

export function VisaGuide() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VisaResult | null>(null);
  const [error, setError] = useState("");
  const statusRef = useRef<HTMLDivElement>(null);

  const checkVisa = async (input: VisaCheckInput) => {
    setLoading(true);
    setResult(null);
    setError("");
    window.setTimeout(() => statusRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);

    try {
      const response = await fetch("/api/check-visa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const payload: unknown = await response.json();
      if (!response.ok) {
        const message = typeof payload === "object" && payload && "error" in payload ? String(payload.error) : "هەڵەیەک ڕوویدا.";
        throw new Error(message);
      }

      setResult(VisaResultSchema.parse(payload));
      window.setTimeout(() => document.getElementById("visa-result")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "ببورە، پشکنینەکە سەرکەوتوو نەبوو.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <VisaSearchForm loading={loading} onSubmit={checkVisa} />
      <div ref={statusRef} className="scroll-mt-6">
        {loading && <LoadingThinking />}
        {error && (
          <div role="alert" className="mt-8 rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center shadow-card">
            <AlertTriangle className="mx-auto h-8 w-8 text-rose-600" />
            <h3 className="mt-3 text-lg font-bold text-rose-900">پشکنینەکە تەواو نەبوو</h3>
            <p className="mx-auto mt-2 max-w-xl leading-8 text-rose-800/80">{error}</p>
            <button onClick={() => { setError(""); document.getElementById("search-form")?.scrollIntoView({ behavior: "smooth" }); }} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-rose-800 shadow-sm">
              <RotateCcw className="h-4 w-4" /> دووبارە هەوڵ بدەرەوە
            </button>
          </div>
        )}
        {result && <ResultCard result={result} />}
      </div>
    </section>
  );
}
