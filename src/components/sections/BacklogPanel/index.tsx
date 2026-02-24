import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useState } from "react";
import { useIssues } from "../../../hooks/useIssues";
import { useIssueFilters } from "../../../hooks/useIssueFilters";
import { BacklogRow } from "./BacklogRow";
import { BacklogFilters } from "./BacklogFilters";
import { RowSkeleton } from "../../ui/Skeleton";
import { PageError } from "../../ui/PageError";
import { Button } from "../../ui/Button";
import { Modal } from "../../ui/Modal";
import { CreateIssueForm } from "../../forms/CreateIssueForm";

interface BacklogPanelProps {
  projectId: string;
}

export function BacklogPanel({ projectId }: BacklogPanelProps) {
  const { type, priority, assignee, setIssueId } = useIssueFilters();
  const parentRef = useRef<HTMLDivElement>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const {
    data: issues,
    isLoading,
    isError,
    refetch,
  } = useIssues(projectId, {
    type: type || undefined,
    assigneeId: assignee || undefined,
  });

  // Filter by priority client-side
  const filtered =
    issues?.filter((i) => (priority ? i.priority === priority : true)) ?? [];

  // TanStack Virtual for long backlogs
  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 5,
  });

  return (
    <div className="flex flex-col h-full">
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
            Backlog
          </span>
          {!isLoading && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "rgb(var(--surface-alt))",
                color: "rgb(var(--text-tertiary))",
              }}
            >
              {filtered.length}
            </span>
          )}
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          Create issue
        </Button>
      </div>

      {/* Filters */}
      <BacklogFilters projectId={projectId} />

      {/* Content */}
      {isLoading && (
        <div className="flex-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <RowSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <div className="p-6">
          <PageError message="Failed to load backlog" onRetry={refetch} />
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 py-16">
          <p
            className="text-sm font-medium mb-1"
            style={{ color: "rgb(var(--text-primary))" }}
          >
            Backlog is empty
          </p>
          <p
            className="text-sm"
            style={{ color: "rgb(var(--text-secondary))" }}
          >
            Create an issue to get started
          </p>
        </div>
      )}

      {/* Virtualised list */}
      {!isLoading && !isError && filtered.length > 0 && (
        <div ref={parentRef} className="flex-1 overflow-auto">
          <div
            style={{ height: virtualizer.getTotalSize(), position: "relative" }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => (
              <div
                key={virtualRow.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <BacklogRow
                  issue={filtered[virtualRow.index]}
                  projectId={projectId}
                  onClick={() => setIssueId(filtered[virtualRow.index].id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Issue Modal */}
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
