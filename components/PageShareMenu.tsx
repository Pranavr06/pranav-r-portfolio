"use client";

import React, { useState, useEffect, useRef } from 'react';
import { showToast } from "@/components/Toast";

export default function PageShareMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    showToast("Link copied to clipboard");
    setIsMenuOpen(false);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyLink(e);
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="menu-container" ref={menuRef} style={{ display: 'inline-block', position: 'relative' }}>
      <button 
        className="menu-btn card-menu-btn" 
        aria-label="More options"
        data-tooltip="More options"
        onClick={(e) => {
          e.stopPropagation();
          setIsMenuOpen(!isMenuOpen);
        }}
        style={{ padding: '4px', display: 'flex', alignItems: 'center' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/><circle cx="12" cy="5" r="1"/></svg>
      </button>
      <div className={`options-menu ${isMenuOpen ? 'open' : ''}`}>
        <button className="menu-option btn-copy-link" onClick={handleCopyLink}>
          Copy Link
        </button>
        <button className="menu-option btn-share" onClick={handleShare}>
          Share
        </button>
      </div>
    </div>
  );
}
