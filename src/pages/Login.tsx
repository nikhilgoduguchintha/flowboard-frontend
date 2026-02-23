import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ValidationError } from "../api/errors";
import { useEffect } from "react";
import { useAuthContext } from "@/lib/AuthContext";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const { isLoggedIn, loading } = useAuthContext();
  useEffect(() => {
    if (!loading && isLoggedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoggedIn, loading, navigate]);

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values.email, values.password);
    } catch (err) {
      if (err instanceof ValidationError) {
        Object.entries(err.fields).forEach(([field, message]) => {
          setError(field as keyof FormValues, { message });
        });
      } else {
        setError("email", { message: "Invalid email or password" });
      }
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4"
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
            Sign in to your account
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
              error={errors.password?.message}
              {...register("password")}
            />

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full mt-2"
            >
              Sign in
            </Button>
          </form>
        </div>

        {/* Signup link */}
        <p
          className="text-center text-sm mt-4"
          style={{ color: "rgb(var(--text-secondary))" }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium hover:underline"
            style={{ color: "rgb(var(--accent))" }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
