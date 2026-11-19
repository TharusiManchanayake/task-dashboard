import Link from "next/link";
import { formatDate, isOverdue } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/Badge";
import type { Task } from "@/types/task";

interface TaskListCardProps {
  title: string;
  tasks: Task[];
  emptyText: string;
}

export default function TaskListCard({ title, tasks, emptyText }: TaskListCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        <Link href="/tasks" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          View all
        </Link>
      </div>

      {tasks.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500">{emptyText}</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {tasks.map((task) => {
            const overdue = isOverdue(task.dueDate, task.status);
            return (
              <li key={task.id}>
                <Link
                  href={`/tasks/${task.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg px-2 py-3 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">{task.title}</p>
                    <p className={overdue ? "text-xs font-medium text-red-600" : "text-xs text-slate-500"}>
                      {overdue ? "Overdue: " : "Due "}
                      {formatDate(task.dueDate)}
                    </p>
                  </div>
                  <StatusBadge status={task.status} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}