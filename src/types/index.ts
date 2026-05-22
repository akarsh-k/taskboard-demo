export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high";

export type ActivityType =
  | "task_created"
  | "status_changed"
  | "assignee_changed"
  | "priority_changed"
  | "label_added"
  | "label_removed"
  | "comment_added";

export const TASK_STATUSES: TaskStatus[] = [
  "todo",
  "in_progress",
  "review",
  "done",
];

export const TASK_PRIORITIES: TaskPriority[] = ["low", "medium", "high"];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export interface CreateTaskInput {
  title: string;
  description: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId: string;
  assigneeId?: string | null;
  creatorId: string;
  dueDate?: Date | null;
  labelIds?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
  dueDate?: Date | null;
}

export interface TaskFilters {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  projectId?: string;
}

export interface DashboardStats {
  totalTasks: number;
  openTasks: number;
  overdueTasks: number;
  tasksByStatus: Record<TaskStatus, number>;
  tasksByAssignee: { assigneeId: string | null; assigneeName: string; count: number }[];
}

export interface ActivityMetadata {
  from?: string;
  to?: string;
  labelName?: string;
  commentId?: string;
}
