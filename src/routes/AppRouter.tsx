import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "../components/layout/AppLayout";
import { ErrorBoundary } from "../components/errors/ErrorBoundary";
import { NotFound } from "../components/errors/NotFound";
import { Forbidden } from "../components/errors/Forbidden";
import { ServerError } from "../components/errors/ServerError";
import { Login } from "../pages/Login";
import { Signup } from "../pages/Signup";
import { Dashboard } from "../pages/Dashboard";
import { Project } from "../pages/Project";
import { IssueDetail } from "../pages/IssueDetail";

export function AppRouter() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/error/not-found" element={<NotFound />} />
        <Route path="/error/forbidden" element={<Forbidden />} />
        <Route path="/error/server" element={<ServerError />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="project/:projectId" element={<Project />} />
          <Route path="issue/:issueId" element={<IssueDetail />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}
