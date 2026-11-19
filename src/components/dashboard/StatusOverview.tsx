import { cn } from "@/lib/utils";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/lib/constants";
import type { TaskStats } from "@/lib/stats";
import type { TaskPriority, TaskStatus } from "@/types/task";

const statusBar: Record<TaskStatus, string> = {
  todo: "bg-slate-400",
  in_progress: "bg-amber-500",
  done: "bg-emerald-500",
};

const priorityBar: Record<TaskPriority, string> = {
  low: "bg-sky-500",
  medium: "bg-orange-500",
  high: "bg-red-500",
};

function BarRow({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const percent = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <li>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-slate-700">{label}</span>
        <span className="text-slate-500">{count} ({percent}%)</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 overflow-hidden rounded-full bg-slate-100"
      >
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${percent}%` }} />
      </div>
    </li>
  );
}

export default function StatusOverview({ stats }: { stats: TaskStats }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="status-heading">
        <h2 id="status-heading" className="mb-4 text-base font-semibold text-slate-900">Tasks by status</h2>
        <ul className="space-y-4">
          {(Object.keys(STATUS_LABELS) as TaskStatus[]).map((status) => (
            <BarRow key={status} label={STATUS_LABELS[status]} count={stats.byStatus[status]} total={stats.total} color={statusBar[status]} />
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="priority-heading">
        <h2 id="priority-heading" className="mb-4 text-base font-semibold text-slate-900">Tasks by priority</h2>
        <ul className="space-y-4">
          {(Object.keys(PRIORITY_LABELS) as TaskPriority[]).map((priority) => (
            <BarRow key={priority} label={PRIORITY_LABELS[priority]} count={stats.byPriority[priority]} total={stats.total} color={priorityBar[priority]} />
          ))}
        </ul>
      </section>
    </div>
  );
}