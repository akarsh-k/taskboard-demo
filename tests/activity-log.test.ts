import { describe, it, expect } from "vitest";
import {
  buildActivityEvent,
  formatActivityMessage,
  parseMetadata,
  serializeMetadata,
} from "@/lib/activity-log";

describe("activity-log", () => {
  it("builds a task_created activity event", () => {
    const event = buildActivityEvent({
      type: "task_created",
      taskId: "task-1",
      userId: "user-1",
    });

    expect(event).toEqual({
      type: "task_created",
      taskId: "task-1",
      userId: "user-1",
      metadata: null,
    });
  });

  it("serializes and parses metadata", () => {
    const metadata = { from: "todo", to: "in_progress" };
    const serialized = serializeMetadata(metadata);
    expect(serialized).toBe('{"from":"todo","to":"in_progress"}');
    expect(parseMetadata(serialized)).toEqual(metadata);
  });

  it("formats status_changed message", () => {
    const message = formatActivityMessage("status_changed", {
      from: "todo",
      to: "in_progress",
    });
    expect(message).toBe("Status changed from todo to in_progress");
  });

  it("formats comment_added message", () => {
    const message = formatActivityMessage("comment_added", { commentId: "c-1" });
    expect(message).toBe("Comment was added");
  });

  it("builds label_added event with metadata", () => {
    const event = buildActivityEvent({
      type: "label_added",
      taskId: "task-1",
      userId: "user-1",
      metadata: { labelName: "bug" },
    });

    expect(event.metadata).toBe('{"labelName":"bug"}');
  });
});
