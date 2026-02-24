import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../../api/projects.api";
import { Avatar } from "../ui/Avatar";
import { useAuth } from "../../hooks/useAuth";
import { ProjectNav } from "./ProjectNav";
import { SearchPalette } from "./SearchPalette";

export function Header() {
  const { user } = useAuth();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projectsApi.getOne(projectId!),
    enabled: !!projectId,
  });

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    if (!projectId) return;
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [projectId]);

  return (
    <>
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

          {/* Search trigger */}
          {projectId && (
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors hover:opacity-80"
              style={{
                backgroundColor: "rgb(var(--surface-alt))",
                color: "rgb(var(--text-tertiary))",
                border: "1px solid rgb(var(--border))",
                minWidth: "180px",
              }}
            >
              <svg
                className="w-3.5 h-3.5 flex-shrink-0"
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
              <span className="flex-1 text-left text-xs">Search issues...</span>
              <kbd
                className="text-xs px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: "rgb(var(--surface))",
                  border: "1px solid rgb(var(--border))",
                }}
              >
                ⌘K
              </kbd>
            </button>
          )}

          {/* User avatar */}
          {user && (
            <Avatar name={user.name} handle={user.user_handle} size="sm" />
          )}
        </div>

        {/* Project nav tabs */}
        {projectId && <ProjectNav projectId={projectId} />}
      </header>

      {/* Search palette */}
      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
