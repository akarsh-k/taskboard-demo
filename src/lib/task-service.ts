import { prisma } from "@/lib/db";
import { buildActivityEvent } from "@/lib/activity-log";
import type { CreateTaskInput, UpdateTaskInput, TaskFilters } from "@/types";
import { filterTasks } from "@/lib/filters";

const taskInclude = {
  project: true,
  assignee: true,
  creator: true,
  labels: { include: { label: true } },
  comments: {
    include: { author: true },
    orderBy: { createdAt: "desc" as const },
  },
  activities: { orderBy: { createdAt: "desc" as const } },
};

const taskListInclude = {
  project: true,
  assignee: true,
  creator: true,
  labels: { include: { label: true } },
} as const;

export type TaskListItem = Awaited<
  ReturnType<
    typeof prisma.task.findMany<{ include: typeof taskListInclude }>
  >
>[number];

export async function getTasks(filters: TaskFilters = {}): Promise<TaskListItem[]> {
  const tasks = await prisma.task.findMany({
    include: taskListInclude,
    orderBy: { updatedAt: "desc" },
  });

  return filterTasks<TaskListItem>(tasks, filters);
}

export async function getTaskById(id: string) {
  return prisma.task.findUnique({
    where: { id },
    include: taskInclude,
  });
}

export async function createTask(input: CreateTaskInput) {
  const { labelIds, ...data } = input;

  const task = await prisma.$transaction(async (tx) => {
    const created = await tx.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status ?? "todo",
        priority: data.priority ?? "medium",
        projectId: data.projectId,
        assigneeId: data.assigneeId ?? null,
        creatorId: data.creatorId,
        dueDate: data.dueDate ?? null,
      },
    });

    if (labelIds && labelIds.length > 0) {
      await tx.taskLabel.createMany({
        data: labelIds.map((labelId) => ({
          taskId: created.id,
          labelId,
        })),
      });

      const labels = await tx.label.findMany({
        where: { id: { in: labelIds } },
      });

      for (const label of labels) {
        await tx.activityEvent.create({
          data: buildActivityEvent({
            type: "label_added",
            taskId: created.id,
            userId: data.creatorId,
            metadata: { labelName: label.name },
          }),
        });
      }
    }

    await tx.activityEvent.create({
      data: buildActivityEvent({
        type: "task_created",
        taskId: created.id,
        userId: data.creatorId,
      }),
    });

    return created;
  });

  return getTaskById(task.id);
}

export async function updateTaskStatus(
  taskId: string,
  status: string,
  userId: string
) {
  const existing = await prisma.task.findUniqueOrThrow({ where: { id: taskId } });

  const task = await prisma.$transaction(async (tx) => {
    const updated = await tx.task.update({
      where: { id: taskId },
      data: { status },
    });

    if (existing.status !== status) {
      await tx.activityEvent.create({
        data: buildActivityEvent({
          type: "status_changed",
          taskId,
          userId,
          metadata: { from: existing.status, to: status },
        }),
      });
    }

    return updated;
  });

  return task;
}

export async function updateTaskPriority(
  taskId: string,
  priority: string,
  userId: string
) {
  const existing = await prisma.task.findUniqueOrThrow({ where: { id: taskId } });

  const task = await prisma.$transaction(async (tx) => {
    const updated = await tx.task.update({
      where: { id: taskId },
      data: { priority },
    });

    if (existing.priority !== priority) {
      await tx.activityEvent.create({
        data: buildActivityEvent({
          type: "priority_changed",
          taskId,
          userId,
          metadata: { from: existing.priority, to: priority },
        }),
      });
    }

    return updated;
  });

  return task;
}

export async function updateTaskAssignee(
  taskId: string,
  assigneeId: string | null,
  userId: string
) {
  const existing = await prisma.task.findUniqueOrThrow({
    where: { id: taskId },
    include: { assignee: true },
  });

  const newAssignee = assigneeId
    ? await prisma.user.findUnique({ where: { id: assigneeId } })
    : null;

  const task = await prisma.$transaction(async (tx) => {
    const updated = await tx.task.update({
      where: { id: taskId },
      data: { assigneeId },
    });

    if (existing.assigneeId !== assigneeId) {
      await tx.activityEvent.create({
        data: buildActivityEvent({
          type: "assignee_changed",
          taskId,
          userId,
          metadata: {
            from: existing.assignee?.name ?? "unassigned",
            to: newAssignee?.name ?? "unassigned",
          },
        }),
      });
    }

    return updated;
  });

  return task;
}

export async function addLabelToTask(
  taskId: string,
  labelId: string,
  userId: string
) {
  const label = await prisma.label.findUniqueOrThrow({ where: { id: labelId } });

  await prisma.$transaction(async (tx) => {
    await tx.taskLabel.upsert({
      where: { taskId_labelId: { taskId, labelId } },
      create: { taskId, labelId },
      update: {},
    });

    await tx.activityEvent.create({
      data: buildActivityEvent({
        type: "label_added",
        taskId,
        userId,
        metadata: { labelName: label.name },
      }),
    });
  });
}

export async function removeLabelFromTask(
  taskId: string,
  labelId: string,
  userId: string
) {
  const label = await prisma.label.findUniqueOrThrow({ where: { id: labelId } });

  await prisma.$transaction(async (tx) => {
    await tx.taskLabel.delete({
      where: { taskId_labelId: { taskId, labelId } },
    });

    await tx.activityEvent.create({
      data: buildActivityEvent({
        type: "label_removed",
        taskId,
        userId,
        metadata: { labelName: label.name },
      }),
    });
  });
}

export async function updateTask(taskId: string, input: UpdateTaskInput) {
  return prisma.task.update({
    where: { id: taskId },
    data: input,
  });
}

export async function getProjects() {
  return prisma.project.findMany({
    include: {
      _count: { select: { tasks: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      tasks: {
        include: {
          assignee: true,
          labels: { include: { label: true } },
        },
        orderBy: { updatedAt: "desc" },
      },
      _count: { select: { tasks: true } },
    },
  });
}

export async function getUsers() {
  return prisma.user.findMany({ orderBy: { name: "asc" } });
}

export async function getLabels() {
  return prisma.label.findMany({ orderBy: { name: "asc" } });
}
