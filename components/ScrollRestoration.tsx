"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ScrollRestoration() {
  const pathname = usePathname();
  const isNavigatingRef = useRef(false);

  // 1. Browser Native Scroll Restoration Conflict Prevention
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // Safe unique key including search params (in case of dynamic queries)
  const getScrollKey = () => {
    if (typeof window === 'undefined') return '';
    return `scroll_pos_${pathname}${window.location.search}`;
  };

  // 3. sessionStorage Cleanup Strategy
  const cleanupOldScrollPositions = () => {
    try {
      const keys = Object.keys(sessionStorage).filter(k => k.startsWith('scroll_pos_'));
      // Keep only the last 20 scroll positions to prevent unbounded growth
      if (keys.length > 20) {
        keys.slice(0, keys.length - 20).forEach(key => sessionStorage.removeItem(key));
      }
    } catch (e) {
      console.warn("Could not cleanup sessionStorage", e);
    }
  };

  // Throttled scroll listener to save position
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (isNavigatingRef.current) return; // Don't save scroll during automated restoration/navigation

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (pathname && !window.location.hash) {
            sessionStorage.setItem(getScrollKey(), window.scrollY.toString());
            cleanupOldScrollPositions();
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  // Handle click on Next.js Links to detect "New Navigations"
  // If a user clicks a link to go to a page, we want them to start at the top,
  // NOT at their previous scroll position (which is only for Back/Refresh).
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (target && target.href) {
        const url = new URL(target.href);
        // If it's an internal link and not a hash link
        if (url.origin === window.location.origin && !url.hash) {
          // It's a new navigation, so clear the saved scroll position for the target
          sessionStorage.removeItem(`scroll_pos_${url.pathname}${url.search}`);
        }
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
    };
  }, []);

  // Restore scroll position on pathname change (or refresh)
  useEffect(() => {
    isNavigatingRef.current = true;

    // 1. Priority 1: Explicit Hash Navigation
    if (window.location.hash) {
      // Let native hash scrolling handle it, or we can manually scroll to the element.
      // A small timeout ensures the element is rendered.
      setTimeout(() => {
        const id = window.location.hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
        isNavigatingRef.current = false;
      }, 100);
      return;
    }

    // 2. Priority 2: Saved Scroll Restoration State
    const savedPos = sessionStorage.getItem(getScrollKey());
    
    if (savedPos !== null) {
      const targetY = parseInt(savedPos, 10);
      
      // We need to wait for DOM stabilization to prevent flickering and incorrect positions
      // caused by async images, CMS data, or dynamic cards loading.
      let checkCount = 0;
      let lastHeight = 0;
      const MAX_CHECKS = 30; // 3 seconds maximum timeout duration
      
      const checkAndScroll = () => {
        const currentHeight = document.documentElement.scrollHeight;
        
        // 4. Infinite Layout Stabilization Wait Prevention (Max timeout fallback)
        if ((currentHeight === lastHeight && currentHeight >= targetY) || checkCount > MAX_CHECKS) {
          window.scrollTo({ top: targetY, left: 0, behavior: "instant" });
          setTimeout(() => { isNavigatingRef.current = false; }, 100);
        } else {
          lastHeight = currentHeight;
          checkCount++;
          window.scrollTo({ top: targetY, left: 0, behavior: "instant" }); // aggressively try to stay at target
          requestAnimationFrame(() => setTimeout(checkAndScroll, 100)); // check again in 100ms
        }
      };
      
      checkAndScroll();
    } else {
      // 3. Priority 3: Default Scroll to Top behavior
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        isNavigatingRef.current = false;
      }, 50);
    }
  }, [pathname]);

  return null;
}
