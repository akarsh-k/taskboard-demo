import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildActivityEvent } from "@/lib/activity-log";

const mockTransaction = vi.fn();
const mockCommentCreate = vi.fn();
const mockActivityCreate = vi.fn();

vi.mock("@/lib/db", () => ({
  prisma: {
    $transaction: mockTransaction,
  },
}));

describe("comment-service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds a comment and writes a comment_added activity event", async () => {
    const createdComment = {
      id: "comment-1",
      body: "Looks good to me",
      authorId: "user-1",
      taskId: "task-1",
      createdAt: new Date(),
      author: { name: "Sarah Chen" },
    };

    mockTransaction.mockImplementation(async (fn) => {
      const tx = {
        comment: {
          create: mockCommentCreate.mockResolvedValue(createdComment),
        },
        activityEvent: {
          create: mockActivityCreate.mockResolvedValue({}),
        },
      };
      return fn(tx);
    });

    const { addComment } = await import("@/lib/comment-service");

    const result = await addComment("task-1", "user-1", "Looks good to me");

    expect(mockCommentCreate).toHaveBeenCalledWith({
      data: { taskId: "task-1", authorId: "user-1", body: "Looks good to me" },
      include: { author: true },
    });

    expect(mockActivityCreate).toHaveBeenCalledWith({
      data: buildActivityEvent({
        type: "comment_added",
        taskId: "task-1",
        userId: "user-1",
        metadata: { commentId: "comment-1" },
      }),
    });

    expect(result.body).toBe("Looks good to me");
  });
});
