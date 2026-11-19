"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");
const getServerSnapshot = (): Theme => "light";

/** Light/dark switch. The theme itself is applied before first paint by the script in layout.tsx. */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // storage can be blocked (private mode); the choice then lasts for this visit only
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-brand-soft hover:text-accent-fg",
        className,
      )}
    >
      {theme === "dark" ? <Sun className="size-[18px]" aria-hidden="true" /> : <Moon className="size-[18px]" aria-hidden="true" />}
    </button>
  );
}
