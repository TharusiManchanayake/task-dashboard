"use client";

import { useParams } from "next/navigation";
import TaskDetails from "@/components/tasks/TaskDetails";

export default function TaskDetailsPage() {
  const params = useParams<{ id: string }>();
  return <TaskDetails id={Number(params.id)} />;
}