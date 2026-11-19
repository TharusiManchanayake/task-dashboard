import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "indigo" | "slate" | "amber" | "emerald" | "red";

const tones: Record<Tone, string> = {
  indigo: "bg-indigo-50 text-indigo-600",
  slate: "bg-slate-100 text-slate-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
  red: "bg-red-50 text-red-600",
};

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: Tone;
}

export default function StatCard({ label, value, icon: Icon, tone = "indigo" }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={cn("rounded-lg p-3", tones[tone])}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}