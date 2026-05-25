"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find all intersecting entries
        const intersecting = entries.filter((entry) => entry.isIntersecting);
        if (intersecting.length > 0) {
          // If multiple, pick the first one on the screen
          setActiveId(intersecting[0].target.id);
        } else {
          // Fallback logic could be used to keep the last active item if scrolled past
          // but relying on rootMargin handles most standard cases.
        }
      },
      {
        rootMargin: "0px 0px -80% 0px", // Triggers when heading is in the top 20% of the viewport
        threshold: 1.0,
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [headings]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100; // 100px offset for fixed headers
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
      
      // Update URL hash without polluting browser history
      history.replaceState(null, "", `#${id}`);
    }
  };

  if (headings.length === 0) return null;

  return (
    <div 
      className="toc-container" 
      role="navigation"
      aria-label="Table of Contents"
      style={{
        backgroundColor: "#f9f9f9",
        border: "1px solid #e0e0e0",
        borderRadius: "0.5rem",
        padding: "1.5rem",
        marginBottom: "2rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
      }}
    >
      <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.5rem", color: "#000" }}>Table of Contents</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {headings.map((heading) => (
          <li 
            key={heading.id} 
            style={{ 
              marginLeft: heading.level === 3 ? "1rem" : "0",
              transition: "all 0.2s ease"
            }}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              style={{
                textDecoration: "none",
                color: activeId === heading.id ? "#007bff" : "#1a73e8",
                fontWeight: activeId === heading.id ? "600" : "400",
                display: "inline-block",
                transition: "color 0.2s ease, transform 0.2s ease"
              }}
              onMouseEnter={(e) => {
                if (activeId !== heading.id) e.currentTarget.style.color = "#0056b3";
              }}
              onMouseLeave={(e) => {
                if (activeId !== heading.id) e.currentTarget.style.color = "#1a73e8";
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
