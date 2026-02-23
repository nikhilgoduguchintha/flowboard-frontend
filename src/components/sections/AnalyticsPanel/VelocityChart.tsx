import type { Sprint } from "../../../types";

interface VelocityChartProps {
  sprints: Sprint[];
}

export function VelocityChart({ sprints }: VelocityChartProps) {
  const closed = sprints.filter((s) => s.status === "closed").slice(-5); // last 5 sprints

  if (closed.length === 0) {
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
          Velocity
        </p>
        <p className="text-sm" style={{ color: "rgb(var(--text-tertiary))" }}>
          No completed sprints yet
        </p>
      </div>
    );
  }

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
        Velocity — last {closed.length} sprints
      </p>

      <div className="flex items-end gap-2 h-24">
        {closed.map((sprint, i) => (
          <div
            key={sprint.id}
            className="flex flex-col items-center gap-1 flex-1"
          >
            <div
              className="w-full rounded-t-sm"
              style={{
                height: `${Math.random() * 80 + 20}%`,
                backgroundColor:
                  i === closed.length - 1
                    ? "rgb(var(--accent))"
                    : "rgb(var(--surface-alt))",
              }}
            />
            <span
              className="text-xs truncate w-full text-center"
              style={{ color: "rgb(var(--text-tertiary))" }}
            >
              {sprint.name.replace("Sprint ", "S")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
