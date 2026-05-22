import type { DashboardStats } from "@/types";
import { STATUS_LABELS } from "@/types";

interface DashboardCardsProps {
  stats: DashboardStats;
}

export function DashboardCards({ stats }: DashboardCardsProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Tasks" value={stats.totalTasks} />
        <StatCard label="Open Tasks" value={stats.openTasks} />
        <StatCard label="Overdue Tasks" value={stats.overdueTasks} highlight={stats.overdueTasks > 0} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Tasks by Status</h3>
          <div className="space-y-2">
            {Object.entries(stats.tasksByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {STATUS_LABELS[status as keyof typeof STATUS_LABELS]}
                </span>
                <span className="font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Tasks by Assignee</h3>
          <div className="space-y-2">
            {stats.tasksByAssignee.map((item) => (
              <div key={item.assigneeId ?? "unassigned"} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{item.assigneeName}</span>
                <span className="font-medium text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${highlight ? "text-red-600" : "text-gray-900"}`}>
        {value}
      </p>
    </div>
  );
}
