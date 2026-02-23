interface OnboardingProps {
  userHandle: string;
  daysIn: number;
}

const STEPS = [
  { label: "Create or join a project", done: true },
  { label: "Invite team members", done: false },
  { label: "Create your first sprint", done: false },
  { label: "Add issues to the backlog", done: false },
  { label: "Start the sprint", done: false },
];

export function Onboarding({ userHandle, daysIn }: OnboardingProps) {
  return (
    <div
      className="mx-4 mt-4 rounded-xl p-5"
      style={{
        backgroundColor: "rgb(var(--accent-light))",
        border: "1px solid rgb(var(--border))",
      }}
    >
      <p
        className="text-sm font-semibold mb-1"
        style={{ color: "rgb(var(--accent))" }}
      >
        Welcome, @{userHandle}!
      </p>
      <p
        className="text-xs mb-4"
        style={{ color: "rgb(var(--text-secondary))" }}
      >
        {daysIn === 0
          ? "You joined today — here is how to get started"
          : `Day ${daysIn} — here is what to do next`}
      </p>

      <div className="space-y-2">
        {STEPS.map((step, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: step.done
                  ? "rgb(var(--accent))"
                  : "rgb(var(--surface))",
                border: step.done
                  ? "none"
                  : "1.5px solid rgb(var(--border-strong))",
              }}
            >
              {step.done && (
                <svg
                  className="w-2.5 h-2.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span
              className="text-xs"
              style={{
                color: step.done
                  ? "rgb(var(--text-tertiary))"
                  : "rgb(var(--text-primary))",
                textDecoration: step.done ? "line-through" : "none",
              }}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
