# Roadmap

Planned features that are intentionally not implemented in the current demo.

## @mentions in comments

Parse `@username` patterns in comment bodies and link them to user records. When a user is mentioned, trigger a notification.

**Starting points:** `src/lib/comment-service.ts` (existing TODO), new `src/lib/mentions.ts`

## In-app notifications

Notify users when they are mentioned in a comment, assigned to a task, or when a high-priority task is created in their project.

**Requires:** New `Notification` model in Prisma, notification service, UI bell/dropdown component.

## Custom statuses per project

Allow each project to define its own workflow statuses instead of using the global `todo | in_progress | review | done` set.

**Impact:** Would affect `Task.status` validation, filter UI, dashboard grouping, and seed data.

## Slack notifications for high-priority tasks

Send a Slack message when a task with `priority: high` is created or assigned.

**Starting point:** Hook into `createTask()` and `updateTaskAssignee()` in `src/lib/task-service.ts`.

## Saved filters

Let users save commonly used filter combinations (e.g., "My open high-priority tasks") for quick access.

**Requires:** New `SavedFilter` model, UI on the tasks page.

## Task templates

Pre-defined task templates with default title, description, labels, and priority for common work items.

**Requires:** New `TaskTemplate` model, template picker in `TaskForm`.

## Simple permissions

Basic role-based access: who can create tasks, edit tasks, or manage projects.

**Requires:** User roles, middleware checks, UI conditionals.
