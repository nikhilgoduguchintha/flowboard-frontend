import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "../api/projects.api";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { Skeleton } from "../components/ui/Skeleton";
import { PageError } from "../components/ui/PageError";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatDistanceToNow } from "date-fns";
import type { Project } from "../types";
import { supabase } from "../lib/supabase";
// ─── Create Project Form Schema ───────────────────────────────────────────────

const createProjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  key: z
    .string()
    .min(2, "Key must be at least 2 characters")
    .max(10, "Key must be 10 characters or less")
    .regex(
      /^[A-Z][A-Z0-9]+$/,
      "Key must be uppercase letters and numbers only"
    ),
  type: z.enum(["scrum", "kanban"]),
});

type CreateProjectValues = z.infer<typeof createProjectSchema>;

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export function Dashboard() {
  const { user } = useAuth();
  console.log("[Dashboard] user:", user);

  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const {
    data: projects,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsApi.getAll,
  });
  console.log("[Dashboard] query:", { isLoading, isError, projects });

  const { mutate: createProject, isPending } = useMutation({
    mutationFn: (values: CreateProjectValues) => projectsApi.create(values),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(`Project "${project.name}" created`);
      setModalOpen(false);
      navigate(`/project/${project.id}`);
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to create project"
      );
    },
  });
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("[Dashboard] session check:", !!session);
    });
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { type: "scrum" },
  });

  const onSubmit = (values: CreateProjectValues) => {
    createProject(values);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    reset();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-xl font-semibold mb-0.5"
            style={{ color: "rgb(var(--text-primary))" }}
          >
            {user ? `Good to see you, ${user.name.split(" ")[0]}` : "Dashboard"}
          </h1>
          <p
            className="text-sm"
            style={{ color: "rgb(var(--text-secondary))" }}
          >
            {projects?.length
              ? `You have ${projects.length} project${
                  projects.length > 1 ? "s" : ""
                }`
              : "Create your first project to get started"}
          </p>
        </div>

        {user?.is_manager && (
          <Button onClick={() => setModalOpen(true)}>New project</Button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl p-5"
              style={{
                backgroundColor: "rgb(var(--surface))",
                border: "1px solid rgb(var(--border))",
              }}
            >
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-16 mb-4" />
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <PageError
          message="Failed to load projects"
          onRetry={() => refetch()}
        />
      )}

      {/* Empty state */}
      {!isLoading && !isError && projects?.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-xl"
          style={{
            backgroundColor: "rgb(var(--surface))",
            border: "1px solid rgb(var(--border))",
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: "rgb(var(--accent-light))" }}
          >
            <svg
              className="w-6 h-6"
              style={{ color: "rgb(var(--accent))" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <p
            className="text-sm font-medium mb-1"
            style={{ color: "rgb(var(--text-primary))" }}
          >
            No projects yet
          </p>
          <p
            className="text-sm mb-4"
            style={{ color: "rgb(var(--text-secondary))" }}
          >
            {user?.is_manager
              ? "Create your first project to get started"
              : "Ask your manager to invite you to a project"}
          </p>
          {user?.is_manager && (
            <Button size="sm" onClick={() => setModalOpen(true)}>
              Create project
            </Button>
          )}
        </div>
      )}

      {/* Projects grid */}
      {!isLoading && !isError && projects && projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => navigate(`/project/${project.id}`)}
            />
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        title="Create project"
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Project name"
            placeholder="FlowBoard"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Project key"
            placeholder="FLOW"
            hint="Unique identifier used in issue keys e.g. FLOW-1"
            error={errors.key?.message}
            {...register("key")}
          />

          <div className="flex flex-col gap-1.5">
            <label
              className="text-sm font-medium"
              style={{ color: "rgb(var(--text-primary))" }}
            >
              Project type
            </label>
            <div className="flex gap-3">
              {(["scrum", "kanban"] as const).map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    value={type}
                    {...register("type")}
                    className="accent-blue-600"
                  />
                  <span
                    className="text-sm capitalize"
                    style={{ color: "rgb(var(--text-primary))" }}
                  >
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleModalClose}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isPending}>
              Create project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className="rounded-xl p-5 cursor-pointer transition-shadow hover:shadow-md"
      style={{
        backgroundColor: "rgb(var(--surface))",
        border: "1px solid rgb(var(--border))",
      }}
    >
      {/* Project key badge */}
      <div className="flex items-start justify-between mb-3">
        <span
          className="text-xs font-bold px-2 py-1 rounded-md"
          style={{
            backgroundColor: "rgb(var(--accent-light))",
            color: "rgb(var(--accent))",
          }}
        >
          {project.key}
        </span>
        <span
          className="text-xs px-2 py-1 rounded-full capitalize"
          style={{
            backgroundColor: "rgb(var(--surface-alt))",
            color: "rgb(var(--text-secondary))",
          }}
        >
          {project.type}
        </span>
      </div>

      {/* Name */}
      <h3
        className="text-sm font-semibold mb-1 truncate"
        style={{ color: "rgb(var(--text-primary))" }}
      >
        {project.name}
      </h3>

      {/* Role */}
      <p
        className="text-xs mb-4 capitalize"
        style={{ color: "rgb(var(--text-secondary))" }}
      >
        {project.role}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {project.owner && (
          <div className="flex items-center gap-1.5">
            <Avatar
              name={project.owner.name}
              handle={project.owner.user_handle}
              size="sm"
            />
            <span
              className="text-xs"
              style={{ color: "rgb(var(--text-tertiary))" }}
            >
              {project.owner.name}
            </span>
          </div>
        )}
        <span
          className="text-xs"
          style={{ color: "rgb(var(--text-tertiary))" }}
        >
          {formatDistanceToNow(new Date(project.created_at), {
            addSuffix: true,
          })}
        </span>
      </div>
    </div>
  );
}
