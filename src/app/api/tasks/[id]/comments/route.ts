import { NextRequest, NextResponse } from "next/server";
import { addComment } from "@/lib/comment-service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: taskId } = await params;
  const body = await request.json();

  const comment = await addComment(taskId, body.authorId, body.body);
  return NextResponse.json(comment, { status: 201 });
}
