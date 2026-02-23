import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useActions } from "./useActions";

export function useSSE(projectId: string) {
  const queryClient = useQueryClient();
  const { execute } = useActions();
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const connect = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/api/events`);
      url.searchParams.set("token", session.access_token);
      url.searchParams.set("projectId", projectId);

      const es = new EventSource(url.toString());
      esRef.current = es;

      // Connected — invalidate layout in case we missed events
      es.onopen = () => {
        console.log("[SSE] Connected");
        queryClient.invalidateQueries({ queryKey: ["layout", projectId] });
      };

      // Update event — execute actions from server
      es.addEventListener("update", (e: MessageEvent) => {
        try {
          const { actions } = JSON.parse(e.data) as {
            actions: Array<{ type: string; [key: string]: unknown }>;
          };
          execute(actions, projectId);
        } catch (err) {
          console.error("[SSE] Failed to parse update event:", err);
        }
      });

      // Notification event — handled inside useActions
      es.addEventListener("notification", (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          execute([{ type: "show_notification", ...data }], projectId);
        } catch (err) {
          console.error("[SSE] Failed to parse notification event:", err);
        }
      });

      es.onerror = () => {
        console.warn("[SSE] Connection lost — browser will retry");
      };
    };

    connect();

    return () => {
      esRef.current?.close();
      esRef.current = null;
      console.log("[SSE] Disconnected");
    };
  }, [projectId, queryClient, execute]);
}
