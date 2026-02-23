import type { IssueType } from "../types";

interface ColorSet {
  bg: string;
  text: string;
  border: string;
  icon: string;
}

const TYPE_COLORS: Record<IssueType, ColorSet> = {
  epic: {
    bg: "#EDE9FE",
    text: "#6D28D9",
    border: "#DDD6FE",
    icon: "#8B5CF6",
  },
  story: {
    bg: "#DBEAFE",
    text: "#1D4ED8",
    border: "#BFDBFE",
    icon: "#3B82F6",
  },
  task: {
    bg: "#D1FAE5",
    text: "#065F46",
    border: "#A7F3D0",
    icon: "#10B981",
  },
  bug: {
    bg: "#FEE2E2",
    text: "#DC2626",
    border: "#FECACA",
    icon: "#EF4444",
  },
  subtask: {
    bg: "#F1F5F9",
    text: "#475569",
    border: "#CBD5E1",
    icon: "#64748B",
  },
};

export function getTypeColors(type: IssueType): ColorSet {
  return TYPE_COLORS[type] ?? TYPE_COLORS.task;
}

export const TYPE_LABELS: Record<IssueType, string> = {
  epic: "Epic",
  story: "Story",
  task: "Task",
  bug: "Bug",
  subtask: "Subtask",
};

export const TYPE_ICONS: Record<IssueType, string> = {
  epic: "⚡",
  story: "📖",
  task: "✅",
  bug: "👁️‍🗨️",
  subtask: "📌",
};
