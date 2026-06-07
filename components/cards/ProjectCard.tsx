"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { showToast } from "@/components/Toast";
import { trackEvent } from "@/lib/analytics";

export default function ProjectCard({ project }: { project: any }) {
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

  const isCollegeProj = project.status === "College" || (project.status && project.status.includes("Year"));
  const statusClass = project.status ? project.status.toLowerCase().replace(" ", "-") : "completed";
  
  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/${isCollegeProj || project.slug === 'college-projects' ? 'college-projects' : 'projects'}/${project.slug}`;
    navigator.clipboard.writeText(url);
    showToast("Link copied to clipboard");
    setIsMenuOpen(false);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/${isCollegeProj || project.slug === 'college-projects' ? 'college-projects' : 'projects'}/${project.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: `Check out this project: ${project.title}`,
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
    <article className="details-container color-container" data-status={statusClass}>
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
          <div className={`status-tag status-${statusClass}`}>{project.status}</div>
      </div>
      <figure>
          <img src={project.image_url} alt={project.title} className="project-img" loading="lazy" />
          <figcaption><h2 className="experience-sub-title project-title">{project.title}</h2></figcaption>
      </figure>
      <p>{project.description}</p>
      <div className="tech-stack">
        {project.tech_stack?.map((tech: string, i: number) => (
          <span key={i} className="tech-tag">{tech}</span>
        ))}
      </div>
      <div className="project-card-footer">
        {project.status === "Collection" ? (
          <Link href={`/${project.slug === 'college-projects' ? 'college-projects' : 'projects/' + project.slug}`} className="read-more-link" aria-label={`View ${project.title} Collection`}>
            View Collection &rarr;
          </Link>
        ) : (
          <>
            <Link href={`/${isCollegeProj ? 'college-projects' : 'projects'}/${project.slug}`} className="read-more-link" aria-label={`Read more about ${project.title}`}>
              Read More &rarr;
            </Link>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {project.demo_url ? (
                <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="btn btn-color-2 project-btn" aria-label={`View ${project.title}`} onClick={() => trackEvent("click_live_demo", project.title)}>
                  {project.demo_url.includes('research-paper') ? 'Research Paper' : project.demo_url.includes('.pdf') ? 'View Report' : 'Live Demo'}
                </a>
              ) : (
                <button className="btn btn-color-2 project-btn" disabled aria-label={`View ${project.title} (${project.status})`}>
                  Live Demo
                </button>
              )}
              {project.repo_url && (
                <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="btn btn-color-2 project-btn" aria-label={`Source Code for ${project.title}`} onClick={() => trackEvent("click_github", project.title)}>
                  Code
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </article>
  );
}
