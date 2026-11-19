import { Loader2 } from "lucide-react";

export default function Spinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}