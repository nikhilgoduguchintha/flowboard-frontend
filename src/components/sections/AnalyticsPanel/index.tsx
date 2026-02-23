import { useIssues } from "../../../hooks/useIssues";
import { useSprints } from "../../../hooks/useSprints";
import { StatsCard } from "./StatsCard";
import { BurndownChart } from "./BurndownChart";
import { VelocityChart } from "./VelocityChart";
import { Skeleton } from "../../ui/Skeleton";

interface AnalyticsPanelProps {
  projectId: string;
  role: string;
}

export function AnalyticsPanel({ projectId }: AnalyticsPanelProps) {
  const { data: issues, isLoading: issuesLoading } = useIssues(projectId);
  const { data: sprints, isLoading: sprintsLoading } = useSprints(projectId);

  const isLoading = issuesLoading || sprintsLoading;

  const totalIssues = issues?.length ?? 0;
  const doneIssues = issues?.filter((i) => i.status === "done").length ?? 0;
  const openBugs =
    issues?.filter((i) => i.type === "bug" && i.status !== "closed").length ??
    0;
  const overdueIssues =
    issues?.filter(
      (i) =>
        i.due_date && new Date(i.due_date) < new Date() && i.status !== "done"
    ).length ?? 0;
  const activeSprint = sprints?.find((s) => s.status === "active");

  return (
    <div className="p-6 space-y-6">
      <h2
        className="text-sm font-semibold"
        style={{ color: "rgb(var(--text-primary))" }}
      >
        Analytics
      </h2>

      {/* Stats row */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            label="Total issues"
            value={totalIssues}
            color="rgb(var(--accent))"
          />
          <StatsCard
            label="Completed"
            value={doneIssues}
            color="rgb(var(--success))"
            sub={
              totalIssues > 0
                ? `${Math.round((doneIssues / totalIssues) * 100)}%`
                : "0%"
            }
          />
          <StatsCard
            label="Open bugs"
            value={openBugs}
            color="rgb(var(--error))"
          />
          <StatsCard
            label="Overdue"
            value={overdueIssues}
            color="rgb(var(--warning))"
          />
        </div>
      )}

      {/* Charts */}
      {activeSprint && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BurndownChart
            projectId={projectId}
            sprint={activeSprint}
            issues={issues ?? []}
          />
          <VelocityChart sprints={sprints ?? []} />
        </div>
      )}
    </div>
  );
}
