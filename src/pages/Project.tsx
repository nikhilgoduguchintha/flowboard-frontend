import { useParams } from "react-router-dom";
import { useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api/projects.api";
import { useSSE } from "../hooks/useSSE";
import { useSDUI } from "../hooks/useSDUI";
import { useIssueFilters } from "../hooks/useIssueFilters";
import { SDUIRenderer } from "../engine/SDUIRenderer";
import { IssueDetail } from "./IssueDetail";
import { BoardSkeleton } from "../components/ui/Skeleton";
import { PageError } from "../components/ui/PageError";
import { NotFound } from "../components/errors/NotFound";
import { Forbidden } from "../components/errors/Forbidden";
import { NotFoundError, ForbiddenError } from "../api/errors";

export function Project() {
  const { projectId } = useParams() as { projectId: string };
  const [view] = useQueryState("view", { defaultValue: "board" });
  const { issueId, setIssueId } = useIssueFilters();

  const {
    isLoading: projectLoading,
    isError: projectError,
    error: projectErr,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projectsApi.getOne(projectId),
  });

  const {
    layout,
    isLoading: layoutLoading,
    isError: layoutError,
    refetch: refetchLayout,
  } = useSDUI(projectId);

  useSSE(projectId);

  if (projectError) {
    if (projectErr instanceof NotFoundError) return <NotFound />;
    if (projectErr instanceof ForbiddenError) return <Forbidden />;
  }

  if (projectLoading || layoutLoading) return <BoardSkeleton />;

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
    <div className="h-full flex flex-col relative">
      <SDUIRenderer layout={layout ?? []} projectId={projectId} view={view} />

      {/* Issue detail slide-over */}
      {issueId && (
        <>
          {/* Backdrop */}
          <div
            className="absolute inset-0 z-10"
            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            onClick={() => setIssueId("")}
          />

          {/* Panel */}
          <div
            className="absolute right-0 top-0 h-full z-20 overflow-auto shadow-xl"
            style={{
              width: "560px",
              backgroundColor: "rgb(var(--background))",
              borderLeft: "1px solid rgb(var(--border))",
            }}
          >
            <IssueDetail
              issueId={issueId}
              projectId={projectId}
              onClose={() => setIssueId("")}
            />
          </div>
        </>
      )}
    </div>
  );
}
