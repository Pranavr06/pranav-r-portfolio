"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { showToast } from "@/components/Toast";
import { slugify } from "@/lib/slug";
import { 
  Code2, 
  Server, 
  ShieldCheck, 
  Sparkles, 
  Palette, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';

export default function ExperienceCard({ experience }: { experience: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Compute card slug for deep-linking
  const cardSlug = experience.read_more_url && experience.read_more_url.includes('#')
    ? experience.read_more_url.split('#')[1]
    : slugify(experience.title);

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
      if (experience.read_more_url.startsWith('http')) {
        return experience.read_more_url;
      }
      return `${window.location.origin}${experience.read_more_url.startsWith('/') ? '' : '/'}${experience.read_more_url}`;
    }
    const slug = slugify(experience.title);
    if (experience.category === 'technical_expertise') {
      return `${window.location.origin}/experiences/technical-expertise#${slug}`;
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
    const titleLower = (experience.title || '').toLowerCase();
    
    let DomainIcon = Code2;
    let eyebrow = "Architecture & Systems";
    let accentClass = "accent-web";
    let fallbackHighlight = null;

    if (titleLower.includes('web')) {
      DomainIcon = Code2;
      eyebrow = "Frontend & Client Engineering";
      accentClass = "accent-web";
    } else if (titleLower.includes('backend') || titleLower.includes('database')) {
      DomainIcon = Server;
      eyebrow = "Distributed Services & Storage";
      accentClass = "accent-backend";
    } else if (titleLower.includes('security') || titleLower.includes('system')) {
      DomainIcon = ShieldCheck;
      eyebrow = "System Hardening & Auth";
      accentClass = "accent-security";
    } else if (titleLower.includes('ai') || titleLower.includes('feature')) {
      DomainIcon = Sparkles;
      eyebrow = "Applied AI & Inference Pipelines";
      accentClass = "accent-ai";
      fallbackHighlight = '<strong>Relevant Work:</strong> <a href="/projects/sentiment-analysis-ai" class="expertise-link">Sentiment Analysis AI</a>';
    } else if (titleLower.includes('design') || titleLower.includes('tool')) {
      DomainIcon = Palette;
      eyebrow = "UI/UX & Interactive Design";
      accentClass = "accent-design";
      fallbackHighlight = '<strong>Relevant Work:</strong> <a href="/projects/3d-aircraft-model" class="expertise-link">3D Aircraft Model</a>';
    }

    let highlightHtml = experience.highlight_text || fallbackHighlight;
    if (highlightHtml && highlightHtml.includes('online-exam-project')) {
      highlightHtml = highlightHtml
        .replace(/\/college-projects\/online-exam-project/g, '/projects/college-projects/online-examination-management-system')
        .replace(/\/projects\/college-projects\/online-exam-project/g, '/projects/college-projects/online-examination-management-system')
        .replace(/\/projects\/online-exam-project/g, '/projects/college-projects/online-examination-management-system');
    }

    return (
      <div id={cardSlug} className={`expertise-card ${accentClass}`}>
        <div className="expertise-card-top">
          <div className="domain-header-left">
            <div className="domain-icon-wrap">
              <DomainIcon size={22} className="domain-icon" />
            </div>
            <div className="domain-header-meta">
              <span className="domain-eyebrow">{eyebrow}</span>
              <h3 className="expertise-title">
                {experience.icon && <span style={{ marginRight: '8px' }}>{experience.icon}</span>}
                {experience.title}
              </h3>
            </div>
          </div>
          <MenuDropdown />
        </div>
        
        {experience.tags && Array.isArray(experience.tags) && (
          <div className="expertise-skills">
            {experience.tags.map((tag: string, idx: number) => (
              <span key={idx} className="tech-tag">
                <span className="tag-dot" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {experience.bullet_points && Array.isArray(experience.bullet_points) && (
          <div className="expertise-proof-wrap">
            <ul className="expertise-proof">
              {experience.bullet_points.map((pt: string, idx: number) => (
                <li key={idx}>
                  <CheckCircle2 size={16} className="proof-check-icon" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {highlightHtml && (
          <div className="expertise-work">
            <div className="work-highlight-content" dangerouslySetInnerHTML={{ __html: highlightHtml }} />
          </div>
        )}
      </div>
    );
  }

  // Professional Journey Category
  return (
    <article id={cardSlug} className="details-container color-container">
      <MenuDropdown />
      
      {experience.image_url && (
        <figure>
            <img src={experience.image_url} alt={experience.title} className="project-img" loading="lazy" />
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
