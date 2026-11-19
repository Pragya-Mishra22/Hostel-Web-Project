"use client";

import * as React from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scrolling for the home page. Mounted only there: a site-wide
 * scroll hijack would fight screen readers and native scroll restoration on the
 * data-heavy portal pages. Skipped for reduced-motion users. Kept in sync with
 * GSAP ScrollTrigger so scroll reveals fire at the right moment.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: true });
    lenis.on("scroll", ScrollTrigger.update);
    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
