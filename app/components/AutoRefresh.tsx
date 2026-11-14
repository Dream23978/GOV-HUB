"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const SYNC_CHANNEL_NAME = "govhub-sync";
const SYNC_STORAGE_KEY = "govhub_sync_ping";

/**
 * Mengirim sinyal sinkronisasi instan ke seluruh tab warga & admin yang terbuka di browser.
 */
export function broadcastSync() {
  if (typeof window === "undefined") return;
  try {
    if ("BroadcastChannel" in window) {
      const ch = new BroadcastChannel(SYNC_CHANNEL_NAME);
      ch.postMessage({ type: "sync", ts: Date.now() });
      ch.close();
    }
    localStorage.setItem(SYNC_STORAGE_KEY, String(Date.now()));
  } catch {
    // ignore storage/channel errors
  }
}

export function AutoRefresh({ intervalMs = 5000 }: { intervalMs?: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const lastRefreshRef = useRef<number>(0);

  useEffect(() => {
    const isEditingBlocked = () => {
      if (
        pathname?.includes("/ajukan") ||
        pathname?.includes("/edit") ||
        pathname?.includes("/profil") ||
        pathname?.includes("/auth")
      ) {
        return true;
      }
      if (typeof document !== "undefined") {
        const tag = document.activeElement?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
          return true;
        }
        if (document.querySelector('[role="dialog"]')) {
          return true;
        }
      }
      return false;
    };

    const triggerRefresh = () => {
      if (isEditingBlocked()) return;
      const now = Date.now();
      // Cegah double-refresh terlalu berdekatan saat event beruntun (mis. focus + visibilitychange)
      if (now - lastRefreshRef.current < 400) return;
      lastRefreshRef.current = now;
      router.refresh();
    };

    const id = setInterval(() => {
      if (document.visibilityState === "visible") {
        triggerRefresh();
      }
    }, intervalMs);

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        triggerRefresh();
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === SYNC_STORAGE_KEY) {
        triggerRefresh();
      }
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("storage", handleStorage);

    let channel: BroadcastChannel | null = null;
    if ("BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
        channel.onmessage = () => triggerRefresh();
      } catch {
        channel = null;
      }
    }

    return () => {
      clearInterval(id);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener("storage", handleStorage);
      if (channel) channel.close();
    };
  }, [router, pathname, intervalMs]);

  return null;
}
