import { makeApiCall } from "./makeApiCall";
import { ENDPOINTS } from "./endpoints";
import type { Comment } from "../types";

export const commentsApi = {
  getAll: (issueId: string) =>
    makeApiCall<Comment[]>({
      method: "GET",
      url: ENDPOINTS.comments.getAll(issueId),
      unwrap: "comments",
    }),

  create: (issueId: string, payload: { content: string }) =>
    makeApiCall<Comment>({
      method: "POST",
      url: ENDPOINTS.comments.create(issueId),
      body: payload,
      unwrap: "comment",
    }),

  delete: (commentId: string) =>
    makeApiCall<{ message: string }>({
      method: "DELETE",
      url: ENDPOINTS.comments.delete(commentId),
    }),
};
