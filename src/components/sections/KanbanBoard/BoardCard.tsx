import { useDraggable } from "@dnd-kit/core";
import { IssueCard } from "../../ui/IssueCard";
import type { Issue } from "../../../types";

interface BoardCardProps {
  issue: Issue;
  projectKey: string;
  onClick: () => void;
}

export function BoardCard({ issue, projectKey, onClick }: BoardCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: issue.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      <IssueCard
        issue={issue}
        projectKey={projectKey}
        onClick={onClick}
        dragging={isDragging}
      />
    </div>
  );
}
