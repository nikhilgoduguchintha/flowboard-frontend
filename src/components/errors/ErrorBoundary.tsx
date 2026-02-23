import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex items-center justify-center min-h-screen"
          style={{ backgroundColor: "rgb(var(--background))" }}
        >
          <div
            className="text-center p-8 rounded-xl max-w-md w-full mx-4"
            style={{
              backgroundColor: "rgb(var(--surface))",
              border: "1px solid rgb(var(--border))",
            }}
          >
            {/* Icon */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "rgb(var(--error-light))" }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: "rgb(var(--error))" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>

            {/* Text */}
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: "rgb(var(--text-primary))" }}
            >
              Something went wrong
            </h2>
            <p
              className="text-sm mb-6"
              style={{ color: "rgb(var(--text-secondary))" }}
            >
              An unexpected error occurred. You can try reloading the page or
              going back to the dashboard.
            </p>

            {/* Error detail — dev only */}
            {import.meta.env.DEV && this.state.error && (
              <pre
                className="text-xs text-left p-3 rounded-lg mb-6 overflow-auto max-h-32"
                style={{
                  backgroundColor: "rgb(var(--surface-alt))",
                  color: "rgb(var(--error))",
                }}
              >
                {this.state.error.message}
              </pre>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: "rgb(var(--surface-alt))",
                  color: "rgb(var(--text-primary))",
                  border: "1px solid rgb(var(--border))",
                }}
              >
                Try again
              </button>
              <button
                onClick={this.handleReload}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: "rgb(var(--accent))",
                  color: "#ffffff",
                }}
              >
                Reload page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
