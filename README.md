# TaskBoard

TaskBoard is a simple team task board web app built with Next.js, React, Prisma, and SQLite. It lets teams manage projects, tasks, labels, comments, and activity history in one place.

## Why this repo exists

This repository is intentionally designed as a **demo codebase for AI repo-understanding agents**. It is small enough to explore in a chat or IDE session, but realistic enough to support meaningful questions about architecture, data flow, and feature implementation.

The codebase includes deliberate gaps — such as @mentions and notifications — so agents can reason about how to extend the app.

## Prerequisites

This project requires **Node.js 24.x**.

If you use [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install 24
nvm use
```

The repo includes `.nvmrc` and `.node-version` so `nvm use`, `fnm use`, and `asdf` pick the right version automatically.

`npm install` will fail on other Node versions because `engine-strict` is enabled in `.npmrc` and `package.json` declares `"engines": { "node": ">=24.0.0 <25" }`.

## Getting started

### Install dependencies

```bash
npm install
```

### Set up the database

```bash
npm run db:push
```

This creates the SQLite database at `prisma/dev.db` from the Prisma schema.

### Seed data

```bash
npm run seed
```

This populates the database with 5 users, 3 projects, 20 tasks, 8 labels, comments, and activity events.

### Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run tests

```bash
npm run test
```

### Other scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push Prisma schema to SQLite |
| `npm run seed` | Seed the database |

## Folder structure

```
taskboard-demo/
├── docs/                  # Architecture, roadmap, demo questions
├── prisma/
│   ├── schema.prisma      # Database models
│   └── seed.ts            # Seed script
├── src/
│   ├── app/               # Next.js App Router pages and API routes
│   ├── components/        # React UI components
│   ├── lib/               # Service functions and business logic
│   └── types/             # Shared TypeScript types
└── tests/                 # Vitest unit tests
```

## AI repo-understanding demo

This repo is intentionally designed for AI repo-understanding demos. An agent can inspect the codebase and answer questions about architecture, data flow, missing features, and implementation plans.

### Try asking your repo agent

1. What does this repo do?
2. How does task creation work?
3. Where are comments created?
4. I want to build @mentions in task comments. What files should I change?
5. I want mentioned users to receive notifications. What data model changes are needed?
6. What would break if I added custom statuses per project?
7. Explain the flow from creating a task to writing an activity event.
8. Which tests should I add before changing comment creation?
9. Where would I add Slack notifications for high-priority tasks?
10. What parts of this repo are intentionally unfinished?

## License

See [LICENSE](LICENSE).
