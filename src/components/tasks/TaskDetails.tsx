"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, CalendarDays, CheckCircle2, Clock, Pencil, Trash2, User } from "lucide-react";
import { useDeleteTask, useTask, useUpdateTask } from "@/hooks/useTasks";
import { formatDate, formatDateTime, isOverdue } from "@/lib/utils";
import { PriorityBadge, StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ResourceError from "@/components/ui/ResourceError";
import Skeleton from "@/components/ui/Skeleton";

function DetailItem({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-slate-400" aria-hidden="true">{icon}</div>
      <div>
        <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
        <dd className="mt-0.5 text-sm text-slate-900">{children}</dd>
      </div>
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading task details">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-32" />
      <Skeleton className="h-28" />
    </div>
  );
}

export default function TaskDetails({ id }: { id: number }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: task, isLoading, isError, error, refetch } = useTask(id);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const overdue = task ? isOverdue(task.dueDate, task.status) : false;

  const handleDelete = () => {
    deleteTask.mutate(id, {
      onSuccess: () => {
        setConfirmOpen(false);
        router.push("/tasks");
      },
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/tasks" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to tasks
      </Link>

      {isLoading && <DetailsSkeleton />}

      {isError && <ResourceError error={error} onRetry={() => refetch()} />}

      {task && (
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="break-words text-2xl font-bold text-slate-900">{task.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <Link
                href={`/tasks/${task.id}/edit`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
                Edit
              </Link>
              <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete
              </Button>
            </div>
          </header>

          {overdue && (
            <div role="alert" className="mt-5 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              This task is overdue. It was due on {formatDate(task.dueDate)}.
            </div>
          )}

          <section className="mt-6" aria-labelledby="description-heading">
            <h2 id="description-heading" className="text-sm font-semibold text-slate-900">Description</h2>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-600">
              {task.description}
            </p>
          </section>

          <dl className="mt-6 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2">
            <DetailItem icon={<User className="h-4 w-4" />} label="Assignee">{task.assignee}</DetailItem>
            <DetailItem icon={<CalendarDays className="h-4 w-4" />} label="Due date">
              <span className={overdue ? "font-medium text-red-600" : undefined}>{formatDate(task.dueDate)}</span>
            </DetailItem>
            <DetailItem icon={<Clock className="h-4 w-4" />} label="Created">{formatDateTime(task.createdAt)}</DetailItem>
            <DetailItem icon={<Clock className="h-4 w-4" />} label="Last updated">{formatDateTime(task.updatedAt)}</DetailItem>
          </dl>

          {task.status !== "done" && (
            <div className="mt-6 border-t border-slate-100 pt-6">
              <Button
                variant="secondary"
                loading={updateTask.isPending}
                onClick={() => updateTask.mutate({ id: task.id, input: { status: "done" } })}
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                Mark as done
              </Button>
            </div>
          )}
        </article>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this task?"
        description={`"${task?.title ?? ""}" will be permanently removed. This action cannot be undone.`}
        loading={deleteTask.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}