import Link from "next/link";
import { ApiError } from "@/services/apiClient";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";

interface ResourceErrorProps {
  error: Error;
  onRetry?: () => void;
}

/** Shows "not found" for 404s and the generic error card (with retry) for everything else. */
export default function ResourceError({ error, onRetry }: ResourceErrorProps) {
  if (error instanceof ApiError && error.status === 404) {
    return (
      <EmptyState
        title="Task not found"
        description="This task may have been deleted, or the link is incorrect."
        action={
          <Link
            href="/tasks"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Back to tasks
          </Link>
        }
      />
    );
  }

  return <ErrorState message={error.message} onRetry={onRetry} />;
}