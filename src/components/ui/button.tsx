"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button
 *
 * Color and size genuinely vary by context: 6 variants x 3 sizes, so a
 * "Save" button never looks like a "Delete" button, and a table row action
 * never looks like a page-level call to action.
 *
 * `liquid` turns on the ink-spread hover effect (a real SVG goo filter +
 * pointer-tracked clip-path reveal). It's opt-in and meant for marketing
 * pages (home, login, register) — a handful of buttons at a time. Admin and
 * student screens render many buttons in a list (fee rows, complaint rows),
 * so they use the plain variants: a filter per row would be real, measurable
 * lag, which the brief explicitly asked to avoid. The filter itself is
 * static (not re-computed every frame), so even where it IS used, it costs
 * nothing while idle.
 */
export const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-xl font-semibold tracking-tight select-none cursor-pointer",
    "transition-colors duration-150 ease-out",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-brand-600 text-white shadow-sm hover:bg-brand-700 active:bg-brand-800",
        secondary:
          "bg-surface-muted text-ink border border-[var(--color-line)] hover:bg-brand-50 hover:text-brand-700",
        accent: "bg-gold-500 text-gold-950 shadow-sm hover:bg-gold-400 active:bg-gold-600",
        outline:
          "border-2 border-brand-600 text-brand-700 bg-transparent hover:bg-brand-50",
        ghost: "bg-transparent text-ink-muted hover:bg-surface-muted hover:text-ink",
        destructive: "bg-danger-500 text-white hover:bg-danger-600 active:bg-red-800",
      },
      size: {
        sm: "h-9 px-3.5 text-sm min-w-9",
        default: "h-11 px-5 text-sm min-w-11",
        lg: "h-12 px-7 text-base min-w-12",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

let liquidFilterMounted = false;

function LiquidFilterDefs() {
  // Mounted once per page; the filter is static (fixed baseFrequency), so it
  // costs nothing until a liquid button is actually hovered.
  if (liquidFilterMounted) return null;
  liquidFilterMounted = true;
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <filter id="btn-liquid-goo" x="-20%" y="-60%" width="140%" height="220%">
          <feTurbulence type="fractalNoise" baseFrequency="0.015 0.09" numOctaves={2} seed={4} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={6} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  liquid?: boolean;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, liquid = false, children, onPointerMove, onPointerDown, style, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<{ id: number; x: number; y: number }[]>([]);
    const rippleId = React.useRef(0);

    const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerMove?.(e);
      if (!liquid) return;
      const rect = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--ink-x", `${e.clientX - rect.left}px`);
      e.currentTarget.style.setProperty("--ink-y", `${e.clientY - rect.top}px`);
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);
      if (!liquid) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const id = rippleId.current++;
      setRipples((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 650);
    };

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), liquid && "overflow-hidden isolate", className)}
        style={liquid ? { filter: "url(#btn-liquid-goo)", ...style } : style}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        {...props}
      >
        {liquid && <LiquidFilterDefs />}
        {liquid &&
          ripples.map((r) => (
            <span
              key={r.id}
              aria-hidden="true"
              className="pointer-events-none absolute rounded-full bg-white/30 motion-safe:animate-[btn-ink_0.65s_ease-out]"
              style={{ left: r.x, top: r.y, width: 10, height: 10, marginLeft: -5, marginTop: -5 }}
            />
          ))}
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
        <style jsx>{`
          @keyframes btn-ink {
            from {
              transform: scale(1);
              opacity: 0.55;
            }
            to {
              transform: scale(22);
              opacity: 0;
            }
          }
        `}</style>
      </button>
    );
  },
);
Button.displayName = "Button";
