import { apiRequest } from "./apiClient";
import type { PaginatedTasks, Task, TaskInput, TaskQuery } from "@/types/task";
import { PAGE_SIZE } from "@/lib/constants";

function buildQueryString(query: TaskQuery): string {
  const params = new URLSearchParams();

  if (query.search) params.set("q", query.search);
  if (query.status && query.status !== "all") params.set("status", query.status);
  if (query.priority && query.priority !== "all") params.set("priority", query.priority);

  params.set("_sort", query.sortBy ?? "createdAt");
  params.set("_order", query.order ?? "desc");
  params.set("_page", String(query.page ?? 1));
  params.set("_limit", String(query.limit ?? PAGE_SIZE));

  return params.toString();
}

export const taskService = {
  async getTasks(query: TaskQuery = {}): Promise<PaginatedTasks> {
    const { data, headers } = await apiRequest<Task[]>(
      `/tasks?${buildQueryString(query)}`
    );
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