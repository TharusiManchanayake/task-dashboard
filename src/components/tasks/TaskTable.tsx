import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { formatDate, isOverdue } from "@/lib/utils";
import { PriorityBadge, StatusBadge } from "@/components/ui/Badge";
import type { Task } from "@/types/task";

interface TaskTableProps {
  tasks: Task[];
  onDelete: (task: Task) => void;
}

const iconButton =
  "rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

function Actions({ task, onDelete }: { task: Task; onDelete: (task: Task) => void }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Link href={`/tasks/${task.id}`} aria-label={`View ${task.title}`} className={iconButton}>
        <Eye className="h-4 w-4" />
      </Link>
      <Link href={`/tasks/${task.id}/edit`} aria-label={`Edit ${task.title}`} className={iconButton}>
        <Pencil className="h-4 w-4" />
      </Link>
      <button type="button" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`} className={`${iconButton} hover:bg-red-50 hover:text-red-600`}>
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function DueDate({ task }: { task: Task }) {
  const overdue = isOverdue(task.dueDate, task.status);
  return (
    <span className={overdue ? "font-medium text-red-600" : "text-slate-600"}>
      {formatDate(task.dueDate)}
      {overdue && <span className="ml-1 text-xs">(overdue)</span>}
    </span>
  );
}

export default function TaskTable({ tasks, onDelete }: TaskTableProps) {
  return (
    <>
      {/* Desktop and tablet */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">List of tasks</caption>
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Task</th>
              <th scope="col" className="px-4 py-3 font-medium">Status</th>
              <th scope="col" className="px-4 py-3 font-medium">Priority</th>
              <th scope="col" className="hidden px-4 py-3 font-medium lg:table-cell">Assignee</th>
              <th scope="col" className="px-4 py-3 font-medium">Due date</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-slate-50/60">
                <td className="max-w-xs px-4 py-3">
                  <Link href={`/tasks/${task.id}`} className="font-medium text-slate-900 hover:text-indigo-600">
                    {task.title}
                  </Link>
                  <p className="truncate text-xs text-slate-500">{task.description}</p>
                </td>
                <td className="px-4 py-3"><StatusBadge status={task.status} /></td>
                <td className="px-4 py-3"><PriorityBadge priority={task.priority} /></td>
                <td className="hidden px-4 py-3 text-slate-600 lg:table-cell">{task.assignee}</td>
                <td className="px-4 py-3"><DueDate task={task} /></td>
                <td className="px-4 py-3"><Actions task={task} onDelete={onDelete} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <ul className="space-y-3 md:hidden">
        {tasks.map((task) => (
          <li key={task.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <Link href={`/tasks/${task.id}`} className="font-medium text-slate-900 hover:text-indigo-600">
              {task.title}
            </Link>
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{task.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
              <div>
                <p className="text-slate-500">{task.assignee}</p>
                <DueDate task={task} />
              </div>
              <Actions task={task} onDelete={onDelete} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}