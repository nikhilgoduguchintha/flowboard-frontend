import { useIssues } from "../../../hooks/useIssues";
import { useAuth } from "../../../hooks/useAuth";
import { useIssueFilters } from "../../../hooks/useIssueFilters";
import { IssueRow } from "./IssueRow";
import { RowSkeleton } from "../../ui/Skeleton";
import { PageError } from "../../ui/PageError";

interface MyIssuesProps {
  projectId: string;
}

export function MyIssues({ projectId }: MyIssuesProps) {
  const { user } = useAuth();
  const { setIssueId } = useIssueFilters();

  const {
    data: issues,
    isLoading,
    isError,
    refetch,
  } = useIssues(projectId, {
    assigneeId: user?.id,
  });

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgb(var(--border))" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-medium"
            style={{ color: "rgb(var(--text-primary))" }}
          >
            My Issues
          </span>
          {!isLoading && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "rgb(var(--surface-alt))",
                color: "rgb(var(--text-tertiary))",
              }}
            >
              {issues?.length ?? 0}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading && (
        <div>
          {[1, 2, 3].map((i) => (
            <RowSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <div className="p-4">
          <PageError message="Failed to load your issues" onRetry={refetch} />
        </div>
      )}

      {!isLoading && !isError && issues?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10">
          <p
            className="text-sm font-medium mb-1"
            style={{ color: "rgb(var(--text-primary))" }}
          >
            No issues assigned to you
          </p>
          <p
            className="text-sm"
            style={{ color: "rgb(var(--text-secondary))" }}
          >
            Issues assigned to you will appear here
          </p>
        </div>
      )}

      {!isLoading && !isError && (issues?.length ?? 0) > 0 && (
        <div className="overflow-auto max-h-80">
          {issues?.map((issue) => (
            <IssueRow
              key={issue.id}
              issue={issue}
              projectId={projectId}
              onClick={() => setIssueId(issue.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
