import { Suspense } from "react";
import TaskListView from "@/components/tasks/TaskListView";

export default function TasksPage() {
  return (
    <Suspense fallback={null}>
      <TaskListView />
    </Suspense>
  );
}