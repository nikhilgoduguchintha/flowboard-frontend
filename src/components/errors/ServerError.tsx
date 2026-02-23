import { useNavigate } from "react-router-dom";

export function ServerError() {
  const navigate = useNavigate();

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: "rgb(var(--background))" }}
    >
      <div className="text-center max-w-md w-full mx-4">
        {/* 500 */}
        <p
          className="text-8xl font-bold mb-4"
          style={{ color: "rgb(var(--border-strong))" }}
        >
          500
        </p>

        <h1
          className="text-2xl font-semibold mb-3"
          style={{ color: "rgb(var(--text-primary))" }}
        >
          Server error
        </h1>

        <p
          className="text-sm mb-8"
          style={{ color: "rgb(var(--text-secondary))" }}
        >
          Something went wrong on our end. We are working on fixing it. Please
          try again in a moment.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: "rgb(var(--surface))",
              color: "rgb(var(--text-primary))",
              border: "1px solid rgb(var(--border))",
            }}
          >
            Go to dashboard
          </button>
          <button
            onClick={handleRetry}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: "rgb(var(--accent))",
              color: "#ffffff",
            }}
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
