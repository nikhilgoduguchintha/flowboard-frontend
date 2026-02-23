import { useIssueFilters } from "../../../hooks/useIssueFilters";
import { useMembers } from "../../../hooks/useMembers";
import { Button } from "../../ui/Button";
import type { IssueType, IssuePriority } from "../../../types";

interface BacklogFiltersProps {
  projectId: string;
}

export function BacklogFilters({ projectId }: BacklogFiltersProps) {
  const {
    type,
    setType,
    priority,
    setPriority,
    assignee,
    setAssignee,
    clearFilters,
    hasActiveFilters,
  } = useIssueFilters();

  const { data: members } = useMembers(projectId);

  return (
    <div
      className="flex items-center gap-2 px-4 py-2 flex-wrap flex-shrink-0"
      style={{ borderBottom: "1px solid rgb(var(--border))" }}
    >
      {/* Type filter */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value as IssueType | "")}
        className="text-xs px-2 py-1.5 rounded-md"
        style={{
          backgroundColor: "rgb(var(--surface-alt))",
          color: "rgb(var(--text-primary))",
          border: "1px solid rgb(var(--border))",
        }}
      >
        <option value="">All types</option>
        <option value="epic">Epic</option>
        <option value="story">Story</option>
        <option value="task">Task</option>
        <option value="bug">Bug</option>
        <option value="subtask">Subtask</option>
      </select>

      {/* Priority filter */}
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as IssuePriority | "")}
        className="text-xs px-2 py-1.5 rounded-md"
        style={{
          backgroundColor: "rgb(var(--surface-alt))",
          color: "rgb(var(--text-primary))",
          border: "1px solid rgb(var(--border))",
        }}
      >
        <option value="">All priorities</option>
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* Assignee filter */}
      <select
        value={assignee}
        onChange={(e) => setAssignee(e.target.value)}
        className="text-xs px-2 py-1.5 rounded-md"
        style={{
          backgroundColor: "rgb(var(--surface-alt))",
          color: "rgb(var(--text-primary))",
          border: "1px solid rgb(var(--border))",
        }}
      >
        <option value="">All assignees</option>
        {members?.map((m: any) => (
          <option key={m.user_id} value={m.user_id}>
            {m.user?.name ?? m.user_id}
          </option>
        ))}
      </select>

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button size="sm" variant="ghost" onClick={clearFilters}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
