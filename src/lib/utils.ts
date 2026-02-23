import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ─── Tailwind Class Merger ────────────────────────────────────────────────────
// Merges Tailwind classes without conflicts
// Usage: cn('px-2 py-1', condition && 'bg-red-500', 'px-4') → 'py-1 bg-red-500 px-4'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}