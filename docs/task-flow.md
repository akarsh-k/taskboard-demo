# Task Flow

This document explains how core task operations work in TaskBoard.

## Creating a task

1. User navigates to `/tasks/new` and fills out `TaskForm`
2. Form POSTs to `POST /api/tasks` with title, description, status, priority, project, assignee, creator, due date, and optional labels
3. `createTask()` in `src/lib/task-service.ts`:
   - Creates the task record via Prisma
   - Attaches any selected labels via `TaskLabel` join records
   - Writes a `label_added` activity event for each label
   - Writes a `task_created` activity event
4. User is redirected to `/tasks/[id]`

**Key files:** `TaskForm.tsx`, `src/app/api/tasks/route.ts`, `src/lib/task-service.ts`

## Changing task status

1. User selects a new status from the dropdown on the task detail page
2. Client PATCHes `/api/tasks/[id]` with `{ status, userId }`
3. `updateTaskStatus()` in `task-service.ts`:
   - Reads the current status
   - Updates the task if the status changed
   - Writes a `status_changed` activity event with `from` and `to` metadata

The same pattern applies to priority (`updateTaskPriority`) and assignee (`updateTaskAssignee`) changes.

**Key files:** `TaskDetail.tsx`, `src/app/api/tasks/[id]/route.ts`, `src/lib/task-service.ts`

## Adding a comment

1. User types a comment in `CommentForm` on the task detail page
2. Client POSTs to `/api/tasks/[id]/comments` with `{ authorId, body }`
3. `addComment()` in `src/lib/comment-service.ts`:
   - Creates the comment record
   - Writes a `comment_added` activity event
   - **TODO:** Parse @mentions from the comment body (not implemented)

**Key files:** `CommentForm.tsx`, `src/app/api/tasks/[id]/comments/route.ts`, `src/lib/comment-service.ts`

## Writing activity events

Activity events are written by service functions whenever something meaningful happens. The pattern is consistent:

1. Service function performs the main operation (create task, change status, etc.)
2. Service calls `buildActivityEvent()` from `src/lib/activity-log.ts`
3. Event is persisted via `prisma.activityEvent.create()` inside the same transaction

Activity types:
- `task_created`
- `status_changed`
- `assignee_changed`
- `priority_changed`
- `label_added`
- `label_removed`
- `comment_added`

Events store optional JSON metadata (e.g., `{ from: "todo", to: "in_progress" }`) for display in `ActivityTimeline`.

**Key files:** `src/lib/activity-log.ts`, `src/lib/task-service.ts`, `src/lib/comment-service.ts`

## Where @mentions would be added later

@mention support would likely be added in these places:

1. **`src/lib/comment-service.ts`** — Parse `@username` patterns from comment body after creation. This is where the existing TODO lives.
2. **`src/lib/mentions.ts`** (new file) — Extract mention parsing logic: regex to find `@name`, resolve to user IDs.
3. **`prisma/schema.prisma`** — Add `Notification` model and optionally `Mention` join table.
4. **`src/lib/notification-service.ts`** (new file) — Create in-app notifications for mentioned users.
5. **`CommentForm.tsx`** — Optional: show autocomplete when user types `@`.

See `docs/roadmap.md` for the full planned feature list.
