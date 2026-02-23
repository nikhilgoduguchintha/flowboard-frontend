import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sprintsApi } from "../api/sprints.api";
import { useToast } from "./useToast";

export function useSprints(projectId: string) {
  return useQuery({
    queryKey: ["sprints", projectId],
    queryFn: () => sprintsApi.getAll(projectId),
    enabled: !!projectId,
  });
}

export function useActiveSprint(projectId: string) {
  const { data: sprints, ...rest } = useSprints(projectId);

  return {
    ...rest,
    activeSprint: sprints?.find((s) => s.status === "active") ?? null,
  };
}

export function useCreateSprint(projectId: string) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: {
      name: string;
      goal?: string;
      startDate?: string;
      endDate?: string;
    }) => sprintsApi.create(projectId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprints", projectId] });
      queryClient.invalidateQueries({ queryKey: ["layout", projectId] });
      toast.success("Sprint created");
    },

    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to create sprint"
      );
    },
  });
}

export function useStartSprint(projectId: string) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (sprintId: string) => sprintsApi.start(projectId, sprintId),

    onSuccess: (sprint) => {
      queryClient.invalidateQueries({ queryKey: ["sprints", projectId] });
      queryClient.invalidateQueries({ queryKey: ["layout", projectId] });
      toast.success(`Sprint "${sprint.name}" started`);
    },

    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to start sprint"
      );
    },
  });
}

export function useCloseSprint(projectId: string) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (sprintId: string) => sprintsApi.close(projectId, sprintId),

    onSuccess: (sprint) => {
      queryClient.invalidateQueries({ queryKey: ["sprints", projectId] });
      queryClient.invalidateQueries({ queryKey: ["issues", projectId] });
      queryClient.invalidateQueries({ queryKey: ["layout", projectId] });
      toast.success(`Sprint "${sprint.name}" closed`);
    },

    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to close sprint"
      );
    },
  });
}
