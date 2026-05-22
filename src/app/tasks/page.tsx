import Link from "next/link";
import { getTasks, getUsers, getProjects } from "@/lib/task-service";
import { TaskTable } from "@/components/TaskTable";
import { parseFiltersFromSearchParams } from "@/lib/filters";
import { TASK_STATUSES, TASK_PRIORITIES, STATUS_LABELS, PRIORITY_LABELS } from "@/types";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseFiltersFromSearchParams(params);
  const [tasks, users, projects] = await Promise.all([
    getTasks(filters),
    getUsers(),
    getProjects(),
  ]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <Link
          href="/tasks/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          New Task
        </Link>
      </div>

      <form className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="block text-xs font-medium text-gray-500">Search</label>
            <input
              name="search"
              defaultValue={filters.search ?? ""}
              placeholder="Search by title..."
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Status</label>
            <select
              name="status"
              defaultValue={filters.status ?? ""}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All</option>
              {TASK_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Priority</label>
            <select
              name="priority"
              defaultValue={filters.priority ?? ""}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All</option>
              {TASK_PRIORITIES.map((p) => (
                <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Assignee</label>
            <select
              name="assigneeId"
              defaultValue={filters.assigneeId ?? ""}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Project</label>
            <select
              name="projectId"
              defaultValue={filters.projectId ?? ""}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Apply Filters
        </button>
      </form>

      <TaskTable tasks={tasks} />
    </div>
  );
}
