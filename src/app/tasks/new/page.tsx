import Link from "next/link";
import { getProjects, getUsers, getLabels } from "@/lib/task-service";
import { TaskForm } from "@/components/TaskForm";

export default async function NewTaskPage() {
  const [projects, users, labels] = await Promise.all([
    getProjects(),
    getUsers(),
    getLabels(),
  ]);

  const defaultCreator = users[0];

  return (
    <div>
      <Link href="/tasks" className="text-sm text-indigo-600 hover:text-indigo-800">
        ← Back to Tasks
      </Link>
      <h1 className="mt-4 mb-6 text-2xl font-bold text-gray-900">Create Task</h1>
      <TaskForm
        projects={projects}
        users={users}
        labels={labels}
        defaultCreatorId={defaultCreator?.id ?? ""}
      />
    </div>
  );
}
