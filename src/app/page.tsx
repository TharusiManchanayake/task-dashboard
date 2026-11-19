"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, CircleDot, ListChecks, Plus, Timer } from "lucide-react";
import { useAllTasks } from "@/hooks/useTasks";
import { computeStats } from "@/lib/stats";
import StatCard from "@/components/dashboard/StatCard";
import StatusOverview from "@/components/dashboard/StatusOverview";
import TaskListCard from "@/components/dashboard/TaskListCard";
import Skeleton from "@/components/ui/Skeleton";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-52" />
        <Skeleton className="h-52" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: tasks, isLoading, isError, error, refetch } = useAllTasks();

  const stats = useMemo(() => (tasks ? computeStats(tasks) : null), [tasks]);

  const upcoming = useMemo(
    () =>
      (tasks ?? [])
        .filter((t) => t.status !== "done")
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
        .slice(0, 5),
    [tasks]
  );

  const recent = useMemo(
    () =>
      [...(tasks ?? [])]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 5),
    [tasks]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">An overview of your tasks and their progress.</p>
      </div>

      {isLoading && <DashboardSkeleton />}

      {isError && <ErrorState message={error.message} onRetry={() => refetch()} />}

      {stats && stats.total === 0 && (
        <EmptyState
          title="No tasks yet"
          description="Create your first task to see statistics here."
          action={
            <Link
              href="/tasks/new"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Create task
            </Link>
          }
        />
      )}

      {stats && stats.total > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard label="Total tasks" value={stats.total} icon={ListChecks} tone="indigo" />
            <StatCard label="To do" value={stats.byStatus.todo} icon={CircleDot} tone="slate" />
            <StatCard label="In progress" value={stats.byStatus.in_progress} icon={Timer} tone="amber" />
            <StatCard label="Completed" value={`${stats.byStatus.done} (${stats.completionRate}%)`} icon={CheckCircle2} tone="emerald" />
            <StatCard label="Overdue" value={stats.overdue} icon={AlertCircle} tone="red" />
          </div>

          <StatusOverview stats={stats} />

          <div className="grid gap-6 lg:grid-cols-2">
            <TaskListCard title="Upcoming deadlines" tasks={upcoming} emptyText="No pending tasks. Great job!" />
            <TaskListCard title="Recently added" tasks={recent} emptyText="No tasks yet." />
          </div>
        </>
      )}
    </div>
  );
}