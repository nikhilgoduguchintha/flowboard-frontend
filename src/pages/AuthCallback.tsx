import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        // Something went wrong — redirect to login
        navigate("/login", { replace: true });
        return;
      }

      // Successfully authenticated — go to dashboard
      navigate("/dashboard", { replace: true });
    };

    handleCallback();
  }, [navigate]);

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: "rgb(var(--background))" }}
    >
      <div className="flex flex-col items-center gap-3">
        {/* Spinner */}
        <svg
          className="w-8 h-8 animate-spin"
          style={{ color: "rgb(var(--accent))" }}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
        <p className="text-sm" style={{ color: "rgb(var(--text-secondary))" }}>
          Signing you in...
        </p>
      </div>
    </div>
  );
}
