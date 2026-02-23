import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { issuesApi } from "../api/issues.api";
import { commentsApi } from "../api/comments.api";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { Avatar } from "../components/ui/Avatar";
// import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { PageError } from "../components/ui/PageError";
import { IssueKey } from "../components/ui/IssueKey";
import { getStatusColors, STATUS_LABELS } from "../utils/statusColors";
import { getPriorityColors, PRIORITY_LABELS } from "../utils/priorityColors";
import { getTypeColors, TYPE_LABELS } from "../utils/typeColors";
import { NotFoundError } from "../api/errors";
import { NotFound } from "../components/errors/NotFound";
import type { IssueStatus } from "../types";

export function IssueDetail() {
  const { issueId } = useParams() as { issueId: string };
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");

  // ── Fetch issue ───────────────────────────────────────────────────────────
  const {
    data: issue,
    isLoading: issueLoading,
    isError: issueError,
    error: issueErr,
    refetch,
  } = useQuery({
    queryKey: ["issue", issueId],
    queryFn: () => issuesApi.getOne(issueId),
  });

  // ── Fetch comments ────────────────────────────────────────────────────────
  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", issueId],
    queryFn: () => commentsApi.getAll(issueId),
    enabled: !!issue,
  });

  // ── Update status ─────────────────────────────────────────────────────────
  const { mutate: updateStatus } = useMutation({
    mutationFn: (status: IssueStatus) =>
      issuesApi.updateStatus(issueId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issue", issueId] });
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      toast.success("Status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  // ── Add comment ───────────────────────────────────────────────────────────
  const { mutate: addComment, isPending: commentPending } = useMutation({
    mutationFn: () => commentsApi.create(issueId, { content: comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", issueId] });
      setComment("");
      toast.success("Comment added");
    },
    onError: () => toast.error("Failed to add comment"),
  });

  // ── Delete comment ────────────────────────────────────────────────────────
  const { mutate: deleteComment } = useMutation({
    mutationFn: (commentId: string) => commentsApi.delete(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", issueId] });
      toast.success("Comment deleted");
    },
    onError: () => toast.error("Failed to delete comment"),
  });

  // ── Error states ──────────────────────────────────────────────────────────
  if (issueError && issueErr instanceof NotFoundError) return <NotFound />;

  if (issueError) {
    return (
      <div className="p-6">
        <PageError message="Failed to load issue" onRetry={refetch} />
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (issueLoading || !issue) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  const statusColors = getStatusColors(issue.status);
  const priorityColors = getPriorityColors(issue.priority);
  const typeColors = getTypeColors(issue.type);

  return (
    <div
      className="min-h-full"
      style={{ backgroundColor: "rgb(var(--background))" }}
    >
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm mb-4 hover:opacity-70 transition-opacity"
          style={{ color: "rgb(var(--text-secondary))" }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        <div className="flex gap-6">
          {/* ── Main content ───────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Issue key + type */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-medium px-2 py-0.5 rounded"
                style={{
                  backgroundColor: typeColors.bg,
                  color: typeColors.text,
                }}
              >
                {TYPE_LABELS[issue.type]}
              </span>
              <IssueKey
                projectKey={issue.project_id.slice(0, 4).toUpperCase()}
                issueNumber={issue.issue_number}
                clickable={false}
              />
            </div>

            {/* Title */}
            <h1
              className="text-xl font-semibold mb-4 leading-snug"
              style={{ color: "rgb(var(--text-primary))" }}
            >
              {issue.title}
            </h1>

            {/* Description */}
            {issue.description ? (
              <div
                className="text-sm leading-relaxed mb-6"
                style={{ color: "rgb(var(--text-secondary))" }}
              >
                {issue.description}
              </div>
            ) : (
              <p
                className="text-sm italic mb-6"
                style={{ color: "rgb(var(--text-tertiary))" }}
              >
                No description provided.
              </p>
            )}

            {/* Comments */}
            <div>
              <h2
                className="text-sm font-semibold mb-4"
                style={{ color: "rgb(var(--text-primary))" }}
              >
                Comments {comments ? `(${comments.length})` : ""}
              </h2>

              {/* Comment input */}
              {user && (
                <div className="flex gap-3 mb-6">
                  <Avatar
                    name={user.name}
                    handle={user.user_handle}
                    size="sm"
                    className="flex-shrink-0 mt-1"
                  />
                  <div className="flex-1">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment... use @handle to mention someone"
                      rows={3}
                      className="w-full px-3 py-2 text-sm rounded-lg resize-none"
                      style={{
                        backgroundColor: "rgb(var(--surface))",
                        color: "rgb(var(--text-primary))",
                        border: "1px solid rgb(var(--border))",
                      }}
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        disabled={!comment.trim()}
                        loading={commentPending}
                        onClick={() => addComment()}
                      >
                        Add comment
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Comments list */}
              {commentsLoading && (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!commentsLoading && comments?.length === 0 && (
                <p
                  className="text-sm"
                  style={{ color: "rgb(var(--text-tertiary))" }}
                >
                  No comments yet. Be the first.
                </p>
              )}

              <div className="space-y-4">
                {comments?.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    {c.user && (
                      <Avatar
                        name={c.user.name}
                        handle={c.user.user_handle}
                        size="sm"
                        className="flex-shrink-0 mt-0.5"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs font-medium"
                          style={{ color: "rgb(var(--text-primary))" }}
                        >
                          {c.user?.name}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: "rgb(var(--text-tertiary))" }}
                        >
                          {formatDistanceToNow(new Date(c.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "rgb(var(--text-secondary))" }}
                      >
                        {c.content}
                      </p>
                      {user?.id === c.author_id && (
                        <button
                          onClick={() => deleteComment(c.id)}
                          className="text-xs mt-1 hover:opacity-70 transition-opacity"
                          style={{ color: "rgb(var(--error))" }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sidebar ────────────────────────────────────────────────── */}
          <div className="w-56 flex-shrink-0">
            <div
              className="rounded-xl p-4 space-y-4"
              style={{
                backgroundColor: "rgb(var(--surface))",
                border: "1px solid rgb(var(--border))",
              }}
            >
              {/* Status */}
              <div>
                <p
                  className="text-xs font-medium mb-1.5"
                  style={{ color: "rgb(var(--text-tertiary))" }}
                >
                  Status
                </p>
                <select
                  value={issue.status}
                  onChange={(e) => updateStatus(e.target.value as IssueStatus)}
                  className="w-full text-xs px-2 py-1.5 rounded-md"
                  style={{
                    backgroundColor: statusColors.bg,
                    color: statusColors.text,
                    border: `1px solid ${statusColors.border}`,
                  }}
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <p
                  className="text-xs font-medium mb-1.5"
                  style={{ color: "rgb(var(--text-tertiary))" }}
                >
                  Priority
                </p>
                <div
                  className="flex items-center gap-1.5 text-xs font-medium px-2 py-1.5 rounded-md"
                  style={{
                    backgroundColor: priorityColors.bg,
                    color: priorityColors.text,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: priorityColors.icon }}
                  />
                  {PRIORITY_LABELS[issue.priority]}
                </div>
              </div>

              {/* Assignee */}
              <div>
                <p
                  className="text-xs font-medium mb-1.5"
                  style={{ color: "rgb(var(--text-tertiary))" }}
                >
                  Assignee
                </p>
                {issue.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar
                      name={issue.assignee.name}
                      handle={issue.assignee.user_handle}
                      size="sm"
                    />
                    <span
                      className="text-xs truncate"
                      style={{ color: "rgb(var(--text-primary))" }}
                    >
                      {issue.assignee.name}
                    </span>
                  </div>
                ) : (
                  <p
                    className="text-xs"
                    style={{ color: "rgb(var(--text-tertiary))" }}
                  >
                    Unassigned
                  </p>
                )}
              </div>

              {/* Reporter */}
              <div>
                <p
                  className="text-xs font-medium mb-1.5"
                  style={{ color: "rgb(var(--text-tertiary))" }}
                >
                  Reporter
                </p>
                {issue.reporter && (
                  <div className="flex items-center gap-2">
                    <Avatar
                      name={issue.reporter.name}
                      handle={issue.reporter.user_handle}
                      size="sm"
                    />
                    <span
                      className="text-xs truncate"
                      style={{ color: "rgb(var(--text-primary))" }}
                    >
                      {issue.reporter.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Story points */}
              {issue.story_points !== null && (
                <div>
                  <p
                    className="text-xs font-medium mb-1.5"
                    style={{ color: "rgb(var(--text-tertiary))" }}
                  >
                    Story points
                  </p>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "rgb(var(--text-primary))" }}
                  >
                    {issue.story_points}
                  </span>
                </div>
              )}

              {/* Due date */}
              {issue.due_date && (
                <div>
                  <p
                    className="text-xs font-medium mb-1.5"
                    style={{ color: "rgb(var(--text-tertiary))" }}
                  >
                    Due date
                  </p>
                  <span
                    className="text-xs"
                    style={{
                      color:
                        new Date(issue.due_date) < new Date()
                          ? "rgb(var(--error))"
                          : "rgb(var(--text-primary))",
                    }}
                  >
                    {new Date(issue.due_date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Created */}
              <div>
                <p
                  className="text-xs font-medium mb-1.5"
                  style={{ color: "rgb(var(--text-tertiary))" }}
                >
                  Created
                </p>
                <span
                  className="text-xs"
                  style={{ color: "rgb(var(--text-secondary))" }}
                >
                  {formatDistanceToNow(new Date(issue.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
