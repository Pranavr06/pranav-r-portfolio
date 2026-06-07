"use client";

import { useEffect, useRef } from "react";
import { trackSectionView } from "@/lib/analytics";

export default function SectionTracker({ 
  sectionId, 
  children 
}: { 
  sectionId: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const enterTimeRef = useRef<number | null>(null);
  const maxScrollRef = useRef<number>(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Section came into view
            if (!enterTimeRef.current) {
              enterTimeRef.current = Date.now();
            }
          } else {
            // Section left view
            if (enterTimeRef.current) {
              const timeSpent = Date.now() - enterTimeRef.current;
              // Only log if they spent at least 1 second looking at it
              if (timeSpent > 1000) {
                // Get approximate scroll depth across whole page
                const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                maxScrollRef.current = Math.max(maxScrollRef.current, scrollDepth);
                
                trackSectionView(sectionId, timeSpent, maxScrollRef.current);
              }
              enterTimeRef.current = null;
            }
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of section is visible
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    // Cleanup on unmount (e.g. user navigates away while section is visible)
    return () => {
      if (enterTimeRef.current) {
        const timeSpent = Date.now() - enterTimeRef.current;
        if (timeSpent > 1000) {
          trackSectionView(sectionId, timeSpent, maxScrollRef.current);
        }
      }
      observer.disconnect();
    };
  }, [sectionId]);

  return <div ref={ref} style={{ width: "100%" }}>{children}</div>;
}
