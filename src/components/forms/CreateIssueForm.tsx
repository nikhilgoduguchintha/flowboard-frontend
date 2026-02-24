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
  } = useForm({
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Type */}
      <FormField label="Issue type">
        <FormSelect {...register("type")}>
          <option value="task">🔧 Task</option>
          <option value="story">📖 Story</option>
          <option value="bug">🐛 Bug</option>
          <option value="epic">⚡ Epic</option>
          <option value="subtask">↳ Subtask</option>
        </FormSelect>
      </FormField>

      {/* Title */}
      <Input
        label="Title"
        placeholder="Short, descriptive title"
        error={errors.title?.message}
        {...register("title")}
      />

      {/* Description */}
      <FormField label="Description">
        <textarea
          {...register("description")}
          placeholder="Add more detail..."
          rows={3}
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
        <Button type="submit" loading={isPending}>
          Create issue
        </Button>
      </div>
    </form>
  );
}
