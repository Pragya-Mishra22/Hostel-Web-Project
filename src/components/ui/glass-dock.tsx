"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { cn } from "@/lib/utils";
import { ICONS, type IconName } from "@/components/ui/icon-registry";

gsap.registerPlugin(MorphSVGPlugin);

/** Icons that morph through a droplet shape on hover (GSAP MorphSVG). */
const MORPH_PATHS = {
  home: "M3 18V10.5339C3 9.57062 3.46259 8.66591 4.24353 8.1019L10.2435 3.76856C11.2921 3.01128 12.7079 3.01128 13.7565 3.76856L19.7565 8.1019C20.5374 8.66591 21 9.57062 21 10.5339V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18Z",
  marker:
    "M12 21C12 21 9.39536 18.8605 7.3637 16C6.06474 14.1711 5 12.0475 5 10C5 6.134 8.134 3 12 3C15.866 3 19 6.134 19 10C19 12.0475 17.9353 14.1711 16.6363 16C14.6046 18.8605 12 21 12 21Z",
  doc: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z",
  email: "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z",
} as const;

const DROP_A =
  "M12 21C12 21 15.3954 18.8605 13.3637 16C12.0647 14.1711 9.51275 11.9823 9 10C8 6.134 10.134 3 12 3C13.866 3 16 6.134 15 10C14.4873 11.9823 11.9353 14.1711 10.6363 16C8.60464 18.8605 12 21 12 21Z";
const DROP_B =
  "M12 21C12 21 14.0216 19.0215 14.3637 16C14.6026 13.8898 13.5128 11.9823 13 10C12 6.134 13.134 3 12 3C10.866 3 12 6.134 11 10C10.4873 11.9823 9.39736 13.8898 9.6363 16C9.97843 19.0215 12 21 12 21Z";

export type MorphIconKey = keyof typeof MORPH_PATHS;
export type DockIconKey = MorphIconKey | IconName;

export interface DockItem {
  title: string;
  icon: DockIconKey;
  href: string;
}

function isMorph(key: DockIconKey): key is MorphIconKey {
  return key in MORPH_PATHS;
}

function MorphIcon({ type, hovered }: { type: MorphIconKey; hovered: boolean }) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const pathRef = React.useRef<SVGPathElement>(null);
  const wasHovered = React.useRef(false);

  React.useEffect(() => {
    const path = pathRef.current;
    const svg = svgRef.current;
    if (!path || !svg) return;
    const justEntered = hovered && !wasHovered.current;
    wasHovered.current = hovered;
    if (!justEntered) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.killTweensOf([path, svg]);
    gsap
      .timeline()
      .to(svg, { scale: 0.55, duration: 0.1 }, 0)
      .to(path, { morphSVG: DROP_A, duration: 0.1 }, 0)
      .to(path, { morphSVG: DROP_B, duration: 0.05 })
      .to(path, { morphSVG: MORPH_PATHS[type], duration: 0.7, ease: "elastic.out(1, .9)" })
      .to(svg, { scale: 1, duration: 0.7, ease: "elastic.out(1, .9)" }, "<");
  }, [hovered, type]);

  return (
    <svg ref={svgRef} viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden="true">
      <path ref={pathRef} d={MORPH_PATHS[type]} />
    </svg>
  );
}

/**
 * GlassDock: a fixed glass dock. While the page scrolls it compresses (smaller,
 * quieter); it expands again when scrolling stops or when you hover it. Icons
 * with a morph shape squish into a droplet and spring back on hover.
 */
export function GlassDock({ items, className }: { items: DockItem[]; className?: string }) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [scrolling, setScrolling] = React.useState(false);
  const [dockHover, setDockHover] = React.useState(false);
  // Stays out of the way of the hero's stats strip until the visitor starts scrolling.
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    let timer: number | undefined;
    const onScroll = () => {
      setShown(window.scrollY > 240);
      setScrolling(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setScrolling(false), 650);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, []);

  const compressed = scrolling && !dockHover;

  return (
    <div className={cn("pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4", className)}>
      <motion.nav
        inert={!shown}
        initial={false}
        aria-label="Quick navigation"
        onPointerEnter={() => setDockHover(true)}
        onPointerLeave={() => {
          setDockHover(false);
          setHovered(null);
        }}
        animate={{ scale: compressed ? 0.78 : 1, y: !shown ? 90 : compressed ? 8 : 0, opacity: !shown ? 0 : compressed ? 0.8 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="pointer-events-auto flex origin-bottom items-center gap-1 rounded-3xl border border-line bg-card/75 px-2.5 py-2 shadow-[0_14px_44px_-14px_rgba(8,15,40,0.5)] backdrop-blur-xl"
      >
        {items.map((item, index) => {
          const isHovered = hovered === index;
          const Lucide = isMorph(item.icon) ? null : ICONS[item.icon];
          return (
            <Link
              key={item.title}
              href={item.href}
              onPointerEnter={() => setHovered(index)}
              onFocus={() => setHovered(index)}
              onBlur={() => setHovered(null)}
              aria-label={item.title}
              className={cn(
                "relative flex size-11 items-center justify-center rounded-2xl text-ink-muted transition-colors hover:bg-brand-soft hover:text-accent-fg focus-visible:text-accent-fg",
                isHovered && "text-accent-fg",
              )}
            >
              <AnimatePresence>
                {isHovered ? (
                  <motion.span
                    initial={{ opacity: 0, y: 6, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className="pointer-events-none absolute -top-10 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-xs font-medium text-page shadow-lg"
                  >
                    {item.title}
                  </motion.span>
                ) : null}
              </AnimatePresence>
              <motion.span
                animate={{ scale: isHovered ? 1.15 : 1, y: isHovered ? -3 : 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="flex items-center justify-center"
              >
                {Lucide ? (
                  <Lucide className="size-[22px]" aria-hidden="true" />
                ) : (
                  <MorphIcon type={item.icon as MorphIconKey} hovered={isHovered} />
                )}
              </motion.span>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
