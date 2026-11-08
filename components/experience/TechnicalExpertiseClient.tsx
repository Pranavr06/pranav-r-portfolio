"use client";

import React, { useState, useMemo } from 'react';
import ExperienceCard from "@/components/cards/ExperienceCard";
import GitHubActivityCard from "@/components/github/GitHubActivityCard";
import PageShareMenu from "@/components/PageShareMenu";
import { 
  Layers, 
  Code2, 
  Server, 
  ShieldCheck, 
  Sparkles, 
  Palette 
} from 'lucide-react';

interface TechnicalExpertiseClientProps {
  experiences: any[];
  githubData: {
    user: any;
    contrib: any;
  };
}

export default function TechnicalExpertiseClient({ experiences, githubData }: TechnicalExpertiseClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filterTabs = [
    { id: 'all', label: 'All Domains', count: experiences.length, icon: Layers },
    { id: 'web', label: 'Full-Stack & Web', count: 1, icon: Code2 },
    { id: 'backend', label: 'Backend & DBs', count: 1, icon: Server },
    { id: 'security', label: 'Security & Systems', count: 1, icon: ShieldCheck },
    { id: 'ai', label: 'AI & ML Features', count: 1, icon: Sparkles },
    { id: 'design', label: 'UI/UX & Tools', count: 1, icon: Palette },
  ];

  const filteredExperiences = useMemo(() => {
    if (activeFilter === 'all') return experiences;
    return experiences.filter((exp) => {
      const titleLower = exp.title.toLowerCase();
      if (activeFilter === 'web' && titleLower.includes('web')) return true;
      if (activeFilter === 'backend' && titleLower.includes('backend')) return true;
      if (activeFilter === 'security' && titleLower.includes('security')) return true;
      if (activeFilter === 'ai' && (titleLower.includes('ai') || titleLower.includes('machine'))) return true;
      if (activeFilter === 'design' && (titleLower.includes('design') || titleLower.includes('tool'))) return true;
      return false;
    });
  }, [experiences, activeFilter]);

  return (
    <>
      {/* Section Header */}
      <div className="expertise-header-wrap">
        <p className="section__text__p1">Technologies &amp; Architecture I Use in Production</p>
        <h1 className="title mb-2">Technical Expertise</h1>
        
        <div className="expertise-focus-badge">
          <ShieldCheck size={16} className="focus-badge-icon" />
          <span>Core Focus: Scalable Full-Stack Architectures &amp; Secure Systems</span>
        </div>

        <div className="expertise-intro-row">
          <p className="expertise-intro">
            Engineering resilient, real-time web applications with end-to-end type safety, hardened authentication, and intelligent data pipelines.
          </p>
          <PageShareMenu />
        </div>
      </div>

      {/* GitHub Bento Hero Component */}
      <GitHubActivityCard 
        initialContrib={githubData.contrib}
        userStats={githubData.user}
      />

      {/* Interactive Domain Filter Pills */}
      <div className="expertise-filter-bar">
        <div className="expertise-filter-scroll">
          {filterTabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`filter-pill-btn ${isActive ? 'active' : ''}`}
                aria-pressed={isActive}
              >
                <IconComponent size={15} />
                <span>{tab.label}</span>
                <span className="filter-count">{tab.count}</span>
              </button>
            );
          })}
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
