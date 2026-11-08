"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import ExperienceCard from "@/components/cards/ExperienceCard";
import GitHubActivityCard from "@/components/github/GitHubActivityCard";
import PageShareMenu from "@/components/PageShareMenu";
import { ShieldCheck } from 'lucide-react';

interface TechnicalExpertiseClientProps {
  experiences: any[];
  githubData: {
    user: any;
    contrib: any;
  } | null;
  pageSettings?: {
    subtitle?: string;
    focusText?: string;
    showGithubGraph?: boolean;
    githubUsername?: string;
    githubUrl?: string;
  };
}

export default function TechnicalExpertiseClient({ experiences, githubData, pageSettings }: TechnicalExpertiseClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close custom dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle URL hash deep-linking (e.g. #web-development, #backend-databases)
  useEffect(() => {
    const handleHash = () => {
      if (typeof window !== "undefined" && window.location.hash) {
        const rawHash = decodeURIComponent(window.location.hash.substring(1)).toLowerCase().trim();
        if (rawHash) {
          // Switch filter to "all" to ensure the target card is rendered in DOM
          setActiveFilter('all');

          setTimeout(() => {
            let targetEl = document.getElementById(rawHash);
            if (!targetEl) {
              const aliasMap: Record<string, string> = {
                'web': 'web-development',
                'frontend': 'web-development',
                'web-dev': 'web-development',
                'backend': 'backend-databases',
                'backend-and-databases': 'backend-databases',
                'database': 'backend-databases',
                'databases': 'backend-databases',
                'security': 'security-systems',
                'security-and-systems': 'security-systems',
                'systems': 'security-systems',
                'ai': 'ai-driven-features',
                'ai-features': 'ai-driven-features',
                'machine-learning': 'ai-driven-features',
                'design': 'design-tools',
                'design-and-tools': 'design-tools',
                'tools': 'design-tools',
                'ui-ux': 'design-tools',
              };
              const resolvedId = aliasMap[rawHash] || aliasMap[rawHash.replace(/[\s_]+/g, '-')];
              if (resolvedId) {
                targetEl = document.getElementById(resolvedId);
              }
            }

            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              targetEl.style.transition = 'box-shadow 0.4s ease, border-color 0.4s ease, transform 0.4s ease';
              targetEl.style.boxShadow = '0 0 25px rgba(0, 112, 243, 0.7)';
              targetEl.style.borderColor = '#0070f3';
              setTimeout(() => {
                targetEl.style.boxShadow = '';
                targetEl.style.borderColor = '';
              }, 3500);
            }
          }, 350);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const filterTabs = [
    { id: 'all', label: 'All Domains' },
    { id: 'web', label: 'Full-Stack & Web' },
    { id: 'backend', label: 'Backend & Databases' },
    { id: 'security', label: 'Security & Systems' },
    { id: 'ai', label: 'AI & ML Features' },
    { id: 'design', label: 'UI/UX & Tools' },
  ];

  const filteredExperiences = useMemo(() => {
    if (activeFilter === 'all') return experiences;
    return experiences.filter((exp) => {
      const titleLower = exp.title.toLowerCase();
      if (activeFilter === 'web' && titleLower.includes('web')) return true;
      if (activeFilter === 'backend' && (titleLower.includes('backend') || titleLower.includes('database'))) return true;
      if (activeFilter === 'security' && (titleLower.includes('security') || titleLower.includes('system'))) return true;
      if (activeFilter === 'ai' && (titleLower.includes('ai') || titleLower.includes('machine'))) return true;
      if (activeFilter === 'design' && (titleLower.includes('design') || titleLower.includes('tool'))) return true;
      return false;
    });
  }, [experiences, activeFilter]);

  const currentFilterLabel = filterTabs.find((t) => t.id === activeFilter)?.label || "All Domains";

  return (
    <>
      {/* Section Header */}
      <div className="expertise-header-wrap">
        <p className="section__text__p1">
          {pageSettings?.subtitle || "Technologies & Architecture I Use in Production"}
        </p>
        <h1 className="title mb-2">Technical Expertise</h1>
        
        <div className="expertise-focus-badge">
          <ShieldCheck size={16} className="focus-badge-icon" />
          <span>
            {pageSettings?.focusText || "Core Focus: Scalable Full-Stack Architectures & Secure Systems"}
          </span>
        </div>

        <div className="expertise-intro-row">
          <p className="expertise-intro">
            Engineering resilient, real-time web applications with end-to-end type safety, hardened authentication, and intelligent data pipelines.
          </p>
          <PageShareMenu />
        </div>
      </div>

      {/* GitHub Bento Hero Component (Toggleable by Admin) */}
      {pageSettings?.showGithubGraph !== false && githubData && (
        <GitHubActivityCard 
          initialContrib={githubData.contrib}
          userStats={githubData.user}
          customUsername={pageSettings?.githubUsername}
          customUrl={pageSettings?.githubUrl}
        />
      )}

      {/* Centered Domain Filter Dropdown (Same design as Certificates) */}
      <div className="filter-container expertise-filter-container">
        <div className="custom-select-container" ref={dropdownRef}>
          <button 
            type="button"
            className="custom-select-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            <span>{currentFilterLabel}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{
                transform: dropdownOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
                flexShrink: 0,
                marginLeft: '0.5rem'
              }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          <div className={`custom-select-dropdown ${dropdownOpen ? 'open' : ''}`} role="listbox">
            {filterTabs.map((tab) => {
              const isSelected = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`custom-select-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setActiveFilter(tab.id);
                    setDropdownOpen(false);
                  }}
                  role="option"
                  aria-selected={isSelected}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Balanced Bento Grid of Technical Domain Cards */}
      <div className={`expertise-bento-grid ${activeFilter !== 'all' ? 'filtered-mode' : ''}`}>
        {filteredExperiences && filteredExperiences.length > 0 ? (
          filteredExperiences.map((exp: any, index: number) => {
            const isLastOdd = activeFilter === 'all' && index === filteredExperiences.length - 1 && filteredExperiences.length % 2 !== 0;
            return (
              <div 
                key={exp.id} 
                className={`bento-grid-item ${isLastOdd ? 'bento-span-full' : ''}`}
              >
                <ExperienceCard experience={exp} />
              </div>
            );
          })
        ) : (
          <div className="empty-expertise-state">
            <p>No technical expertise matches this filter.</p>
          </div>
        )}
      </div>
    </>
  );
}
