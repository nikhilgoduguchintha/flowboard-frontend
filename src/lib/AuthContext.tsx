import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "./supabase";
import type { User } from "../types";
import type { Session } from "@supabase/supabase-js";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isLoggedIn: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  isLoggedIn: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const profileFetched = useRef(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[AuthContext] onAuthStateChange", event, !!session);

      setSession(session);
      setLoading(false);

      if (!session) {
        setUser(null);
        profileFetched.current = false;
        return;
      }

      // Prevent duplicate profile fetches across SIGNED_IN + INITIAL_SESSION
      if (profileFetched.current) return;
      profileFetched.current = true;

      supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single()
        .then(({ data: profile }) => setUser(profile ?? null));
    });

    return () => {
      subscription.unsubscribe();
      profileFetched.current = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isLoggedIn: !!session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
