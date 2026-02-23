import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { authApi } from "../api/auth.api";
import { useToast } from "./useToast";
import type { User, Session } from "../types";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  const navigate = useNavigate();
  const toast = useToast();

  // ── Load session on mount ─────────────────────────────────────────────────
  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Fetch our users table profile
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setState({
          user: profile ?? null,
          session: session as unknown as Session,
          loading: false,
        });
      } else {
        setState({ user: null, session: null, loading: false });
      }
    };

    loadSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setState({
          user: profile ?? null,
          session: session as unknown as Session,
          loading: false,
        });
      }

      if (event === "SIGNED_OUT") {
        setState({ user: null, session: null, loading: false });
      }

      if (event === "TOKEN_REFRESHED" && session) {
        setState((prev) => ({
          ...prev,
          session: session as unknown as Session,
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────

  const login = async (email: string, password: string) => {
    try {
      console.log("[login] 1. Calling backend");
      const { session } = await authApi.login({ email, password });
      console.log(
        "[login] 2. Got session from backend",
        session.access_token.slice(0, 20)
      );

      console.log("[login] 3. Calling setSession");
      const { data, error } = await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });
      console.log("[login] 4. setSession result", { data, error });

      console.log("[login] 5. Calling navigate");
      navigate("/dashboard");
      console.log("[login] 6. Navigate called");
    } catch (err) {
      console.error("[login] ERROR", err);
      toast.error(err instanceof Error ? err.message : "Login failed");
      throw err;
    }
  };
  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await authApi.logout();
      await supabase.auth.signOut();
      navigate("/login");
    } catch {
      // Force logout even if API call fails
      await supabase.auth.signOut();
      navigate("/login");
    }
  };

  // ── Signup ────────────────────────────────────────────────────────────────
  const signup = async (payload: {
    email: string;
    password: string;
    name: string;
    userHandle: string;
    isManager?: boolean;
  }) => {
    try {
      await authApi.signup(payload);
      toast.success("Account created! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Signup failed");
      throw err;
    }
  };

  return {
    user: state.user,
    session: state.session,
    loading: state.loading,
    isLoggedIn: !!state.session,
    login,
    logout,
    signup,
  };
}
