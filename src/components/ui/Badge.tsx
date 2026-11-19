import { cn } from "@/lib/utils";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/lib/constants";
import type { TaskPriority, TaskStatus } from "@/types/task";

const statusStyles: Record<TaskStatus, string> = {
  todo: "bg-slate-100 text-slate-700 ring-slate-200",
  in_progress: "bg-amber-50 text-amber-700 ring-amber-200",
  done: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const priorityStyles: Record<TaskPriority, string> = {
  low: "bg-sky-50 text-sky-700 ring-sky-200",
  medium: "bg-orange-50 text-orange-700 ring-orange-200",
  high: "bg-red-50 text-red-700 ring-red-200",
};

const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset";

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <span className={cn(base, statusStyles[status])}>{STATUS_LABELS[status]}</span>;
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return <span className={cn(base, priorityStyles[priority])}>{PRIORITY_LABELS[priority]}</span>;
}