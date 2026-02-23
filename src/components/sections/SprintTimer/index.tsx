import { useState, useEffect } from "react";
import { useSprints } from "../../../hooks/useSprints";
import { differenceInDays, differenceInHours, format } from "date-fns";

interface SprintTimerProps {
  projectId: string;
  sprintStatus: string;
}

export function SprintTimer({ projectId }: SprintTimerProps) {
  const { data: sprints } = useSprints(projectId);
  const [now, setNow] = useState(new Date());

  const activeSprint = sprints?.find((s) => s.status === "active");

  // Tick every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!activeSprint?.end_date) return null;

  const endDate = new Date(activeSprint.end_date);
  const daysLeft = differenceInDays(endDate, now);
  const hoursLeft = differenceInHours(endDate, now) % 24;
  const isOverdue = endDate < now;

  return (
    <div
      className="mx-4 mt-4 rounded-xl p-4 flex items-center justify-between"
      style={{
        backgroundColor: isOverdue ? "#FEE2E2" : "rgb(var(--surface))",
        border: `1px solid ${isOverdue ? "#FECACA" : "rgb(var(--border))"}`,
      }}
    >
      <div>
        <p
          className="text-xs font-medium mb-0.5"
          style={{ color: isOverdue ? "#DC2626" : "rgb(var(--text-tertiary))" }}
        >
          {activeSprint.name}
        </p>
        <p
          className="text-sm font-semibold"
          style={{ color: isOverdue ? "#DC2626" : "rgb(var(--text-primary))" }}
        >
          {isOverdue
            ? "Sprint overdue"
            : `${daysLeft}d ${hoursLeft}h remaining`}
        </p>
      </div>

      <div className="text-right">
        <p className="text-xs" style={{ color: "rgb(var(--text-tertiary))" }}>
          Ends
        </p>
        <p
          className="text-xs font-medium"
          style={{ color: "rgb(var(--text-secondary))" }}
        >
          {format(endDate, "MMM d, yyyy")}
        </p>
      </div>
    </div>
  );
}
