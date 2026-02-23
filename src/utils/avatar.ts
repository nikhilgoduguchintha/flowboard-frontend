// Deterministic color palette for avatars
// Same handle always maps to same color
const AVATAR_COLORS = [
  { bg: "#EEF1FD", text: "#4F6BED" }, // accent blue
  { bg: "#EDE9FE", text: "#7C3AED" }, // purple
  { bg: "#D1FAE5", text: "#059669" }, // green
  { bg: "#FEF3C7", text: "#D97706" }, // amber
  { bg: "#FEE2E2", text: "#DC2626" }, // red
  { bg: "#DBEAFE", text: "#1D4ED8" }, // blue
  { bg: "#FCE7F3", text: "#BE185D" }, // pink
  { bg: "#CCFBF1", text: "#0F766E" }, // teal
  { bg: "#FEF9C3", text: "#A16207" }, // yellow
  { bg: "#E0F2FE", text: "#0369A1" }, // sky
];

// Hash user handle to a consistent index
function hashHandle(handle: string): number {
  let hash = 0;
  for (let i = 0; i < handle.length; i++) {
    hash = (hash * 31 + handle.charCodeAt(i)) % AVATAR_COLORS.length;
  }
  return hash;
}

export function getAvatarColor(handle: string): {
  bg: string;
  text: string;
} {
  return AVATAR_COLORS[hashHandle(handle)];
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    // Single name — take first two characters
    return parts[0].slice(0, 2).toUpperCase();
  }

  // First letter of first name + first letter of last name
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
