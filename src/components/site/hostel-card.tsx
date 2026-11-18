import Image from "next/image";
import Link from "next/link";
import { Building2, Users, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface HostelCardData {
  id: string;
  name: string;
  code: string;
  description: string;
  imageUrl: string | null;
  totalBeds: number;
  occupiedBeds: number;
}

export function HostelCard({ hostel }: { hostel: HostelCardData }) {
  const vacant = hostel.totalBeds - hostel.occupiedBeds;
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-100">
        {hostel.imageUrl ? (
          <Image
            src={hostel.imageUrl}
            alt={`${hostel.name} hostel building`}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand-600 to-brand-900 text-white">
            <Building2 className="size-10 opacity-80" aria-hidden="true" />
            <span className="flex items-center gap-1.5 text-xs font-medium opacity-80">
              <ImageOff className="size-3.5" aria-hidden="true" /> Photo coming soon
            </span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {hostel.code}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg font-bold text-ink">{hostel.name}</h3>
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-ink-muted">{hostel.description}</p>

        <div className="flex items-center gap-2 text-sm text-ink-muted">
          <Users className="size-4 text-brand-600" aria-hidden="true" />
          <span>
            <span className="font-semibold text-ink">{vacant}</span> of {hostel.totalBeds} beds vacant
          </span>
        </div>

        <Link href={`/register?hostel=${hostel.id}`} className="mt-1">
          <Button variant="secondary" size="sm" className="w-full">
            View &amp; apply
          </Button>
        </Link>
      </div>
    </div>
  );
}
