import { makeApiCall } from "./makeApiCall";
import { ENDPOINTS } from "./endpoints";
import type { Sprint } from "../types";

export const sprintsApi = {
  getAll: (projectId: string) =>
    makeApiCall<Sprint[]>({
      method: "GET",
      url: ENDPOINTS.sprints.getAll(projectId),
      unwrap: "sprints",
    }),

  create: (
    projectId: string,
    payload: {
      name: string;
      goal?: string;
      startDate?: string;
      endDate?: string;
    }
  ) =>
    makeApiCall<Sprint>({
      method: "POST",
      url: ENDPOINTS.sprints.create(projectId),
      body: payload,
      unwrap: "sprint",
    }),

  start: (projectId: string, sprintId: string) =>
    makeApiCall<Sprint>({
      method: "POST",
      url: ENDPOINTS.sprints.start(projectId, sprintId),
      unwrap: "sprint",
    }),

  close: (projectId: string, sprintId: string) =>
    makeApiCall<Sprint>({
      method: "POST",
      url: ENDPOINTS.sprints.close(projectId, sprintId),
      unwrap: "sprint",
    }),
};
