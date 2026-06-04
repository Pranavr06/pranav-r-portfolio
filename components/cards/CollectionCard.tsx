"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { showToast } from "@/components/Toast";

interface CollectionCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  href: string;
}

export default function CollectionCard({ title, description, image, tags, href }: CollectionCardProps) {
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
    const url = `${window.location.origin}${href}`;
    navigator.clipboard.writeText(url);
    showToast("Link copied to clipboard");
    setIsMenuOpen(false);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}${href}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this collection: ${title}`,
          url: url,
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
    <article className="details-container color-container">
      <div className="menu-container" ref={menuRef}>
          <button 
            className="menu-btn card-menu-btn" 
            aria-label="More options"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
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
      <div className="status-wrapper">
          <div className="status-tag status-collection">Collection</div>
      </div>
      <figure>
          <img src={image} alt={title} className="project-img" loading="lazy" />
          <figcaption><h2 className="experience-sub-title project-title">{title}</h2></figcaption>
      </figure>
      <p style={{ textAlign: 'center' }}>{description}</p>
      <div className="tech-stack">
          {tags.map((tag, idx) => (
            <span key={idx} className="tech-tag">{tag}</span>
          ))}
      </div>
      <div className="project-card-footer center-footer">
          <Link href={href} className="btn btn-color-2 project-btn" aria-label={`Explore ${title}`}>
            Explore
          </Link>
      </div>
    </article>
  );
}
