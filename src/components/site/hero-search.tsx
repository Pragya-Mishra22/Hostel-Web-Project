"use client";

import * as React from "react";
import { Search, ArrowRight } from "lucide-react";
import { SiteSearch } from "@/components/site/site-search";
import type { NavHostel } from "@/components/site/notch-nav";

/**
 * The big search bar in the hero (the "where do you want to stay next?" bar).
 * It opens the same command palette as the header search.
 */
export function HeroSearch({ hostels }: { hostels: NavHostel[] }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search hostels, pages and help"
        className="group flex w-full max-w-2xl cursor-pointer items-center gap-3 rounded-full bg-white p-2 pl-6 text-left text-gray-500 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-0.5"
      >
        <Search className="size-5 shrink-0 text-brand-600" aria-hidden="true" />
        <span className="flex-1 truncate text-sm sm:text-base">Which hostel do you want to stay in?</span>
        <span className="hidden rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 sm:block">Kasturba, Mother Teresa...</span>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition-transform group-hover:translate-x-0.5">
          <ArrowRight className="size-5" aria-hidden="true" />
        </span>
      </button>
      <SiteSearch open={open} onOpenChange={setOpen} hostels={hostels} hotkey={null} />
    </>
  );
}
