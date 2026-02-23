import { makeApiCall } from "./makeApiCall";
import { ENDPOINTS } from "./endpoints";
import type { User, Session } from "../types";

export const authApi = {
  signup: (payload: {
    email: string;
    password: string;
    name: string;
    userHandle: string;
    isManager?: boolean;
  }) =>
    makeApiCall<{ user: User }>({
      method: "POST",
      url: ENDPOINTS.auth.signup,
      body: payload,
    }),

  login: (payload: { email: string; password: string }) =>
    makeApiCall<{ session: Session; user: User }>({
      method: "POST",
      url: ENDPOINTS.auth.login,
      body: payload,
    }),

  logout: () =>
    makeApiCall<{ message: string }>({
      method: "POST",
      url: ENDPOINTS.auth.logout,
    }),
};
