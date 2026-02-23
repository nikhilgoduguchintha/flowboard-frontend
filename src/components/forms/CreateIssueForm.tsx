import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateIssue } from "../../hooks/useIssues";
import { useMembers } from "../../hooks/useMembers";
import { useSprints } from "../../hooks/useSprints";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import type { IssueType, IssuePriority } from "../../types";

const schema = z.object({
  type: z.enum(["epic", "story", "task", "bug", "subtask"]),
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().optional(),
  priority: z.enum(["critical", "high", "medium", "low"]),
  status: z.enum([
    "backlog",
    "todo",
    "in_progress",
    "in_review",
    "testing",
    "done",
    "resolved",
    "closed",
  ]),
  assigneeId: z.string().optional(),
  sprintId: z.string().optional(),
  storyPoints: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? undefined : Number(val),
    z.number().min(0).max(100).optional()
  ),
  dueDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CreateIssueFormProps {
  projectId: string;
  sprintId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateIssueForm({
  projectId,
  sprintId,
  onSuccess,
  onCancel,
}: CreateIssueFormProps) {
  const { mutate: createIssue, isPending } = useCreateIssue(projectId);
  const { data: members } = useMembers(projectId);
  const { data: sprints } = useSprints(projectId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "task",
      priority: "medium",
      status: "backlog",
      sprintId: sprintId ?? "",
    },
  });

  const onSubmit = (values: FormValues) => {
    createIssue(
      {
        type: values.type as IssueType,
        title: values.title,
        description: values.description,
        priority: values.priority as IssuePriority,
        assigneeId: values.assigneeId || undefined,
        sprintId: values.sprintId || undefined,
        storyPoints: values.storyPoints,
      },
      { onSuccess }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Type */}
      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-medium"
          style={{ color: "rgb(var(--text-primary))" }}
        >
          Type
        </label>
        <select
          {...register("type")}
          className="px-3 py-2 text-sm rounded-lg"
          style={{
            backgroundColor: "rgb(var(--surface))",
            color: "rgb(var(--text-primary))",
            border: "1px solid rgb(var(--border))",
          }}
        >
          <option value="task">Task</option>
          <option value="story">Story</option>
          <option value="bug">Bug</option>
          <option value="epic">Epic</option>
          <option value="subtask">Subtask</option>
        </select>
      </div>

      {/* Title */}
      <Input
        label="Title"
        placeholder="Short, descriptive title"
        error={errors.title?.message}
        {...register("title")}
      />

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-medium"
          style={{ color: "rgb(var(--text-primary))" }}
        >
          Description
        </label>
        <textarea
          {...register("description")}
          placeholder="Add more detail..."
          rows={3}
          className="px-3 py-2 text-sm rounded-lg resize-none"
          style={{
            backgroundColor: "rgb(var(--surface))",
            color: "rgb(var(--text-primary))",
            border: "1px solid rgb(var(--border))",
          }}
        />
      </div>

      {/* Priority + Status row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label
            className="text-sm font-medium"
            style={{ color: "rgb(var(--text-primary))" }}
          >
            Priority
          </label>
          <select
            {...register("priority")}
            className="px-3 py-2 text-sm rounded-lg"
            style={{
              backgroundColor: "rgb(var(--surface))",
              color: "rgb(var(--text-primary))",
              border: "1px solid rgb(var(--border))",
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            className="text-sm font-medium"
            style={{ color: "rgb(var(--text-primary))" }}
          >
            Status
          </label>
          <select
            {...register("status")}
            className="px-3 py-2 text-sm rounded-lg"
            style={{
              backgroundColor: "rgb(var(--surface))",
              color: "rgb(var(--text-primary))",
              border: "1px solid rgb(var(--border))",
            }}
          >
            <option value="backlog">Backlog</option>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="testing">Testing</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      {/* Assignee */}
      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-medium"
          style={{ color: "rgb(var(--text-primary))" }}
        >
          Assignee
        </label>
        <select
          {...register("assigneeId")}
          className="px-3 py-2 text-sm rounded-lg"
          style={{
            backgroundColor: "rgb(var(--surface))",
            color: "rgb(var(--text-primary))",
            border: "1px solid rgb(var(--border))",
          }}
        >
          <option value="">Unassigned</option>
          {members?.map((m) => (
            <option key={m.user_id} value={m.user_id}>
              {m.user?.name ?? m.user_id}
            </option>
          ))}
        </select>
      </div>

      {/* Sprint */}
      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-medium"
          style={{ color: "rgb(var(--text-primary))" }}
        >
          Sprint
        </label>
        <select
          {...register("sprintId")}
          className="px-3 py-2 text-sm rounded-lg"
          style={{
            backgroundColor: "rgb(var(--surface))",
            color: "rgb(var(--text-primary))",
            border: "1px solid rgb(var(--border))",
          }}
        >
          <option value="">Backlog</option>
          {sprints
            ?.filter((s) => s.status !== "closed")
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.status})
              </option>
            ))}
        </select>
      </div>

      {/* Story points + Due date row */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Story points"
          type="number"
          placeholder="0"
          error={errors.storyPoints?.message}
          {...register("storyPoints")}
        />
        <Input label="Due date" type="date" {...register("dueDate")} />
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={isPending}>
          Create issue
        </Button>
      </div>
    </form>
  );
}
