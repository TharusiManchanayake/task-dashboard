"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import TaskForm from "@/components/tasks/TaskForm";
import { useCreateTask } from "@/hooks/useTasks";

export default function NewTaskPage() {
  const router = useRouter();
  const createTask = useCreateTask();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/tasks" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to tasks
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Create task</h1>
        <p className="text-sm text-slate-500">Fill in the details below to add a new task.</p>
      </div>

      <TaskForm
        mode="create"
        isSubmitting={createTask.isPending}
        onSubmit={(values) => createTask.mutate(values, { onSuccess: () => router.push("/tasks") })}
        onCancel={() => router.push("/tasks")}
      />
    </div>
  );
}