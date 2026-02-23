import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdateIssue } from "../../hooks/useIssues";
import { useMembers } from "../../hooks/useMembers";
import { useSprints } from "../../hooks/useSprints";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import type { Issue, IssueStatus, IssuePriority } from "../../types";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().nullable().optional(),
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
  assigneeId: z.string().nullable().optional(),
  sprintId: z.string().nullable().optional(),
  storyPoints: z.coerce.number().min(0).max(100).nullable().optional(),
  dueDate: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof schema>;

interface EditIssueFormProps {
  issue: Issue;
  projectId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditIssueForm({
  issue,
  projectId,
  onSuccess,
  onCancel,
}: EditIssueFormProps) {
  const { mutate: updateIssue, isPending } = useUpdateIssue(projectId);
  const { data: members } = useMembers(projectId);
  const { data: sprints } = useSprints(projectId);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: issue.title,
      description: issue.description,
      priority: issue.priority,
      status: issue.status,
      assigneeId: issue.assignee_id,
      sprintId: issue.sprint_id,
      storyPoints: issue.story_points,
      dueDate: issue.due_date ?? "",
    },
  });

  const onSubmit = (values: FormValues) => {
    updateIssue(
      {
        issueId: issue.id,
        payload: {
          title: values.title,
          description: values.description ?? null,
          priority: values.priority as IssuePriority,
          status: values.status as IssueStatus,
          assigneeId: values.assigneeId ?? null,
          sprintId: values.sprintId ?? null,
          storyPoints: values.storyPoints ?? null,
          dueDate: values.dueDate ?? null,
        },
      },
      { onSuccess }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Title */}
      <Input
        label="Title"
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
          rows={4}
          className="px-3 py-2 text-sm rounded-lg resize-none"
          style={{
            backgroundColor: "rgb(var(--surface))",
            color: "rgb(var(--text-primary))",
            border: "1px solid rgb(var(--border))",
          }}
        />
      </div>

      {/* Priority + Status */}
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
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
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

      {/* Story points + Due date */}
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
        <Button type="submit" loading={isPending} disabled={!isDirty}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
