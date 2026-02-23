import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../../api/projects.api";
import { Avatar } from "../ui/Avatar";
import { useAuth } from "../../hooks/useAuth";
import { ProjectNav } from "./ProjectNav";

export function Header() {
  const { user } = useAuth();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projectsApi.getOne(projectId!),
    enabled: !!projectId,
  });

  return (
    <header
      className="flex flex-col flex-shrink-0"
      style={{
        backgroundColor: "rgb(var(--surface))",
        borderBottom: "1px solid rgb(var(--border))",
      }}
    >
      {/* Top bar */}
      <div className="flex items-center gap-4 px-4 py-2">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm hover:opacity-70 transition-opacity truncate"
            style={{ color: "rgb(var(--text-tertiary))" }}
          >
            Dashboard
          </button>

          {project && (
            <>
              <span style={{ color: "rgb(var(--border-strong))" }}>/</span>
              <span
                className="text-sm font-medium truncate"
                style={{ color: "rgb(var(--text-primary))" }}
              >
                {project.name}
              </span>
            </>
          )}
        </div>

        {/* Search */}
        {projectId && (
          <div className="relative hidden md:block">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
              style={{ color: "rgb(var(--text-tertiary))" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search issues..."
              className="pl-8 pr-3 py-1.5 text-sm rounded-lg w-48 focus:w-64 transition-all"
              style={{
                backgroundColor: "rgb(var(--surface-alt))",
                color: "rgb(var(--text-primary))",
                border: "1px solid rgb(var(--border))",
              }}
            />
          </div>
        )}

        {/* User avatar */}
        {user && (
          <Avatar name={user.name} handle={user.user_handle} size="sm" />
        )}
      </div>

      {/* Project nav tabs — only shown on project pages */}
      {projectId && <ProjectNav projectId={projectId} />}
    </header>
  );
}
