"use client";

import * as React from "react";
import Lenis from "lenis";

/**
 * SmoothScroll — wraps a section in Lenis's buttery scroll easing. Mounted
 * on the home page only (not globally): a site-wide scroll hijack can fight
 * screen readers and the browser's native scroll restoration on data pages,
 * which is exactly the "no errors anywhere" bar this build has to clear.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: true });
    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}
