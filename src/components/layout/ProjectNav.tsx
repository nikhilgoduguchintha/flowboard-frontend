import { useQueryState } from "nuqs";
import { cn } from "../../lib/utils";

interface ProjectNavProps {
  projectId: string;
}

const TABS = [
  { key: "board", label: "Board" },
  { key: "backlog", label: "Backlog" },
  { key: "settings", label: "Settings" },
] as const;

// type TabKey = (typeof TABS)[number]["key"];

export function ProjectNav({ projectId: _ }: ProjectNavProps) {
  const [view, setView] = useQueryState("view", {
    defaultValue: "board",
  });

  return (
    <div
      className="flex items-center gap-1 px-4"
      style={{ borderTop: "1px solid rgb(var(--border))" }}
    >
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setView(tab.key)}
          className={cn(
            "px-3 py-2 text-sm font-medium transition-colors",
            "border-b-2 -mb-px"
          )}
          style={{
            borderBottomColor:
              view === tab.key ? "rgb(var(--accent))" : "transparent",
            color:
              view === tab.key
                ? "rgb(var(--accent))"
                : "rgb(var(--text-secondary))",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
