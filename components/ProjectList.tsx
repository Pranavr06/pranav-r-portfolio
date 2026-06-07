"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { showToast } from "@/components/Toast";
import ProjectCard from "@/components/cards/ProjectCard";

export default function ProjectList({ 
  initialProjects, 
  hideCollegeProjects = true, 
  title = "Projects", 
  subtitle = "Browse My Recent",
  hideTabs = false
}: { 
  initialProjects: any[], 
  hideCollegeProjects?: boolean, 
  title?: string, 
  subtitle?: string,
  hideTabs?: boolean
}) {
  const [filter, setFilter] = useState("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isPageMenuOpen, setIsPageMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.menu-container')) {
        setOpenMenuId(null);
        setIsPageMenuOpen(false);
      }
      if (!target.closest('.custom-select-container')) {
        setIsFilterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyLink = (slug: string, isCollege: boolean = false) => {
    const url = `${window.location.origin}/${isCollege ? 'college-projects' : 'projects'}/${slug}`;
    navigator.clipboard.writeText(url);
    showToast("Link copied to clipboard");
    setOpenMenuId(null);
  };

  const handleShare = async (title: string, slug: string, isCollege: boolean = false) => {
    const url = `${window.location.origin}/${isCollege ? 'college-projects' : 'projects'}/${slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this project: ${title}`,
          url: url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyLink(slug, isCollege);
    }
    setOpenMenuId(null);
  };

  const handleCopyPageLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Page link copied to clipboard");
    setIsPageMenuOpen(false);
  };

  const handleSharePage = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Pranav R - Projects",
          text: "Check out Pranav R's projects portfolio!",
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      handleCopyPageLink();
    }
    setIsPageMenuOpen(false);
  };

  const displayedProjects = initialProjects.filter(project => {
    const isCollegeProj = project.status === "College" || project.status.includes("Year");
    if (hideCollegeProjects && isCollegeProj) return false;
    
    // Filter by status
    if (filter !== "all") {
      if (project.status.toLowerCase() !== filter.toLowerCase() && project.status.toLowerCase().replace(" ", "-") !== filter.toLowerCase()) {
        return false;
      }
    }
    
    return true;
  });

  const filterOptions = title === "College Projects"
    ? [
        { value: "all", label: "All Statuses" },
        { value: "1st year", label: "1st Year" },
        { value: "2nd year", label: "2nd Year" },
        { value: "3rd year", label: "3rd Year" },
        { value: "4th year", label: "4th Year" }
      ]
    : [
        { value: "all", label: "All Statuses" },
        { value: "completed", label: "Completed" },
        { value: "in-progress", label: "In Progress" },
        { value: "planned", label: "Planned" }
      ];

  return (
    <section className="mobile-spacing" style={{ paddingTop: "2rem", marginTop: 0, minHeight: "100vh", height: "auto" }}>
      {subtitle && <p className="section__text__p1">{subtitle}</p>}
      <h1 className="title">{title} <span className="count-span">({initialProjects.length})</span></h1>
      
      {!hideTabs && (
        <div className="filter-container">
          {/* Custom Status Dropdown */}
          <div className="custom-select-container">
            <button 
              className="custom-select-btn"
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              aria-haspopup="listbox"
              aria-expanded={isFilterDropdownOpen}
            >
              {filterOptions.find(o => o.value === filter)?.label}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div className={`custom-select-dropdown ${isFilterDropdownOpen ? 'open' : ''}`} role="listbox">
              {filterOptions.map(option => (
                <button
                  key={option.value}
                  className={`custom-select-option ${filter === option.value ? 'selected' : ''}`}
                  onClick={() => { setFilter(option.value); setIsFilterDropdownOpen(false); }}
                  role="option"
                  aria-selected={filter === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Page-level 3 Dots Menu */}
          <div className="menu-container page-menu">
              <button 
                className="menu-btn" 
                aria-label="More options" 
                data-tooltip="More options"
                onClick={() => setIsPageMenuOpen(!isPageMenuOpen)}
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/><circle cx="12" cy="5" r="1"/></svg>
              </button>
              <div className={`options-menu ${isPageMenuOpen ? 'open' : ''}`}>
                  <button className="menu-option btn-copy-link" onClick={handleCopyPageLink}>Copy Link</button>
                  <button className="menu-option btn-share" onClick={handleSharePage}>Share</button>
              </div>
          </div>
        </div>
      )}

      <div className="project-details-container">
        <div className="project-grid">
          {displayedProjects.length > 0 ? (
            displayedProjects.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <div id="empty-state-message" style={{ display: "block", gridColumn: "1 / -1", textAlign: "center" }}>
              <h2 className="title">No Projects Found</h2>
              <p>There are currently no projects matching this status. Check back later!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
