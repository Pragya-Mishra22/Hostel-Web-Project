"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  Open: "#d97706",
  "In progress": "#335fe8",
  Resolved: "#16a34a",
};

export function OccupancyChart({ data }: { data: { hostel: string; occupied: number; vacant: number }[] }) {
  if (data.length === 0) {
    return <p className="flex h-64 items-center justify-center text-sm text-ink-muted">No room data yet.</p>;
  }
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barSize={28}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e3e8f2" vertical={false} />
        <XAxis dataKey="hostel" tick={{ fontSize: 12, fill: "#51607a" }} axisLine={{ stroke: "#e3e8f2" }} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#51607a" }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e3e8f2", fontSize: 13 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="occupied" name="Occupied" fill="#335fe8" radius={[6, 6, 0, 0]} stackId="beds" />
        <Bar dataKey="vacant" name="Vacant" fill="#b8d0ff" radius={[6, 6, 0, 0]} stackId="beds" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ComplaintsChart({ data }: { data: { status: string; count: number }[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  if (total === 0) {
    return <p className="flex h-64 items-center justify-center text-sm text-ink-muted">No complaints recorded yet.</p>;
  }
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" barSize={22} margin={{ left: 12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e3e8f2" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "#51607a" }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="status" width={90} tick={{ fontSize: 12, fill: "#51607a" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e3e8f2", fontSize: 13 }} />
        <Bar dataKey="count" name="Complaints" radius={[0, 6, 6, 0]}>
          {data.map((d) => (
            <Cell key={d.status} fill={STATUS_COLORS[d.status] ?? "#51607a"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function FeesChart({ data }: { data: { type: string; paid: number; pending: number }[] }) {
  if (data.every((d) => d.paid === 0 && d.pending === 0)) {
    return <p className="flex h-64 items-center justify-center text-sm text-ink-muted">No fee records yet.</p>;
  }
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barSize={28}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e3e8f2" vertical={false} />
        <XAxis dataKey="type" tick={{ fontSize: 12, fill: "#51607a" }} axisLine={{ stroke: "#e3e8f2" }} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#51607a" }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid #e3e8f2", fontSize: 13 }}
          formatter={(value) => [`Rs ${value}`, ""]}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="paid" name="Paid" fill="#16a34a" radius={[6, 6, 0, 0]} />
        <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
