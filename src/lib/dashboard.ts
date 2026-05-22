import type { DashboardStats, TaskStatus } from "@/types";
import { TASK_STATUSES } from "@/types";

export interface DashboardTask {
  status: TaskStatus;
  assigneeId: string | null;
  assigneeName: string | null;
  dueDate: Date | null;
}

export function calculateDashboardStats(tasks: DashboardTask[]): DashboardStats {
  const now = new Date();

  const tasksByStatus = TASK_STATUSES.reduce(
    (acc, status) => {
      acc[status] = tasks.filter((t) => t.status === status).length;
      return acc;
    },
    {} as Record<TaskStatus, number>
  );

  const openTasks = tasks.filter((t) => t.status !== "done").length;

  const overdueTasks = tasks.filter(
    (t) => t.dueDate && t.dueDate < now && t.status !== "done"
  ).length;

  const assigneeMap = new Map<string | null, { name: string; count: number }>();
  for (const task of tasks) {
    const key = task.assigneeId;
    const existing = assigneeMap.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      assigneeMap.set(key, {
        name: task.assigneeName ?? "Unassigned",
        count: 1,
      });
    }
  }

  const tasksByAssignee = Array.from(assigneeMap.entries()).map(
    ([assigneeId, { name, count }]) => ({
      assigneeId,
      assigneeName: name,
      count,
    })
  );

  return {
    totalTasks: tasks.length,
    openTasks,
    overdueTasks,
    tasksByStatus,
    tasksByAssignee,
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { prisma } = await import("@/lib/db");

  const tasks = await prisma.task.findMany({
    include: {
      assignee: { select: { name: true } },
    },
  });

  return calculateDashboardStats(
    tasks.map((t) => ({
      status: t.status as TaskStatus,
      assigneeId: t.assigneeId,
      assigneeName: t.assignee?.name ?? null,
      dueDate: t.dueDate,
    }))
  );
}
