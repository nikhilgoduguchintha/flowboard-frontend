import { useState } from "react";
import { getInitials, getAvatarColor } from "../../utils/avatar";
import { cn } from "../../lib/utils";
import type { AvatarSize } from "../../types";

interface AvatarProps {
  name: string;
  handle: string;
  avatarUrl?: string;
  size?: AvatarSize;
  className?: string;
}

const SIZES = {
  sm: { container: "w-6 h-6", text: "text-xs" },
  md: { container: "w-8 h-8", text: "text-sm" },
  lg: { container: "w-10 h-10", text: "text-base" },
};

export function Avatar({ name, handle, avatarUrl, size = "md", className }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(name);
  const colors = getAvatarColor(handle);
  const sizeClass = SIZES[size];

  const isUrl = !!avatarUrl && avatarUrl.startsWith("http");

  if (isUrl && !imgError) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        title={name}
        onError={() => setImgError(true)}
        className={cn(
          "rounded-full object-cover flex-shrink-0",
          sizeClass.container,
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold flex-shrink-0",
        sizeClass.container,
        sizeClass.text,
        className
      )}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
      title={name}
    >
      {initials}
    </div>
  );
}
