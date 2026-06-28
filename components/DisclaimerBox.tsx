import { TriangleAlert } from "lucide-react";

export function DisclaimerBox({ warnings }: { warnings?: string[] }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <TriangleAlert className="mt-1 h-6 w-6 shrink-0 text-amber-600" />
        <div>
          <h3 className="text-lg font-bold text-amber-900">ئاگاداریی گرنگ</h3>
          <ul className="mt-2 list-disc space-y-2 text-sm leading-7 text-amber-900/80">
            {(warnings?.length ? warnings : ["یاساکانی ڤیزا دەگۆڕێن؛ پێش کڕینی بلیت یان حجزکردن، زانیارییەکە لەلایەن باڵیۆزخانە یان فەرمانگەی فەرمی پشتڕاست بکەرەوە."]).map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
