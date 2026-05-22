import type { TaskPriority } from "@/types";
import { PRIORITY_LABELS } from "@/types";

const priorityColors: Record<TaskPriority, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

interface PriorityBadgeProps {
  priority: TaskPriority | string;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const label = PRIORITY_LABELS[priority as TaskPriority] ?? priority;
  const color = priorityColors[priority as TaskPriority] ?? "bg-gray-100 text-gray-600";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}
