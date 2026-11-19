"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import type { TaskFilters as Filters } from "@/hooks/useTaskFilters";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/lib/constants";
import Button from "@/components/ui/Button";

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
  { value: "dueDate:asc", label: "Due date (soonest)" },
  { value: "dueDate:desc", label: "Due date (latest)" },
  { value: "title:asc", label: "Title (A-Z)" },
  { value: "title:desc", label: "Title (Z-A)" },
  { value: "priority:desc", label: "Priority (high to low)" },
  { value: "priority:asc", label: "Priority (low to high)" },
];

interface TaskFiltersProps {
  filters: Filters;
  hasActiveFilters: boolean;
  onChange: (changes: Partial<Filters>) => void;
  onReset: () => void;
}

const selectClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30";

export default function TaskFilters({ filters, hasActiveFilters, onChange, onReset }: TaskFiltersProps) {
  const [searchText, setSearchText] = useState(filters.search);
  const debouncedSearch = useDebounce(searchText, 400);

  // Push the debounced search text to the URL
  useEffect(() => {
    if (debouncedSearch !== filters.search) onChange({ search: debouncedSearch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Keep the input in sync when filters are reset or changed from the URL
  useEffect(() => {
    setSearchText(filters.search);
  }, [filters.search]);

  const handleSort = (value: string) => {
    const [sortBy, order] = value.split(":");
    onChange({ sortBy: sortBy as Filters["sortBy"], order: order as Filters["order"] });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr_auto]">
        <div className="relative md:col-span-2 xl:col-span-1">
          <label htmlFor="task-search" className="sr-only">Search tasks</label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="task-search"
            type="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by title, description or assignee..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-9 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 [&::-webkit-search-cancel-button]:appearance-none"
          />
          {searchText && (
            <button
              type="button"
              onClick={() => setSearchText("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div>
          <label htmlFor="filter-status" className="sr-only">Filter by status</label>
          <select id="filter-status" value={filters.status} onChange={(e) => onChange({ status: e.target.value as Filters["status"] })} className={selectClass}>
            <option value="all">All statuses</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-priority" className="sr-only">Filter by priority</label>
          <select id="filter-priority" value={filters.priority} onChange={(e) => onChange({ priority: e.target.value as Filters["priority"] })} className={selectClass}>
            <option value="all">All priorities</option>
            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sort-by" className="sr-only">Sort tasks</label>
          <select id="sort-by" value={`${filters.sortBy}:${filters.order}`} onChange={(e) => handleSort(e.target.value)} className={selectClass}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={onReset}>
            <X className="h-4 w-4" aria-hidden="true" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}