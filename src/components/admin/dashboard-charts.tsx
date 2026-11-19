"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "recharts";

// Colors come from CSS variables so the charts follow light and dark mode.
const GRID = "var(--color-line)";
const TICK = { fontSize: 12, fill: "var(--color-ink-muted)" };
const TOOLTIP = {
  contentStyle: {
    borderRadius: 12,
    border: "1px solid var(--color-line)",
    background: "var(--color-card)",
    color: "var(--color-ink)",
    fontSize: 13,
  },
  labelStyle: { color: "var(--color-ink)", fontWeight: 600 },
  cursor: { fill: "var(--color-brand-soft)" },
};

const STATUS_COLORS: Record<string, string> = {
  Open: "#f59e0b",
  "In progress": "#5a87ff",
  Resolved: "#22c55e",
};

function Empty({ text }: { text: string }) {
  return <p className="flex h-64 items-center justify-center text-sm text-ink-muted">{text}</p>;
}

export function OccupancyChart({ data }: { data: { hostel: string; occupied: number; vacant: number }[] }) {
  if (data.length === 0) return <Empty text="No room data yet." />;
  const summary = data.map((d) => `${d.hostel}: ${d.occupied} occupied, ${d.vacant} vacant`).join(". ");
  return (
    <div role="img" aria-label={`Bed occupancy by hostel. ${summary}`}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barSize={32}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
          <XAxis dataKey="hostel" tick={TICK} axisLine={{ stroke: GRID }} tickLine={false} />
          <YAxis tick={TICK} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip {...TOOLTIP} />
          <Legend wrapperStyle={{ fontSize: 12, color: "var(--color-ink-muted)" }} />
          <Bar dataKey="occupied" name="Occupied" fill="#4f7cff" radius={[0, 0, 0, 0]} stackId="beds" />
          <Bar dataKey="vacant" name="Vacant" fill="#8ea3cf" radius={[6, 6, 0, 0]} stackId="beds" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ComplaintsChart({ data }: { data: { status: string; count: number }[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  if (total === 0) return <Empty text="No complaints recorded yet." />;
  const summary = data.map((d) => `${d.status}: ${d.count}`).join(". ");
  return (
    <div role="img" aria-label={`Complaints by status. ${summary}`}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" barSize={26} margin={{ left: 12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={TICK} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="status" width={90} tick={TICK} axisLine={false} tickLine={false} />
          <Tooltip {...TOOLTIP} />
          <Bar dataKey="count" name="Complaints" radius={[0, 6, 6, 0]}>
            {data.map((d) => (
              <Cell key={d.status} fill={STATUS_COLORS[d.status] ?? "#8ea3cf"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FeesChart({ data }: { data: { type: string; paid: number; pending: number }[] }) {
  if (data.every((d) => d.paid === 0 && d.pending === 0)) return <Empty text="No fee records yet." />;
  const summary = data.map((d) => `${d.type}: Rs ${d.paid} paid, Rs ${d.pending} pending`).join(". ");
  return (
    <div role="img" aria-label={`Fee collection versus pending. ${summary}`}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barSize={30}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
          <XAxis dataKey="type" tick={TICK} axisLine={{ stroke: GRID }} tickLine={false} />
          <YAxis tick={TICK} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip {...TOOLTIP} formatter={(value) => [`Rs ${value}`, ""]} />
          <Legend wrapperStyle={{ fontSize: 12, color: "var(--color-ink-muted)" }} />
          <Bar dataKey="paid" name="Paid" fill="#22c55e" radius={[6, 6, 0, 0]} />
          <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
