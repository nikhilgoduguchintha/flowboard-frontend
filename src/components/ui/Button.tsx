import { cn } from "../../lib/utils";
import { Spinner } from "./Spinner";
import type { ButtonVariant } from "../../types";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const VARIANT_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: "rgb(var(--accent))",
    color: "#ffffff",
    border: "1px solid transparent",
  },
  secondary: {
    backgroundColor: "rgb(var(--surface))",
    color: "rgb(var(--text-primary))",
    border: "1px solid rgb(var(--border))",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "rgb(var(--text-secondary))",
    border: "1px solid transparent",
  },
  destructive: {
    backgroundColor: "#FEE2E2",
    color: "#DC2626",
    border: "1px solid #FECACA",
  },
  outline: {
    backgroundColor: "transparent",
    color: "rgb(var(--accent))",
    border: "1px solid rgb(var(--accent))",
  },
};

const SIZE_STYLES = {
  sm: "px-3 py-1.5 text-xs rounded-md gap-1.5",
  md: "px-4 py-2   text-sm rounded-lg gap-2",
  lg: "px-5 py-2.5 text-sm rounded-lg gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium",
        "transition-opacity cursor-pointer",
        "focus-visible:outline-2",
        SIZE_STYLES[size],
        isDisabled && "opacity-50 cursor-not-allowed",
        className
      )}
      style={VARIANT_STYLES[variant]}
      disabled={isDisabled}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
