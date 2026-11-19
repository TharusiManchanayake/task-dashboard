"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SortField, SortOrder, TaskPriority, TaskStatus } from "@/types/task";

export interface TaskFilters {
  search: string;
  status: TaskStatus | "all";
  priority: TaskPriority | "all";
  sortBy: SortField;
  order: SortOrder;
  page: number;
}

const DEFAULTS: TaskFilters = {
  search: "",
  status: "all",
  priority: "all",
  sortBy: "createdAt",
  order: "desc",
  page: 1,
};

const STATUSES = ["all", "todo", "in_progress", "done"];
const PRIORITIES = ["all", "low", "medium", "high"];
const SORT_FIELDS = ["title", "dueDate", "priority", "createdAt"];

export function useTaskFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<TaskFilters>(() => {
    const status = searchParams.get("status") ?? DEFAULTS.status;
    const priority = searchParams.get("priority") ?? DEFAULTS.priority;
    const sortBy = searchParams.get("sortBy") ?? DEFAULTS.sortBy;
    const order = searchParams.get("order") ?? DEFAULTS.order;
    const page = Number(searchParams.get("page") ?? DEFAULTS.page);

    return {
      search: searchParams.get("search") ?? DEFAULTS.search,
      status: (STATUSES.includes(status) ? status : DEFAULTS.status) as TaskFilters["status"],
      priority: (PRIORITIES.includes(priority) ? priority : DEFAULTS.priority) as TaskFilters["priority"],
      sortBy: (SORT_FIELDS.includes(sortBy) ? sortBy : DEFAULTS.sortBy) as SortField,
      order: (order === "asc" ? "asc" : "desc") as SortOrder,
      page: Number.isInteger(page) && page > 0 ? page : 1,
    };
  }, [searchParams]);

  const setFilters = useCallback(
    (changes: Partial<TaskFilters>) => {
      // Any change except page navigation sends the user back to page 1
      const next: TaskFilters = {
        ...filters,
        ...changes,
        page: changes.page ?? 1,
      };

      const params = new URLSearchParams();
      (Object.keys(next) as (keyof TaskFilters)[]).forEach((key) => {
        if (next[key] !== DEFAULTS[key]) params.set(key, String(next[key]));
      });

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [filters, pathname, router]
  );

  const resetFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  const hasActiveFilters =
    filters.search !== "" || filters.status !== "all" || filters.priority !== "all";

  return { filters, setFilters, resetFilters, hasActiveFilters };
}