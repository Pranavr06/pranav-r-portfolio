"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function FadeInObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const faders = document.querySelectorAll('.fade-in-section');
    const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, appearOptions);
    
    faders.forEach(fader => appearOnScroll.observe(fader));

    return () => {
      faders.forEach(fader => appearOnScroll.unobserve(fader));
    };
  }, [pathname]);

  return null; // This component doesn't render anything itself
}
