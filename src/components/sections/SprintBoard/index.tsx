import { useState } from "react";
import { useIssues, useUpdateIssueStatus } from "../../../hooks/useIssues";
import { useIssueFilters } from "../../../hooks/useIssueFilters";
// import { useMembers } from "../../../hooks/useMembers";
import { BoardColumn } from "./BoardColumn";
import { BoardSkeleton } from "../../ui/Skeleton";
import { PageError } from "../../ui/PageError";
import { Button } from "../../ui/Button";
import type { Issue, IssueStatus } from "../../../types";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { IssueCard } from "../../ui/IssueCard";

interface SprintBoardProps {
  projectId: string;
  sprintStatus: string;
}

const COLUMNS: { status: IssueStatus; label: string }[] = [
  { status: "todo", label: "Todo" },
  { status: "in_progress", label: "In Progress" },
  { status: "in_review", label: "In Review" },
  { status: "done", label: "Done" },
];

export function SprintBoard({ projectId, sprintStatus }: SprintBoardProps) {
  const { sprintId, setIssueId } = useIssueFilters();
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const [, setCreateOpen] = useState(false);

  const {
    data: issues,
    isLoading,
    isError,
    refetch,
  } = useIssues(projectId, {
    sprintId: sprintId || undefined,
  });

//   const { data: members } = useMembers(projectId);
  const { mutate: updateStatus } = useUpdateIssueStatus(projectId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const issue = issues?.find((i) => i.id === event.active.id);
    if (issue) setActiveIssue(issue);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveIssue(null);

    if (!over) return;

    const issueId = active.id as string;
    const newStatus = over.id as IssueStatus;
    const issue = issues?.find((i) => i.id === issueId);

    if (issue && issue.status !== newStatus) {
      updateStatus({ issueId, status: newStatus });
    }
  };

  if (isLoading) return <BoardSkeleton />;
  if (isError)
    return (
      <div className="p-6">
        <PageError message="Failed to load sprint board" onRetry={refetch} />
      </div>
    );

  const issuesByStatus = (status: IssueStatus) =>
    issues?.filter((i) => i.status === status) ?? [];

  return (
    <div className="flex flex-col h-full">
      {/* Board toolbar */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgb(var(--border))" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-medium"
            style={{ color: "rgb(var(--text-primary))" }}
          >
            Sprint Board
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: "rgb(var(--accent-light))",
              color: "rgb(var(--accent))",
            }}
          >
            {sprintStatus}
          </span>
        </div>

        <Button size="sm" onClick={() => setCreateOpen(true)}>
          Add issue
        </Button>
      </div>

      {/* Board columns */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 p-4 overflow-x-auto flex-1">
          {COLUMNS.map((col) => (
            <BoardColumn
              key={col.status}
              status={col.status}
              label={col.label}
              issues={issuesByStatus(col.status)}
              projectId={projectId}
              onIssueClick={(issueId) => setIssueId(issueId)}
            />
          ))}
        </div>

        {/* Drag overlay — shows card being dragged */}
        <DragOverlay>
          {activeIssue && (
            <IssueCard
              issue={activeIssue}
              projectKey={projectId.slice(0, 4).toUpperCase()}
              dragging
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
