import { Navigate } from "react-router-dom";
import { useAuthContext } from "../lib/AuthContext";
import { Spinner } from "../components/ui/Spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn, loading } = useAuthContext();

  console.log("[ProtectedRoute] render", { isLoggedIn, loading });

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "rgb(var(--background))" }}
      >
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
