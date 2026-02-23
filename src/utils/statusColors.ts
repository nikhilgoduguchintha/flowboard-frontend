import type { IssueStatus } from "../types";

interface ColorSet {
  bg: string;
  text: string;
  border: string;
  dot: string;
}

const STATUS_COLORS: Record<IssueStatus, ColorSet> = {
  backlog: {
    bg: "#F1F5F9",
    text: "#64748B",
    border: "#CBD5E1",
    dot: "#94A3B8",
  },
  todo: {
    bg: "#F1F5F9",
    text: "#475569",
    border: "#CBD5E1",
    dot: "#64748B",
  },
  in_progress: {
    bg: "#DBEAFE",
    text: "#1D4ED8",
    border: "#BFDBFE",
    dot: "#3B82F6",
  },
  in_review: {
    bg: "#EDE9FE",
    text: "#6D28D9",
    border: "#DDD6FE",
    dot: "#8B5CF6",
  },
  testing: {
    bg: "#FEF3C7",
    text: "#B45309",
    border: "#FDE68A",
    dot: "#F59E0B",
  },
  done: {
    bg: "#D1FAE5",
    text: "#065F46",
    border: "#A7F3D0",
    dot: "#10B981",
  },
  resolved: {
    bg: "#D1FAE5",
    text: "#047857",
    border: "#6EE7B7",
    dot: "#059669",
  },
  closed: {
    bg: "#F1F5F9",
    text: "#475569",
    border: "#CBD5E1",
    dot: "#6B7280",
  },
};

export function getStatusColors(status: IssueStatus): ColorSet {
  return STATUS_COLORS[status] ?? STATUS_COLORS.backlog;
}

export const STATUS_LABELS: Record<IssueStatus, string> = {
  backlog: "Backlog",
  todo: "Todo",
  in_progress: "In Progress",
  in_review: "In Review",
  testing: "Testing",
  done: "Done",
  resolved: "Resolved",
  closed: "Closed",
};

// Valid status transitions per issue type
export const STATUS_TRANSITIONS: Record<string, IssueStatus[]> = {
  epic: ["backlog", "in_progress", "done"],
  story: ["backlog", "todo", "in_progress", "in_review", "done"],
  task: ["backlog", "todo", "in_progress", "done"],
  bug: [
    "backlog",
    "todo",
    "in_progress",
    "in_review",
    "testing",
    "resolved",
    "closed",
  ],
  subtask: ["todo", "in_progress", "done"],
};
