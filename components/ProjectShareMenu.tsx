"use client";
import React, { useState, useEffect, useRef } from 'react';
import { showToast } from '@/components/Toast';

export default function ProjectShareMenu({ title, slug }: { title: string, slug: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/projects/${slug}`;
    navigator.clipboard.writeText(url);
    showToast("Project link copied to clipboard");
    setIsOpen(false);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/projects/${slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this project: ${title} by Pranav R!`,
          url: url,
        });
      } catch (err) {}
    } else {
      handleCopyLink();
    }
    setIsOpen(false);
  };

  return (
    <div className="menu-container" ref={menuRef} style={{ position: "relative" }}>
      <button 
        className="menu-btn" 
        aria-label="More options" 
        data-tooltip="More options"
        onClick={() => setIsOpen(!isOpen)}
        style={{ color: "#666", display: "flex", alignItems: "center", justifyContent: "center", padding: "0.4rem", borderRadius: "50%", width: "40px", height: "40px" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1"/>
          <circle cx="12" cy="19" r="1"/>
          <circle cx="12" cy="5" r="1"/>
        </svg>
      </button>

      <div className={`options-menu ${isOpen ? 'open' : ''}`}>
          <button className="menu-option btn-copy-link" onClick={handleCopyLink}>Copy Link</button>
          <button className="menu-option btn-share" onClick={handleShare}>Share</button>
      </div>
    </div>
  );
}
