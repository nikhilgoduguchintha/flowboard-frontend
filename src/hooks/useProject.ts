import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { projectsApi } from "../api/projects.api";
import { useToast } from "./useToast";

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projectsApi.getOne(projectId),
    enabled: !!projectId,
  });
}

export function useUpdateProject(projectId: string) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (name: string) => projectsApi.update(projectId, { name }),

    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(`Project renamed to "${project.name}"`);
    },

    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to update project"
      );
    },
  });
}

export function useArchiveProject(projectId: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();

  return useMutation({
    mutationFn: () => projectsApi.archive(projectId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project archived");
      navigate("/dashboard");
    },

    onError: () => {
      toast.error("Failed to archive project");
    },
  });
}
