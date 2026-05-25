"use client";
import React, { useState, useEffect, useRef } from 'react';
import { showToast } from '@/components/Toast';

export default function ShareMenu({ title, slug, type = "projects", urlOverride, downloadUrl, downloadName }: { title: string, slug?: string, type?: "projects" | "blogs" | "certificates" | "page", urlOverride?: string, downloadUrl?: string, downloadName?: string }) {
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

  const getUrl = () => {
    if (urlOverride) return urlOverride;
    if (type === "page" || !slug) return window.location.href;
    return `${window.location.origin}/${type}/${slug}`;
  };

  const getTypeName = () => {
    if (type === "projects") return "Project";
    if (type === "blogs") return "Blog";
    if (type === "certificates") return "Certificate";
    return "Page";
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getUrl());
    showToast(`${getTypeName()} link copied to clipboard`);
    setIsOpen(false);
  };

  const handleShare = async () => {
    const url = getUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this ${getTypeName().toLowerCase()}: ${title} by Pranav R!`,
          url: url,
        });
      } catch (err) {}
    } else {
      handleCopyLink();
    }
    setIsOpen(false);
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = downloadName || `${title.replace(/\s+/g, '_')}_Document.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
  };

  return (
    <div className="menu-container" ref={menuRef} style={{ position: "relative" }}>
      <div className="custom-tooltip-wrapper">
        <button 
          className="menu-btn" 
          aria-label="More options" 
          onClick={() => setIsOpen(!isOpen)}
          style={{ color: "#666", display: "flex", alignItems: "center", justifyContent: "center", padding: "0.4rem", borderRadius: "50%", width: "40px", height: "40px", border: "none", background: "none", cursor: "pointer" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="12" cy="19" r="1"/>
            <circle cx="12" cy="5" r="1"/>
          </svg>
        </button>
        <span className="custom-tooltip">More options</span>
      </div>

      <div className={`options-menu ${isOpen ? 'open' : ''}`}>
          <button className="menu-option btn-copy-link" onClick={handleCopyLink}>Copy Link</button>
          <button className="menu-option btn-share" onClick={handleShare}>Share</button>
          {downloadUrl && (
            <button className="menu-option" onClick={handleDownload}>Download PDF</button>
          )}
      </div>
    </div>
  );
}
