import Link from "next/link";
import { notFound } from "next/navigation";
import { getTaskById, getUsers, getLabels } from "@/lib/task-service";
import { TaskDetail } from "@/components/TaskDetail";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [task, users, labels] = await Promise.all([
    getTaskById(id),
    getUsers(),
    getLabels(),
  ]);

  if (!task) notFound();

  // No auth — default to first seeded user as the "current" user
  const currentUserId = users[0]?.id ?? "";

  return (
    <div>
      <Link href="/tasks" className="text-sm text-indigo-600 hover:text-indigo-800">
        ← Back to Tasks
      </Link>
      <div className="mt-4">
        <TaskDetail
          task={task}
          users={users}
          allLabels={labels}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}
