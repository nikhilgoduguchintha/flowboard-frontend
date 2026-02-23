import { useIssues } from "../../../hooks/useIssues";
import { useIssueFilters } from "../../../hooks/useIssueFilters";
import { formatDistanceToNow } from "date-fns";

interface OverdueAlertProps {
  projectId: string;
}

export function OverdueAlert({ projectId }: OverdueAlertProps) {
  const { setIssueId } = useIssueFilters();
  const { data: issues } = useIssues(projectId);

  const overdue =
    issues?.filter(
      (i) =>
        i.due_date &&
        new Date(i.due_date) < new Date() &&
        i.status !== "done" &&
        i.status !== "closed"
    ) ?? [];

  if (overdue.length === 0) return null;

  return (
    <div
      className="mx-4 mt-4 rounded-xl p-4"
      style={{
        backgroundColor: "#FEF2F2",
        border: "1px solid #FECACA",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <svg
          className="w-4 h-4 flex-shrink-0"
          style={{ color: "#DC2626" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          />
        </svg>
        <p className="text-sm font-medium" style={{ color: "#DC2626" }}>
          {overdue.length} overdue {overdue.length === 1 ? "issue" : "issues"}
        </p>
      </div>

      <div className="space-y-1.5">
        {overdue.slice(0, 3).map((issue) => (
          <div
            key={issue.id}
            onClick={() => setIssueId(issue.id)}
            className="flex items-center justify-between cursor-pointer hover:opacity-70 transition-opacity"
          >
            <span
              className="text-xs truncate flex-1"
              style={{ color: "#7F1D1D" }}
            >
              {issue.title}
            </span>
            <span
              className="text-xs flex-shrink-0 ml-2"
              style={{ color: "#DC2626" }}
            >
              {formatDistanceToNow(new Date(issue.due_date!), {
                addSuffix: true,
              })}
            </span>
          </div>
        ))}
        {overdue.length > 3 && (
          <p className="text-xs" style={{ color: "#DC2626" }}>
            +{overdue.length - 3} more
          </p>
        )}
      </div>
    </div>
  );
}
