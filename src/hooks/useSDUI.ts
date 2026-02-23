import { useQuery } from "@tanstack/react-query";
import { layoutApi } from "../api/layout.api";
import type { ResolvedSection } from "../types";

export function useSDUI(projectId: string) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["layout", projectId],
    queryFn: () => layoutApi.get(projectId),
    staleTime: 0, // always consider stale — SSE handles freshness
    enabled: !!projectId,
  });

  return {
    layout: data?.layout ?? ([] as ResolvedSection[]),
    fromCache: data?.fromCache ?? false,
    isLoading,
    isError,
    error,
    refetch,
  };
}
