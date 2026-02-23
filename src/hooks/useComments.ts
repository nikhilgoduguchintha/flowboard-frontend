import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "../api/comments.api";
import { useToast } from "./useToast";

export function useComments(issueId: string) {
  return useQuery({
    queryKey: ["comments", issueId],
    queryFn: () => commentsApi.getAll(issueId),
    enabled: !!issueId,
  });
}

export function useAddComment(issueId: string) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (content: string) => commentsApi.create(issueId, { content }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", issueId] });
      toast.success("Comment added");
    },

    onError: () => {
      toast.error("Failed to add comment");
    },
  });
}

export function useDeleteComment(issueId: string) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (commentId: string) => commentsApi.delete(commentId),

    // Optimistic delete
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: ["comments", issueId] });

      const previous = queryClient.getQueryData(["comments", issueId]);

      queryClient.setQueryData(
        ["comments", issueId],
        (old: Array<{ id: string }>) =>
          old?.filter((c) => c.id !== commentId) ?? []
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["comments", issueId], context.previous);
      }
      toast.error("Failed to delete comment");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", issueId] });
    },
  });
}
