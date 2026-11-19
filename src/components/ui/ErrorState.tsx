import { AlertTriangle } from "lucide-react";
import Button from "./Button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Something went wrong while loading the data.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
      <AlertTriangle className="h-10 w-10 text-red-500" aria-hidden="true" />
      <h3 className="mt-4 text-base font-semibold text-red-900">Unable to load data</h3>
      <p className="mt-1 max-w-sm text-sm text-red-700">{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" className="mt-6" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}