import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthContext } from "@/lib/AuthContext";
import { authApi } from "@/api/auth.api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ValidationError } from "@/api/errors";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateHandle(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 20);
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  userHandle: z
    .string()
    .min(3, "Handle must be at least 3 characters")
    .max(20, "Handle must be 20 characters or less")
    .regex(
      /^[a-z0-9_-]+$/,
      "Only lowercase letters, numbers, hyphens and underscores"
    ),
});

type FormValues = z.infer<typeof schema>;

// ─── Role Card ────────────────────────────────────────────────────────────────

interface RoleCardProps {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function RoleCard({ selected, onClick, icon, title, description }: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 flex flex-col items-start gap-3 p-4 rounded-xl text-left transition-all duration-150"
      style={{
        backgroundColor: selected
          ? "rgba(var(--accent), 0.08)"
          : "rgb(var(--surface-alt))",
        border: selected
          ? "2px solid rgb(var(--accent))"
          : "2px solid rgb(var(--border))",
        cursor: "pointer",
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
        style={{
          backgroundColor: selected
            ? "rgba(var(--accent), 0.15)"
            : "rgb(var(--surface))",
        }}
      >
        {icon}
      </div>
      <div>
        <p
          className="text-sm font-semibold mb-0.5"
          style={{
            color: selected
              ? "rgb(var(--accent))"
              : "rgb(var(--text-primary))",
          }}
        >
          {title}
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "rgb(var(--text-tertiary))" }}>
          {description}
        </p>
      </div>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function Onboarding() {
  const { session, user, loading, refreshUser } = useAuthContext();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<"member" | "manager" | null>(null);
  const [roleError, setRoleError] = useState("");
  const [avatarError, setAvatarError] = useState(false);

  // Pull identity from Google metadata
  const metadata = session?.user?.user_metadata ?? {};
  const fullName: string = metadata.full_name ?? metadata.name ?? "";
  const firstName = fullName.split(" ")[0] || "there";
  const avatarUrl: string = metadata.avatar_url ?? metadata.picture ?? "";
  const email: string = session?.user?.email ?? "";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      userHandle: generateHandle(fullName),
    },
  });

  // Guard: redirect if no session, or if profile already exists
  useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate("/login", { replace: true });
      return;
    }
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, session, user, navigate]);

  const onSubmit = async (values: FormValues) => {
    if (!selectedRole) {
      setRoleError("Please select a role to continue");
      return;
    }
    setRoleError("");

    try {
      await authApi.completeProfile({
        userHandle: values.userHandle,
        isManager: selectedRole === "manager",
      });
      // Re-fetch the user profile so ProtectedRoute sees the completed profile
      await refreshUser();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err instanceof ValidationError) {
        Object.entries(err.fields).forEach(([field, message]) => {
          setError(field as keyof FormValues, { message });
        });
      }
    }
  };

  // Show nothing while auth is resolving to avoid flash
  if (loading) return null;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: "rgb(var(--background))" }}
    >
      <div className="w-full max-w-md">

        {/* Avatar + welcome */}
        <div className="flex flex-col items-center text-center mb-8">
          {/* Google profile photo */}
          <div className="mb-4 relative">
            {avatarUrl && !avatarError ? (
              <img
                src={avatarUrl}
                alt={fullName}
                onError={() => setAvatarError(true)}
                className="w-20 h-20 rounded-full object-cover"
                style={{ border: "3px solid rgb(var(--border))" }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
                style={{
                  backgroundColor: "rgb(var(--accent))",
                  color: "#fff",
                  border: "3px solid rgb(var(--border))",
                }}
              >
                {firstName.charAt(0).toUpperCase()}
              </div>
            )}
            {/* Flowboard badge on avatar */}
            <div
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: "rgb(var(--accent))", color: "#fff" }}
            >
              F
            </div>
          </div>

          <h1
            className="text-2xl font-bold tracking-tight mb-1"
            style={{ color: "rgb(var(--text-primary))" }}
          >
            Welcome, {firstName}!
          </h1>
          <p className="text-sm" style={{ color: "rgb(var(--text-secondary))" }}>
            Just two things before you get started
          </p>
          {email && (
            <p
              className="text-xs mt-1 px-3 py-1 rounded-full"
              style={{
                color: "rgb(var(--text-tertiary))",
                backgroundColor: "rgb(var(--surface))",
                border: "1px solid rgb(var(--border))",
              }}
            >
              {email}
            </p>
          )}
        </div>

        {/* Card */}
        <div
          className="rounded-xl p-6 flex flex-col gap-6"
          style={{
            backgroundColor: "rgb(var(--surface))",
            border: "1px solid rgb(var(--border))",
          }}
        >
          {/* Handle */}
          <div>
            <Input
              label="Choose your username"
              type="text"
              placeholder="your-handle"
              hint="This is how teammates will find and mention you"
              error={errors.userHandle?.message}
              leftIcon={<span className="text-xs font-medium">@</span>}
              {...register("userHandle")}
            />
          </div>

          {/* Role selection */}
          <div>
            <p
              className="text-sm font-medium mb-3"
              style={{ color: "rgb(var(--text-primary))" }}
            >
              What's your role?
            </p>
            <div className="flex gap-3">
              <RoleCard
                selected={selectedRole === "member"}
                onClick={() => { setSelectedRole("member"); setRoleError(""); }}
                icon="👤"
                title="Developer"
                description="I work on tasks and collaborate with my team"
              />
              <RoleCard
                selected={selectedRole === "manager"}
                onClick={() => { setSelectedRole("manager"); setRoleError(""); }}
                icon="📋"
                title="Project Manager"
                description="I create projects and manage my team's workflow"
              />
            </div>
            {roleError && (
              <p
                className="text-xs mt-2"
                style={{ color: "rgb(var(--error))" }}
              >
                {roleError}
              </p>
            )}
          </div>

          {/* CTA */}
          <Button
            type="button"
            loading={isSubmitting}
            className="w-full"
            onClick={handleSubmit(onSubmit)}
          >
            Get Started →
          </Button>
        </div>
      </div>
    </div>
  );
}
