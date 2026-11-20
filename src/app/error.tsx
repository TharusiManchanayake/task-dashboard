"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ui/ErrorState";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.warn("Unexpected application error:", error.message);
  }, [error]);

  return (
    <div className="py-16">
      <ErrorState
        message="An unexpected error occurred. Please try again."
        onRetry={reset}
      />
    </div>
  );
}