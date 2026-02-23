import { useSprints, useCloseSprint } from "../../../hooks/useSprints";
import { useIssues } from "../../../hooks/useIssues";
import { CompletionStats } from "./CompletionStats";
import { Button } from "../../ui/Button";
import { Skeleton } from "../../ui/Skeleton";

interface SprintCompletionProps {
  projectId: string;
}

export function SprintCompletion({ projectId }: SprintCompletionProps) {
  const { data: sprints, isLoading } = useSprints(projectId);
  const closedSprint =
    sprints?.find((s) => s.status === "closed") ?? sprints?.[0];

  const { data: issues } = useIssues(projectId, {
    sprintId: closedSprint?.id,
  });

  const { mutate: closeSprint, isPending } = useCloseSprint(projectId);
  const activeSprint = sprints?.find((s) => s.status === "active");

  if (isLoading) return <Skeleton className="h-32 mx-4 mt-4 rounded-xl" />;

  return (
    <div
      className="mx-4 mt-4 rounded-xl p-5"
      style={{
        backgroundColor: "rgb(var(--surface))",
        border: "1px solid rgb(var(--border))",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <p
          className="text-sm font-semibold"
          style={{ color: "rgb(var(--text-primary))" }}
        >
          Sprint Completion
        </p>

        {activeSprint && (
          <Button
            size="sm"
            variant="secondary"
            loading={isPending}
            onClick={() => closeSprint(activeSprint.id)}
          >
            Close sprint
          </Button>
        )}
      </div>

      {issues && <CompletionStats issues={issues} />}
    </div>
  );
}
