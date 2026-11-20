"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import TaskForm from "@/components/tasks/TaskForm";
import Skeleton from "@/components/ui/Skeleton";
import ResourceError from "@/components/ui/ResourceError";
import { useTask, useUpdateTask } from "@/hooks/useTasks";

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const { data: task, isLoading, isError, error, refetch } = useTask(id);
  const updateTask = useUpdateTask();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/tasks" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to tasks
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Edit task</h1>
        <p className="text-sm text-slate-500">Update the details and save your changes.</p>
      </div>

      {isLoading && (
        <div className="space-y-4" aria-busy="true" aria-label="Loading task">
          <Skeleton className="h-12" />
          <Skeleton className="h-28" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      )}

      {isError && <ResourceError error={error} onRetry={() => refetch()} />}

      {task && (
        <TaskForm
          mode="edit"
          defaultValues={{
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            assignee: task.assignee,
            dueDate: task.dueDate,
          }}
          isSubmitting={updateTask.isPending}
          onSubmit={(values) =>
            updateTask.mutate({ id: task.id, input: values }, { onSuccess: () => router.push("/tasks") })
          }
          onCancel={() => router.push("/tasks")}
        />
      )}
    </div>
  );
}