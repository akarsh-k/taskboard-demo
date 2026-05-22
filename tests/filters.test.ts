import { describe, it, expect } from "vitest";
import { filterTasks, parseFiltersFromSearchParams, buildFilterQueryString } from "@/lib/filters";

const tasks = [
  {
    title: "Fix login bug",
    status: "todo" as const,
    priority: "high" as const,
    assigneeId: "user-1",
    projectId: "proj-1",
  },
  {
    title: "Update homepage",
    status: "in_progress" as const,
    priority: "medium" as const,
    assigneeId: "user-2",
    projectId: "proj-1",
  },
  {
    title: "Write documentation",
    status: "done" as const,
    priority: "low" as const,
    assigneeId: "user-1",
    projectId: "proj-2",
  },
  {
    title: "Design mobile nav",
    status: "review" as const,
    priority: "high" as const,
    assigneeId: "user-3",
    projectId: "proj-2",
  },
];

describe("filters", () => {
  it("filters by search query (title)", () => {
    const result = filterTasks(tasks, { search: "login" });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Fix login bug");
  });

  it("filters by status", () => {
    const result = filterTasks(tasks, { status: "done" });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Write documentation");
  });

  it("filters by priority", () => {
    const result = filterTasks(tasks, { priority: "high" });
    expect(result).toHaveLength(2);
  });

  it("filters by assignee", () => {
    const result = filterTasks(tasks, { assigneeId: "user-1" });
    expect(result).toHaveLength(2);
  });

  it("filters by project", () => {
    const result = filterTasks(tasks, { projectId: "proj-2" });
    expect(result).toHaveLength(2);
  });

  it("combines multiple filters", () => {
    const result = filterTasks(tasks, {
      status: "todo",
      priority: "high",
      assigneeId: "user-1",
    });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Fix login bug");
  });

  it("parses filters from search params", () => {
    const filters = parseFiltersFromSearchParams({
      search: "bug",
      status: "todo",
      priority: "high",
      assigneeId: "user-1",
      projectId: "proj-1",
    });
    expect(filters).toEqual({
      search: "bug",
      status: "todo",
      priority: "high",
      assigneeId: "user-1",
      projectId: "proj-1",
    });
  });

  it("builds filter query string", () => {
    const qs = buildFilterQueryString({
      search: "bug",
      status: "todo",
    });
    expect(qs).toBe("?search=bug&status=todo");
  });
});
