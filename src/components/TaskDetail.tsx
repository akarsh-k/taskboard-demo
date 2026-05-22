"use client";

import { useRouter } from "next/navigation";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import { ActivityTimeline } from "./ActivityTimeline";
import { TASK_STATUSES, TASK_PRIORITIES, STATUS_LABELS, PRIORITY_LABELS } from "@/types";

interface TaskDetailProps {
  task: {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
    project: { id: string; name: string };
    assignee: { id: string; name: string } | null;
    creator: { name: string };
    labels: { label: { id: string; name: string; color: string } }[];
    comments: {
      id: string;
      body: string;
      createdAt: Date;
      author: { name: string };
    }[];
    activities: {
      id: string;
      type: string;
      metadata: string | null;
      createdAt: Date;
    }[];
  };
  users: { id: string; name: string }[];
  allLabels: { id: string; name: string; color: string }[];
  currentUserId: string;
}

export function TaskDetail({ task, users, allLabels, currentUserId }: TaskDetailProps) {
  const router = useRouter();

  async function patchTask(data: Record<string, string | null>) {
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, userId: currentUserId }),
    });
    router.refresh();
  }

  async function toggleLabel(labelId: string, isAttached: boolean) {
    const method = isAttached ? "DELETE" : "POST";
    await fetch(`/api/tasks/${task.id}/labels`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ labelId, userId: currentUserId }),
    });
    router.refresh();
  }

  const attachedLabelIds = new Set(task.labels.map((tl) => tl.label.id));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
        <p className="mt-2 text-sm text-gray-500">
          Created by {task.creator.name} · {new Date(task.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-2 text-sm font-semibold text-gray-900">Description</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {task.description || "No description."}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">Comments</h2>
            <CommentList comments={task.comments} />
            <div className="mt-4 border-t border-gray-200 pt-4">
              <CommentForm taskId={task.id} authorId={currentUserId} />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">Activity</h2>
            <ActivityTimeline activities={task.activities} />
          </div>
        </div>

        <div className="space-y-4">
          <Field label="Status">
            <select
              value={task.status}
              onChange={(e) => patchTask({ status: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {TASK_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </Field>

          <Field label="Priority">
            <select
              value={task.priority}
              onChange={(e) => patchTask({ priority: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {TASK_PRIORITIES.map((p) => (
                <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
              ))}
            </select>
          </Field>

          <Field label="Assignee">
            <select
              value={task.assignee?.id ?? ""}
              onChange={(e) => patchTask({ assigneeId: e.target.value || null })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Project">
            <p className="text-sm text-gray-700">{task.project.name}</p>
          </Field>

          <Field label="Due Date">
            <p className="text-sm text-gray-700">
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "None"}
            </p>
          </Field>

          <Field label="Current">
            <div className="flex gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
          </Field>

          <Field label="Labels">
            <div className="flex flex-wrap gap-2">
              {allLabels.map((label) => {
                const attached = attachedLabelIds.has(label.id);
                return (
                  <button
                    key={label.id}
                    onClick={() => toggleLabel(label.id, attached)}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                      attached
                        ? "text-white"
                        : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                    style={attached ? { backgroundColor: label.color } : undefined}
                  >
                    {label.name}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">{label}</p>
      {children}
    </div>
  );
}
