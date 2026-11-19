import type { ReactNode } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  children: ReactNode;
}

export const inputClass = (hasError: boolean) =>
  [
    "w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400",
    "focus:outline-none focus:ring-2",
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
      : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/30",
  ].join(" ");

export default function FormField({ id, label, error, hint, required, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}