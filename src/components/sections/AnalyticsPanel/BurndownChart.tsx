import { differenceInDays, format } from "date-fns";
import type { Sprint, Issue } from "../../../types";

interface BurndownChartProps {
  projectId: string;
  sprint: Sprint;
  issues: Issue[];
}

export function BurndownChart({ sprint, issues }: BurndownChartProps) {
  if (!sprint.start_date || !sprint.end_date) {
    return (
      <div
        className="rounded-xl p-4"
        style={{
          backgroundColor: "rgb(var(--surface))",
          border: "1px solid rgb(var(--border))",
        }}
      >
        <p
          className="text-xs font-medium mb-4"
          style={{ color: "rgb(var(--text-tertiary))" }}
        >
          Burndown Chart
        </p>
        <p className="text-sm" style={{ color: "rgb(var(--text-tertiary))" }}>
          No sprint dates set
        </p>
      </div>
    );
  }

  const startDate = new Date(sprint.start_date);
  const endDate = new Date(sprint.end_date);
  const totalPoints = issues.reduce((sum, i) => sum + (i.story_points ?? 0), 0);
  const donePoints = issues
    .filter((i) => i.status === "done")
    .reduce((sum, i) => sum + (i.story_points ?? 0), 0);

  const totalDays = differenceInDays(endDate, startDate) || 1;
  const elapsed = Math.min(differenceInDays(new Date(), startDate), totalDays);
  const remaining = totalPoints - donePoints;
  const ideal = totalPoints - (totalPoints / totalDays) * elapsed;
  const progress =
    totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0;

  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: "rgb(var(--surface))",
        border: "1px solid rgb(var(--border))",
      }}
    >
      <p
        className="text-xs font-medium mb-4"
        style={{ color: "rgb(var(--text-tertiary))" }}
      >
        Burndown — {sprint.name}
      </p>

      {/* Simple progress visual */}
      <div className="space-y-3">
        <div
          className="flex justify-between text-xs"
          style={{ color: "rgb(var(--text-secondary))" }}
        >
          <span>{donePoints} pts done</span>
          <span>{remaining} pts left</span>
        </div>

        <div
          className="w-full h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: "rgb(var(--surface-alt))" }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progress}%`,
              backgroundColor: "rgb(var(--accent))",
            }}
          />
        </div>

        <div
          className="flex justify-between text-xs"
          style={{ color: "rgb(var(--text-tertiary))" }}
        >
          <span>{progress}% complete</span>
          <span>Ideal: {Math.round(ideal)} pts remaining</span>
        </div>

        <div
          className="flex justify-between text-xs pt-1"
          style={{ color: "rgb(var(--text-tertiary))" }}
        >
          <span>{format(startDate, "MMM d")}</span>
          <span>
            Day {elapsed} of {totalDays}
          </span>
          <span>{format(endDate, "MMM d")}</span>
        </div>
      </div>
    </div>
  );
}
