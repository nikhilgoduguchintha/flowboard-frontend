import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { authApi } from "../api/auth.api";
import { useToast } from "./useToast";
import { AuthContext } from "../lib/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const login = async (email: string, password: string) => {
    try {
      const { session } = await authApi.login({ email, password });
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });
      navigate("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    } finally {
      queryClient.clear();
      await supabase.auth.setSession({ access_token: "", refresh_token: "" });
      navigate("/login");
    }
  };

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
    ...context,
    login,
    logout,
    signup,
  };
}
