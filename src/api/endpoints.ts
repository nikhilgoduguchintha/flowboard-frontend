const BASE = "/api";

export const ENDPOINTS = {
  auth: {
    signup: `${BASE}/auth/signup`,
    login: `${BASE}/auth/login`,
    logout: `${BASE}/auth/logout`,
  },

  projects: {
    getAll: `${BASE}/projects`,
    getOne: (projectId: string) => `${BASE}/projects/${projectId}`,
    create: `${BASE}/projects`,
    update: (projectId: string) => `${BASE}/projects/${projectId}`,
    archive: (projectId: string) => `${BASE}/projects/${projectId}`,
  },

  members: {
    getAll: (projectId: string) => `${BASE}/projects/${projectId}/members`,
    invite: (projectId: string) => `${BASE}/projects/${projectId}/members`,
    remove: (projectId: string, userId: string) =>
      `${BASE}/projects/${projectId}/members/${userId}`,
  },

  sprints: {
    getAll: (projectId: string) => `${BASE}/projects/${projectId}/sprints`,
    create: (projectId: string) => `${BASE}/projects/${projectId}/sprints`,
    start: (projectId: string, sprintId: string) =>
      `${BASE}/projects/${projectId}/sprints/${sprintId}/start`,
    close: (projectId: string, sprintId: string) =>
      `${BASE}/projects/${projectId}/sprints/${sprintId}/close`,
  },

  issues: {
    getAll: (projectId: string) => `${BASE}/projects/${projectId}/issues`,
    getOne: (issueId: string) => `${BASE}/issues/${issueId}`,
    create: (projectId: string) => `${BASE}/projects/${projectId}/issues`,
    update: (issueId: string) => `${BASE}/issues/${issueId}`,
    updateStatus: (issueId: string) => `${BASE}/issues/${issueId}/status`,
    delete: (issueId: string) => `${BASE}/issues/${issueId}`,
  },

  comments: {
    getAll: (issueId: string) => `${BASE}/issues/${issueId}/comments`,
    create: (issueId: string) => `${BASE}/issues/${issueId}/comments`,
    delete: (commentId: string) => `${BASE}/comments/${commentId}`,
  },

  layout: {
    get: `${BASE}/layout`,
    clearCache: `${BASE}/layout/cache`,
  },

  search: {
    query: (projectId: string) => `${BASE}/projects/${projectId}/search`,
  },

  events: {
    connect: `${BASE}/events`,
  },
} as const;
