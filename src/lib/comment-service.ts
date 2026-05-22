import { prisma } from "@/lib/db";
import { buildActivityEvent } from "@/lib/activity-log";

export async function getCommentsForTask(taskId: string) {
  return prisma.comment.findMany({
    where: { taskId },
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function addComment(
  taskId: string,
  authorId: string,
  body: string
) {
  // TODO: Parse @mentions from comment body and create notifications for mentioned users.
  // Mention parsing will be added later — see docs/roadmap.md.

  const comment = await prisma.$transaction(async (tx) => {
    const created = await tx.comment.create({
      data: { taskId, authorId, body },
      include: { author: true },
    });

    await tx.activityEvent.create({
      data: buildActivityEvent({
        type: "comment_added",
        taskId,
        userId: authorId,
        metadata: { commentId: created.id },
      }),
    });

    return created;
  });

  return comment;
}
