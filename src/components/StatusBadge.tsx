import type { TaskStatus } from "@/types";
import { STATUS_LABELS } from "@/types";

const statusColors: Record<TaskStatus, string> = {
  todo: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  review: "bg-purple-100 text-purple-700",
  done: "bg-green-100 text-green-700",
};

interface StatusBadgeProps {
  status: TaskStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const label = STATUS_LABELS[status as TaskStatus] ?? status;
  const color = statusColors[status as TaskStatus] ?? "bg-gray-100 text-gray-700";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}
