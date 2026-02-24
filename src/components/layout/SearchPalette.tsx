import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { issuesApi } from "../../api/issues.api";
import { useIssueFilters } from "../../hooks/useIssueFilters";
import { useParams } from "react-router-dom";
import type { Issue } from "../../types";
import { useDebounce } from "../../hooks/useDebounce";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  backlog: {
    bg: "rgb(var(--surface-alt))",
    color: "rgb(var(--text-tertiary))",
    label: "Backlog",
  },
  todo: {
    bg: "rgb(var(--surface-alt))",
    color: "rgb(var(--text-secondary))",
    label: "Todo",
  },
  in_progress: { bg: "#DBEAFE", color: "#1D4ED8", label: "In Progress" },
  in_review: { bg: "#EDE9FE", color: "#6D28D9", label: "In Review" },
  testing: { bg: "#FEF3C7", color: "#B45309", label: "Testing" },
  done: { bg: "#D1FAE5", color: "#065F46", label: "Done" },
  resolved: { bg: "#D1FAE5", color: "#065F46", label: "Resolved" },
  closed: {
    bg: "rgb(var(--surface-alt))",
    color: "rgb(var(--text-tertiary))",
    label: "Closed",
  },
};

// ─── Result item ──────────────────────────────────────────────────────────────

function SearchResult({
  issue,
  isActive,
  onClick,
}: {
  issue: Issue;
  isActive: boolean;
  onClick: () => void;
}) {
  const status = STATUS_COLORS[issue.status] ?? STATUS_COLORS.backlog;
  const assigneeName = issue.assignee?.name ?? null;

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
      style={{
        backgroundColor: isActive ? "rgb(var(--accent-light))" : "transparent",
        borderLeft: isActive
          ? "2px solid rgb(var(--accent))"
          : "2px solid transparent",
      }}
    >
      {/* Issue key */}
      <span
        className="text-xs font-mono font-medium flex-shrink-0 w-16 truncate"
        style={{ color: "rgb(var(--text-tertiary))" }}
      >
        {issue.project_id?.slice(0, 4).toUpperCase()}-{issue.issue_number}
      </span>

      {/* Title */}
      <span
        className="flex-1 text-sm truncate"
        style={{ color: "rgb(var(--text-primary))" }}
      >
        {issue.title}
      </span>

      {/* Assignee */}
      {assigneeName && (
        <span
          className="text-xs flex-shrink-0 hidden sm:block"
          style={{ color: "rgb(var(--text-tertiary))" }}
        >
          {assigneeName}
        </span>
      )}

      {/* Status badge */}
      <span
        className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: status.bg, color: status.color }}
      >
        {status.label}
      </span>
    </div>
  );
}

// ─── Main palette ─────────────────────────────────────────────────────────────

interface SearchPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function SearchPalette({ open, onClose }: SearchPaletteProps) {
  const { projectId } = useParams();
  const { setIssueId } = useIssueFilters();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 800);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  // Search query — debounced via staleTime
  const { data: results, isFetching } = useQuery({
    queryKey: ["search", projectId, debouncedQuery],
    queryFn: () => issuesApi.search(projectId!, debouncedQuery),
    enabled: !!projectId && debouncedQuery.trim().length >= 2,
    staleTime: 30_000, // consider fresh for 30 seconds
    gcTime: 2 * 60 * 1000, // remove from cache after 2 minutes
  });

  const issues = results ?? [];

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [issues.length]);

  const handleSelect = useCallback(
    (issue: Issue) => {
      setIssueId(issue.id);
      onClose();
    },
    [setIssueId, onClose]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, issues.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && issues[activeIndex]) {
        handleSelect(issues[activeIndex]);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, issues, activeIndex, handleSelect, onClose]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.children[activeIndex] as HTMLElement;
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Palette */}
      <div
        className="relative w-full max-w-xl mx-4 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: "rgb(var(--surface))",
          border: "1px solid rgb(var(--border))",
        }}
      >
        {/* Search input */}
        <div
          className="flex items-center gap-3 px-4 py-3.5"
          style={{ borderBottom: "1px solid rgb(var(--border))" }}
        >
          {/* Search icon */}
          <svg
            className="w-4 h-4 flex-shrink-0"
            style={{ color: "rgb(var(--text-tertiary))" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search issues..."
            className="flex-1 text-sm bg-transparent focus:outline-none"
            style={{ color: "rgb(var(--text-primary))" }}
          />

          {/* Loading spinner */}
          {isFetching && (
            <svg
              className="w-4 h-4 animate-spin flex-shrink-0"
              style={{ color: "rgb(var(--text-tertiary))" }}
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          )}

          {/* Escape hint */}
          <kbd
            className="text-xs px-1.5 py-0.5 rounded hidden sm:block"
            style={{
              backgroundColor: "rgb(var(--surface-alt))",
              color: "rgb(var(--text-tertiary))",
              border: "1px solid rgb(var(--border))",
            }}
          >
            esc
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="overflow-y-auto max-h-80">
          {query.trim().length === 0 && (
            <div className="px-4 py-8 text-center">
              <p
                className="text-sm"
                style={{ color: "rgb(var(--text-tertiary))" }}
              >
                Type to search issues...
              </p>
            </div>
          )}

          {query.trim().length > 0 && !isFetching && issues.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p
                className="text-sm"
                style={{ color: "rgb(var(--text-tertiary))" }}
              >
                No issues found for "{query}"
              </p>
            </div>
          )}

          {issues.map((issue, i) => (
            <SearchResult
              key={issue.id}
              issue={issue}
              isActive={i === activeIndex}
              onClick={() => handleSelect(issue)}
            />
          ))}
        </div>

        {/* Footer hint */}
        {issues.length > 0 && (
          <div
            className="flex items-center gap-4 px-4 py-2"
            style={{ borderTop: "1px solid rgb(var(--border))" }}
          >
            <span
              className="text-xs"
              style={{ color: "rgb(var(--text-tertiary))" }}
            >
              <kbd className="font-mono">↑↓</kbd> navigate
            </span>
            <span
              className="text-xs"
              style={{ color: "rgb(var(--text-tertiary))" }}
            >
              <kbd className="font-mono">↵</kbd> open
            </span>
            <span
              className="text-xs"
              style={{ color: "rgb(var(--text-tertiary))" }}
            >
              <kbd className="font-mono">esc</kbd> close
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
