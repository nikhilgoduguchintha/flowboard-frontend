interface StatsCardProps {
  label: string;
  value: number;
  color: string;
  sub?: string;
}

export function StatsCard({ label, value, color, sub }: StatsCardProps) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: "rgb(var(--surface))",
        border: "1px solid rgb(var(--border))",
      }}
    >
      <p
        className="text-xs font-medium mb-2"
        style={{ color: "rgb(var(--text-tertiary))" }}
      >
        {label}
      </p>
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
      {sub && (
        <p
          className="text-xs mt-1"
          style={{ color: "rgb(var(--text-tertiary))" }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
