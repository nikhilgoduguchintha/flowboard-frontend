import { makeApiCall } from "./makeApiCall";
import { ENDPOINTS } from "./endpoints";
import type { Member, MemberRole } from "../types";

export const membersApi = {
  getAll: (projectId: string) =>
    makeApiCall<Member[]>({
      method: "GET",
      url: ENDPOINTS.members.getAll(projectId),
      unwrap: "members",
    }),

  invite: (
    projectId: string,
    payload: {
      email: string;
      role: MemberRole;
    }
  ) =>
    makeApiCall<Member>({
      method: "POST",
      url: ENDPOINTS.members.invite(projectId),
      body: payload,
      unwrap: "member",
    }),

  remove: (projectId: string, userId: string) =>
    makeApiCall<{ message: string }>({
      method: "DELETE",
      url: ENDPOINTS.members.remove(projectId, userId),
    }),
};
