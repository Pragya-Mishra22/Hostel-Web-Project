"use client";

import * as React from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  Plus,
  FileDown,
  Share2,
  CheckCheck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * SearchModal: a command-palette panel with a live search bar, removable
 * "I'm looking for" tags that filter result groups, result rows with per-row
 * actions, quick actions with working Alt+key shortcuts, and a files section.
 * Icons are lucide (the rest of the site uses one icon family).
 */

export interface SearchTag {
  /** Matches `SearchResult.category`; removing the tag hides that group. */
  id: string;
  label: string;
  icon?: LucideIcon;
}

export interface SearchResultAction {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

export interface SearchResult {
  id: string;
  name: string;
  /** Secondary text, also matched by the live filter. */
  meta?: string;
  category?: string;
  /** Avatar image URL. Falls back to the icon, then a neutral circle. */
  avatar?: string;
  icon?: LucideIcon;
  href?: string;
  actions?: SearchResultAction[];
}

export interface QuickAction {
  label: string;
  icon?: LucideIcon;
  /** Letter for the Alt+letter shortcut (shown as a hint, and it works). */
  shortcut?: string;
  href?: string;
  onClick?: () => void;
}

export interface SearchFile {
  name: string;
  ext?: string;
  icon?: LucideIcon;
  verified?: boolean;
  href?: string;
  onShare?: () => void;
}

export interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onQueryChange: (query: string) => void;
  placeholder?: string;
  tags?: SearchTag[];
  results?: SearchResult[];
  quickActions?: QuickAction[];
  files?: SearchFile[];
  /** Live-filter `results` by the query here. Turn off when the parent already returns filtered (server) results. */
  filter?: boolean;
  loading?: boolean;
  onSelectResult?: (result: SearchResult) => void;
  /** Called to navigate to an href (pass router.push so navigation stays client-side). */
  onNavigate?: (href: string) => void;
  /** Key pressed with Cmd/Ctrl that toggles the modal. Null disables it. */
  hotkey?: string | null;
  emptyText?: string;
}

const ICON = "size-[18px] text-ink-muted";

