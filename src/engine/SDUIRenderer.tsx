import { ComponentRegistry } from "./ComponentRegistry";
import type { ResolvedSection } from "../types";
import { Settings } from "@/pages/Settings";

interface SDUIRendererProps {
  layout: ResolvedSection[];
  projectId: string;
  view: string;
}

export function SDUIRenderer({ layout, projectId, view }: SDUIRendererProps) {
  if (view === "settings") {
    return <Settings projectId={projectId} />;
  }
  // Filter sections relevant to current view
  const visibleSections = filterByView(layout, view);

  if (visibleSections.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm" style={{ color: "rgb(var(--text-tertiary))" }}>
          Nothing to show here
        </p>
      </div>
    );
  }

  return (
    <div className="h-full">
      {visibleSections.map((section) => {
        const Component = ComponentRegistry[section.type];

        if (!Component) {
          console.warn(
            `[SDUIRenderer] No component registered for type: "${section.type}"`
          );
          return null;
        }

        return (
          <Component
            key={section.id}
            {...section.props}
            sectionKey={section.sectionKey}
            projectId={projectId}
          />
        );
      })}
    </div>
  );
}

// ─── View Filter ──────────────────────────────────────────────────────────────
// Decides which sections to show based on current URL view param

const BOARD_SECTIONS = [
  "sprint_board",
  "kanban_board",
  "sprint_planning",
  "sprint_completion",
  "overdue_alert",
  "open_bugs_alert",
  "activity_feed",
  "my_issues",
];

const BACKLOG_SECTIONS = ["backlog_panel", "analytics_panel"];

function filterByView(
  layout: ResolvedSection[],
  view: string
): ResolvedSection[] {
  switch (view) {
    case "board":
      return layout.filter((s) => BOARD_SECTIONS.includes(s.sectionKey));
    case "backlog":
      return layout.filter((s) => BACKLOG_SECTIONS.includes(s.sectionKey));
    default:
      return layout;
  }
}
