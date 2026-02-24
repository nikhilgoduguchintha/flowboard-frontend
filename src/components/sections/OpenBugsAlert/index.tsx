import { useIssues } from "../../../hooks/useIssues";
import { useIssueFilters } from "../../../hooks/useIssueFilters";

interface OpenBugsAlertProps {
  projectId: string;
  openBugs: number;
}

export function OpenBugsAlert({ projectId, openBugs }: OpenBugsAlertProps) {
  const { setView, setType, setIssueId } = useIssueFilters();
  const { data: issues } = useIssues(projectId, { type: "bug" });

  const openBugsList =
    issues?.filter((i) => i.status !== "closed" && i.status !== "resolved") ??
    [];

  if (openBugs === 0) return null;

  return (
    <div
      className="mx-4 mt-4 rounded-xl p-4"
      style={{
        backgroundColor: "#FFF7ED",
        border: "1px solid #FED7AA",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 flex-shrink-0"
            style={{ color: "#EA580C" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm font-medium" style={{ color: "#EA580C" }}>
            {openBugs} open {openBugs === 1 ? "bug" : "bugs"}
          </p>
        </div>
        <button
          onClick={() => {
            void setView("backlog");
            void setType("bug");
          }}
          className="text-xs hover:underline"
          style={{ color: "#EA580C" }}
        >
          View all
        </button>
      </div>

      <div className="space-y-1.5">
        {openBugsList.slice(0, 3).map((issue) => (
          <div
            key={issue.id}
            onClick={() => setIssueId(issue.id)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
          >
            <span
              className="text-xs px-1.5 py-0.5 rounded flex-shrink-0"
              style={{
                backgroundColor: "#FEE2E2",
                color: "#DC2626",
              }}
            >
              {issue.priority}
            </span>
            <span className="text-xs truncate" style={{ color: "#7C2D12" }}>
              {issue.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
