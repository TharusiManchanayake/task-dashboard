import type { TaskPriority, TaskStatus } from "@/types/task";

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

export const PAGE_SIZE = 8;