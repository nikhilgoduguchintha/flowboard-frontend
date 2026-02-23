import { useState } from "react";
import { useSprints, useStartSprint } from "../../../hooks/useSprints";
import { useIssues } from "../../../hooks/useIssues";
import { PlanningIssueRow } from "./PlanningIssueRow";
import { Button } from "../../ui/Button";
import { Modal } from "../../ui/Modal";
import { Input } from "../../ui/Input";
import { Skeleton } from "../../ui/Skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface SprintPlanningProps {
  projectId: string;
}

const sprintSchema = z.object({
  name: z.string().min(2, "Sprint name is required"),
  goal: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type SprintFormValues = z.infer<typeof sprintSchema>;

export function SprintPlanning({ projectId }: SprintPlanningProps) {
  const [createOpen, setCreateOpen] = useState(false);

  const { data: sprints, isLoading: sprintsLoading } = useSprints(projectId);
  const { data: backlog, isLoading: backlogLoading } = useIssues(projectId, {
    sprintId: "",
  });

  const planningSprint = sprints?.find((s) => s.status === "planning");
  const { mutate: startSprint, isPending: starting } =
    useStartSprint(projectId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SprintFormValues>({ resolver: zodResolver(sprintSchema) });

  const isLoading = sprintsLoading || backlogLoading;

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          className="text-sm font-semibold"
          style={{ color: "rgb(var(--text-primary))" }}
        >
          Sprint Planning
        </h2>

        {planningSprint && (
          <Button
            size="sm"
            loading={starting}
            onClick={() => startSprint(planningSprint.id)}
          >
            Start sprint
          </Button>
        )}
      </div>

      {/* Sprint details */}
      {isLoading && <Skeleton className="h-20 rounded-xl" />}

      {!isLoading && planningSprint && (
        <div
          className="rounded-xl p-4"
          style={{
            backgroundColor: "rgb(var(--surface))",
            border: "1px solid rgb(var(--border))",
          }}
        >
          <p
            className="text-sm font-medium mb-1"
            style={{ color: "rgb(var(--text-primary))" }}
          >
            {planningSprint.name}
          </p>
          {planningSprint.goal && (
            <p
              className="text-xs"
              style={{ color: "rgb(var(--text-secondary))" }}
            >
              {planningSprint.goal}
            </p>
          )}
          <p
            className="text-xs mt-2"
            style={{ color: "rgb(var(--text-tertiary))" }}
          >
            {backlog?.filter((i) => i.sprint_id === planningSprint.id).length ??
              0}{" "}
            issues planned
          </p>
        </div>
      )}

      {!isLoading && !planningSprint && (
        <div
          className="flex flex-col items-center justify-center py-8 rounded-xl"
          style={{
            backgroundColor: "rgb(var(--surface))",
            border: "1px solid rgb(var(--border))",
          }}
        >
          <p
            className="text-sm font-medium mb-1"
            style={{ color: "rgb(var(--text-primary))" }}
          >
            No sprint planned
          </p>
          <p
            className="text-sm mb-3"
            style={{ color: "rgb(var(--text-secondary))" }}
          >
            Create a sprint to start planning
          </p>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            Create sprint
          </Button>
        </div>
      )}

      {/* Backlog issues */}
      {backlog && backlog.length > 0 && (
        <div>
          <p
            className="text-xs font-medium mb-2"
            style={{ color: "rgb(var(--text-tertiary))" }}
          >
            Backlog ({backlog.length})
          </p>
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid rgb(var(--border))" }}
          >
            {backlog.slice(0, 10).map((issue) => (
              <PlanningIssueRow
                key={issue.id}
                issue={issue}
                projectId={projectId}
                sprintId={planningSprint?.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Create Sprint Modal */}
      <Modal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          reset();
        }}
        title="Create sprint"
        size="sm"
      >
        <form
          onSubmit={handleSubmit(() => {
            setCreateOpen(false);
            reset();
          })}
          className="flex flex-col gap-4"
        >
          <Input
            label="Sprint name"
            placeholder="Sprint 1"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Goal"
            placeholder="What do you want to achieve?"
            {...register("goal")}
          />
          <Input label="Start date" type="date" {...register("startDate")} />
          <Input label="End date" type="date" {...register("endDate")} />
          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setCreateOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
