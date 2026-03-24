import { queryClient } from "../lib/queryClient";
import toast from "react-hot-toast";
import type { ToastType } from "../types";

// ─── Action Types ─────────────────────────────────────────────────────────────

interface BaseAction {
  type: string;
  [key: string]: unknown;
}

interface InvalidateLayoutAction extends BaseAction {
  type: "invalidate_layout";
}

interface InvalidateIssuesAction extends BaseAction {
  type: "invalidate_issues";
  projectId: string;
}

interface InvalidateCommentsAction extends BaseAction {
  type: "invalidate_comments";
  issueId: string;
}

interface InvalidateActivityAction extends BaseAction {
  type: "invalidate_activity";
  projectId: string;
}

interface MoveCardAction extends BaseAction {
  type: "move_card";
  cardId: string;
  fromColumn: string;
  toColumn: string;
}

interface RemoveCardAction extends BaseAction {
  type: "remove_card";
  cardId: string;
  projectId: string;
}

interface UpdateProgressAction extends BaseAction {
  type: "update_progress";
  sprintId: string;
  projectId: string;
}

interface ShowNotificationAction extends BaseAction {
  type: "show_notification";
  message: string;
  variant: ToastType;
}

interface NotifyMentionsAction extends BaseAction {
  type: "notify_mentions";
  message: string;
  mentions: string[];
  issueId: string;
}

type Action =
  | InvalidateLayoutAction
  | InvalidateIssuesAction
  | InvalidateCommentsAction
  | InvalidateActivityAction
  | MoveCardAction
  | RemoveCardAction
  | UpdateProgressAction
  | ShowNotificationAction
  | NotifyMentionsAction;

// ─── Registry ─────────────────────────────────────────────────────────────────

export const ActionRegistry = {
  execute(actions: BaseAction[], projectId: string): void {
    actions.forEach((action) => {
      try {
        this.handle(action as Action, projectId);
      } catch {
        // silently ignore unhandled actions
      }
    });
  },

  handle(action: Action, projectId: string): void {
    switch (action.type) {
      // ── Layout ──────────────────────────────────────────────────────────────
      case "invalidate_layout": {
        queryClient.invalidateQueries({ queryKey: ["layout", projectId] });
        break;
      }

      // ── Issues ──────────────────────────────────────────────────────────────
      case "invalidate_issues": {
        const pid = action.projectId ?? projectId;
        queryClient.invalidateQueries({ queryKey: ["issues", pid] });
        break;
      }

      case "move_card": {
        queryClient.setQueriesData(
          { queryKey: ["issues", projectId] },
          (old: unknown) => {
            if (!Array.isArray(old)) return old;
            return old.map((issue: { id: string; status: string }) =>
              issue.id === action.cardId
                ? { ...issue, status: action.toColumn }
                : issue
            );
          }
        );
        break;
      }

      case "remove_card": {
        const pid = action.projectId ?? projectId;
        queryClient.setQueriesData(
          { queryKey: ["issues", pid] },
          (old: unknown) => {
            if (!Array.isArray(old)) return old;
            return old.filter(
              (issue: { id: string }) => issue.id !== action.cardId
            );
          }
        );
        break;
      }

      // ── Sprint ──────────────────────────────────────────────────────────────
      case "update_progress": {
        const pid = action.projectId ?? projectId;
        queryClient.invalidateQueries({ queryKey: ["sprints", pid] });
        break;
      }

      // ── Comments ────────────────────────────────────────────────────────────
      case "invalidate_comments": {
        queryClient.invalidateQueries({
          queryKey: ["comments", action.issueId],
        });
        break;
      }

      // ── Activity ─────────────────────────────────────────────────────────────
      case "invalidate_activity": {
        const pid = action.projectId ?? projectId;
        queryClient.invalidateQueries({ queryKey: ["activity", pid] });
        break;
      }

      // ── Notifications ────────────────────────────────────────────────────────
      case "show_notification": {
        const variant = action.variant ?? "info";
        switch (variant) {
          case "success":
            toast.success(action.message);
            break;
          case "error":
            toast.error(action.message);
            break;
          case "loading":
            toast.loading(action.message);
            break;
          default:
            toast(action.message, { icon: "ℹ️" });
            break;
        }
        break;
      }

      case "notify_mentions": {
        toast(action.message, { icon: "🔔" });
        break;
      }

      default:
        break;
    }
  },
};
