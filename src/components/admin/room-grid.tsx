"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BedDouble, UserPlus, UserMinus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RoomGridBed {
  id: string;
  bedNumber: number;
  studentName: string | null;
  rollNumber: string | null;
}
export interface RoomGridRoom {
  id: string;
  roomNumber: string;
  floor: number;
  capacity: number;
  beds: RoomGridBed[];
}
export interface UnassignedStudent {
  id: string;
  name: string;
  rollNumber: string;
}

export function RoomGrid({ rooms, unassignedStudents }: { rooms: RoomGridRoom[]; unassignedStudents: UnassignedStudent[] }) {
  const router = useRouter();
  const [activeBed, setActiveBed] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const assign = async (bedId: string, studentId: string) => {
    setBusy(bedId);
    setError(null);
    const res = await fetch(`/api/admin/beds/${bedId}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId }),
    });
    setBusy(null);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Could not allocate that bed.");
      return;
    }
    setActiveBed(null);
    router.refresh();
  };

  const vacate = async (bedId: string) => {
    setBusy(bedId);
    setError(null);
    const res = await fetch(`/api/admin/beds/${bedId}/vacate`, { method: "POST" });
    setBusy(null);
    if (!res.ok) {
      setError("Could not vacate that bed.");
      return;
    }
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-danger-fg">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <div key={room.id} className="rounded-xl border border-line bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="font-display text-sm font-bold text-ink">Room {room.roomNumber}</p>
              <span className="text-xs text-ink-muted">Floor {room.floor}</span>
            </div>
            <div className="mt-3 space-y-2">
              {room.beds.map((bed) => (
                <div key={bed.id} className="relative">
                  <div
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm",
                      bed.studentName ? "border-brand-200 bg-brand-soft" : "border-dashed border-line",
                    )}
                  >
                    <span className="flex items-center gap-2 text-ink">
                      <BedDouble className="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
                      {bed.studentName ? (
                        <span className="truncate">
                          <span className="font-medium">{bed.studentName}</span>
                          <span className="ml-1 text-xs text-ink-muted">({bed.rollNumber})</span>
                        </span>
                      ) : (
                        <span className="text-ink-muted">Bed {bed.bedNumber} · vacant</span>
                      )}
                    </span>
                    {bed.studentName ? (
                      <button
                        type="button"
                        disabled={busy === bed.id}
                        onClick={() => vacate(bed.id)}
                        aria-label={`Vacate bed ${bed.bedNumber}`}
                        className="flex size-8 shrink-0 items-center justify-center rounded-md text-ink-muted hover:bg-danger-soft hover:text-danger-fg"
                      >
                        <UserMinus className="size-4" aria-hidden="true" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={busy === bed.id || unassignedStudents.length === 0}
                        onClick={() => setActiveBed(bed.id)}
                        aria-label={`Allocate bed ${bed.bedNumber}`}
                        className="flex size-8 shrink-0 items-center justify-center rounded-md text-accent-fg hover:bg-brand-soft disabled:opacity-40"
                      >
                        <UserPlus className="size-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>

                  {activeBed === bed.id ? (
                    <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-xl border border-line bg-card p-2 shadow-lg">
                      <div className="mb-1 flex items-center justify-between px-1">
                        <span className="text-xs font-semibold text-ink-muted">Allocate to</span>
                        <button type="button" onClick={() => setActiveBed(null)} aria-label="Cancel" className="text-ink-muted hover:text-ink">
                          <X className="size-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      <ul className="max-h-48 overflow-y-auto">
                        {unassignedStudents.map((s) => (
                          <li key={s.id}>
                            <button
                              type="button"
                              onClick={() => assign(bed.id, s.id)}
                              className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm hover:bg-surface-muted"
                            >
                              <span className="text-ink">{s.name}</span>
                              <span className="font-mono text-xs text-ink-muted">{s.rollNumber}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
