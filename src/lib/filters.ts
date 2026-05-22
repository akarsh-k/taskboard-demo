import type { TaskFilters } from "@/types";

export interface FilterableTask {
  title: string;
  status: string;
  priority: string;
  assigneeId: string | null;
  projectId: string;
}

export function filterTasks<T extends FilterableTask>(
  tasks: T[],
  filters: TaskFilters
): T[] {
  return tasks.filter((task) => {
    if (filters.search) {
      const query = filters.search.toLowerCase();
      if (!task.title.toLowerCase().includes(query)) {
        return false;
      }
    }
    if (filters.status && task.status !== filters.status) {
      return false;
    }
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }
    if (filters.assigneeId && task.assigneeId !== filters.assigneeId) {
      return false;
    }
    if (filters.projectId && task.projectId !== filters.projectId) {
      return false;
    }
    return true;
  });
}

export function parseFiltersFromSearchParams(
  params: Record<string, string | string[] | undefined>
): TaskFilters {
  const get = (key: string) => {
    const value = params[key];
    return typeof value === "string" ? value : undefined;
  };

  return {
    search: get("search"),
    status: get("status") as TaskFilters["status"],
    priority: get("priority") as TaskFilters["priority"],
    assigneeId: get("assigneeId"),
    projectId: get("projectId"),
  };
}

export function buildFilterQueryString(filters: TaskFilters): string {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.assigneeId) params.set("assigneeId", filters.assigneeId);
  if (filters.projectId) params.set("projectId", filters.projectId);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
