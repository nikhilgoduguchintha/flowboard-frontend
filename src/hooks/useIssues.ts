import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { issuesApi } from "../api/issues.api";
import { useToast } from "./useToast";
import type { Issue, IssueType, IssueStatus, IssuePriority } from "../types";

// ─── Get all issues for a project ────────────────────────────────────────────

export function useIssues(
  projectId: string,
  filters?: {
    sprintId?: string;
    type?: IssueType;
    status?: IssueStatus;
    assigneeId?: string;
  }
) {
  return useQuery({
    queryKey: ["issues", projectId, filters],
    queryFn: () => issuesApi.getAll(projectId, filters),
    enabled: !!projectId,
  });
}

// ─── Get single issue ─────────────────────────────────────────────────────────

export function useIssue(issueId: string) {
  return useQuery({
    queryKey: ["issue", issueId],
    queryFn: () => issuesApi.getOne(issueId),
    enabled: !!issueId,
  });
}

// ─── Create issue ─────────────────────────────────────────────────────────────

export function useCreateIssue(projectId: string) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: {
      type: IssueType;
      title: string;
      description?: string;
      priority?: IssuePriority;
      assigneeId?: string;
      sprintId?: string;
      storyPoints?: number;
    }) => issuesApi.create(projectId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues", projectId] });
      toast.success("Issue created");
    },

    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to create issue"
      );
    },
  });
}

// ─── Update issue status — optimistic ────────────────────────────────────────

export function useUpdateIssueStatus(projectId: string) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({
      issueId,
      status,
    }: {
      issueId: string;
      status: IssueStatus;
    }) => issuesApi.updateStatus(issueId, status),

    // Optimistic update
    onMutate: async ({ issueId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["issues", projectId] });

      const previous = queryClient.getQueryData<Issue[]>(["issues", projectId]);

      queryClient.setQueryData<Issue[]>(
        ["issues", projectId],
        (old) =>
          old?.map((issue) =>
            issue.id === issueId ? { ...issue, status } : issue
          ) ?? []
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      // Rollback
      if (context?.previous) {
        queryClient.setQueryData(["issues", projectId], context.previous);
      }
      toast.error("Failed to update status");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["issues", projectId] });
    },
  });
}

// ─── Update issue ─────────────────────────────────────────────────────────────

export function useUpdateIssue(projectId: string) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({
      issueId,
      payload,
    }: {
      issueId: string;
      payload: {
        title?: string;
        description?: string | null;
        priority?: IssuePriority;
        status?: IssueStatus;
        assigneeId?: string | null;
        sprintId?: string | null;
        storyPoints?: number | null;
        dueDate?: string | null;
      };
    }) => issuesApi.update(issueId, payload),

    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["issues", projectId] });
      queryClient.setQueryData(["issue", updated.id], updated);
      toast.success("Issue updated");
    },

    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to update issue"
      );
    },
  });
}

// ─── Delete issue ─────────────────────────────────────────────────────────────

export function useDeleteIssue(projectId: string) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (issueId: string) => issuesApi.delete(issueId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues", projectId] });
      toast.success("Issue deleted");
    },

    onError: () => {
      toast.error("Failed to delete issue");
    },
  });
}
