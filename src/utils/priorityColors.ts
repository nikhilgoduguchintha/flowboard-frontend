import type { IssuePriority } from "../types";

interface ColorSet {
  bg: string;
  text: string;
  border: string;
  icon: string;
}

const PRIORITY_COLORS: Record<IssuePriority, ColorSet> = {
  critical: {
    bg: "#FEE2E2",
    text: "#DC2626",
    border: "#FECACA",
    icon: "#EF4444",
  },
  high: {
    bg: "#FFEDD5",
    text: "#C2410C",
    border: "#FED7AA",
    icon: "#F97316",
  },
  medium: {
    bg: "#FEF3C7",
    text: "#B45309",
    border: "#FDE68A",
    icon: "#F59E0B",
  },
  low: {
    bg: "#F1F5F9",
    text: "#475569",
    border: "#CBD5E1",
    icon: "#6B7280",
  },
};

export function getPriorityColors(priority: IssuePriority): ColorSet {
  return PRIORITY_COLORS[priority] ?? PRIORITY_COLORS.medium;
}

export const PRIORITY_LABELS: Record<IssuePriority, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const PRIORITY_ORDER: IssuePriority[] = [
  "critical",
  "high",
  "medium",
  "low",
];
