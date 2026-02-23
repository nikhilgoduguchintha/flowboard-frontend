import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { projectsApi } from "../../api/projects.api";
import { useToast } from "../../hooks/useToast";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import type { ProjectType } from "../../types";

const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long"),

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

type FormValues = z.infer<typeof schema>;

interface CreateProjectFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateProjectForm({
  onSuccess,
  onCancel,
}: CreateProjectFormProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();

  const { mutate: createProject, isPending } = useMutation({
    mutationFn: (values: FormValues) =>
      projectsApi.create({
        name: values.name,
        key: values.key,
        type: values.type as ProjectType,
      }),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(`Project "${project.name}" created`);
      onSuccess?.();
      navigate(`/project/${project.id}`);
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to create project"
      );
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: "scrum" },
  });

  // Auto-generate key from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const key = name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6);
    if (key.length >= 2) setValue("key", key);
  };

  return (
    <form
      onSubmit={handleSubmit((values) => createProject(values))}
      className="flex flex-col gap-4"
    >
      <Input
        label="Project name"
        placeholder="FlowBoard"
        error={errors.name?.message}
        {...register("name", { onChange: handleNameChange })}
      />

      <Input
        label="Project key"
        placeholder="FLOW"
        hint="Unique identifier used in issue keys e.g. FLOW-1"
        error={errors.key?.message}
        {...register("key")}
      />

      {/* Project type */}
      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-medium"
          style={{ color: "rgb(var(--text-primary))" }}
        >
          Project type
        </label>

        <div className="grid grid-cols-2 gap-3">
          {(["scrum", "kanban"] as const).map((type) => (
            <label
              key={type}
              className="flex flex-col gap-1 p-3 rounded-lg cursor-pointer transition-colors"
              style={{
                backgroundColor:
                  watch("type") === type
                    ? "rgb(var(--accent-light))"
                    : "rgb(var(--surface-alt))",
                border:
                  watch("type") === type
                    ? "1.5px solid rgb(var(--accent))"
                    : "1.5px solid rgb(var(--border))",
              }}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  value={type}
                  className="accent-blue-600"
                  {...register("type")}
                />
                <span
                  className="text-sm font-medium capitalize"
                  style={{ color: "rgb(var(--text-primary))" }}
                >
                  {type}
                </span>
              </div>
              <p
                className="text-xs pl-5"
                style={{ color: "rgb(var(--text-tertiary))" }}
              >
                {type === "scrum"
                  ? "Sprints, story points, burndown charts"
                  : "Continuous flow, no sprints"}
              </p>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={isPending}>
          Create project
        </Button>
      </div>
    </form>
  );
}
