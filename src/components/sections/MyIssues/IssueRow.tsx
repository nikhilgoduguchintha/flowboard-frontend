import { IssueKey } from "../../ui/IssueKey";
import { getTypeColors } from "../../../utils/typeColors";
import { getPriorityColors } from "../../../utils/priorityColors";
import { getStatusColors, STATUS_LABELS } from "../../../utils/statusColors";
import type { Issue } from "../../../types";

interface IssueRowProps {
  issue: Issue;
  projectId: string;
  onClick: () => void;
}

export function IssueRow({ issue, projectId, onClick }: IssueRowProps) {
  const typeColors = getTypeColors(issue.type);
  const priorityColors = getPriorityColors(issue.priority);
  const statusColors = getStatusColors(issue.status);

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:opacity-80 transition-opacity"
      style={{ borderBottom: "1px solid rgb(var(--border))" }}
    >
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: typeColors.icon }}
      />
      <IssueKey
        projectKey={projectId.slice(0, 4).toUpperCase()}
        issueNumber={issue.issue_number}
        clickable={false}
        className="flex-shrink-0"
      />
      <span
        className="flex-1 text-sm truncate"
        style={{ color: "rgb(var(--text-primary))" }}
      >
        {issue.title}
      </span>
      <span
        className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
        style={{
          backgroundColor: statusColors.bg,
          color: statusColors.text,
        }}
      >
        {STATUS_LABELS[issue.status]}
      </span>
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: priorityColors.icon }}
      />
    </div>
  );
}
