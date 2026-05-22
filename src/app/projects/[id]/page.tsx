import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/task-service";
import { TaskTable } from "@/components/TaskTable";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) notFound();

  return (
    <div>
      <Link href="/projects" className="text-sm text-indigo-600 hover:text-indigo-800">
        ← Back to Projects
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">{project.name}</h1>
      <p className="mt-2 text-gray-600">{project.description}</p>
      <p className="mt-1 text-sm text-gray-500">
        Created {new Date(project.createdAt).toLocaleDateString()} · {project._count.tasks} tasks
      </p>

      <h2 className="mb-4 mt-8 text-lg font-semibold text-gray-900">Tasks</h2>
      <TaskTable tasks={project.tasks} />
    </div>
  );
}
