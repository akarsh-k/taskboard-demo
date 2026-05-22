import { describe, it, expect } from "vitest";
import { calculateDashboardStats } from "@/lib/dashboard";
import type { DashboardTask } from "@/lib/dashboard";

describe("dashboard", () => {
  const now = new Date("2026-05-22");
  const pastDue = new Date("2026-05-01");
  const futureDue = new Date("2026-06-01");

  const tasks: DashboardTask[] = [
    { status: "todo", assigneeId: "u1", assigneeName: "Sarah", dueDate: futureDue },
    { status: "in_progress", assigneeId: "u2", assigneeName: "Marcus", dueDate: pastDue },
    { status: "done", assigneeId: "u1", assigneeName: "Sarah", dueDate: pastDue },
    { status: "review", assigneeId: null, assigneeName: null, dueDate: pastDue },
    { status: "todo", assigneeId: "u2", assigneeName: "Marcus", dueDate: null },
  ];

  it("calculates total tasks", () => {
    const stats = calculateDashboardStats(tasks);
    expect(stats.totalTasks).toBe(5);
  });

  it("calculates open tasks (not done)", () => {
    const stats = calculateDashboardStats(tasks);
    expect(stats.openTasks).toBe(4);
  });

  it("calculates overdue tasks excluding done", () => {
    const originalDate = Date;
    global.Date = class extends originalDate {
      constructor(...args: ConstructorParameters<typeof Date>) {
        if (args.length === 0) {
          super(now.getTime());
        } else {
          super(...args);
        }
      }
      static now() {
        return now.getTime();
      }
    } as DateConstructor;

    const stats = calculateDashboardStats(tasks);
    expect(stats.overdueTasks).toBe(2);

    global.Date = originalDate;
  });

  it("groups tasks by status", () => {
    const stats = calculateDashboardStats(tasks);
    expect(stats.tasksByStatus.todo).toBe(2);
    expect(stats.tasksByStatus.in_progress).toBe(1);
    expect(stats.tasksByStatus.review).toBe(1);
    expect(stats.tasksByStatus.done).toBe(1);
  });

  it("groups tasks by assignee", () => {
    const stats = calculateDashboardStats(tasks);
    const sarah = stats.tasksByAssignee.find((a) => a.assigneeName === "Sarah");
    const marcus = stats.tasksByAssignee.find((a) => a.assigneeName === "Marcus");
    const unassigned = stats.tasksByAssignee.find((a) => a.assigneeName === "Unassigned");

    expect(sarah?.count).toBe(2);
    expect(marcus?.count).toBe(2);
    expect(unassigned?.count).toBe(1);
  });
});
