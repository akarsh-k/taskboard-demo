import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.activityEvent.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.taskLabel.deleteMany();
  await prisma.task.deleteMany();
  await prisma.label.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const users = await Promise.all([
    prisma.user.create({
      data: { name: "Sarah Chen", email: "sarah@taskboard.dev" },
    }),
    prisma.user.create({
      data: { name: "Marcus Lee", email: "marcus@taskboard.dev" },
    }),
    prisma.user.create({
      data: { name: "Priya Shah", email: "priya@taskboard.dev" },
    }),
    prisma.user.create({
      data: { name: "Elena Garcia", email: "elena@taskboard.dev" },
    }),
    prisma.user.create({
      data: { name: "Noah Williams", email: "noah@taskboard.dev" },
    }),
  ]);

  const [sarah, marcus, priya, elena, noah] = users;

  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: "Website Refresh",
        description: "Redesign the marketing site with updated branding and improved conversion flows.",
      },
    }),
    prisma.project.create({
      data: {
        name: "Customer Portal",
        description: "Self-service portal for customers to manage accounts, billing, and support tickets.",
      },
    }),
    prisma.project.create({
      data: {
        name: "Mobile App",
        description: "Native mobile experience for iOS and Android with offline support.",
      },
    }),
  ]);

  const [website, portal, mobile] = projects;

  const labelData = [
    { name: "bug", color: "#ef4444" },
    { name: "feature", color: "#22c55e" },
    { name: "docs", color: "#3b82f6" },
    { name: "design", color: "#a855f7" },
    { name: "backend", color: "#f97316" },
    { name: "frontend", color: "#06b6d4" },
    { name: "urgent", color: "#dc2626" },
    { name: "polish", color: "#eab308" },
  ];

  const labels = await Promise.all(
    labelData.map((l) => prisma.label.create({ data: l }))
  );

  const labelByName = Object.fromEntries(labels.map((l) => [l.name, l]));

  const taskData = [
    {
      title: "Update homepage hero section",
      description: "Replace the current hero with the new design mockups from Figma.",
      status: "in_progress",
      priority: "high",
      projectId: website.id,
      assigneeId: elena.id,
      creatorId: sarah.id,
      dueDate: new Date("2026-06-01"),
      labels: ["design", "frontend"],
    },
    {
      title: "Fix broken contact form validation",
      description: "Email field accepts invalid addresses. Add proper validation and error messages.",
      status: "todo",
      priority: "high",
      projectId: website.id,
      assigneeId: marcus.id,
      creatorId: sarah.id,
      dueDate: new Date("2026-05-15"),
      labels: ["bug", "frontend", "urgent"],
    },
    {
      title: "Write API documentation for portal endpoints",
      description: "Document all REST endpoints with request/response examples.",
      status: "review",
      priority: "medium",
      projectId: portal.id,
      assigneeId: priya.id,
      creatorId: marcus.id,
      dueDate: new Date("2026-05-30"),
      labels: ["docs", "backend"],
    },
    {
      title: "Implement user profile page",
      description: "Allow users to view and edit their profile information.",
      status: "in_progress",
      priority: "medium",
      projectId: portal.id,
      assigneeId: noah.id,
      creatorId: elena.id,
      dueDate: new Date("2026-06-10"),
      labels: ["feature", "frontend"],
    },
    {
      title: "Add push notification support",
      description: "Integrate Firebase Cloud Messaging for iOS and Android push notifications.",
      status: "todo",
      priority: "high",
      projectId: mobile.id,
      assigneeId: marcus.id,
      creatorId: noah.id,
      dueDate: new Date("2026-07-01"),
      labels: ["feature", "backend"],
    },
    {
      title: "Optimize image loading on product pages",
      description: "Implement lazy loading and WebP format for product images.",
      status: "done",
      priority: "low",
      projectId: website.id,
      assigneeId: elena.id,
      creatorId: sarah.id,
      dueDate: new Date("2026-04-01"),
      labels: ["frontend", "polish"],
    },
    {
      title: "Set up CI/CD pipeline",
      description: "Configure GitHub Actions for automated testing and deployment.",
      status: "done",
      priority: "medium",
      projectId: portal.id,
      assigneeId: marcus.id,
      creatorId: priya.id,
      dueDate: new Date("2026-03-15"),
      labels: ["backend"],
    },
    {
      title: "Design onboarding flow wireframes",
      description: "Create wireframes for the new user onboarding experience in the mobile app.",
      status: "review",
      priority: "medium",
      projectId: mobile.id,
      assigneeId: elena.id,
      creatorId: noah.id,
      dueDate: new Date("2026-05-20"),
      labels: ["design"],
    },
    {
      title: "Fix login redirect loop",
      description: "Users get stuck in a redirect loop after logging in with SSO.",
      status: "in_progress",
      priority: "high",
      projectId: portal.id,
      assigneeId: priya.id,
      creatorId: marcus.id,
      dueDate: new Date("2026-05-10"),
      labels: ["bug", "backend", "urgent"],
    },
    {
      title: "Add dark mode toggle",
      description: "Implement system-aware dark mode across the website.",
      status: "todo",
      priority: "low",
      projectId: website.id,
      assigneeId: noah.id,
      creatorId: elena.id,
      dueDate: new Date("2026-08-01"),
      labels: ["feature", "frontend", "polish"],
    },
    {
      title: "Migrate billing data to new schema",
      description: "One-time migration script for the updated billing data model.",
      status: "todo",
      priority: "high",
      projectId: portal.id,
      assigneeId: marcus.id,
      creatorId: priya.id,
      dueDate: new Date("2026-05-25"),
      labels: ["backend"],
    },
    {
      title: "Create app store screenshots",
      description: "Design and export screenshots for App Store and Google Play listings.",
      status: "todo",
      priority: "medium",
      projectId: mobile.id,
      assigneeId: elena.id,
      creatorId: noah.id,
      dueDate: new Date("2026-06-15"),
      labels: ["design", "polish"],
    },
    {
      title: "Implement search functionality",
      description: "Add full-text search across tasks and projects in the portal.",
      status: "in_progress",
      priority: "medium",
      projectId: portal.id,
      assigneeId: noah.id,
      creatorId: sarah.id,
      dueDate: new Date("2026-06-20"),
      labels: ["feature", "backend", "frontend"],
    },
    {
      title: "Fix mobile navigation menu overlap",
      description: "The hamburger menu overlaps content on small screens.",
      status: "done",
      priority: "medium",
      projectId: website.id,
      assigneeId: elena.id,
      creatorId: marcus.id,
      dueDate: new Date("2026-04-10"),
      labels: ["bug", "frontend"],
    },
    {
      title: "Add unit tests for auth module",
      description: "Increase test coverage for authentication and session management.",
      status: "review",
      priority: "medium",
      projectId: portal.id,
      assigneeId: priya.id,
      creatorId: marcus.id,
      dueDate: new Date("2026-05-28"),
      labels: ["backend"],
    },
    {
      title: "Performance audit for mobile app",
      description: "Profile app startup time and identify bottlenecks.",
      status: "todo",
      priority: "low",
      projectId: mobile.id,
      assigneeId: marcus.id,
      creatorId: noah.id,
      dueDate: new Date("2026-07-15"),
      labels: ["backend", "polish"],
    },
    {
      title: "Update privacy policy page",
      description: "Legal team requested updates to reflect new data handling practices.",
      status: "done",
      priority: "low",
      projectId: website.id,
      assigneeId: sarah.id,
      creatorId: elena.id,
      dueDate: new Date("2026-03-01"),
      labels: ["docs"],
    },
    {
      title: "Implement offline data sync",
      description: "Allow users to work offline and sync changes when connectivity returns.",
      status: "todo",
      priority: "high",
      projectId: mobile.id,
      assigneeId: noah.id,
      creatorId: marcus.id,
      dueDate: new Date("2026-08-01"),
      labels: ["feature", "backend"],
    },
    {
      title: "Refactor dashboard components",
      description: "Extract reusable chart and stat card components from the dashboard page.",
      status: "in_progress",
      priority: "low",
      projectId: portal.id,
      assigneeId: elena.id,
      creatorId: priya.id,
      dueDate: new Date("2026-06-05"),
      labels: ["frontend", "polish"],
    },
    {
      title: "Set up error tracking with Sentry",
      description: "Integrate Sentry for error monitoring across all three projects.",
      status: "todo",
      priority: "medium",
      projectId: website.id,
      assigneeId: marcus.id,
      creatorId: sarah.id,
      dueDate: new Date("2026-05-01"),
      labels: ["backend"],
    },
  ];

  for (const td of taskData) {
    const { labels: labelNames, ...taskFields } = td;
    const task = await prisma.task.create({ data: taskFields });

    for (const name of labelNames) {
      await prisma.taskLabel.create({
        data: { taskId: task.id, labelId: labelByName[name].id },
      });
    }

    await prisma.activityEvent.create({
      data: {
        type: "task_created",
        taskId: task.id,
        userId: taskFields.creatorId,
      },
    });
  }

  const allTasks = await prisma.task.findMany();

  const commentData = [
    { taskIndex: 0, authorId: sarah.id, body: "The new hero looks great! Can we add a CTA button?" },
    { taskIndex: 0, authorId: elena.id, body: "Added the CTA in the latest mockup. Ready for review." },
    { taskIndex: 1, authorId: marcus.id, body: "Found the issue — regex was too permissive. Fix incoming." },
    { taskIndex: 1, authorId: sarah.id, body: "Thanks Marcus, this is blocking the launch." },
    { taskIndex: 2, authorId: priya.id, body: "Draft docs are in the wiki. Please review the auth section." },
    { taskIndex: 2, authorId: marcus.id, body: "Looks good overall. Added a few notes on pagination." },
    { taskIndex: 3, authorId: noah.id, body: "Profile edit form is done. Need design review on the avatar upload." },
    { taskIndex: 4, authorId: marcus.id, body: "Firebase project is set up. Starting iOS integration this week." },
    { taskIndex: 4, authorId: noah.id, body: "Make sure to handle permission prompts gracefully on first launch." },
    { taskIndex: 8, authorId: priya.id, body: "Root cause is a stale session cookie. Working on a fix." },
    { taskIndex: 8, authorId: marcus.id, body: "Can you also check if this affects the mobile web view?" },
    { taskIndex: 8, authorId: priya.id, body: "Confirmed — same issue on mobile web. Patch should cover both." },
    { taskIndex: 12, authorId: sarah.id, body: "Search should support filtering by date range too." },
    { taskIndex: 12, authorId: noah.id, body: "Good idea. I'll add date filters in the next iteration." },
    { taskIndex: 14, authorId: priya.id, body: "Coverage is now at 85% for the auth module." },
    { taskIndex: 17, authorId: marcus.id, body: "Sync conflict resolution needs more thought. Let's discuss in standup." },
    { taskIndex: 17, authorId: noah.id, body: "Agreed. I'll prepare a proposal for last-write-wins vs merge." },
  ];

  for (const cd of commentData) {
    const task = allTasks[cd.taskIndex];
    const comment = await prisma.comment.create({
      data: {
        taskId: task.id,
        authorId: cd.authorId,
        body: cd.body,
      },
    });

    await prisma.activityEvent.create({
      data: {
        type: "comment_added",
        taskId: task.id,
        userId: cd.authorId,
        metadata: JSON.stringify({ commentId: comment.id }),
      },
    });
  }

  console.log("Seed complete:");
  console.log(`  ${users.length} users`);
  console.log(`  ${projects.length} projects`);
  console.log(`  ${allTasks.length} tasks`);
  console.log(`  ${labels.length} labels`);
  console.log(`  ${commentData.length} comments`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
