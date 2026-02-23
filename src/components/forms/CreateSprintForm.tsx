import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateSprint } from "../../hooks/useSprints";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

const schema = z
  .object({
    name: z.string().min(2, "Sprint name is required").max(50),
    goal: z.string().max(200).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) > new Date(data.startDate);
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

type FormValues = z.infer<typeof schema>;

interface CreateSprintFormProps {
  projectId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateSprintForm({
  projectId,
  onSuccess,
  onCancel,
}: CreateSprintFormProps) {
  const { mutate: createSprint, isPending } = useCreateSprint(projectId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (values: FormValues) => {
    createSprint(
      {
        name: values.name,
        goal: values.goal,
        startDate: values.startDate,
        endDate: values.endDate,
      },
      { onSuccess }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Sprint name"
        placeholder="Sprint 1"
        error={errors.name?.message}
        {...register("name")}
      />

      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-medium"
          style={{ color: "rgb(var(--text-primary))" }}
        >
          Sprint goal
        </label>
        <textarea
          {...register("goal")}
          placeholder="What do you want to achieve in this sprint?"
          rows={2}
          className="px-3 py-2 text-sm rounded-lg resize-none"
          style={{
            backgroundColor: "rgb(var(--surface))",
            color: "rgb(var(--text-primary))",
            border: "1px solid rgb(var(--border))",
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Start date" type="date" {...register("startDate")} />
        <Input
          label="End date"
          type="date"
          error={errors.endDate?.message}
          {...register("endDate")}
        />
      </div>

      <div className="flex gap-3 justify-end pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={isPending}>
          Create sprint
        </Button>
      </div>
    </form>
  );
}
