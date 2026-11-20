"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useDeleteTask, useTasks } from "@/hooks/useTasks";
import { useTaskFilters } from "@/hooks/useTaskFilters";
import { PAGE_SIZE } from "@/lib/constants";
import TaskFilters from "./TaskFilters";
import TaskTable from "./TaskTable";
import Pagination from "@/components/ui/Pagination";
import Skeleton from "@/components/ui/Skeleton";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Button from "@/components/ui/Button";
import type { Task } from "@/types/task";

function ListSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading tasks">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-16" />
      ))}
    </div>
  );
}

export default function TaskListView() {
  const { filters, setFilters, resetFilters, hasActiveFilters } = useTaskFilters();
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching, isPlaceholderData } = useTasks({
    ...filters,
    limit: PAGE_SIZE,
  });
  const deleteTask = useDeleteTask();

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // If the current page becomes empty (e.g. after deleting its last task), step back one page
  useEffect(() => {
    if (data && !isPlaceholderData && data.data.length === 0 && filters.page > 1) {
      setFilters({ page: Math.min(filters.page - 1, totalPages) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isPlaceholderData]);

  const handleConfirmDelete = () => {
    if (!taskToDelete) return;
    deleteTask.mutate(taskToDelete.id, { onSuccess: () => setTaskToDelete(null) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
        <p className="text-sm text-slate-500">Search, filter and manage all your tasks.</p>
      </div>

      <TaskFilters filters={filters} hasActiveFilters={hasActiveFilters} onChange={setFilters} onReset={resetFilters} />

      {isLoading && <ListSkeleton />}

      {isError && <ErrorState message={error.message} onRetry={() => refetch()} />}

      {data && data.data.length === 0 && !isError && (
        hasActiveFilters ? (
          <EmptyState
            title="No matching tasks"
            description="Try changing your search or filters."
            action={<Button variant="secondary" onClick={resetFilters}>Clear filters</Button>}
          />
        ) : (
          <EmptyState
            title="No tasks yet"
            description="Get started by creating your first task."
            action={
              <Link href="/tasks/new" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Create task
              </Link>
            }
          />
        )
      )}

      {data && data.data.length > 0 && (
        <div className={isFetching ? "space-y-4 opacity-60 transition-opacity" : "space-y-4 transition-opacity"} aria-busy={isFetching}>
          <TaskTable tasks={data.data} onDelete={setTaskToDelete} />
          <Pagination
            page={filters.page}
            totalPages={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => setFilters({ page })}
          />
        </div>
      )}

      <ConfirmDialog
        open={taskToDelete !== null}
        title="Delete this task?"
        description={`"${taskToDelete?.title ?? ""}" will be permanently removed. This action cannot be undone.`}
        loading={deleteTask.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
}