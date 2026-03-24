import { Navigate } from "react-router-dom";
import { useAuthContext } from "../lib/AuthContext";
import { Spinner } from "../components/ui/Spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn, loading, user } = useAuthContext();

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

  // No session at all → go to login
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  // Has session but no profile row → incomplete Google OAuth signup
  if (!user) return <Navigate to="/onboarding" replace />;

  return <>{children}</>;
}
