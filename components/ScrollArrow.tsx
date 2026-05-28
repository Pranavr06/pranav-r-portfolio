"use client";

import React from 'react';

interface ScrollArrowProps {
  direction?: 'up' | 'down';
  targetId?: string;
  altText?: string;
  invert?: boolean;
}

export default function ScrollArrow({ direction = 'down', targetId, altText, invert = false }: ScrollArrowProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (targetId && targetId !== 'top') {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: direction === 'up' ? 0 : document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  const src = direction === 'up' || invert ? "/assets/arrow-invert.webp" : "/assets/arrow.webp";
  const defaultAlt = direction === 'up' ? "Scroll up" : "Scroll down";
  const className = `icon arrow scroll-${direction}`;
  
  // Use div as wrapper instead of a href when targetId is not provided to prevent routing issues
  const href = targetId && targetId !== 'top' ? `#${targetId}` : '#';

  const linkClass = direction === 'up' ? 'scroll-up-link' : 'scroll-down-link';

  return (
    <a href={href} onClick={handleClick} aria-label={altText || defaultAlt} className={linkClass}>
      <img 
        src={src} 
        alt={altText || defaultAlt} 
        className={className} 
        loading="lazy" 
        style={{ width: "30px", height: "30px", cursor: "pointer" }} 
        title={altText || defaultAlt}
      />
    </a>
  );
}
