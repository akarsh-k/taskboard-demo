import { NextRequest, NextResponse } from "next/server";
import { createTask, getTasks } from "@/lib/task-service";
import { parseFiltersFromSearchParams } from "@/lib/filters";
import type { CreateTaskInput } from "@/types";

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const filters = parseFiltersFromSearchParams(params);
  const tasks = await getTasks(filters);
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const input: CreateTaskInput = {
    title: body.title,
    description: body.description ?? "",
    status: body.status,
    priority: body.priority,
    projectId: body.projectId,
    assigneeId: body.assigneeId,
    creatorId: body.creatorId,
    dueDate: body.dueDate ? new Date(body.dueDate) : null,
    labelIds: body.labelIds,
  };

  const task = await createTask(input);
  return NextResponse.json(task, { status: 201 });
}
