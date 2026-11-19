"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdmissionActions({ studentId }: { studentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState<"APPROVE" | "REJECT" | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const decide = async (decision: "APPROVE" | "REJECT") => {
    setLoading(decision);
    setError(null);
    const res = await fetch(`/api/admin/admissions/${studentId}/decide`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision }),
    });
    setLoading(null);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Could not update this admission.");
      return;
    }
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      {error ? <span className="text-xs text-danger-fg">{error}</span> : null}
      <Button size="sm" variant="destructive" onClick={() => decide("REJECT")} disabled={loading !== null}>
        <X className="size-4" aria-hidden="true" /> Reject
      </Button>
      <Button size="sm" variant="success" onClick={() => decide("APPROVE")} disabled={loading !== null}>
        <Check className="size-4" aria-hidden="true" /> Approve
      </Button>
    </div>
  );
}
