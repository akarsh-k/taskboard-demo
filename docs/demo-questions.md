# Demo Questions

Use these prompts when demonstrating an AI repo-understanding agent against TaskBoard.

## Primary demo prompt

> I want to build @mentions in task comments. When someone writes @sarah, Sarah should receive an in-app notification. Explain the implementation plan and list the first files I should edit.

**Expected agent behavior:** The agent should identify `src/lib/comment-service.ts` as the starting point (where the TODO exists), propose a new mentions parser, a Notification model, and a notification service. It should reference `docs/roadmap.md` and `docs/task-flow.md`.

## Additional demo questions

### What files are involved when a comment is created?

Expected answer should trace: `CommentForm.tsx` → `POST /api/tasks/[id]/comments` → `comment-service.ts` → Prisma `Comment` model → activity event in `activity-log.ts`.

### What data model changes are needed for notifications?

Expected answer should propose a `Notification` model with fields like `userId`, `type`, `message`, `read`, `createdAt`, and possibly a relation to `Comment` or `Task`.

### What would break if statuses became project-specific?

Expected answer should mention: global `TASK_STATUSES` constant in `src/types/index.ts`, status dropdowns in `TaskDetail.tsx` and `TaskForm.tsx`, dashboard grouping in `dashboard.ts`, filter logic in `filters.ts`, and seed data assumptions.

### Which tests should be added before implementing mentions?

Expected answer should suggest tests in `tests/comment-service.test.ts` for mention parsing, new tests for a mentions module, and integration tests verifying notification creation when a comment contains `@username`.

## Tips for demo presenters

1. Start with "What does this repo do?" to show the agent understands the big picture.
2. Use the primary demo prompt to show architectural reasoning.
3. Ask about intentionally missing features to show the agent reads docs and code comments.
4. Ask "Which tests should I add?" to show the agent understands test coverage gaps.
