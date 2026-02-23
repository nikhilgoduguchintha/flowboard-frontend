import { cn } from "../../lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md", className)}
      style={{ backgroundColor: "rgb(var(--surface-alt))" }}
    />
  );
}

// ─── Preset Skeletons ─────────────────────────────────────────────────────────

export function CardSkeleton() {
  return (
    <div
      className="rounded-lg p-3 space-y-2"
      style={{
        backgroundColor: "rgb(var(--surface))",
        border: "1px solid rgb(var(--border))",
      }}
    >
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
    </div>
  );
}

export function ColumnSkeleton() {
  return (
    <div className="flex flex-col gap-2 w-64">
      <Skeleton className="h-6 w-32 mb-2" />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

export function BoardSkeleton() {
  return (
    <div className="flex gap-4 p-4 overflow-x-auto">
      <ColumnSkeleton />
      <ColumnSkeleton />
      <ColumnSkeleton />
      <ColumnSkeleton />
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3"
      style={{ borderBottom: "1px solid rgb(var(--border))" }}
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-6 w-6 rounded-full" />
    </div>
  );
}
