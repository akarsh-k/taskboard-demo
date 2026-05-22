import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "TaskBoard",
  description: "A simple team task board demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <nav className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-bold text-indigo-600">
              TaskBoard
            </Link>
            <div className="flex gap-6 text-sm font-medium text-gray-600">
              <Link href="/dashboard" className="hover:text-indigo-600">
                Dashboard
              </Link>
              <Link href="/projects" className="hover:text-indigo-600">
                Projects
              </Link>
              <Link href="/tasks" className="hover:text-indigo-600">
                Tasks
              </Link>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
