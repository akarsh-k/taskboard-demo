import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildActivityEvent } from "@/lib/activity-log";

const mockTransaction = vi.fn();
const mockTaskCreate = vi.fn();
const mockActivityCreate = vi.fn();
const mockTaskLabelCreateMany = vi.fn();
const mockLabelFindMany = vi.fn();
const mockTaskFindUnique = vi.fn();

vi.mock("@/lib/db", () => ({
  prisma: {
    $transaction: mockTransaction,
    task: {
      findUnique: mockTaskFindUnique,
    },
  },
}));

describe("task-service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTaskFindUnique.mockResolvedValue({
      id: "task-new",
      title: "New task",
      status: "todo",
    });
  });

  it("creates a task and writes a task_created activity event", async () => {
    const createdTask = {
      id: "task-new",
      title: "New task",
      description: "A test task",
      status: "todo",
      priority: "medium",
      projectId: "proj-1",
      assigneeId: null,
      creatorId: "user-1",
      dueDate: null,
    };

    mockTransaction.mockImplementation(async (fn) => {
      const tx = {
        task: { create: mockTaskCreate.mockResolvedValue(createdTask) },
        activityEvent: { create: mockActivityCreate.mockResolvedValue({}) },
        taskLabel: { createMany: mockTaskLabelCreateMany },
        label: { findMany: mockLabelFindMany },
      };
      return fn(tx);
    });

    const { createTask } = await import("@/lib/task-service");

    await createTask({
      title: "New task",
      description: "A test task",
      projectId: "proj-1",
      creatorId: "user-1",
    });

    expect(mockTaskCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: "New task",
        status: "todo",
        priority: "medium",
        creatorId: "user-1",
      }),
    });

    expect(mockActivityCreate).toHaveBeenCalledWith({
      data: buildActivityEvent({
        type: "task_created",
        taskId: "task-new",
        userId: "user-1",
      }),
    });
  });

  it("creates label activity events when labels are provided", async () => {
    const createdTask = { id: "task-new", title: "Labeled task" };

    mockTransaction.mockImplementation(async (fn) => {
      const tx = {
        task: { create: vi.fn().mockResolvedValue(createdTask) },
        activityEvent: { create: mockActivityCreate.mockResolvedValue({}) },
        taskLabel: {
          createMany: mockTaskLabelCreateMany.mockResolvedValue({}),
        },
        label: {
          findMany: mockLabelFindMany.mockResolvedValue([
            { id: "label-1", name: "bug" },
          ]),
        },
      };
      return fn(tx);
    });

    const { createTask } = await import("@/lib/task-service");

    await createTask({
      title: "Labeled task",
      description: "",
      projectId: "proj-1",
      creatorId: "user-1",
      labelIds: ["label-1"],
    });

    expect(mockTaskLabelCreateMany).toHaveBeenCalled();
    expect(mockActivityCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({ type: "label_added" }),
    });
    expect(mockActivityCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({ type: "task_created" }),
    });
  });
});
