import { apiRequest } from "./apiClient";
import type { PaginatedTasks, Task, TaskInput, TaskQuery } from "@/types/task";
import { PAGE_SIZE, PRIORITY_WEIGHT } from "@/lib/constants";

function buildFilterParams(query: TaskQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.search) params.set("q", query.search);
  if (query.status && query.status !== "all") params.set("status", query.status);
  if (query.priority && query.priority !== "all") params.set("priority", query.priority);
  return params;
}

export const taskService = {
  async getTasks(query: TaskQuery = {}): Promise<PaginatedTasks> {
    const page = query.page ?? 1;
    const limit = query.limit ?? PAGE_SIZE;
    const order = query.order ?? "desc";
    const params = buildFilterParams(query);

    // Priority needs custom ordering (low < medium < high), so sort on the client
    if (query.sortBy === "priority") {
      const { data } = await apiRequest<Task[]>(`/tasks?${params.toString()}`);
      const direction = order === "asc" ? 1 : -1;
      const sorted = [...data].sort(
        (a, b) => (PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]) * direction
      );
      const start = (page - 1) * limit;
      return { data: sorted.slice(start, start + limit), total: sorted.length };
    }

    params.set("_sort", query.sortBy ?? "createdAt");
    params.set("_order", order);
    params.set("_page", String(page));
    params.set("_limit", String(limit));

    const { data, headers } = await apiRequest<Task[]>(`/tasks?${params.toString()}`);
    return { data, total: Number(headers.get("X-Total-Count") ?? data.length) };
  },

  async getAllTasks(): Promise<Task[]> {
    const { data } = await apiRequest<Task[]>("/tasks");
    return data;
  },

  async getTask(id: number): Promise<Task> {
    const { data } = await apiRequest<Task>(`/tasks/${id}`);
    return data;
  },

  async createTask(input: TaskInput): Promise<Task> {
    const now = new Date().toISOString();
    const { data } = await apiRequest<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify({ ...input, createdAt: now, updatedAt: now }),
    });
    return data;
  },

  async updateTask(id: number, input: Partial<TaskInput>): Promise<Task> {
    const { data } = await apiRequest<Task>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ ...input, updatedAt: new Date().toISOString() }),
    });
    return data;
  },

  async deleteTask(id: number): Promise<void> {
    await apiRequest<null>(`/tasks/${id}`, { method: "DELETE" });
  },
};