"use client";

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

const defaultColors = [
  "var(--admin-primary)", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444",
  "#06B6D4", "#EC4899", "#14B8A6", "#6366F1", "#F97316",
];

export function BarChart({ data, title }: { data: BarChartData[]; title: string }) {
  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="admin-card" style={{ height: "100%" }}>
      <div className="admin-card-header">
        <span className="admin-card-title">{title}</span>
      </div>
      <div className="admin-card-body" style={{ padding: "16px 20px" }}>
        {data.length === 0 ? (
          <div style={{ color: "var(--admin-text-muted)", fontSize: 13, textAlign: "center", padding: 20 }}>
            Belum ada data
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {data.map((item, i) => (
              <div key={item.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: "var(--admin-text-secondary)", fontWeight: 500 }}>
                    {item.label}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text-primary)" }}>
                    {item.value}
                  </span>
                </div>
                <div style={{
                  height: 8, borderRadius: 4, background: "var(--admin-border)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", borderRadius: 4,
                    width: `${(item.value / max) * 100}%`,
                    background: item.color || defaultColors[i % defaultColors.length],
                    transition: "width 0.6s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function LineChart({ data, title, color }: { data: { label: string; value: number }[]; title: string; color?: string }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const chartColor = color || "var(--admin-primary)";

  return (
    <div className="admin-card" style={{ height: "100%" }}>
      <div className="admin-card-header">
        <span className="admin-card-title">{title}</span>
      </div>
      <div className="admin-card-body" style={{ padding: "16px 20px" }}>
        {data.length === 0 ? (
          <div style={{ color: "var(--admin-text-muted)", fontSize: 13, textAlign: "center", padding: 20 }}>
            Belum ada data
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 120, marginBottom: 8 }}>
              {data.map((item, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    height: "100%",
                  }}
                >
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: "var(--admin-text-primary)",
                    marginBottom: 4,
                  }}>
                    {item.value > 0 ? item.value : ""}
                  </span>
                  <div style={{
                    width: "100%", maxWidth: 32,
                    height: `${Math.max((item.value / max) * 100, 4)}%`,
                    background: chartColor,
                    borderRadius: "4px 4px 0 0",
                    opacity: 0.85,
                    transition: "height 0.6s ease",
                  }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 4, borderTop: "1px solid var(--admin-border)", paddingTop: 8 }}>
              {data.map((item, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: "var(--admin-text-muted)" }}>
                  {item.label}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function DonutChart({ data, title }: { data: BarChartData[]; title: string }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) {
    return (
      <div className="admin-card" style={{ height: "100%" }}>
        <div className="admin-card-header">
          <span className="admin-card-title">{title}</span>
        </div>
        <div className="admin-card-body" style={{ padding: 20, textAlign: "center", color: "var(--admin-text-muted)", fontSize: 13 }}>
          Belum ada data
        </div>
      </div>
    );
  }

  // Build conic-gradient
  const segments = data.reduce<{ segments: string[]; angle: number }>((acc, item, i) => {
    const pct = (item.value / total) * 100;
    const color = item.color || defaultColors[i % defaultColors.length];
    acc.segments.push(`${color} ${acc.angle}% ${acc.angle + pct}%`);
    acc.angle += pct;
    return acc;
  }, { segments: [], angle: 0 }).segments;

  return (
    <div className="admin-card" style={{ height: "100%" }}>
      <div className="admin-card-header">
        <span className="admin-card-title">{title}</span>
      </div>
      <div className="admin-card-body" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{
          width: 100, height: 100, borderRadius: "50%", flexShrink: 0,
          background: `conic-gradient(${segments.join(", ")})`,
          position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: 20, borderRadius: "50%",
            background: "var(--admin-card-bg)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700, color: "var(--admin-text-primary)",
          }}>
            {total}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
          {data.map((item, i) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <div style={{
                width: 10, height: 10, borderRadius: 2, flexShrink: 0,
                background: item.color || defaultColors[i % defaultColors.length],
              }} />
              <span style={{ color: "var(--admin-text-secondary)", flex: 1 }}>{item.label}</span>
              <span style={{ fontWeight: 600, color: "var(--admin-text-primary)" }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
