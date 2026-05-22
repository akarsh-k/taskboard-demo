# Architecture

TaskBoard follows a simple layered architecture. Each layer has a clear responsibility, making it easy for humans and AI agents to trace how data flows through the app.

## Layers

### Next.js pages (`src/app/`)

Server-rendered pages that fetch data and pass it to React components. API routes in `src/app/api/` handle mutations from client components (creating tasks, adding comments, updating status).

Key pages:
- `/` — Home
- `/dashboard` — Team metrics
- `/projects` — Project list and detail
- `/tasks` — Searchable task list
- `/tasks/[id]` — Task detail with comments and activity

### React components (`src/components/`)

Presentational and interactive UI components. Client components (marked with `"use client"`) handle form submissions and inline edits. Server components receive data as props from pages.

Key components:
- `TaskTable` — Filterable task list
- `TaskDetail` — Task view with inline editing
- `TaskForm` — Create task form
- `CommentList` / `CommentForm` — Task comments
- `ActivityTimeline` — Activity history
- `DashboardCards` — Dashboard metrics

### Service functions (`src/lib/`)

Business logic lives here. Pages and API routes call service functions rather than querying Prisma directly.

| File | Responsibility |
|------|----------------|
| `task-service.ts` | Task CRUD, status/priority/assignee updates, labels |
| `comment-service.ts` | Comment creation |
| `activity-log.ts` | Activity event formatting and building |
| `dashboard.ts` | Dashboard stat calculations |
| `filters.ts` | Task search and filter logic |
| `db.ts` | Prisma client singleton |

### Prisma database (`prisma/`)

Schema defines models: User, Project, Task, Label, TaskLabel, Comment, ActivityEvent. SQLite is used for simplicity — no external database required.

### Tests (`tests/`)

Vitest unit tests cover service logic, dashboard calculations, filters, and activity logging. Tests use mocked Prisma calls or pure in-memory inputs.

## Data flow diagram

```
Browser UI
  -> Next.js pages
  -> React components
  -> src/lib service functions
  -> Prisma
  -> SQLite
```

## Example: creating a task

1. User fills out `TaskForm` and submits
2. Client POSTs to `/api/tasks`
3. API route calls `createTask()` in `task-service.ts`
4. Service creates the task in a Prisma transaction
5. Service writes a `task_created` activity event
6. API returns the new task; client navigates to task detail page

## Example: adding a comment

1. User types in `CommentForm` on the task detail page
2. Client POSTs to `/api/tasks/[id]/comments`
3. API route calls `addComment()` in `comment-service.ts`
4. Service creates the comment and writes a `comment_added` activity event
5. Page refreshes to show the new comment and activity entry

Note: `comment-service.ts` contains a TODO for @mention parsing — this is intentionally not implemented yet.
