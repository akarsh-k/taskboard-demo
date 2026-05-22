import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900">TaskBoard</h1>
      <p className="mt-4 text-gray-600">
        TaskBoard is a simple team task board for managing projects, tasks, comments,
        and activity. It is designed as a demo repository for AI repo-understanding agents.
      </p>
      <p className="mt-4 text-gray-600">
        Browse the dashboard for team metrics, explore projects, or jump into the task list
        to create and manage work items.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/dashboard"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Dashboard
        </Link>
        <Link
          href="/projects"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Projects
        </Link>
        <Link
          href="/tasks"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Tasks
        </Link>
      </div>
    </div>
  );
}
