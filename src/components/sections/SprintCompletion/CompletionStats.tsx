import type { Issue } from "../../../types";

interface CompletionStatsProps {
  issues: Issue[];
}

export function CompletionStats({ issues }: CompletionStatsProps) {
  const total = issues.length;
  const done = issues.filter((i) => i.status === "done").length;
  const incomplete = total - done;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div>
        <div
          className="flex justify-between text-xs mb-1"
          style={{ color: "rgb(var(--text-secondary))" }}
        >
          <span>{done} completed</span>
          <span>{percent}%</span>
        </div>
        <div
          className="w-full h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: "rgb(var(--surface-alt))" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${percent}%`,
              backgroundColor: "rgb(var(--success))",
            }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-4">
        <div>
          <p
            className="text-lg font-bold"
            style={{ color: "rgb(var(--success))" }}
          >
            {done}
          </p>
          <p className="text-xs" style={{ color: "rgb(var(--text-tertiary))" }}>
            Done
          </p>
        </div>
        <div>
          <p
            className="text-lg font-bold"
            style={{ color: "rgb(var(--warning))" }}
          >
            {incomplete}
          </p>
          <p className="text-xs" style={{ color: "rgb(var(--text-tertiary))" }}>
            Moved to backlog
          </p>
        </div>
        <div>
          <p
            className="text-lg font-bold"
            style={{ color: "rgb(var(--text-primary))" }}
          >
            {total}
          </p>
          <p className="text-xs" style={{ color: "rgb(var(--text-tertiary))" }}>
            Total
          </p>
        </div>
      </div>
    </div>
  );
}
