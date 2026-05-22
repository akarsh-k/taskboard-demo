import { formatActivityMessage, parseMetadata } from "@/lib/activity-log";
import type { ActivityType } from "@/types";

interface Activity {
  id: string;
  type: string;
  metadata: string | null;
  createdAt: Date;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return <p className="text-sm text-gray-500">No activity yet.</p>;
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const metadata = parseMetadata(activity.metadata);
        const message = formatActivityMessage(
          activity.type as ActivityType,
          metadata
        );

        return (
          <div key={activity.id} className="flex items-start gap-3 text-sm">
            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-400" />
            <div>
              <p className="text-gray-700">{message}</p>
              <p className="text-xs text-gray-400">
                {new Date(activity.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
