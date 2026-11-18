"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MovementActionButton({ leaveId, type }: { leaveId: string; type: "DEPARTURE" | "RETURN" }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const log = async () => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/movements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leaveId, type }),
    });
    setLoading(false);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Could not log that.");
      return;
    }
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      {error ? <span className="text-xs text-danger-600">{error}</span> : null}
      <Button size="sm" variant={type === "DEPARTURE" ? "secondary" : "primary"} onClick={log} disabled={loading}>
        {type === "DEPARTURE" ? <LogOut className="size-4" aria-hidden="true" /> : <LogIn className="size-4" aria-hidden="true" />}
        {loading ? "Logging…" : type === "DEPARTURE" ? "Mark departed" : "Mark returned"}
      </Button>
    </div>
  );
}
