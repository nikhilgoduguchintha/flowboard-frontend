import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { OfflineBanner } from "./OfflineBanner";

export function AppLayout() {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "rgb(var(--background))" }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Offline banner */}
        <OfflineBanner />

        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "8px",
            fontSize: "14px",
            backgroundColor: "rgb(var(--surface))",
            color: "rgb(var(--text-primary))",
            border: "1px solid rgb(var(--border))",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          },
        }}
      />
    </div>
  );
}
