import Image from "next/image";
import { Building2, Users, ImageOff, ArrowRight } from "lucide-react";
import { LiquidButton } from "@/components/ui/liquid-button";

export interface HostelCardData {
  id: string;
  name: string;
  code: string;
  description: string;
  imageUrl: string | null;
  totalBeds: number;
  occupiedBeds: number;
}

export function HostelCard({ hostel, variant = "brand" }: { hostel: HostelCardData; variant?: "brand" | "gold" | "success" | "accent" }) {
  const vacant = hostel.totalBeds - hostel.occupiedBeds;
  const filled = hostel.totalBeds > 0 ? Math.round((hostel.occupiedBeds / hostel.totalBeds) * 100) : 0;

  return (
    <article
      id={`hostel-${hostel.code.toLowerCase()}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-900">
        {hostel.imageUrl ? (
          <Image
            src={hostel.imageUrl}
            alt={`${hostel.name} building`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand-600 to-brand-950 text-white">
            <Building2 className="size-12 opacity-80" aria-hidden="true" />
            <span className="flex items-center gap-1.5 text-xs font-medium opacity-80">
              <ImageOff className="size-3.5" aria-hidden="true" /> Photo coming soon
            </span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {hostel.code}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3 className="font-display text-xl font-bold text-ink">{hostel.name}</h3>
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-ink-muted">{hostel.description}</p>

        <div>
          <div className="flex items-center justify-between text-sm text-ink-muted">
            <span className="flex items-center gap-2">
              <Users className="size-4 text-accent-fg" aria-hidden="true" />
              <span>
                <span className="font-semibold text-ink">{vacant}</span> of {hostel.totalBeds} beds vacant
              </span>
            </span>
            <span className="font-mono text-xs">{filled}% full</span>
          </div>
          <div
            role="progressbar"
            aria-label={`${hostel.name} occupancy`}
            aria-valuenow={filled}
            aria-valuemin={0}
            aria-valuemax={100}
            className="mt-2 h-2 overflow-hidden rounded-full bg-surface-muted"
          >
            <div className="h-full rounded-full bg-brand-500 transition-all duration-700" style={{ width: `${filled}%` }} />
          </div>
        </div>

        <LiquidButton href={`/register?hostel=${hostel.id}`} variant={variant} size="sm" className="w-full">
          View and apply <ArrowRight className="size-4" aria-hidden="true" />
        </LiquidButton>
      </div>
    </article>
  );
}
