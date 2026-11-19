import { z } from "zod";

export const todayISO = (): string => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

export function getTaskSchema(mode: "create" | "edit") {
  return z.object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title must be 100 characters or fewer"),
    description: z
      .string()
      .trim()
      .min(1, "Description is required")
      .max(500, "Description must be 500 characters or fewer"),
    status: z.enum(["todo", "in_progress", "done"]),
    priority: z.enum(["low", "medium", "high"]),
    assignee: z
      .string()
      .trim()
      .min(2, "Assignee must be at least 2 characters")
      .max(60, "Assignee must be 60 characters or fewer"),
    dueDate: z
      .string()
      .min(1, "Due date is required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date")
      .refine(
        (value) => mode === "edit" || value >= todayISO(),
        "Due date cannot be in the past"
      ),
  });
}