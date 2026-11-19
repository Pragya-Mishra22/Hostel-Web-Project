"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeeToggleButton({ feeId, status }: { feeId: string; status: "PAID" | "PENDING" }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const toggle = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/fees/${feeId}/toggle`, { method: "POST" });
    setLoading(false);
    if (res.ok) router.refresh();
  };

  const paid = status === "PAID";
  return (
    <Button size="sm" variant={paid ? "secondary" : "success"} onClick={toggle} disabled={loading} className="min-w-32">
      {paid ? <RotateCcw className="size-3.5" aria-hidden="true" /> : <Check className="size-3.5" aria-hidden="true" />}
      {loading ? "Saving..." : paid ? "Mark pending" : "Mark paid"}
    </Button>
  );
}
