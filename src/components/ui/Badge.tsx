import { cn } from "../../lib/utils";
import type { BadgeVariant } from "../../types";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const VARIANT_STYLES: Record<
  BadgeVariant,
  { bg: string; text: string; border: string }
> = {
  default: {
    bg: "rgb(var(--surface-alt))",
    text: "rgb(var(--text-secondary))",
    border: "rgb(var(--border))",
  },
  success: {
    bg: "#D1FAE5",
    text: "#065F46",
    border: "#A7F3D0",
  },
  warning: {
    bg: "#FEF3C7",
    text: "#B45309",
    border: "#FDE68A",
  },
  error: {
    bg: "#FEE2E2",
    text: "#DC2626",
    border: "#FECACA",
  },
  info: {
    bg: "#DBEAFE",
    text: "#1D4ED8",
    border: "#BFDBFE",
  },
  purple: {
    bg: "#EDE9FE",
    text: "#6D28D9",
    border: "#DDD6FE",
  },
};

export function Badge({
  label,
  variant = "default",
  dot,
  className,
}: BadgeProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full",
        "text-xs font-medium border",
        className
      )}
      style={{
        backgroundColor: styles.bg,
        color: styles.text,
        borderColor: styles.border,
      }}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: styles.text }}
        />
      )}
      {label}
    </span>
  );
}
