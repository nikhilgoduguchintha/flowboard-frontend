import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import { ActivityItem } from "./ActivityItem";
import { RowSkeleton } from "../../ui/Skeleton";
import { PageError } from "../../ui/PageError";

interface ActivityFeedProps {
  projectId: string;
}

export interface ActivityEvent {
  id: string;
  payload: {
    table_name: string;
    event_type: string;
    record: Record<string, unknown> | null;
    old_record: Record<string, unknown> | null;
  };
  created_at: string;
}

export function ActivityFeed({ projectId }: ActivityFeedProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const {
    data: events,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["activity", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("webhook_events")
        .select("*")
        .not("processed_at", "is", null)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as ActivityEvent[];
    },
    staleTime: 30_000,
    enabled: !!projectId,
  });

  const virtualizer = useVirtualizer({
    count: events?.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 5,
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center px-4 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgb(var(--border))" }}
      >
        <span
          className="text-sm font-medium"
          style={{ color: "rgb(var(--text-primary))" }}
        >
          Activity
        </span>
      </div>

      {/* Content */}
      {isLoading && (
        <div>
          {[1, 2, 3].map((i) => (
            <RowSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <div className="p-4">
          <PageError message="Failed to load activity" onRetry={refetch} />
        </div>
      )}

      {!isLoading && !isError && (events?.length ?? 0) === 0 && (
        <div className="flex items-center justify-center flex-1">
          <p className="text-sm" style={{ color: "rgb(var(--text-tertiary))" }}>
            No activity yet
          </p>
        </div>
      )}

      {/* Virtualised feed */}
      {!isLoading && !isError && (events?.length ?? 0) > 0 && (
        <div ref={parentRef} className="flex-1 overflow-auto">
          <div
            style={{ height: virtualizer.getTotalSize(), position: "relative" }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => (
              <div
                key={virtualRow.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <ActivityItem event={events![virtualRow.index]} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
