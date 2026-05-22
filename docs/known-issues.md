# Known Issues

This document lists intentional limitations and known gaps in the TaskBoard demo.

## @mentions are not implemented yet

Comment creation does not parse `@username` patterns. A TODO in `src/lib/comment-service.ts` marks where mention parsing will be added. See `docs/roadmap.md`.

## Notifications are not implemented yet

There is no notification system. Users are not alerted when mentioned, assigned, or when tasks change.

## Statuses are global, not per-project

All projects share the same four statuses: `todo`, `in_progress`, `review`, `done`. There is no per-project workflow customization.

## There is no authentication

The app uses seeded users with no login. The "current user" defaults to the first seeded user (Sarah Chen). Any visitor can act as any user.

## Activity logging is simple

Activity events record what happened but do not store rich diffs or full before/after snapshots. Metadata is a simple JSON string with key fields like `from`, `to`, and `labelName`.

## The UI is intentionally minimal

The interface is functional but not polished. There is no drag-and-drop kanban, rich text editor, or responsive mobile optimization beyond basic Tailwind layouts.

## No real-time updates

Changes made by one browser tab are not reflected in other tabs without a manual refresh.

## SQLite limitations

The demo uses SQLite for zero-setup convenience. This is not suitable for multi-user production deployments.
