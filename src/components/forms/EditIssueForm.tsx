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

// ─── Reusable field wrapper ───────────────────────────────────────────────────
function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs font-semibold uppercase tracking-wide"
        style={{ color: "rgb(var(--text-tertiary))" }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs" style={{ color: "rgb(var(--error))" }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Reusable select ─────────────────────────────────────────────────────────
function FormSelect({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full px-3 py-2 text-sm rounded-lg transition-colors focus:outline-2"
      style={{
        backgroundColor: "rgb(var(--surface-alt))",
        color: "rgb(var(--text-primary))",
        border: "1px solid rgb(var(--border))",
      }}
    >
      {children}
    </select>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div
        className="flex-1 h-px"
        style={{ backgroundColor: "rgb(var(--border))" }}
      />
      <span
        className="text-xs font-medium"
        style={{ color: "rgb(var(--text-tertiary))" }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-px"
        style={{ backgroundColor: "rgb(var(--border))" }}
      />
    </div>
  );
}

// ─── Form ─────────────────────────────────────────────────────────────────────
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Title */}
      <Input
        label="Title"
        error={errors.title?.message}
        {...register("title")}
      />

      {/* Description */}
      <FormField label="Description">
        <textarea
          {...register("description")}
          rows={4}
          className="w-full px-3 py-2 text-sm rounded-lg resize-none transition-colors focus:outline-2"
          style={{
            backgroundColor: "rgb(var(--surface-alt))",
            color: "rgb(var(--text-primary))",
            border: "1px solid rgb(var(--border))",
          }}
        />
      </FormField>

      <Divider label="Details" />

      {/* Priority + Status */}
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Priority">
          <FormSelect {...register("priority")}>
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🟠 High</option>
            <option value="critical">🔴 Critical</option>
          </FormSelect>
        </FormField>

        <FormField label="Status">
          <FormSelect {...register("status")}>
            <option value="backlog">Backlog</option>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="testing">Testing</option>
            <option value="done">Done</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </FormSelect>
        </FormField>
      </div>

      {/* Assignee */}
      <FormField label="Assignee">
        <FormSelect {...register("assigneeId")}>
          <option value="">Unassigned</option>
          {members?.map((m) => (
            <option key={m.user_id} value={m.user_id}>
              {m.users?.name ?? m.user_id}
            </option>
          ))}
        </FormSelect>
      </FormField>

      {/* Sprint */}
      <FormField label="Sprint">
        <FormSelect {...register("sprintId")}>
          <option value="">Backlog (no sprint)</option>
          {sprints
            ?.filter((s) => s.status !== "closed")
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.status})
              </option>
            ))}
        </FormSelect>
      </FormField>

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
      <div
        className="flex gap-3 justify-end pt-3 mt-1"
        style={{ borderTop: "1px solid rgb(var(--border))" }}
      >
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