export function SearchModal({
  open,
  onOpenChange,
  query,
  onQueryChange,
  placeholder = "Search",
  tags = [],
  results = [],
  quickActions = [],
  files = [],
  filter = true,
  loading = false,
  onSelectResult,
  onNavigate,
  hotkey = "k",
  emptyText = "No matches. Try another word.",
}: SearchModalProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [removedTags, setRemovedTags] = React.useState<string[]>([]);

  const go = React.useCallback(
    (href?: string, fn?: () => void) => {
      fn?.();
      if (href) {
        onOpenChange(false);
        if (onNavigate) onNavigate(href);
        else window.location.assign(href);
      }
    },
    [onNavigate, onOpenChange],
  );

  // Ctrl/Cmd+K toggles, Escape closes, Alt+letter runs a quick action.
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (hotkey && e.key.toLowerCase() === hotkey.toLowerCase() && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        onOpenChange(false);
        return;
      }
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const action = quickActions.find((a) => a.shortcut && a.shortcut.toLowerCase() === e.key.toLowerCase());
        if (action) {
          e.preventDefault();
          go(action.href, action.onClick);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, hotkey, onOpenChange, quickActions, go]);

  React.useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  const activeTags = tags.filter((t) => !removedTags.includes(t.id));

  const filteredResults = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return results.filter((r) => {
      if (r.category && tags.length > 0 && removedTags.includes(r.category)) return false;
      if (!filter || !q) return true;
      return `${r.name} ${r.meta ?? ""}`.toLowerCase().includes(q);
    });
  }, [query, results, filter, removedTags, tags.length]);

  return (
    <div
      aria-hidden={!open}
      inert={!open}
      onClick={() => onOpenChange(false)}
      className={cn(
        "fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[10vh] transition-opacity duration-200",
        open ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative z-10 max-h-[80dvh] w-full max-w-xl overflow-y-auto rounded-2xl border border-line bg-card text-ink shadow-[0_18px_50px_-16px_rgba(0,0,0,0.5)] transition-all duration-200 ease-out",
          open ? "translate-y-0 scale-100 opacity-100" : "-translate-y-2 scale-[0.98] opacity-0",
        )}
      >
        {/* Search bar */}
        <div className="sticky top-0 z-10 flex items-center gap-1 border-b border-line bg-card px-4 py-3.5">
          <Search className={ICON} aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={placeholder}
            aria-label="Search"
            className="min-w-0 flex-1 bg-transparent px-3 text-sm text-ink outline-none placeholder:text-ink-muted"
          />
          <div className="flex shrink-0 items-center gap-2.5">
            {removedTags.length > 0 ? (
              <button
                type="button"
                aria-label="Reset filters"
                onClick={() => setRemovedTags([])}
                className="text-ink-muted transition-colors hover:text-ink"
              >
                <SlidersHorizontal className="size-[18px]" aria-hidden="true" />
              </button>
            ) : null}
            <kbd className="hidden items-center rounded-md border border-line bg-surface-muted px-1.5 py-0.5 font-sans text-[11px] font-medium text-ink-muted sm:flex">
              Esc
            </kbd>
            <button
              type="button"
              aria-label="Close search"
              onClick={() => onOpenChange(false)}
              className="flex size-7 items-center justify-center rounded-md text-ink-muted hover:bg-surface-muted sm:hidden"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Tags */}
        {activeTags.length > 0 ? (
          <div className="border-b border-line px-4 py-3.5">
            <span className="text-[13px] text-ink-muted">I&apos;m looking for...</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {activeTags.map((tag) => {
                const Icon = tag.icon;
                return (
                  <span
                    key={tag.id}
                    className="flex items-center gap-1.5 rounded-full bg-surface-muted py-1 pl-2.5 pr-2 text-[13px] ring-1 ring-inset ring-line"
                  >
                    {Icon ? <Icon className="size-4 text-accent-fg" aria-hidden="true" /> : null}
                    <span>{tag.label}</span>
                    <button
                      type="button"
                      onClick={() => setRemovedTags((prev) => [...prev, tag.id])}
                      aria-label={`Remove ${tag.label}`}
                      className="text-ink-muted transition-colors hover:text-ink"
                    >
                      <X className="size-3.5" aria-hidden="true" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Results */}
        <div className="border-b border-line">
          <p className="px-4 pb-2 pt-3.5 text-[13px] text-ink-muted" aria-live="polite">
            {query.trim() ? "Results" : "Suggested"}&nbsp;&nbsp;
            <span className="text-ink">{loading ? "..." : filteredResults.length}</span>
          </p>
          {filteredResults.length === 0 ? (
            <p className="px-4 pb-4 text-sm text-ink-muted">{loading ? "Searching..." : emptyText}</p>
          ) : (
            <ul className="px-1.5 pb-1.5">
              {filteredResults.map((result) => {
                const Icon = result.icon;
                return (
                  <li key={result.id}>
                    <div className="group relative flex items-center rounded-lg px-2.5 py-2 transition-colors hover:bg-surface-muted">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectResult?.(result);
                          go(result.href);
                        }}
                        className="flex min-w-0 flex-1 items-center text-left"
                      >
                        {result.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={result.avatar} alt="" className="size-6 shrink-0 rounded-full object-cover ring-1 ring-line" />
                        ) : Icon ? (
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-accent-fg">
                            <Icon className="size-3.5" aria-hidden="true" />
                          </span>
                        ) : (
                          <span className="size-6 shrink-0 rounded-full bg-surface-muted ring-1 ring-line" />
                        )}
                        <span className="ml-2.5 truncate text-sm">
                          {result.name}
                          {result.meta ? <span className="pl-1.5 text-ink-muted">{result.meta}</span> : null}
                        </span>
                      </button>
                      {result.actions && result.actions.length > 0 ? (
                        <span className="ml-auto flex items-center gap-2.5 pl-3 text-ink-muted opacity-70 transition-opacity group-hover:opacity-100">
                          {result.actions.map((action) => (
                            <button
                              key={action.label}
                              type="button"
                              aria-label={action.label}
                              onClick={() => action.onClick?.()}
                              className="transition-colors hover:text-ink"
                            >
                              <action.icon className="size-4" aria-hidden="true" />
                            </button>
                          ))}
                        </span>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Quick actions */}
        {quickActions.length > 0 ? (
          <div className="border-b border-line px-1.5 py-1.5">
            <p className="px-2.5 pb-1 pt-2 text-[13px] text-ink-muted">Quick actions</p>
            {quickActions.map((action) => {
              const Icon = action.icon ?? Plus;
              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => go(action.href, action.onClick)}
                  className="relative flex w-full items-center rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-surface-muted"
                >
                  <span className="flex size-[30px] shrink-0 items-center justify-center rounded-lg bg-surface-muted text-ink-muted ring-1 ring-inset ring-line">
                    <Icon className="size-[15px]" aria-hidden="true" />
                  </span>
                  <span className="pl-3 text-sm">{action.label}</span>
                  {action.shortcut ? (
                    <kbd className="ml-auto flex h-[26px] items-center justify-center rounded-md bg-surface-muted px-2 font-sans text-[12px] text-ink-muted ring-1 ring-inset ring-line">
                      Alt+{action.shortcut.toUpperCase()}
                    </kbd>
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : null}

        {/* Files */}
        {files.length > 0 ? (
          <div className="px-1.5 py-1.5">
            <p className="px-2.5 pb-1 pt-2 text-[13px] text-ink-muted">
              Files&nbsp;&nbsp;<span className="text-ink">{files.length}</span>
            </p>
            {files.map((file) => {
              const Icon = file.icon ?? FileDown;
              return (
                <div key={file.name} className="group relative flex items-center rounded-lg px-2.5 py-2 transition-colors hover:bg-surface-muted">
                  <button type="button" onClick={() => go(file.href)} className="flex min-w-0 flex-1 items-center text-left">
                    <span className="flex size-[30px] shrink-0 items-center justify-center rounded-lg bg-surface-muted text-ink-muted ring-1 ring-inset ring-line">
                      <Icon className="size-[15px]" aria-hidden="true" />
                    </span>
                    <span className="flex items-center gap-1.5 pl-3 text-sm">
                      <span>
                        {file.name}
                        {file.ext ? <span className="text-ink-muted">{file.ext}</span> : null}
                      </span>
                      {file.verified ? <CheckCheck className="size-4 text-success-fg" aria-hidden="true" /> : null}
                    </span>
                  </button>
                  {file.onShare ? (
                    <button
                      type="button"
                      onClick={file.onShare}
                      className="ml-auto flex items-center gap-1.5 text-sm text-ink-muted opacity-80 transition-all hover:text-ink group-hover:opacity-100"
                    >
                      <Share2 className="size-4" aria-hidden="true" />
                      <span>Share</span>
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default SearchModal;
