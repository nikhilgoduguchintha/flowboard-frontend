import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30 seconds — data considered fresh
      gcTime: 300_000, // 5 minutes — keep in cache after unmount
      retry: 2, // retry failed queries twice
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
      refetchOnWindowFocus: false, // don't refetch on tab switch
      refetchOnReconnect: true, // refetch when back online
    },
    mutations: {
      retry: 0, // never retry mutations — side effects should not be duplicated
    },
  },
});
