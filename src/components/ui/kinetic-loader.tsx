"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface KineticTextLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
}

/**
 * The big kinetic "Loading" wordmark (a bouncing L, a stretching i and a dot
 * that hops across). Used for page-level loading states. Keyframes are in globals.css.
 */
export function KineticTextLoader({ className, text = "Loading", ...props }: KineticTextLoaderProps) {
  const letters = text.split("");

  return (
    <div
      role="status"
      aria-label={text}
      className={cn("relative flex items-center justify-center font-light", className)}
      style={{ fontFamily: "'Roboto', sans-serif" }}
      {...props}
    >
      <div className="relative scale-75 md:scale-90 lg:scale-100" aria-hidden="true">
        <div
          className="absolute left-[85px] top-[40px] z-10 size-[6px] rounded-full bg-ink"
          style={{ animation: "ktl-dotMove 1800ms cubic-bezier(0.25,0.25,0.75,0.75) infinite" }}
        />

        <p className="relative m-0 whitespace-nowrap text-[3.75rem] text-ink">
          {letters.map((char, index) => {
            if (index === 0 && char.toUpperCase() === "L") {
              return (
                <span
                  key={index}
                  className="relative inline-block origin-[100%_70%] tracking-[8px]"
                  style={{ animation: "ktl-l-bounce 1800ms cubic-bezier(0.25,0.25,0.75,0.75) infinite" }}
                >
                  {char}
                </span>
              );
            }

            if (index === 4 && char.toLowerCase() === "i") {
              return (
                <span
                  key={index}
                  className="relative inline-block origin-[100%_70%] tracking-[8px]"
                  style={{ animation: "ktl-letterStretch 1800ms cubic-bezier(0.25,0.23,0.73,0.75) infinite" }}
                >
                  {char === "i" ? "ı" : char}
                </span>
              );
            }

            return (
              <span key={index} className="relative inline-block tracking-[8px]">
                {char}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}

/** Small inline three-dot loader for inside buttons and quick waits. */
export function KineticLoader({
  label = "Loading",
  size = "default",
  className,
}: {
  label?: string;
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const dot = size === "sm" ? "size-1.5" : size === "lg" ? "size-3" : "size-2";
  return (
    <span role="status" aria-label={label} className={cn("inline-flex items-center gap-1.5", className)}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(dot, "rounded-full bg-current motion-safe:animate-bounce")}
          style={{ animationDelay: `${i * 0.12}s`, animationDuration: "0.9s" }}
        />
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
}

/** Full-area loading state for a slow section (chart, table). */
export function SectionLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-[220px] w-full items-center justify-center">
      <KineticTextLoader text={label} />
    </div>
  );
}

export default KineticTextLoader;
