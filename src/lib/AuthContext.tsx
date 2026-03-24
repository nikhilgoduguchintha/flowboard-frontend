import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "./supabase";
import type { User } from "../types";
import type { Session } from "@supabase/supabase-js";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isLoggedIn: boolean;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  isLoggedIn: false,
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const profileFetched = useRef(false);
  const sessionRef = useRef<Session | null>(null);

  // Expose a way to manually re-fetch the profile (used after onboarding completes)
  const refreshUser = useCallback(async () => {
    const currentSession = sessionRef.current;
    if (!currentSession) return;
    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", currentSession.user.id)
      .single();
    setUser(profile ?? null);
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      sessionRef.current = session;
      setAuthLoading(false);

      if (!session) {
        setUser(null);
        profileFetched.current = false;
        return;
      }

      // Prevent duplicate profile fetches across SIGNED_IN + INITIAL_SESSION
      if (profileFetched.current) return;
      profileFetched.current = true;

      setProfileLoading(true);
      supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single()
        .then(({ data: profile }) => {
          setUser(profile ?? null);
          setProfileLoading(false);
        });
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
        loading: authLoading || profileLoading,
        isLoggedIn: !!session,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
