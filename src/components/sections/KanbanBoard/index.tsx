import { useState } from "react";
import { useIssues, useUpdateIssueStatus } from "../../../hooks/useIssues";
import { useIssueFilters } from "../../../hooks/useIssueFilters";
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
import { Modal } from "@/components/ui/Modal";
import { CreateIssueForm } from "@/components/forms/CreateIssueForm";

interface KanbanBoardProps {
  projectId: string;
}

const COLUMNS: { status: IssueStatus; label: string }[] = [
  { status: "backlog", label: "Backlog" },
  { status: "todo", label: "Todo" },
  { status: "in_progress", label: "In Progress" },
  { status: "in_review", label: "In Review" },
  { status: "done", label: "Done" },
];

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { setIssueId } = useIssueFilters();

  const [createOpen, setCreateOpen] = useState(false);

  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);

  const { data: issues, isLoading, isError, refetch } = useIssues(projectId);
  const { mutate: updateStatus } = useUpdateIssueStatus(projectId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
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
        <PageError message="Failed to load kanban board" onRetry={refetch} />
      </div>
    );

  const issuesByStatus = (status: IssueStatus) =>
    issues?.filter((i) => i.status === status) ?? [];

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgb(var(--border))" }}
      >
        <span
          className="text-sm font-medium"
          style={{ color: "rgb(var(--text-primary))" }}
        >
          Kanban Board
        </span>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          Add issue
        </Button>
      </div>

      {/* Columns */}
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
              onIssueClick={(id) => setIssueId(id)}
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
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create issue"
        size="md"
      >
        <CreateIssueForm
          projectId={projectId}
          onSuccess={() => setCreateOpen(false)}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>
    </div>
  );
}
