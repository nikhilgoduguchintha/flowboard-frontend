import { useState } from "react";
import { useMembers, useRemoveMember } from "../hooks/useMembers";
import { useAuth } from "../hooks/useAuth";
import { useProject } from "../hooks/useProject";
import { useArchiveProject } from "../hooks/useProject";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { InviteMemberForm } from "../components/forms/InviteMemberForm";
import { Skeleton } from "../components/ui/Skeleton";

interface SettingsProps {
  projectId: string;
}

export function Settings({ projectId }: SettingsProps) {
  const { user } = useAuth();
  const { data: project } = useProject(projectId);
  const { data: members, isLoading: membersLoading } = useMembers(projectId);
  const { mutate: removeMember } = useRemoveMember(projectId);
  const { mutate: archiveProject } = useArchiveProject(projectId);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);

  const isManager =
    members?.find((m) => m.users?.id === user?.id)?.role === "manager";
  return (
    <div className="max-w-2xl mx-auto px-6 py-6 space-y-8">
      {/* Members */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              className="text-sm font-semibold"
              style={{ color: "rgb(var(--text-primary))" }}
            >
              Members
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: "rgb(var(--text-secondary))" }}
            >
              Manage who has access to this project
            </p>
          </div>
          {isManager && (
            <Button size="sm" onClick={() => setInviteOpen(true)}>
              Invite member
            </Button>
          )}
        </div>

        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid rgb(var(--border))" }}
        >
          {membersLoading && (
            <div
              className="divide-y"
              style={{ borderColor: "rgb(var(--border))" }}
            >
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!membersLoading &&
            members?.map((member, idx) => (
              <div
                key={member.user_id}
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  borderTop:
                    idx === 0 ? "none" : "1px solid rgb(var(--border))",
                }}
              >
                <Avatar
                  name={member.users?.name ?? ""}
                  handle={member.users?.user_handle ?? ""}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "rgb(var(--text-primary))" }}
                  >
                    {member.users?.name}
                    {member.user_id === user?.id && (
                      <span
                        className="ml-1.5 text-xs"
                        style={{ color: "rgb(var(--text-tertiary))" }}
                      >
                        (you)
                      </span>
                    )}
                  </p>
                  <p
                    className="text-xs capitalize"
                    style={{ color: "rgb(var(--text-secondary))" }}
                  >
                    {member.role}
                  </p>
                </div>

                {/* Remove button — managers can remove others, not themselves */}
                {isManager && member.user_id !== user?.id && (
                  <button
                    onClick={() => removeMember(member.user_id)}
                    className="text-xs hover:opacity-70 transition-opacity"
                    style={{ color: "rgb(var(--error))" }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
        </div>
      </section>

      {/* General */}
      {isManager && project && (
        <section>
          <h2
            className="text-sm font-semibold mb-4"
            style={{ color: "rgb(var(--text-primary))" }}
          >
            General
          </h2>
          <div
            className="rounded-xl p-4"
            style={{ border: "1px solid rgb(var(--border))" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "rgb(var(--text-primary))" }}
                >
                  {project.name}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "rgb(var(--text-secondary))" }}
                >
                  {project.key} · {project.type}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Danger zone */}
      {isManager && (
        <section>
          <h2
            className="text-sm font-semibold mb-4"
            style={{ color: "rgb(var(--error))" }}
          >
            Danger zone
          </h2>
          <div
            className="rounded-xl p-4 flex items-center justify-between"
            style={{ border: "1px solid rgb(var(--error))" }}
          >
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: "rgb(var(--text-primary))" }}
              >
                Archive project
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "rgb(var(--text-secondary))" }}
              >
                This will hide the project from your dashboard
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirmArchive(true)}
            >
              Archive
            </Button>
          </div>
        </section>
      )}

      {/* Invite modal */}
      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite member"
        size="sm"
      >
        <InviteMemberForm
          projectId={projectId}
          onSuccess={() => setInviteOpen(false)}
          onCancel={() => setInviteOpen(false)}
        />
      </Modal>

      {/* Archive confirmation modal */}
      <Modal
        open={confirmArchive}
        onClose={() => setConfirmArchive(false)}
        title="Archive project?"
        size="sm"
      >
        <p
          className="text-sm mb-4"
          style={{ color: "rgb(var(--text-secondary))" }}
        >
          This will hide the project from your dashboard. You can contact
          support to restore it.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setConfirmArchive(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              archiveProject();
              setConfirmArchive(false);
            }}
          >
            Archive
          </Button>
        </div>
      </Modal>
    </div>
  );
}
