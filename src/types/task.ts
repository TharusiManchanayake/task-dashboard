export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string; // ISO date: YYYY-MM-DD
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export type TaskInput = Omit<Task, "id" | "createdAt" | "updatedAt">;

export type SortField = "title" | "dueDate" | "priority" | "createdAt";
export type SortOrder = "asc" | "desc";

export interface TaskQuery {
  search?: string;
  status?: TaskStatus | "all";
  priority?: TaskPriority | "all";
  sortBy?: SortField;
  order?: SortOrder;
  page?: number;
  limit?: number;
}

export interface PaginatedTasks {
  data: Task[];
  total: number;
}