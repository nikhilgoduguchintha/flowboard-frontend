import { useOnlineStatus } from "../../hooks/useOnlineStatus";

export function OfflineBanner() {
  const { isOnline } = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium"
      style={{
        backgroundColor: "#FEF3C7",
        color: "#92400E",
        borderBottom: "1px solid #FDE68A",
      }}
    >
      <svg
        className="w-4 h-4 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        />
      </svg>
      You are offline — changes will resume when your connection is restored
    </div>
  );
}
