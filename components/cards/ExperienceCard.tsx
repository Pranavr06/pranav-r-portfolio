"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { showToast } from "@/components/Toast";

export default function ExperienceCard({ experience }: { experience: any }) {
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

  const getShareUrl = () => {
    if (experience.read_more_url) {
      return `${window.location.origin}${experience.read_more_url}`;
    }
    return window.location.href; // Fallback to current page
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(getShareUrl());
    showToast("Link copied to clipboard");
    setIsMenuOpen(false);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: experience.title,
          text: `Check out this experience: ${experience.title}`,
          url: getShareUrl(),
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyLink(e);
    }
    setIsMenuOpen(false);
  };

  const MenuDropdown = () => (
    <div className="menu-container" ref={menuRef}>
      <button 
        className="menu-btn card-menu-btn" 
        aria-label="More options"
        data-tooltip="More options"
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
          {experience.certificate_url && (
            <button className="menu-option btn-download-pdf" onClick={(e) => {
               e.stopPropagation();
               window.open(experience.certificate_url, '_blank');
               setIsMenuOpen(false);
            }}>
              Download PDF
            </button>
          )}
      </div>
    </div>
  );

  if (experience.category === 'technical_expertise') {
    return (
      <div className={`expertise-card ${experience.display_order <= 2 ? 'highlighted-expertise' : ''}`}>
        <MenuDropdown />
        <h3 className="expertise-title">
          {experience.icon && <span style={{ marginRight: '8px' }}>{experience.icon}</span>}
          {experience.title}
        </h3>
        
        {experience.tags && Array.isArray(experience.tags) && (
          <div className="expertise-skills">
            {experience.tags.map((tag: string, idx: number) => (
              <span key={idx} className="tech-tag">{tag}</span>
            ))}
          </div>
        )}

        {experience.bullet_points && Array.isArray(experience.bullet_points) && (
          <ul className="expertise-proof">
            {experience.bullet_points.map((pt: string, idx: number) => (
              <li key={idx}>{pt}</li>
            ))}
          </ul>
        )}

        {experience.highlight_text && (
          <div className="expertise-work" dangerouslySetInnerHTML={{ __html: experience.highlight_text }} />
        )}
      </div>
    );
  }

  // Professional Journey Category
  return (
    <article className="details-container color-container">
      <MenuDropdown />
      
      {experience.image_url && (
        <figure>
            <Image src={experience.image_url} alt={experience.title} className="project-img" width={400} height={250} />
            <figcaption>
              {experience.title.includes("MY Bharat") ? (
                <h3 className="experience-sub-title project-title" style={{ transform: "translateY(15px)", lineHeight: "1.2" }}>
                  MY Bharat Budget Quest<br/>2026 – Final Round
                </h3>
              ) : (
                <h3 className="experience-sub-title project-title">{experience.title}</h3>
              )}
            </figcaption>
        </figure>
      )}
      
      {experience.date_text && (
        <p className="certificate-date">{experience.date_text}</p>
      )}
      
      {experience.description && (
        <p>{experience.description}</p>
      )}

      {experience.tags && Array.isArray(experience.tags) && (
        <div className="tech-stack" style={{ marginBottom: '1rem' }}>
          {experience.tags.map((tag: string, idx: number) => (
            <span key={idx} className="tech-tag">{tag}</span>
          ))}
        </div>
      )}

      {experience.highlight_text && (
        <p className="achievement-highlight">{experience.highlight_text}</p>
      )}

      <div className="project-card-footer" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {experience.read_more_url && (
          <Link href={experience.read_more_url} className="read-more-link" aria-label={`Read ${experience.title} Experience`}>
            View Experience &rarr;
          </Link>
        )}
        {experience.certificate_url && (
          <a href={experience.certificate_url} className="btn btn-color-2 project-btn" target="_blank" rel="noopener noreferrer" aria-label={`View ${experience.title} certificate`}>
            Certificate
          </a>
        )}
      </div>
    </article>
  );
}
