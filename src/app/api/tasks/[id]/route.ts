import { NextRequest, NextResponse } from "next/server";
import {
  getTaskById,
  updateTaskStatus,
  updateTaskPriority,
  updateTaskAssignee,
} from "@/lib/task-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const task = await getTaskById(id);
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
  return NextResponse.json(task);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const userId = body.userId as string;

  if (body.status !== undefined) {
    await updateTaskStatus(id, body.status, userId);
  }
  if (body.priority !== undefined) {
    await updateTaskPriority(id, body.priority, userId);
  }
  if (body.assigneeId !== undefined) {
    await updateTaskAssignee(id, body.assigneeId, userId);
  }

  const task = await getTaskById(id);
  return NextResponse.json(task);
}
