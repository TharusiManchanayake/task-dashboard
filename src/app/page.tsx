"use client";

import { useTasks } from "@/hooks/useTasks";
import Spinner from "@/components/ui/Spinner";
import ErrorState from "@/components/ui/ErrorState";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";

export default function Home() {
  const { data, isLoading, isError, error, refetch } = useTasks({ page: 1, limit: 5 });

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-4 text-2xl font-bold">Test: {data?.total} tasks in total</h1>
      <ul className="space-y-3">
        {data?.data.map((t) => (
          <li key={t.id} className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
            <span>{t.title}</span>
            <span className="flex gap-2">
              <StatusBadge status={t.status} />
              <PriorityBadge priority={t.priority} />
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}