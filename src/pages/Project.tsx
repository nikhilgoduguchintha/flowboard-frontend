import { useParams } from "react-router-dom";
import { useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api/projects.api";
import { useSSE } from "../hooks/useSSE";
import { useSDUI } from "../hooks/useSDUI";
import { SDUIRenderer } from "../engine/SDUIRenderer";
import { BoardSkeleton } from "../components/ui/Skeleton";
import { PageError } from "../components/ui/PageError";
import { NotFound } from "../components/errors/NotFound";
import { Forbidden } from "../components/errors/Forbidden";
import { NotFoundError, ForbiddenError } from "../api/errors";

export function Project() {
  const { projectId } = useParams() as { projectId: string };
  const [view] = useQueryState("view", { defaultValue: "board" });

  // Verify user has access to project
  const {
    isLoading: projectLoading,
    isError: projectError,
    error: projectErr,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projectsApi.getOne(projectId),
  });

  // Fetch SDUI layout
  const {
    layout,
    isLoading: layoutLoading,
    isError: layoutError,
    refetch: refetchLayout,
  } = useSDUI(projectId);

  // Open SSE connection for real-time updates
  useSSE(projectId);

  // ── Error states ──────────────────────────────────────────────────────────
  if (projectError) {
    if (projectErr instanceof NotFoundError) return <NotFound />;
    if (projectErr instanceof ForbiddenError) return <Forbidden />;
  }

  // ── Loading state ─────────────────────────────────────────────────────────
  if (projectLoading || layoutLoading) {
    return <BoardSkeleton />;
  }

  // ── Layout error ──────────────────────────────────────────────────────────
  if (layoutError) {
    return (
      <div className="p-6">
        <PageError
          message="Failed to load project layout"
          onRetry={refetchLayout}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <SDUIRenderer layout={layout ?? []} projectId={projectId} view={view} />
    </div>
  );
}
