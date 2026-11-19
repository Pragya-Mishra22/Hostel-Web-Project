"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

export interface FaqAccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items: FaqItem[];
  title?: string;
}

export function FaqAccordion({ items, title, className, ...props }: FaqAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => setActiveIndex(activeIndex === index ? null : index);

  return (
    <div className={cn("relative mx-auto w-full font-sans", className)} {...props}>
      {title ? <h2 className="mb-10 text-center font-display text-2xl font-bold text-ink-muted md:text-3xl">{title}</h2> : null}

      <ul className="mx-auto flex w-full list-none flex-col p-0">
        {items.map((item, index) => {
          const isActive = activeIndex === index;
          const buttonId = `faq-button-${index}`;
          const panelId = `faq-panel-${index}`;
          return (
            <li
              key={item.question}
              className={cn(
                "relative w-full border-b-2 border-line transition-all duration-300 ease-in last:border-b-0",
                isActive && "border-b border-line",
              )}
            >
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isActive}
                  aria-controls={panelId}
                  onClick={() => toggleItem(index)}
                  className={cn(
                    "relative m-0 flex min-h-[60px] w-full cursor-pointer flex-row items-center justify-start border-l-[6px] py-4 pl-14 pr-12 text-left text-base outline-none transition-colors duration-200 md:border-l-[10px] md:text-lg",
                    isActive
                      ? "border-l-brand-600 bg-brand-soft font-semibold text-ink dark:border-l-brand-300"
                      : "border-l-line bg-transparent text-ink-muted hover:border-l-brand-400 hover:bg-surface-muted hover:text-ink",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-4 top-1/2 -translate-y-1/2 font-normal leading-none transition-all duration-200 md:left-5",
                      isActive ? "text-[32px] text-accent-fg md:text-[40px]" : "text-[24px] text-ink-muted md:text-[30px]",
                    )}
                  >
                    {isActive ? "−" : "+"}
                  </span>

                  <span>{item.question}</span>

                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute right-6 block size-2 border-r-[3px] border-t-[3px] transition-transform duration-200 ease-in-out",
                      isActive ? "-rotate-[44deg] border-accent-fg" : "rotate-[133deg] border-ink-muted",
                    )}
                  />
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                inert={!isActive}
                className={cn(
                  "grid w-full border-l-[6px] transition-all duration-300 ease-in-out md:border-l-[10px]",
                  isActive ? "grid-rows-[1fr] border-l-brand-600 bg-brand-soft dark:border-l-brand-300" : "grid-rows-[0fr] border-l-line bg-transparent",
                )}
              >
                <div className="overflow-hidden">
                  <div className="flex w-full flex-row items-start justify-start px-4 pb-6 pl-14 pt-2 text-base font-normal text-ink-muted md:text-lg">
                    <span>{item.answer}</span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default FaqAccordion;
