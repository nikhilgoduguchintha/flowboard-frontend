import { useNavigate } from "react-router-dom";

export function Forbidden() {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: "rgb(var(--background))" }}
    >
      <div className="text-center max-w-md w-full mx-4">
        {/* 403 */}
        <p
          className="text-8xl font-bold mb-4"
          style={{ color: "rgb(var(--border-strong))" }}
        >
          403
        </p>

        <h1
          className="text-2xl font-semibold mb-3"
          style={{ color: "rgb(var(--text-primary))" }}
        >
          Access denied
        </h1>

        <p
          className="text-sm mb-8"
          style={{ color: "rgb(var(--text-secondary))" }}
        >
          You do not have permission to view this page. Contact your project
          manager if you think this is a mistake.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: "rgb(var(--surface))",
              color: "rgb(var(--text-primary))",
              border: "1px solid rgb(var(--border))",
            }}
          >
            Go back
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: "rgb(var(--accent))",
              color: "#ffffff",
            }}
          >
            Go to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
