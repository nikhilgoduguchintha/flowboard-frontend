import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ValidationError } from "../api/errors";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [googleLoading, setGoogleLoading] = useState(false);

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

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    // No need to setGoogleLoading(false) — page will redirect
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
          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            style={{
              backgroundColor: "rgb(var(--surface-alt))",
              color: "rgb(var(--text-primary))",
              border: "1px solid rgb(var(--border))",
            }}
          >
            {/* Google icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {googleLoading ? "Redirecting..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "rgb(var(--border))" }}
            />
            <span
              className="text-xs"
              style={{ color: "rgb(var(--text-tertiary))" }}
            >
              or
            </span>
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "rgb(var(--border))" }}
            />
          </div>

          {/* Email/Password form */}
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
