import { useState } from "react";
import { useIssues, useUpdateIssueStatus } from "../../../hooks/useIssues";
import { useIssueFilters } from "../../../hooks/useIssueFilters";
import { useActiveSprint } from "../../../hooks/useSprints";
import { BoardColumn } from "./BoardColumn";
import { BoardSkeleton } from "../../ui/Skeleton";
import { PageError } from "../../ui/PageError";
import { Button } from "../../ui/Button";
import { Modal } from "../../ui/Modal";
import { CreateIssueForm } from "../../forms/CreateIssueForm";
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

// ─── Sprint Meta ──────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getTimeRemaining(endDate: string): string {
  const now = new Date();
  const end = new Date(endDate);
  const diffMs = end.getTime() - now.getTime();

  if (diffMs <= 0) return "Ended";

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d left`;
  if (hours > 0) return `${hours}h left`;
  return "Ending soon";
}

function getTimeRemainingColor(endDate: string): string {
  const diffMs = new Date(endDate).getTime() - Date.now();
  const days = diffMs / (1000 * 60 * 60 * 24);

  if (days <= 0) return "rgb(var(--error))";
  if (days <= 2) return "rgb(var(--warning))";
  return "rgb(var(--success))";
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SprintBoard({ projectId, sprintStatus }: SprintBoardProps) {
  const { sprintId, setIssueId } = useIssueFilters();
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { activeSprint } = useActiveSprint(projectId);

  const {
    data: issues,
    isLoading,
    isError,
    refetch,
  } = useIssues(projectId, {
    sprintId: sprintId || undefined,
  });

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
        <div className="flex items-center gap-3 flex-wrap">
          {/* Title + status */}
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-medium"
              style={{ color: "rgb(var(--text-primary))" }}
            >
              {activeSprint?.name ?? "Sprint Board"}
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

          {/* Sprint dates + time remaining */}
          {activeSprint?.start_date && activeSprint?.end_date && (
            <div className="flex items-center gap-2">
              <span
                className="text-xs"
                style={{ color: "rgb(var(--text-tertiary))" }}
              >
                📅 {formatDate(activeSprint.start_date)} →{" "}
                {formatDate(activeSprint.end_date)}
              </span>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "rgb(var(--surface-alt))",
                  color: getTimeRemainingColor(activeSprint.end_date),
                }}
              >
                ⏱ {getTimeRemaining(activeSprint.end_date)}
              </span>
            </div>
          )}
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

      {/* Create Issue Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create issue"
        size="md"
      >
        <CreateIssueForm
          projectId={projectId}
          sprintId={sprintId || undefined}
          onSuccess={() => setCreateOpen(false)}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>
    </div>
  );
}
