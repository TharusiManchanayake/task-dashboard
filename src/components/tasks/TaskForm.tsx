"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField, { inputClass } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/lib/constants";
import { getTaskSchema, todayISO } from "@/lib/validation";
import type { TaskInput } from "@/types/task";

const EMPTY_VALUES: TaskInput = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  assignee: "",
  dueDate: "",
};

interface TaskFormProps {
  mode: "create" | "edit";
  defaultValues?: TaskInput;
  isSubmitting: boolean;
  onSubmit: (values: TaskInput) => void;
  onCancel: () => void;
}

export default function TaskForm({ mode, defaultValues, isSubmitting, onSubmit, onCancel }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<TaskInput>({
    resolver: zodResolver(getTaskSchema(mode)),
    defaultValues: defaultValues ?? EMPTY_VALUES,
    mode: "onTouched",
  });

  const descriptionLength = watch("description")?.length ?? 0;

  const aria = (name: keyof TaskInput) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <FormField id="title" label="Title" required error={errors.title?.message}>
        <input
          id="title"
          type="text"
          placeholder="e.g. Design the login page"
          className={inputClass(!!errors.title)}
          {...aria("title")}
          {...register("title")}
        />
      </FormField>

      <FormField
        id="description"
        label="Description"
        required
        error={errors.description?.message}
        hint={`${descriptionLength}/500 characters`}
      >
        <textarea
          id="description"
          rows={4}
          placeholder="Describe what needs to be done"
          className={inputClass(!!errors.description)}
          {...aria("description")}
          {...register("description")}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="status" label="Status" required error={errors.status?.message}>
          <select id="status" className={inputClass(!!errors.status)} {...aria("status")} {...register("status")}>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </FormField>

        <FormField id="priority" label="Priority" required error={errors.priority?.message}>
          <select id="priority" className={inputClass(!!errors.priority)} {...aria("priority")} {...register("priority")}>
            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </FormField>

        <FormField id="assignee" label="Assignee" required error={errors.assignee?.message}>
          <input
            id="assignee"
            type="text"
            placeholder="e.g. Nimali Silva"
            className={inputClass(!!errors.assignee)}
            {...aria("assignee")}
            {...register("assignee")}
          />
        </FormField>

        <FormField id="dueDate" label="Due date" required error={errors.dueDate?.message}>
          <input
            id="dueDate"
            type="date"
            min={mode === "create" ? todayISO() : undefined}
            className={inputClass(!!errors.dueDate)}
            {...aria("dueDate")}
            {...register("dueDate")}
          />
        </FormField>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting} disabled={mode === "edit" && !isDirty}>
          {mode === "create" ? "Create task" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}