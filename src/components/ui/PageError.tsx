interface PageErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function PageError({
  message = "Failed to load data",
  onRetry,
}: PageErrorProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 px-4 rounded-lg"
      style={{
        backgroundColor: "rgb(var(--surface))",
        border: "1px solid rgb(var(--border))",
      }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
        style={{ backgroundColor: "rgb(var(--error-light))" }}
      >
        <svg
          className="w-5 h-5"
          style={{ color: "rgb(var(--error))" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <p
        className="text-sm font-medium mb-1"
        style={{ color: "rgb(var(--text-primary))" }}
      >
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
          style={{
            backgroundColor: "rgb(var(--surface-alt))",
            color: "rgb(var(--text-primary))",
            border: "1px solid rgb(var(--border))",
          }}
        >
          Try again
        </button>
      )}
    </div>
  );
}
