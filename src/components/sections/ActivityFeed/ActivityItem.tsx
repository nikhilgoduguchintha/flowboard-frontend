import { formatDistanceToNow } from "date-fns";

interface ActivityEvent {
  id: string;
  payload: {
    table_name: string;
    event_type: string;
    record: Record<string, unknown> | null;
    old_record: Record<string, unknown> | null;
  };
  created_at: string;
}

interface ActivityItemProps {
  event: ActivityEvent;
}

function getActivityLabel(event: ActivityEvent): string {
  const { table_name, event_type, record, old_record } = event.payload;

  switch (table_name) {
    case "issues": {
      const title = (record?.title as string) ?? "An issue";
      if (event_type === "INSERT") return `Issue "${title}" was created`;
      if (event_type === "DELETE") return `An issue was deleted`;
      if (record?.status !== old_record?.status) {
        return `"${title}" moved to ${record?.status}`;
      }
      return `"${title}" was updated`;
    }
    case "sprints": {
      const name = (record?.name as string) ?? "A sprint";
      if (event_type === "INSERT") return `Sprint "${name}" was created`;
      return `Sprint "${name}" status changed to ${record?.status}`;
    }
    case "comments":
      return "A comment was added";
    case "project_members":
      if (event_type === "INSERT") return "A new member joined the project";
      if (event_type === "DELETE") return "A member left the project";
      return "Member role was updated";
    default:
      return `${table_name ?? "Unknown"} ${
        event_type?.toLowerCase() ?? "updated"
      }`;
  }
}

function getActivityIcon(tableName: string): string {
  switch (tableName) {
    case "issues":
      return "📋";
    case "sprints":
      return "🏃";
    case "comments":
      return "💬";
    case "project_members":
      return "👤";
    default:
      return "📌";
  }
}

export function ActivityItem({ event }: ActivityItemProps) {
  const tableName = event.payload?.table_name;

  return (
    <div
      className="flex items-start gap-3 px-4 py-3"
      style={{ borderBottom: "1px solid rgb(var(--border))" }}
    >
      <span className="text-base flex-shrink-0 mt-0.5">
        {getActivityIcon(tableName)}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm" style={{ color: "rgb(var(--text-primary))" }}>
          {getActivityLabel(event)}
        </p>
        <p
          className="text-xs mt-0.5"
          style={{ color: "rgb(var(--text-tertiary))" }}
        >
          {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
