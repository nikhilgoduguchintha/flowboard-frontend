import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membersApi } from "../api/members.api";
import { useToast } from "./useToast";
import type { MemberRole } from "../types";

export function useMembers(projectId: string) {
  return useQuery({
    queryKey: ["members", projectId],
    queryFn: () => membersApi.getAll(projectId),
    enabled: !!projectId,
  });
}

export function useInviteMember(projectId: string) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: { email: string; role: MemberRole }) =>
      membersApi.invite(projectId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", projectId] });
      toast.success("Member invited successfully");
    },

    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to invite member"
      );
    },
  });
}

export function useRemoveMember(projectId: string) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (userId: string) => membersApi.remove(projectId, userId),

    // Optimistic remove
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ["members", projectId] });

      const previous = queryClient.getQueryData(["members", projectId]);

      queryClient.setQueryData(
        ["members", projectId],
        (old: Array<{ user_id: string }>) =>
          old?.filter((m) => m.user_id !== userId) ?? []
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["members", projectId], context.previous);
      }
      toast.error("Failed to remove member");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["members", projectId] });
    },
  });
}
