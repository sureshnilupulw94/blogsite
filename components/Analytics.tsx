"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Fires one anonymous pageview per path per session. */
export default function Analytics({ locale }: { locale: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.doNotTrack === "1") return;
    const key = `fs_pv_${pathname}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* private mode — still send, just may duplicate */
    }
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "pageview",
        path: pathname,
        locale,
        ref: typeof document !== "undefined" ? document.referrer.slice(0, 300) : null,
      }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname, locale]);

  return null;
}
