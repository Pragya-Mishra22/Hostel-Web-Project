"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ICONS, type IconName } from "@/components/ui/icon-registry";

export interface DockItem {
  title: string;
  icon: IconName;
  href: string;
}

/**
 * GlassDock — a fixed, glassy quick-nav dock with expand/compress-on-hover
 * icons and a tooltip. Adapted from the reference without GSAP's optional
 * MorphSVGPlugin: that plugin can silently fail to load (it's dynamically
 * imported) and we want zero fragile dependencies in a "must never error"
 * build. The scale + tooltip motion gives the same tactile feel.
 */
export function GlassDock({ items, className }: { items: DockItem[]; className?: string }) {
  const [hovered, setHovered] = React.useState<number | null>(null);

  return (
    <div
      className={cn("pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4", className)}
    >
      <div
        role="navigation"
        aria-label="Quick navigation"
        onMouseLeave={() => setHovered(null)}
        className={cn(
          "pointer-events-auto flex items-center gap-1 rounded-2xl border px-3 py-2.5",
          "border-black/[0.06] bg-white/75 shadow-[0_10px_40px_-12px_rgba(15,22,41,0.25)] backdrop-blur-xl",
          "dark:border-white/[0.08] dark:bg-neutral-900/75",
        )}
      >
        {items.map((item, index) => {
          const Icon = ICONS[item.icon];
          const isHovered = hovered === index;
          return (
            <Link
              key={item.title}
              href={item.href}
              onMouseEnter={() => setHovered(index)}
              onFocus={() => setHovered(index)}
              onBlur={() => setHovered(null)}
              aria-label={item.title}
              className="relative flex size-11 items-center justify-center rounded-xl text-ink-muted transition-colors hover:text-brand-700 focus-visible:text-brand-700"
            >
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, y: 6, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className="absolute -top-10 whitespace-nowrap rounded-md bg-ink px-2.5 py-1 text-xs font-medium text-[var(--color-surface)] shadow-lg"
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.span
                animate={{ scale: isHovered ? 1.15 : 1, y: isHovered ? -2 : 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="flex items-center justify-center"
              >
                <Icon className="size-5" aria-hidden="true" />
              </motion.span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
