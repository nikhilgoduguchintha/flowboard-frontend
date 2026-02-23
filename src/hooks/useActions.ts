import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "./useToast";
import type { ToastType } from "../types";

export function useActions() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const execute = useCallback(
    (
      actions: Array<{ type: string; [key: string]: unknown }>,
      projectId: string
    ) => {
      actions.forEach((action) => {
        switch (action.type) {
          // ── Layout ──────────────────────────────────────────────────────
          case "invalidate_layout":
            queryClient.invalidateQueries({ queryKey: ["layout", projectId] });
            break;

          // ── Issues ──────────────────────────────────────────────────────
          case "invalidate_issues":
            queryClient.invalidateQueries({ queryKey: ["issues", projectId] });
            break;

          case "move_card": {
            // Optimistically move card in cache
            const { cardId, toColumn } = action as unknown as {
              cardId: string;
              toColumn: string;
              fromColumn: string;
            };
            queryClient.setQueriesData(
              { queryKey: ["issues", projectId] },
              (old: unknown) => {
                if (!Array.isArray(old)) return old;
                return old.map((issue: { id: string; status: string }) =>
                  issue.id === cardId ? { ...issue, status: toColumn } : issue
                );
              }
            );
            break;
          }

          case "remove_card": {
            const { cardId } = action as unknown as { cardId: string };
            queryClient.setQueriesData(
              { queryKey: ["issues", projectId] },
              (old: unknown) => {
                if (!Array.isArray(old)) return old;
                return old.filter(
                  (issue: { id: string }) => issue.id !== cardId
                );
              }
            );
            break;
          }

          // ── Sprint ──────────────────────────────────────────────────────
          case "update_progress":
            queryClient.invalidateQueries({ queryKey: ["sprints", projectId] });
            break;

          // ── Comments ────────────────────────────────────────────────────
          case "invalidate_comments": {
            const { issueId } = action as unknown as { issueId: string };
            queryClient.invalidateQueries({ queryKey: ["comments", issueId] });
            break;
          }

          // ── Notifications ────────────────────────────────────────────────
          case "show_notification": {
            const { message, variant } = action as unknown as {
              message: string;
              variant: ToastType;
            };
            toast.show({ type: variant ?? "info", message });
            break;
          }

          case "notify_mentions": {
            const { message } = action as unknown as { message: string };
            toast.info(message);
            break;
          }

          default:
            console.warn("[ActionRegistry] Unknown action type:", action.type);
        }
      });
    },
    [queryClient, toast]
  );

  return { execute };
}
