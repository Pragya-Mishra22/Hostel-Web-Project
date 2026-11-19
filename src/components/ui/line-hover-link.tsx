"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Line hover link variants (CSS lives in globals.css):
 *   slide    line slides in from the right
 *   double   two lines with different timings
 *   grow     line thickens on hover
 *   strike   strike-through with a text scale
 *   fade     two lines fade up with a stagger
 *   pulse    line pulses up and down
 *   swap     two lines travel in opposite directions
 *   sweep    background sweeps over the text
 *   bounce   bouncy squish
 *   arc      SVG arc draws in
 *   scribble SVG scribble draws in
 */
export type LineHoverVariant =
  | "slide"
  | "double"
  | "grow"
  | "strike"
  | "fade"
  | "pulse"
  | "swap"
  | "sweep"
  | "bounce"
  | "arc"
  | "scribble";

interface CommonProps {
  variant?: LineHoverVariant;
  className?: string;
  children: React.ReactNode;
}

const NEEDS_SPAN: LineHoverVariant[] = ["strike", "bounce", "arc", "scribble"];

const ArcGraphic = () => (
  <svg
    className="link-hover__graphic link-hover__graphic--stroke link-hover__graphic--arc"
    width="100%"
    height="18"
    viewBox="0 0 59 18"
    aria-hidden="true"
  >
    <path d="M.945.149C12.3 16.142 43.573 22.572 58.785 10.842" pathLength="1" />
  </svg>
);

const ScribbleGraphic = () => (
  <svg
    className="link-hover__graphic link-hover__graphic--stroke link-hover__graphic--scribble"
    width="100%"
    height="9"
    viewBox="0 0 101 9"
    aria-hidden="true"
  >
    <path
      d="M.426 1.973C4.144 1.567 17.77-.514 21.443 1.48 24.296 3.026 24.844 4.627 27.5 7c3.075 2.748 6.642-4.141 10.066-4.688 7.517-1.2 13.237 5.425 17.59 2.745C58.5 3 60.464-1.786 66 2c1.996 1.365 3.174 3.737 5.286 4.41 5.423 1.727 25.34-7.981 29.14-1.294"
      pathLength="1"
    />
  </svg>
);

function inner(variant: LineHoverVariant, children: React.ReactNode) {
  return (
    <>
      {NEEDS_SPAN.includes(variant) ? <span>{children}</span> : children}
      {variant === "arc" ? <ArcGraphic /> : null}
      {variant === "scribble" ? <ScribbleGraphic /> : null}
    </>
  );
}

/** Internal (Next.js routed) text link. Used for every inline text link on the site. */
export const LineHoverLink = React.forwardRef<
  HTMLAnchorElement,
  CommonProps & Omit<React.ComponentPropsWithoutRef<typeof Link>, "className" | "children">
>(({ variant = "slide", className, children, ...props }, ref) => (
  <Link ref={ref} className={cn("link-hover", `link-hover--${variant}`, className)} {...props}>
    {inner(variant, children)}
  </Link>
));
LineHoverLink.displayName = "LineHoverLink";

/** Plain anchor version for external links, mailto: and tel:. */
export const LineHoverAnchor = React.forwardRef<
  HTMLAnchorElement,
  CommonProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">
>(({ variant = "slide", className, children, ...props }, ref) => (
  <a ref={ref} className={cn("link-hover", `link-hover--${variant}`, className)} {...props}>
    {inner(variant, children)}
  </a>
));
LineHoverAnchor.displayName = "LineHoverAnchor";
