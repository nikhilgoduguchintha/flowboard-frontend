import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { ActionRegistry } from "../actions/ActionRegistry";

export function useSSE(projectId: string) {
  const queryClient = useQueryClient();
  const esRef = useRef<EventSource | null>(null);
  const retryCount = useRef(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    if (!projectId) return;
    console.log("[SSE] effect running for projectId:", projectId);

    const connect = async () => {
      if (esRef.current?.readyState === EventSource.OPEN) return;

      console.log("[SSE] connecting...");

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/api/events`);
      url.searchParams.set("token", session.access_token);
      url.searchParams.set("projectId", projectId);

      const es = new EventSource(url.toString());
      esRef.current = es;

      es.onopen = () => {
        console.log("[SSE] Connected");
        retryCount.current = 0;
        queryClient.invalidateQueries({ queryKey: ["layout", projectId] });
      };

      es.addEventListener("update", (e: MessageEvent) => {
        try {
          const { actions } = JSON.parse(e.data) as {
            actions: Array<{ type: string; [key: string]: unknown }>;
          };
          ActionRegistry.execute(actions, projectId);
        } catch (err) {
          console.error("[SSE] Failed to parse update event:", err);
        }
      });

      es.addEventListener("notification", (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          ActionRegistry.execute(
            [{ type: "show_notification", ...data }],
            projectId
          );
        } catch (err) {
          console.error("[SSE] Failed to parse notification event:", err);
        }
      });

      es.onerror = () => {
        es.close();
        retryCount.current++;
        if (retryCount.current < MAX_RETRIES) {
          console.warn(`[SSE] Reconnecting... attempt ${retryCount.current}`);
          setTimeout(connect, 2000 * retryCount.current);
        } else {
          console.warn("[SSE] Max retries reached, giving up");
        }
      };
    };

    connect();

    return () => {
      console.log("[SSE] cleanup for projectId:", projectId);
      esRef.current?.close();
      esRef.current = null;
      retryCount.current = 0;
    };
  }, [projectId, queryClient]); // ← execute removed from deps, using ActionRegistry directly
}
