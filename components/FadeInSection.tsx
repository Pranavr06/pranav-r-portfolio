"use client";

import { useEffect, useRef, useState } from "react";

export default function FadeInSection({ 
  children, 
  id, 
  className = "" 
}: { 
  children: React.ReactNode, 
  id?: string, 
  className?: string 
}) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // If IntersectionObserver is somehow not supported, show it immediately
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        // If it is in view, OR if the user has already scrolled past it (e.g. Back button)
        if (entry.isIntersecting || entry.boundingClientRect.top <= 0) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    const current = domRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <section 
      id={id} 
      ref={domRef} 
      className={`fade-in-section ${isVisible ? 'visible' : ''} ${className}`}
    >
      {children}
    </section>
  );
}
