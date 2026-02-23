import { getTypeColors } from "../../../utils/typeColors";
import { getPriorityColors } from "../../../utils/priorityColors";
import type { Issue } from "../../../types";

interface PlanningIssueRowProps {
  issue: Issue;
  projectId: string;
  sprintId?: string;
}

export function PlanningIssueRow({ issue }: PlanningIssueRowProps) {
  const typeColors = getTypeColors(issue.type);
  const priorityColors = getPriorityColors(issue.priority);

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5"
      style={{ borderBottom: "1px solid rgb(var(--border))" }}
    >
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: typeColors.icon }}
      />
      <span
        className="flex-1 text-sm truncate"
        style={{ color: "rgb(var(--text-primary))" }}
      >
        {issue.title}
      </span>
      {issue.story_points !== null && (
        <span
          className="text-xs font-medium px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: "rgb(var(--surface-alt))",
            color: "rgb(var(--text-secondary))",
          }}
        >
          {issue.story_points}
        </span>
      )}
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: priorityColors.icon }}
      />
    </div>
  );
}
