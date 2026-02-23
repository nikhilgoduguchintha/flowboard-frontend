import { makeApiCall } from "./makeApiCall";
import { ENDPOINTS } from "./endpoints";
import type { Project, ProjectType } from "../types";

export const projectsApi = {
  getAll: () =>
    makeApiCall<Project[]>({
      method: "GET",
      url: ENDPOINTS.projects.getAll,
      unwrap: "projects",
    }),

  getOne: (projectId: string) =>
    makeApiCall<Project>({
      method: "GET",
      url: ENDPOINTS.projects.getOne(projectId),
      unwrap: "project",
    }),

  create: (payload: { name: string; key: string; type: ProjectType }) =>
    makeApiCall<Project>({
      method: "POST",
      url: ENDPOINTS.projects.create,
      body: payload,
      unwrap: "project",
    }),

  update: (projectId: string, payload: { name: string }) =>
    makeApiCall<Project>({
      method: "PATCH",
      url: ENDPOINTS.projects.update(projectId),
      body: payload,
      unwrap: "project",
    }),

  archive: (projectId: string) =>
    makeApiCall<{ message: string }>({
      method: "DELETE",
      url: ENDPOINTS.projects.archive(projectId),
    }),
};
