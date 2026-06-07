"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

export default function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      // Small delay to ensure the document title has updated
      setTimeout(() => {
        trackPageView(pathname, document.title);
      }, 500);
    }
  }, [pathname, searchParams]);

  return null; // Invisible tracking component
}
