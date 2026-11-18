"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * ScrollReveal — splits the text inside into lines and blurs/fades each one
 * in as it scrolls into view, used for section headings on the public
 * marketing pages (home, safety). Kept off data-dense admin/student screens
 * on purpose: splitting dozens of table cells into lines on every render
 * would be real, measurable overhead for no visual benefit there.
 */
export function ScrollReveal({
  children,
  className,
  as: Tag = "div",
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  once?: boolean;
}) {
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let split: SplitText | undefined;
    let trigger: ScrollTrigger | undefined;
    const ctx = gsap.context(() => {
      split = SplitText.create(el, { type: "lines", linesClass: "reveal-line" });
      gsap.set(split.lines, { opacity: 0, y: 24, filter: "blur(6px)" });
      const tween = gsap.to(split.lines, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once,
        },
      });
      trigger = tween.scrollTrigger;
    }, el);

    return () => {
      trigger?.kill();
      split?.revert();
      ctx.revert();
    };
  }, [once]);

  const Component = Tag as React.ElementType;
  return (
    <Component ref={ref as React.Ref<never>} className={className}>
      {children}
    </Component>
  );
}
