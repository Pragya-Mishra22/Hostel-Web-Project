"use client";

import * as React from "react";
import { Search, X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  href?: string;
}

export interface SearchModalProps {
  placeholder?: string;
  results: SearchResult[];
  query: string;
  onQueryChange: (query: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (result: SearchResult) => void;
  hotkey?: string | null;
}

/**
 * SearchModal — a command-palette style search (⌘K / Ctrl+K). Adapted from
 * the reference to use lucide-react throughout, matching every other icon
 * in the app (the reference used @phosphor-icons/react — mixing two icon
 * sets breaks the "one icon language" rule and is dead weight in the bundle).
 */
export function SearchModal({
  placeholder = "Search students, rooms, complaints…",
  results,
  query,
  onQueryChange,
  open,
  onOpenChange,
  onSelect,
  hotkey = "k",
}: SearchModalProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (hotkey && e.key.toLowerCase() === hotkey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      } else if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, hotkey, onOpenChange]);

  React.useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  return (
    <div
      aria-hidden={!open}
      onClick={() => onOpenChange(false)}
      className={cn(
        "fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[14vh] transition-opacity duration-200",
        open ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-2xl transition-all duration-200",
          open ? "translate-y-0 scale-100 opacity-100" : "-translate-y-2 scale-[0.98] opacity-0",
        )}
      >
        <div className="flex items-center gap-2 border-b border-[var(--color-line)] px-4 py-3.5">
          <Search className="size-4 text-ink-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={placeholder}
            aria-label="Search"
            className="min-w-0 flex-1 bg-transparent px-2 text-sm text-ink outline-none placeholder:text-ink-muted/70"
          />
          <button
            type="button"
            aria-label="Close search"
            onClick={() => onOpenChange(false)}
            className="flex size-7 items-center justify-center rounded-md text-ink-muted hover:bg-surface-muted"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <ul className="max-h-80 overflow-y-auto p-1.5">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-ink-muted">No matches yet. Keep typing.</li>
          ) : (
            results.map((result) => {
              const Icon = result.icon;
              return (
                <li key={result.id}>
                  <button
                    type="button"
                    onClick={() => onSelect?.(result)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-surface-muted"
                  >
                    {Icon ? (
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                    ) : null}
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ink">{result.title}</span>
                      {result.subtitle ? (
                        <span className="block truncate text-xs text-ink-muted">{result.subtitle}</span>
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
