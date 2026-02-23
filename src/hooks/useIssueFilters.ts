import { useQueryState, parseAsString } from "nuqs";
import type { IssueType, IssuePriority } from "../types";

export function useIssueFilters() {
  const [view, setView] = useQueryState("view", {
    defaultValue: "board",
  });

  const [sprintId, setSprintId] = useQueryState("sprintId", {
    defaultValue: "",
  });

  const [issueId, setIssueId] = useQueryState("issueId", {
    defaultValue: "",
  });

  const [type, setType] = useQueryState<IssueType | "">(
    "type",
    parseAsString.withDefault("") as never
  );

  const [assignee, setAssignee] = useQueryState("assignee", {
    defaultValue: "",
  });

  const [priority, setPriority] = useQueryState<IssuePriority | "">(
    "priority",
    parseAsString.withDefault("") as never
  );

  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
  });

  const clearFilters = () => {
    void setType("");
    void setAssignee("");
    void setPriority("");
    void setSearch("");
  };

  const hasActiveFilters = !!(type || assignee || priority || search);

  return {
    // Values
    view,
    sprintId,
    issueId,
    type: type as IssueType | "",
    assignee,
    priority: priority as IssuePriority | "",
    search,

    // Setters
    setView,
    setSprintId,
    setIssueId,
    setType: setType as (v: IssueType | "") => void,
    setAssignee,
    setPriority: setPriority as (v: IssuePriority | "") => void,
    setSearch,

    // Helpers
    clearFilters,
    hasActiveFilters,
  };
}
