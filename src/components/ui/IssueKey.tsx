import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { formatIssueKey } from "../../utils/issueKey";

interface IssueKeyProps {
  projectKey: string;
  issueNumber: number;
  clickable?: boolean;
  className?: string;
}

export function IssueKey({
  projectKey,
  issueNumber,
  clickable = true,
  className,
}: IssueKeyProps) {
  const navigate = useNavigate();
  const key = formatIssueKey(projectKey, issueNumber);

  if (!clickable) {
    return (
      <span
        className={cn("text-xs font-mono font-medium", className)}
        style={{ color: "rgb(var(--text-tertiary))" }}
      >
        {key}
      </span>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/issue/${key}`);
      }}
      className={cn(
        "text-xs font-mono font-medium transition-colors hover:underline",
        className
      )}
      style={{ color: "rgb(var(--accent))" }}
    >
      {key}
    </button>
  );
}
