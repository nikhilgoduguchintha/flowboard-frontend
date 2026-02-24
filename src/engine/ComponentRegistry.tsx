import { SprintBoard } from "../components/sections/SprintBoard";
import { KanbanBoard } from "../components/sections/KanbanBoard";
import { BacklogPanel } from "../components/sections/BacklogPanel";
import { AnalyticsPanel } from "../components/sections/AnalyticsPanel";
import { MyIssues } from "../components/sections/MyIssues";
import { SprintPlanning } from "../components/sections/SprintPlanning";
import { OverdueAlert } from "../components/sections/OverdueAlert";
import { OpenBugsAlert } from "../components/sections/OpenBugsAlert";
import { SprintCompletion } from "../components/sections/SprintCompletion";
import { ActivityFeed } from "../components/sections/ActivityFeed";

export type SectionProps = Record<string, unknown>;
export type SectionComponent = React.ComponentType<SectionProps>;

// Cast helper — goes through unknown to avoid overlap error
function reg<T>(component: React.ComponentType<T>): SectionComponent {
  return component as unknown as SectionComponent;
}

export const ComponentRegistry: Record<string, SectionComponent> = {
  board: reg(SprintBoard),
  kanban: reg(KanbanBoard),
  backlog: reg(BacklogPanel),
  analytics: reg(AnalyticsPanel),
  issue_list: reg(MyIssues),
  planning: reg(SprintPlanning),
  alert: reg(AlertResolver),
  summary: reg(SprintCompletion),
  feed: reg(ActivityFeed),
};

function AlertResolver(props: SectionProps) {
  const sectionKey = props.sectionKey as string;
  const alertProps = props as unknown as {
    projectId: string;
    openBugs: number;
  };

  if (sectionKey === "overdue_alert")
    return <OverdueAlert projectId={alertProps.projectId} />;
  if (sectionKey === "open_bugs_alert")
    return (
      <OpenBugsAlert
        projectId={alertProps.projectId}
        openBugs={alertProps.openBugs}
      />
    );
  return null;
}
