"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TASK_STATUSES, TASK_PRIORITIES, STATUS_LABELS, PRIORITY_LABELS } from "@/types";

interface TaskFormProps {
  projects: { id: string; name: string }[];
  users: { id: string; name: string }[];
  labels: { id: string; name: string }[];
  defaultCreatorId: string;
}

export function TaskForm({ projects, users, labels, defaultCreatorId }: TaskFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const data = {
      title: form.get("title") as string,
      description: form.get("description") as string,
      status: form.get("status") as string,
      priority: form.get("priority") as string,
      projectId: form.get("projectId") as string,
      assigneeId: (form.get("assigneeId") as string) || null,
      creatorId: form.get("creatorId") as string,
      dueDate: (form.get("dueDate") as string) || null,
      labelIds: selectedLabels,
    };

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const task = await res.json();
      router.push(`/tasks/${task.id}`);
    } finally {
      setSubmitting(false);
    }
  }

  function toggleLabel(labelId: string) {
    setSelectedLabels((prev) =>
      prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId]
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          name="title"
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          rows={4}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select name="status" defaultValue="todo" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select name="priority" defaultValue="medium" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            {TASK_PRIORITIES.map((p) => (
              <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Project</label>
          <select name="projectId" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Assignee</label>
          <select name="assigneeId" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Creator</label>
          <select name="creatorId" defaultValue={defaultCreatorId} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            name="dueDate"
            type="date"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Labels</label>
        <div className="flex flex-wrap gap-2">
          {labels.map((label) => (
            <button
              key={label.id}
              type="button"
              onClick={() => toggleLabel(label.id)}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                selectedLabels.includes(label.id)
                  ? "bg-indigo-600 text-white"
                  : "border border-gray-300 text-gray-600"
              }`}
            >
              {label.name}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {submitting ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}
