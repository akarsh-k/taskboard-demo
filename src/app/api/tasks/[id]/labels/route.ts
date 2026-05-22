import { NextRequest, NextResponse } from "next/server";
import { addLabelToTask, removeLabelFromTask } from "@/lib/task-service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: taskId } = await params;
  const body = await request.json();

  await addLabelToTask(taskId, body.labelId, body.userId);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: taskId } = await params;
  const body = await request.json();

  await removeLabelFromTask(taskId, body.labelId, body.userId);
  return NextResponse.json({ ok: true });
}
