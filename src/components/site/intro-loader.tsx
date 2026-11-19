"use client";

import * as React from "react";
import { Building2 } from "lucide-react";
import { FlipFadeText } from "@/components/ui/flip-fade-text";
import { cn } from "@/lib/utils";

const SEEN_KEY = "ymca-intro-seen";

/**
 * First-visit splash for the home page. The words flip in letter by letter, then
 * the overlay fades away. It shows once per browser session, is skipped for
 * reduced-motion users, can be dismissed by clicking, and always removes itself
 * after a few seconds so it can never trap the page.
 */
export function IntroLoader() {
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const [leaving, setLeaving] = React.useState(false);

  React.useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // storage blocked: just show the intro this once
    }
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.hidden = true;
      return;
    }
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // ignore
    }

    const fade = window.setTimeout(() => setLeaving(true), 2900);
    const remove = window.setTimeout(() => {
      el.hidden = true;
    }, 3500);
    return () => {
      window.clearTimeout(fade);
      window.clearTimeout(remove);
    };
  }, []);

  const dismiss = () => {
    setLeaving(true);
    window.setTimeout(() => {
      if (overlayRef.current) overlayRef.current.hidden = true;
    }, 500);
  };

  return (
    <>
      <div
        ref={overlayRef}
        id="intro-overlay"
        // The inline script below may set `hidden` before hydration on purpose.
        suppressHydrationWarning
        role="presentation"
        onClick={dismiss}
        className={cn(
          // The CSS animation is a no-JavaScript safety net: the overlay always clears itself.
          "fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-brand-950 text-white transition-opacity duration-500 animate-[intro-auto-hide_0.4s_ease_3.8s_forwards]",
          leaving ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        <span className="mb-2 flex size-16 items-center justify-center rounded-2xl bg-brand-600">
          <Building2 className="size-8" aria-hidden="true" />
        </span>
        <FlipFadeText
          words={["WELCOME", "YMCA HOSTELS", "FARIDABAD"]}
          interval={1000}
          letterDuration={0.4}
          staggerDelay={0.04}
          exitStaggerDelay={0.02}
          className="min-h-[120px]"
          textClassName="text-3xl text-white sm:text-5xl md:text-6xl dark:text-white"
        />
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">J C Bose University, Faridabad</p>
        <p className="absolute bottom-8 text-xs text-white/40">Click anywhere to skip</p>
      </div>
      {/* Repeat visitors in the same session: hide before first paint, not after hydration. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem("${SEEN_KEY}")==="1"){var o=document.getElementById("intro-overlay");if(o)o.hidden=true}}catch(e){}`,
        }}
      />
    </>
  );
}
