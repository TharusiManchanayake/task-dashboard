import type { Task, TaskPriority, TaskStatus } from "@/types/task";
import { isOverdue } from "./utils";

export interface TaskStats {
  total: number;
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
  overdue: number;
  completionRate: number; // 0-100
}

export function computeStats(tasks: Task[]): TaskStats {
  const byStatus: Record<TaskStatus, number> = { todo: 0, in_progress: 0, done: 0 };
  const byPriority: Record<TaskPriority, number> = { low: 0, medium: 0, high: 0 };
  let overdue = 0;

  for (const task of tasks) {
    byStatus[task.status] += 1;
    byPriority[task.priority] += 1;
    if (isOverdue(task.dueDate, task.status)) overdue += 1;
  }

  const total = tasks.length;
  const completionRate = total === 0 ? 0 : Math.round((byStatus.done / total) * 100);

  return { total, byStatus, byPriority, overdue, completionRate };
}