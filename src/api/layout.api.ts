import { makeApiCall } from "./makeApiCall";
import { ENDPOINTS } from "./endpoints";
import type { ResolvedSection } from "../types";

export const layoutApi = {
  get: (projectId: string) =>
    makeApiCall<{ layout: ResolvedSection[]; fromCache: boolean }>({
      method: "GET",
      url: ENDPOINTS.layout.get,
      params: { projectId },
    }),

  clearCache: (projectId: string) =>
    makeApiCall<{ message: string }>({
      method: "DELETE",
      url: ENDPOINTS.layout.clearCache,
      params: { projectId },
    }),
};
