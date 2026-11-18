"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * LineHoverLink — an inline text link with an underline that slides in from
 * the left on hover/focus. Pure CSS transform, no JS per interaction, used
 * for every inline text link across the site (per the brief).
 */
export interface LineHoverLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  className?: string;
  children: React.ReactNode;
}

export const LineHoverLink = React.forwardRef<HTMLAnchorElement, LineHoverLinkProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        className={cn(
          "relative inline-block w-fit cursor-pointer no-underline",
          "after:absolute after:left-0 after:top-full after:h-px after:w-full after:bg-current",
          "after:origin-right after:scale-x-0 after:transition-transform after:duration-300 after:ease-out",
          "hover:after:origin-left hover:after:scale-x-100 focus-visible:after:origin-left focus-visible:after:scale-x-100",
          className,
        )}
        {...props}
      >
        {children}
      </Link>
    );
  },
);
LineHoverLink.displayName = "LineHoverLink";

/** Same effect for a plain external/anchor link (no Next.js routing). */
export function LineHoverAnchor({
  className,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        "relative inline-block w-fit cursor-pointer no-underline",
        "after:absolute after:left-0 after:top-full after:h-px after:w-full after:bg-current",
        "after:origin-right after:scale-x-0 after:transition-transform after:duration-300 after:ease-out",
        "hover:after:origin-left hover:after:scale-x-100 focus-visible:after:origin-left focus-visible:after:scale-x-100",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
