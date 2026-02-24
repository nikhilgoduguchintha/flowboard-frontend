import { makeApiCall } from "./makeApiCall";
import { ENDPOINTS } from "./endpoints";
import type { Issue, IssueType, IssueStatus, IssuePriority } from "../types";

export const issuesApi = {
  getAll: (
    projectId: string,
    filters?: {
      sprintId?: string;
      type?: IssueType;
      status?: IssueStatus;
      assigneeId?: string;
    }
  ) =>
    makeApiCall<Issue[]>({
      method: "GET",
      url: ENDPOINTS.issues.getAll(projectId),
      params: filters as Record<string, unknown>,
      unwrap: "issues",
    }),

  getOne: (issueId: string) =>
    makeApiCall<Issue>({
      method: "GET",
      url: ENDPOINTS.issues.getOne(issueId),
      unwrap: "issue",
    }),

  create: (
    projectId: string,
    payload: {
      type: IssueType;
      title: string;
      description?: string;
      status?: IssueStatus;
      priority?: IssuePriority;
      assigneeId?: string;
      sprintId?: string;
      parentId?: string;
      storyPoints?: number;
      dueDate?: string;
      typeFields?: Record<string, unknown>;
    }
  ) =>
    makeApiCall<{ issue: Issue; autoPromoted: boolean }>({
      method: "POST",
      url: ENDPOINTS.issues.create(projectId),
      body: payload,
      unwrap: ["issue", "autoPromoted"],
    }),

  update: (
    issueId: string,
    payload: Partial<{
      title: string;
      description: string | null;
      status: IssueStatus;
      priority: IssuePriority;
      assigneeId: string | null;
      sprintId: string | null;
      storyPoints: number | null;
      dueDate: string | null;
      typeFields: Record<string, unknown>;
    }>
  ) =>
    makeApiCall<{ issue: Issue; autoPromoted: boolean }>({
      method: "PATCH",
      url: ENDPOINTS.issues.update(issueId),
      body: payload,
      unwrap: ["issue", "autoPromoted"],
    }),

  updateStatus: (issueId: string, status: IssueStatus) =>
    makeApiCall<Issue>({
      method: "PATCH",
      url: ENDPOINTS.issues.updateStatus(issueId),
      body: { status },
      unwrap: "issue",
    }),

  delete: (issueId: string) =>
    makeApiCall<{ message: string }>({
      method: "DELETE",
      url: ENDPOINTS.issues.delete(issueId),
    }),

  search: (
    projectId: string,
    query: string,
    filters?: {
      type?: IssueType;
      status?: IssueStatus;
      assigneeId?: string;
    }
  ) =>
    makeApiCall<Issue[]>({
      method: "GET",
      url: ENDPOINTS.search.query(projectId),
      params: { q: query, ...filters } as Record<string, unknown>,
      unwrap: "results",
    }),
};
