import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router/v6";
import { queryClient } from "./lib/queryClient";
import { AppRouter } from "./routes/AppRouter";
import { AuthProvider } from "./lib/AuthContext";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <NuqsAdapter>
            <AppRouter />
          </NuqsAdapter>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
