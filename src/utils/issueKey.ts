export function formatIssueKey(
  projectKey: string,
  issueNumber: number
): string {
  return `${projectKey}-${issueNumber}`;
}

export function parseIssueKey(issueKey: string): {
  projectKey: string;
  issueNumber: number;
} | null {
  const parts = issueKey.split("-");
  if (parts.length !== 2) return null;

  const issueNumber = parseInt(parts[1], 10);
  if (isNaN(issueNumber)) return null;

  return {
    projectKey: parts[0],
    issueNumber,
  };
}
