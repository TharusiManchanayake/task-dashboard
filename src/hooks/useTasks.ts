"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { taskService } from "@/services/taskService";
import type { TaskInput, TaskQuery } from "@/types/task";

export const taskKeys = {
  all: ["tasks"] as const,
  list: (query: TaskQuery) => ["tasks", "list", query] as const,
  everything: ["tasks", "all"] as const,
  detail: (id: number) => ["tasks", "detail", id] as const,
};

/** Paginated, filtered, sorted list (used by the Task List page). */
export function useTasks(query: TaskQuery) {
  return useQuery({
    queryKey: taskKeys.list(query),
    queryFn: () => taskService.getTasks(query),
    placeholderData: keepPreviousData, // keeps old rows visible while the next page loads
  });
}

/** Every task, unpaginated (used for dashboard statistics). */
export function useAllTasks() {
  return useQuery({
    queryKey: taskKeys.everything,
    queryFn: () => taskService.getAllTasks(),
  });
}

export function useTask(id: number) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => taskService.getTask(id),
    enabled: Number.isFinite(id),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TaskInput) => taskService.createTask(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success("Task created successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<TaskInput> }) =>
      taskService.updateTask(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success("Task updated successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success("Task deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}