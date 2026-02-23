import { useDroppable } from "@dnd-kit/core";
import { BoardCard } from "./BoardCard";
import type { Issue, IssueStatus } from "../../../types";

interface BoardColumnProps {
  status: IssueStatus;
  label: string;
  issues: Issue[];
  projectId: string;
  onIssueClick: (issueId: string) => void;
}

export function BoardColumn({
  status,
  label,
  issues,
  projectId,
  onIssueClick,
}: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex flex-col w-64 flex-shrink-0">
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "rgb(var(--text-secondary))" }}
        >
          {label}
        </span>
        <span
          className="text-xs px-1.5 py-0.5 rounded-full"
          style={{
            backgroundColor: "rgb(var(--surface-alt))",
            color: "rgb(var(--text-tertiary))",
          }}
        >
          {issues.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className="flex flex-col gap-2 flex-1 rounded-xl p-2 min-h-32 transition-colors"
        style={{
          backgroundColor: isOver
            ? "rgb(var(--accent-light))"
            : "rgb(var(--surface-alt))",
          border: isOver
            ? "2px dashed rgb(var(--accent))"
            : "2px dashed transparent",
        }}
      >
        {issues.length === 0 && (
          <div className="flex items-center justify-center h-20">
            <p
              className="text-xs"
              style={{ color: "rgb(var(--text-tertiary))" }}
            >
              {isOver ? "Drop here" : "No issues"}
            </p>
          </div>
        )}

        {issues.map((issue) => (
          <BoardCard
            key={issue.id}
            issue={issue}
            projectKey={projectId.slice(0, 4).toUpperCase()}
            onClick={() => onIssueClick(issue.id)}
          />
        ))}
      </div>
    </div>
  );
}
