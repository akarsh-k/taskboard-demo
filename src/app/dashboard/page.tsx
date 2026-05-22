import { getDashboardStats } from "@/lib/dashboard";
import { DashboardCards } from "@/components/DashboardCards";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>
      <DashboardCards stats={stats} />
    </div>
  );
}
