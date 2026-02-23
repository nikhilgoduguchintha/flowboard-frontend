import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../../api/projects.api";
import { Avatar } from "../ui/Avatar";
import { Spinner } from "../ui/Spinner";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/utils";

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  const [collapsed, setCollapsed] = useState(false);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsApi.getAll,
  });

  return (
    <aside
      className={cn(
        "flex flex-col h-full transition-all duration-200 flex-shrink-0",
        collapsed ? "w-14" : "w-56"
      )}
      style={{
        backgroundColor: "rgb(var(--surface))",
        borderRight: "1px solid rgb(var(--border))",
      }}
    >
      {/* Logo + collapse */}
      <div
        className="flex items-center justify-between px-3 py-4 flex-shrink-0"
        style={{ borderBottom: "1px solid rgb(var(--border))" }}
      >
        {!collapsed && (
          <span
            className="text-sm font-bold tracking-tight"
            style={{ color: "rgb(var(--accent))" }}
          >
            FlowBoard
          </span>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="p-1 rounded-md hover:opacity-70 transition-opacity ml-auto"
          style={{ color: "rgb(var(--text-tertiary))" }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {collapsed ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 px-2 py-3 flex-shrink-0">
        <SidebarItem
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          }
          label="Dashboard"
          collapsed={collapsed}
          active={location.pathname === "/dashboard"}
          onClick={() => navigate("/dashboard")}
        />
      </nav>

      {/* Projects list */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {!collapsed && (
          <p
            className="text-xs font-semibold uppercase tracking-wider px-2 mb-2"
            style={{ color: "rgb(var(--text-tertiary))" }}
          >
            Projects
          </p>
        )}

        {isLoading && (
          <div className="flex justify-center py-4">
            <Spinner size="sm" />
          </div>
        )}

        {projects?.map((project) => (
          <SidebarItem
            key={project.id}
            icon={
              <span
                className="w-4 h-4 rounded text-xs font-bold flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: "rgb(var(--accent-light))",
                  color: "rgb(var(--accent))",
                }}
              >
                {project.key[0]}
              </span>
            }
            label={project.name}
            collapsed={collapsed}
            active={projectId === project.id}
            onClick={() => navigate(`/project/${project.id}`)}
          />
        ))}
      </div>

      {/* User profile */}
      {user && (
        <div
          className="flex items-center gap-2 px-3 py-3 flex-shrink-0"
          style={{ borderTop: "1px solid rgb(var(--border))" }}
        >
          <Avatar name={user.name} handle={user.user_handle} size="sm" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-medium truncate"
                style={{ color: "rgb(var(--text-primary))" }}
              >
                {user.name}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: "rgb(var(--text-tertiary))" }}
              >
                @{user.user_handle}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={logout}
              className="p-1 rounded hover:opacity-70 transition-opacity flex-shrink-0"
              style={{ color: "rgb(var(--text-tertiary))" }}
              title="Logout"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </aside>
  );
}

// ─── Sidebar Item ─────────────────────────────────────────────────────────────

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  active: boolean;
  onClick: () => void;
}

function SidebarItem({
  icon,
  label,
  collapsed,
  active,
  onClick,
}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 w-full px-2 py-1.5 rounded-md",
        "text-sm transition-colors text-left",
        collapsed && "justify-center"
      )}
      style={{
        backgroundColor: active ? "rgb(var(--accent-light))" : "transparent",
        color: active ? "rgb(var(--accent))" : "rgb(var(--text-secondary))",
      }}
      title={collapsed ? label : undefined}
    >
      {icon}
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}
