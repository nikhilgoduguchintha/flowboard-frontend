import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useInviteMember } from "../../hooks/useMembers";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import type { MemberRole } from "../../types";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  role: z.enum(["manager", "developer"]),
});

type FormValues = z.infer<typeof schema>;

interface InviteMemberFormProps {
  projectId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function InviteMemberForm({
  projectId,
  onSuccess,
  onCancel,
}: InviteMemberFormProps) {
  const { mutate: inviteMember, isPending } = useInviteMember(projectId);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "developer" },
  });

  const onSubmit = (values: FormValues) => {
    inviteMember(
      { email: values.email, role: values.role as MemberRole },
      {
        onSuccess,
        onError: (err) => {
          setError("email", {
            message:
              err instanceof Error ? err.message : "Failed to invite member",
          });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Email address"
        type="email"
        placeholder="teammate@example.com"
        hint="They must already have a FlowBoard account"
        error={errors.email?.message}
        {...register("email")}
      />

      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-medium"
          style={{ color: "rgb(var(--text-primary))" }}
        >
          Role
        </label>
        <div className="flex gap-4">
          {(["developer", "manager"] as const).map((role) => (
            <label
              key={role}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                value={role}
                className="accent-blue-600"
                {...register("role")}
              />
              <div>
                <p
                  className="text-sm font-medium capitalize"
                  style={{ color: "rgb(var(--text-primary))" }}
                >
                  {role}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "rgb(var(--text-tertiary))" }}
                >
                  {role === "manager"
                    ? "Can manage sprints and members"
                    : "Can create and update issues"}
                </p>
              </div>
            </label>
          ))}
        </div>
        {errors.role && (
          <p className="text-xs" style={{ color: "rgb(var(--error))" }}>
            {errors.role.message}
          </p>
        )}
      </div>

      <div className="flex gap-3 justify-end pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={isPending}>
          Send invite
        </Button>
      </div>
    </form>
  );
}
