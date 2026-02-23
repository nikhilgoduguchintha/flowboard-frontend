import { Avatar } from "../../ui/Avatar";
import { IssueKey } from "../../ui/IssueKey";
import { getTypeColors } from "../../../utils/typeColors";
import { getPriorityColors } from "../../../utils/priorityColors";
import { getStatusColors, STATUS_LABELS } from "../../../utils/statusColors";
import type { Issue } from "../../../types";

interface BacklogRowProps {
  issue: Issue;
  projectId: string;
  onClick: () => void;
}

export function BacklogRow({ issue, projectId, onClick }: BacklogRowProps) {
  const typeColors = getTypeColors(issue.type);
  const priorityColors = getPriorityColors(issue.priority);
  const statusColors = getStatusColors(issue.status);

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:opacity-80 transition-opacity"
      style={{ borderBottom: "1px solid rgb(var(--border))" }}
    >
      {/* Type dot */}
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: typeColors.icon }}
        title={issue.type}
      />

      {/* Issue key */}
      <IssueKey
        projectKey={projectId.slice(0, 4).toUpperCase()}
        issueNumber={issue.issue_number}
        clickable={false}
        className="flex-shrink-0"
      />

      {/* Title */}
      <span
        className="flex-1 text-sm truncate"
        style={{ color: "rgb(var(--text-primary))" }}
      >
        {issue.title}
      </span>

      {/* Status */}
      <span
        className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 hidden sm:block"
        style={{
          backgroundColor: statusColors.bg,
          color: statusColors.text,
        }}
      >
        {STATUS_LABELS[issue.status]}
      </span>

      {/* Priority */}
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: priorityColors.icon }}
        title={issue.priority}
      />

      {/* Assignee */}
      {issue.assignee ? (
        <Avatar
          name={issue.assignee.name}
          handle={issue.assignee.user_handle}
          size="sm"
          className="flex-shrink-0"
        />
      ) : (
        <div
          className="w-6 h-6 rounded-full border-2 border-dashed flex-shrink-0"
          style={{ borderColor: "rgb(var(--border-strong))" }}
        />
      )}
    </div>
  );
}
