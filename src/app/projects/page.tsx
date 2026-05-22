import Link from "next/link";
import { getProjects } from "@/lib/task-service";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Projects</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="rounded-lg border border-gray-200 bg-white p-6 hover:border-indigo-300 hover:shadow-sm transition-shadow"
          >
            <h2 className="text-lg font-semibold text-gray-900">{project.name}</h2>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{project.description}</p>
            <p className="mt-4 text-xs text-gray-500">
              {project._count.tasks} task{project._count.tasks !== 1 ? "s" : ""} · Created{" "}
              {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
