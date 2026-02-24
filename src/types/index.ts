// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  user_handle: string;
  email: string;
  name: string;
  avatar_seed: string;
  is_manager: boolean;
  created_at: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expires_in: number;
  token_type: string;
  user: User;
}

// ─── Project ──────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  key: string;
  type: ProjectType;
  owner_id: string;
  is_archived: boolean;
  created_at: string;
  owner?: Pick<User, "id" | "name" | "user_handle">;
  role?: MemberRole; // attached when fetched as member
  joined_at?: string;
}

export type ProjectType = "scrum" | "kanban";

// ─── Member ───────────────────────────────────────────────────────────────────

export interface Member {
  id: string;
  project_id: string;
  user_id: string;
  role: MemberRole;
  joined_at: string;
  users: {
    id: string;
    name: string;
    user_handle: string;
    avatar_seed: string;
  } | null;
}

export type MemberRole = "manager" | "developer";

// ─── Sprint ───────────────────────────────────────────────────────────────────

export interface Sprint {
  id: string;
  project_id: string;
  name: string;
  goal: string | null;
  status: SprintStatus;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

export type SprintStatus = "planning" | "active" | "closed";

// ─── Issue ────────────────────────────────────────────────────────────────────

export interface Issue {
  id: string;
  issue_number: number;
  project_id: string;
  sprint_id: string | null;
  parent_id: string | null;
  type: IssueType;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  assignee_id: string | null;
  reporter_id: string;
  story_points: number | null;
  due_date: string | null;
  type_fields: Record<string, unknown>;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  assignee?: Pick<User, "id" | "name" | "user_handle" | "avatar_seed">;
  reporter?: Pick<User, "id" | "name" | "user_handle" | "avatar_seed">;
  parent?: Pick<Issue, "id" | "title" | "type">;
}

export type IssueType = "epic" | "story" | "task" | "bug" | "subtask";

export type IssueStatus =
  | "backlog"
  | "todo"
  | "in_progress"
  | "in_review"
  | "testing"
  | "done"
  | "resolved"
  | "closed";

export type IssuePriority = "critical" | "high" | "medium" | "low";

// ─── Comment ──────────────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  issue_id: string;
  author_id: string;
  content: string;
  mentions: string[];
  created_at: string;
  users: {
    id: string;
    name: string;
    user_handle: string;
    avatar_seed: string;
  } | null;
}

// ─── SDUI ─────────────────────────────────────────────────────────────────────

export interface ResolvedSection {
  id: string;
  sectionKey: string;
  type: string;
  props: Record<string, unknown>;
}

export interface Layout {
  layout: ResolvedSection[];
  fromCache: boolean;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export interface Action {
  type: string;
  [key: string]: unknown;
}

export interface MoveCardAction extends Action {
  type: "move_card";
  cardId: string;
  fromColumn: string;
  toColumn: string;
}

export interface UpdateProgressAction extends Action {
  type: "update_progress";
  sprintId: string;
}

export interface ShowNotificationAction extends Action {
  type: "show_notification";
  message: string;
  variant: "success" | "error" | "info" | "warning";
}

export interface InvalidateLayoutAction extends Action {
  type: "invalidate_layout";
  userId?: string;
}

export interface InvalidateIssuesAction extends Action {
  type: "invalidate_issues";
  projectId: string;
}

export interface InvalidateCommentsAction extends Action {
  type: "invalidate_comments";
  issueId: string;
}

export interface RemoveCardAction extends Action {
  type: "remove_card";
  cardId: string;
  projectId: string;
}

export interface NotifyMentionsAction extends Action {
  type: "notify_mentions";
  mentions: string[];
  issueId: string;
  message: string;
}

export type KnownAction =
  | MoveCardAction
  | UpdateProgressAction
  | ShowNotificationAction
  | InvalidateLayoutAction
  | InvalidateIssuesAction
  | InvalidateCommentsAction
  | RemoveCardAction
  | NotifyMentionsAction;

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  error: null;
}

export interface ApiError {
  data: null;
  error: string;
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface IssueFilters {
  view?: "board" | "backlog" | "settings";
  sprintId?: string;
  issueId?: string;
  type?: IssueType;
  assignee?: string;
  priority?: IssuePriority;
  search?: string;
}

// ─── UI ───────────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "info" | "warning" | "loading";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive"
  | "outline";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "purple";

export type AvatarSize = "sm" | "md" | "lg";
