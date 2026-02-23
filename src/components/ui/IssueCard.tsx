import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Avatar } from "./Avatar";
import { IssueKey } from "./IssueKey";
import { getTypeColors } from "../../utils/typeColors";
import { getPriorityColors } from "../../utils/priorityColors";
// import { STATUS_LABELS } from "../../utils/statusColors";
import type { Issue } from "../../types";

interface IssueCardProps {
  issue: Issue;
  projectKey: string;
  onClick?: () => void;
  dragging?: boolean;
  className?: string;
}

export function IssueCard({
  issue,
  projectKey,
  onClick,
  dragging = false,
  className,
}: IssueCardProps) {
  const navigate = useNavigate();
  const typeColors = getTypeColors(issue.type);
  const priorityColors = getPriorityColors(issue.priority);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/issue/${issue.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "rounded-lg p-3 cursor-pointer",
        "transition-shadow hover:shadow-md",
        dragging && "shadow-lg rotate-1 opacity-90",
        className
      )}
      style={{
        backgroundColor: "rgb(var(--surface))",
        border: "1px solid rgb(var(--border))",
      }}
    >
      {/* Top row — issue key + priority */}
      <div className="flex items-center justify-between mb-2">
        <IssueKey
          projectKey={projectKey}
          issueNumber={issue.issue_number}
          clickable={false}
        />
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: priorityColors.icon }}
          title={issue.priority}
        />
      </div>

      {/* Title */}
      <p
        className="text-sm font-medium leading-snug mb-3 line-clamp-2"
        style={{ color: "rgb(var(--text-primary))" }}
      >
        {issue.title}
      </p>

      {/* Bottom row — type badge + assignee */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-medium px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: typeColors.bg,
            color: typeColors.text,
          }}
        >
          {issue.type}
        </span>

        <div className="flex items-center gap-2">
          {issue.story_points !== null && (
            <span
              className="text-xs font-medium"
              style={{ color: "rgb(var(--text-tertiary))" }}
            >
              {issue.story_points}
            </span>
          )}

          {issue.assignee ? (
            <Avatar
              name={issue.assignee.name}
              handle={issue.assignee.user_handle}
              size="sm"
            />
          ) : (
            <div
              className="w-6 h-6 rounded-full border-2 border-dashed"
              style={{ borderColor: "rgb(var(--border-strong))" }}
              title="Unassigned"
            />
          )}
        </div>
      </div>

      {/* Due date warning */}
      {issue.due_date &&
        new Date(issue.due_date) < new Date() &&
        issue.status !== "done" && (
          <div
            className="mt-2 pt-2 text-xs font-medium"
            style={{
              color: "rgb(var(--error))",
              borderTop: "1px solid rgb(var(--border))",
            }}
          >
            Overdue · {new Date(issue.due_date).toLocaleDateString()}
          </div>
        )}
    </div>
  );
}
