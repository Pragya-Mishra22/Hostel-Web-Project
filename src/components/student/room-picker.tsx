"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BedDouble, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface RoomOption {
  roomId: string;
  roomNumber: string;
  floor: number;
  capacity: number;
  beds: { id: string; bedNumber: number; taken: boolean }[];
}

export function RoomPicker({ rooms }: { rooms: RoomOption[] }) {
  const router = useRouter();
  const [selectedBed, setSelectedBed] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleBook = async () => {
    if (!selectedBed) return;
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/student/room/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bedId: selectedBed }),
    });
    const json = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(json.error ?? "Could not book that bed.");
      return;
    }
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {error ? (
        <div role="alert" className="flex items-center gap-2 rounded-xl border border-danger-500/30 bg-red-50 px-4 py-3 text-sm text-danger-600 dark:bg-red-950/20">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" /> {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <div key={room.roomId} className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
            <div className="flex items-center justify-between">
              <p className="font-display text-sm font-bold text-ink">Room {room.roomNumber}</p>
              <span className="text-xs text-ink-muted">Floor {room.floor}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {room.beds.map((bed) => {
                const isSelected = selectedBed === bed.id;
                return (
                  <button
                    key={bed.id}
                    type="button"
                    disabled={bed.taken}
                    onClick={() => setSelectedBed(bed.id)}
                    aria-pressed={isSelected}
                    className={cn(
                      "flex min-w-[44px] min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-lg border text-xs font-medium transition-colors",
                      bed.taken
                        ? "cursor-not-allowed border-[var(--color-line)] bg-surface-muted text-ink-muted/50"
                        : isSelected
                          ? "border-brand-600 bg-brand-600 text-white"
                          : "border-[var(--color-line)] text-ink hover:border-brand-500 hover:text-brand-700",
                    )}
                  >
                    <BedDouble className="size-4" aria-hidden="true" />
                    {bed.bedNumber}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Button onClick={handleBook} disabled={!selectedBed || submitting} liquid size="lg">
        {submitting ? "Booking…" : "Book selected bed"}
      </Button>
    </div>
  );
}
