import { forwardRef } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium"
            style={{ color: "rgb(var(--text-primary))" }}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "rgb(var(--text-tertiary))" }}
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-lg text-sm transition-colors",
              "focus:outline-2",
              leftIcon ? "pl-9 pr-3 py-2" : "px-3 py-2",
              className
            )}
            style={{
              backgroundColor: "rgb(var(--surface))",
              color: "rgb(var(--text-primary))",
              border: error
                ? "1px solid rgb(var(--error))"
                : "1px solid rgb(var(--border))",
            }}
            {...props}
          />
        </div>

        {error && (
          <p className="text-xs" style={{ color: "rgb(var(--error))" }}>
            {error}
          </p>
        )}

        {hint && !error && (
          <p className="text-xs" style={{ color: "rgb(var(--text-tertiary))" }}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
