import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ValidationError } from "../api/errors";
import { useAuthContext } from "@/lib/AuthContext";
import { useEffect } from "react";

const schema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name is too long"),

    userHandle: z
      .string()
      .min(3, "Handle must be at least 3 characters")
      .max(20, "Handle must be 20 characters or less")
      .regex(
        /^[a-z0-9_-]+$/,
        "Only lowercase letters, numbers, hyphens and underscores"
      ),

    email: z.string().email("Enter a valid email"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),

    confirmPassword: z.string(),

    isManager: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function Signup() {
  const { signup } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { isManager: false },
  });
  const { isLoggedIn, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isLoggedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoggedIn, loading, navigate]);

  const onSubmit = async (values: FormValues) => {
    try {
      await signup({
        email: values.email,
        password: values.password,
        name: values.name,
        userHandle: values.userHandle,
        isManager: values.isManager,
      });
    } catch (err) {
      if (err instanceof ValidationError) {
        Object.entries(err.fields).forEach(([field, message]) => {
          setError(field as keyof FormValues, { message });
        });
      }
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4 py-8"
      style={{ backgroundColor: "rgb(var(--background))" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl font-bold tracking-tight mb-1"
            style={{ color: "rgb(var(--accent))" }}
          >
            FlowBoard
          </h1>
          <p
            className="text-sm"
            style={{ color: "rgb(var(--text-secondary))" }}
          >
            Create your account
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: "rgb(var(--surface))",
            border: "1px solid rgb(var(--border))",
          }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Input
              label="Full name"
              type="text"
              placeholder="Nikhil Goduguchintha"
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="Username"
              type="text"
              placeholder="nikhilg"
              hint="Letters, numbers, hyphens and underscores only"
              error={errors.userHandle?.message}
              leftIcon={<span className="text-xs">@</span>}
              {...register("userHandle")}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              hint="Min 8 characters, one uppercase, one number"
              error={errors.password?.message}
              {...register("password")}
            />

            <Input
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            {/* Manager toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded accent-blue-600"
                {...register("isManager")}
              />
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "rgb(var(--text-primary))" }}
                >
                  I am a project manager
                </p>
                <p
                  className="text-xs"
                  style={{ color: "rgb(var(--text-tertiary))" }}
                >
                  Managers can create and manage projects
                </p>
              </div>
            </label>

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full mt-2"
            >
              Create account
            </Button>
          </form>
        </div>

        {/* Login link */}
        <p
          className="text-center text-sm mt-4"
          style={{ color: "rgb(var(--text-secondary))" }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium hover:underline"
            style={{ color: "rgb(var(--accent))" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
