import axios from "axios";
import axiosRetry from "axios-retry";
import { supabase } from "../lib/supabase";
import { createApiError, NetworkError, AuthError } from "./errors";

// ─── Axios Instance ───────────────────────────────────────────────────────────

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL as string,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Retry Config ─────────────────────────────────────────────────────────────

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // Only retry network errors or 5xx — never retry 4xx
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      (error.response?.status ?? 0) >= 500
    );
  },
});

// ─── Request Interceptor — Attach Token ──────────────────────────────────────

axiosInstance.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log(
    "[interceptor] token exists:",
    !!session?.access_token,
    config.url
  );

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// ─── Response Interceptor — Handle 401 ───────────────────────────────────────

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Skip refresh logic entirely for auth routes
    const isAuthRoute = originalRequest.url?.includes("/auth/");
    if (isAuthRoute) {
      return Promise.reject(error);
    }

    // Token expired — try refresh once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { data, error: refreshError } =
        await supabase.auth.refreshSession();

      if (refreshError || !data.session) {
        // Refresh failed — sign out and redirect
        await supabase.auth.signOut();
        window.location.href = "/login";
        return Promise.reject(new AuthError());
      }

      // Retry with new token
      originalRequest.headers.Authorization = `Bearer ${data.session.access_token}`;
      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);

// ─── makeApiCall ──────────────────────────────────────────────────────────────

interface ApiCallConfig {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  url: string;
  body?: unknown;
  params?: Record<string, unknown>;
  unwrap?: string | string[];
}

export async function makeApiCall<T>({
  method,
  url,
  body,
  params,
  unwrap,
}: ApiCallConfig): Promise<T> {
  console.log("[makeApiCall]", method, url);
  try {
    const response = await axiosInstance.request({
      method,
      url,
      data: body,
      params,
    });
    console.log("[makeApiCall] response", url, response.status, response.data);

    // Unwrap specific field if requested
    if (unwrap) {
      if (Array.isArray(unwrap)) {
        // Return object with all requested keys
        return unwrap.reduce((acc, key) => {
          acc[key] = response.data[key];
          return acc;
        }, {} as Record<string, unknown>) as T;
      }
      return response.data[unwrap] as T;
    }

    return response.data as T;
  } catch (error) {
    // No response — network error
    if (!axios.isAxiosError(error) || !error.response) {
      throw new NetworkError();
    }

    const status = error.response.status;
    const message =
      error.response.data?.error ?? "An unexpected error occurred";
    const fields = error.response.data?.fields;

    throw createApiError(status, message, fields);
  }
}
