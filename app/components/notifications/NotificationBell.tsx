"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { authFetch } from "../../lib/clientFetch";
import type { NotificationItem, NotificationsPage } from "../../lib/types";
import { BellIcon, RefreshIcon, XIcon } from "../icons";
import { NotificationRow } from "./NotificationRow";

const PAGE_SIZE = 10;
const LOAD_ERROR = "নোটিফিকেশন লোড করা যায়নি।";

async function fetchPage(page: number) {
  const res = await authFetch(
    `/api/notifications?page=${page}&pageSize=${PAGE_SIZE}`,
  );
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error?.message ?? LOAD_ERROR);
  return body as NotificationsPage;
}

function hrefFor(item: NotificationItem) {
  if (!item.moduleSlug) return null;
  const base = `/modules/${encodeURIComponent(item.moduleSlug)}`;
  return item.type === "exam_deadline" ? `${base}/exam` : base;
}

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // (Re)loads the first page. Runs on mount so the bell dot is accurate, and
  // again on each open so new notifications show up; it never clears what's
  // already on screen, so reopening doesn't flash a spinner.
  const refresh = useCallback(async () => {
    try {
      const result = await fetchPage(1);
      setItems(result.items);
      setPage(1);
      setHasNext(result.hasNext);
      setUnreadCount(result.unreadCount);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : LOAD_ERROR);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function toggle() {
    if (!open) void refresh();
    setOpen((v) => !v);
  }

  async function loadMore() {
    if (loadingMore) return;
    setLoadingMore(true);
    setError(null);
    try {
      const result = await fetchPage(page + 1);
      // Skip anything already shown: a notification published since the last
      // refresh shifts every row down, so the next page can repeat a row.
      setItems((prev) => {
        const seen = new Set(prev.map((n) => n.id));
        return [...prev, ...result.items.filter((n) => !seen.has(n.id))];
      });
      setPage(result.page);
      setHasNext(result.hasNext);
      setUnreadCount(result.unreadCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : LOAD_ERROR);
    } finally {
      setLoadingMore(false);
    }
  }

  function setRead(id: string, isRead: boolean) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead } : n)));
  }

  async function markRead(item: NotificationItem) {
    // Optimistic: the row and bell dot update immediately, and roll back if
    // the request fails so the notification isn't silently left unread-looking
    // as read.
    setRead(item.id, true);
    setUnreadCount((n) => Math.max(n - 1, 0));
    try {
      const res = await authFetch(
        `/api/notifications/${encodeURIComponent(item.id)}/read`,
        { method: "POST" },
      );
      if (!res.ok) throw new Error("mark-read failed");
    } catch {
      setRead(item.id, false);
      setUnreadCount((n) => n + 1);
    }
  }

  function onSelect(item: NotificationItem) {
    if (!item.isRead) void markRead(item);
    setOpen(false);
    const href = hrefFor(item);
    if (href) router.push(href);
  }

  const badge = unreadCount > 99 ? "৯৯+" : unreadCount.toLocaleString("bn-BD");

  return (
    <div className="lg:relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={toggle}
        aria-label={unreadCount > 0 ? `নোটিফিকেশন, ${badge}টি অপঠিত` : "নোটিফিকেশন"}
        aria-expanded={open}
        className={`relative w-8 h-8 lg:w-9 lg:h-9 rounded-full border border-border flex items-center justify-center shrink-0 cursor-pointer ${
          open
            ? "bg-navy-soft text-navy"
            : "text-foreground-muted hover:text-foreground"
        }`}
      >
        <BellIcon size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 px-1 rounded-full bg-accent text-accent-ink text-[10.5px] font-bold leading-none flex items-center justify-center ring-2 ring-background-elevated">
            {badge}
          </span>
        )}
      </button>

      {open && (
        // Mobile: a full-width sheet below the 64px top bar that also covers
        // the bottom nav (z-40 > its z-30). Desktop: a dropdown under the bell.
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col bg-background-elevated border-t border-border lg:absolute lg:inset-x-auto lg:bottom-auto lg:right-0 lg:top-full lg:mt-2 lg:w-[396px] lg:max-h-[calc(100vh-100px)] lg:rounded-xl lg:border lg:shadow-lg lg:z-30">
          <div className="px-4 pt-4 pb-2 shrink-0 flex items-center justify-between">
            <h2 className="font-display font-bold text-[20px] text-foreground">
              নোটিফিকেশন
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="বন্ধ করুন"
              className="lg:hidden w-9 h-9 -mr-2 rounded-full flex items-center justify-center text-foreground-muted hover:bg-background cursor-pointer"
            >
              <XIcon size={18} />
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
            {!loaded ? (
              <div className="flex justify-center py-10 text-foreground-muted">
                <RefreshIcon size={18} className="animate-spin" />
              </div>
            ) : items.length === 0 ? (
              <div className="text-center text-[13.5px] text-foreground-muted py-10">
                {error ?? "কোনো নোটিফিকেশন নেই।"}
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <NotificationRow
                    key={item.id}
                    item={item}
                    onSelect={onSelect}
                  />
                ))}
                {/* Lives inside the scroll area so it only appears once the
                    user has scrolled to the end of the loaded notifications. */}
                {(hasNext || error) && (
                  <div className="px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
                    {error && (
                      <p className="text-[12.5px] text-error text-center mb-2">
                        {error}
                      </p>
                    )}
                    {hasNext && (
                      <button
                        type="button"
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="w-full flex items-center justify-center gap-2 py-3 lg:py-2.5 rounded-lg bg-background text-[13.5px] font-semibold text-foreground hover:bg-navy-soft cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loadingMore && (
                          <RefreshIcon size={14} className="animate-spin" />
                        )}
                        {loadingMore ? "লোড হচ্ছে..." : "আরও দেখুন"}
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
