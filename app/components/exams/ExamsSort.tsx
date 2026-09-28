"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import type { KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { RefreshIcon, SortIcon } from "../icons";
import type { ExamSortBy, SortOrder } from "../../lib/types";

const SORT_OPTIONS: { sortBy: ExamSortBy; sortOrder: SortOrder; label: string }[] = [
  { sortBy: "order", sortOrder: "asc", label: "মডিউল ক্রম (ঊর্ধ্বক্রম)" },
  { sortBy: "order", sortOrder: "desc", label: "মডিউল ক্রম (অধঃক্রম)" },
  { sortBy: "dueDate", sortOrder: "asc", label: "ডিউ ডেট (ঊর্ধ্বক্রম)" },
  { sortBy: "dueDate", sortOrder: "desc", label: "ডিউ ডেট (অধঃক্রম)" },
];

export function ExamsSort({ sortBy, sortOrder }: { sortBy: ExamSortBy; sortOrder: SortOrder }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedIndex = Math.max(
    0,
    SORT_OPTIONS.findIndex((o) => o.sortBy === sortBy && o.sortOrder === sortOrder)
  );
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  // Close when clicking anywhere outside the dropdown.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const openMenu = () => {
    setActiveIndex(selectedIndex);
    setOpen(true);
  };

  const select = (index: number) => {
    setOpen(false);
    buttonRef.current?.focus();
    if (index === selectedIndex) return;
    const option = SORT_OPTIONS[index];
    startTransition(() => {
      router.replace(`/exams?sortBy=${option.sortBy}&sortOrder=${option.sortOrder}`, { scroll: false });
    });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % SORT_OPTIONS.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + SORT_OPTIONS.length) % SORT_OPTIONS.length);
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(SORT_OPTIONS.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        select(activeIndex);
        break;
      case "Escape":
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div className="px-4 pb-5 lg:px-10 flex items-center justify-end gap-2">
      <div ref={containerRef} className="relative">
        <button
          ref={buttonRef}
          type="button"
          role="combobox"
          aria-label="সাজান"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={open ? `${listboxId}-${activeIndex}` : undefined}
          onClick={() => (open ? setOpen(false) : openMenu())}
          onKeyDown={onKeyDown}
          disabled={isPending}
          className="cursor-pointer flex items-center gap-2.5 pl-3.5 pr-4 py-2.5 rounded-lg border-2 border-border bg-background-elevated text-[14px] text-foreground hover:border-navy focus:border-navy focus:outline-none disabled:cursor-wait disabled:opacity-60"
        >
          <SortIcon size={18} />
          {SORT_OPTIONS[selectedIndex].label}
        </button>

        {open && (
          <ul
            id={listboxId}
            role="listbox"
            aria-label="সাজান"
            className="absolute z-20 mt-2 right-0 min-w-full w-max overflow-hidden rounded-xl border border-border bg-background-elevated shadow-xl shadow-black/10"
          >
            {SORT_OPTIONS.map((option, index) => {
              const selected = index === selectedIndex;
              const active = index === activeIndex;
              return (
                <li
                  key={`${option.sortBy}:${option.sortOrder}`}
                  id={`${listboxId}-${index}`}
                  role="option"
                  aria-selected={selected}
                  onPointerEnter={() => setActiveIndex(index)}
                  onClick={() => select(index)}
                  className={`cursor-pointer px-5 py-3.5 text-[14.5px] ${
                    selected ? "bg-navy text-navy-ink" : active ? "bg-navy-soft text-foreground" : "text-foreground"
                  }`}
                >
                  {option.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {isPending && <RefreshIcon size={14} className="animate-spin text-foreground-muted order-first" />}
    </div>
  );
}
