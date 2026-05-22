import type { ActivityType, ActivityMetadata } from "@/types";

export interface ActivityEventInput {
  type: ActivityType;
  taskId: string;
  userId?: string | null;
  metadata?: ActivityMetadata;
}

export function serializeMetadata(metadata?: ActivityMetadata): string | null {
  if (!metadata) return null;
  return JSON.stringify(metadata);
}

export function parseMetadata(raw: string | null): ActivityMetadata | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ActivityMetadata;
  } catch {
    return null;
  }
}

export function formatActivityMessage(
  type: ActivityType,
  metadata: ActivityMetadata | null
): string {
  switch (type) {
    case "task_created":
      return "Task was created";
    case "status_changed":
      return `Status changed from ${metadata?.from ?? "?"} to ${metadata?.to ?? "?"}`;
    case "assignee_changed":
      return `Assignee changed from ${metadata?.from ?? "unassigned"} to ${metadata?.to ?? "unassigned"}`;
    case "priority_changed":
      return `Priority changed from ${metadata?.from ?? "?"} to ${metadata?.to ?? "?"}`;
    case "label_added":
      return `Label "${metadata?.labelName ?? "unknown"}" was added`;
    case "label_removed":
      return `Label "${metadata?.labelName ?? "unknown"}" was removed`;
    case "comment_added":
      return "Comment was added";
    default:
      return "Activity recorded";
  }
}

export function buildActivityEvent(input: ActivityEventInput) {
  return {
    type: input.type,
    taskId: input.taskId,
    userId: input.userId ?? null,
    metadata: serializeMetadata(input.metadata),
  };
}
