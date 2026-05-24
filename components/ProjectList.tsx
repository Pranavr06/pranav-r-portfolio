"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { showToast } from "@/components/Toast";

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

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/projects/${slug}`;
    navigator.clipboard.writeText(url);
    showToast("Link copied to clipboard");
    setOpenMenuId(null);
  };

  const handleShare = async (title: string, slug: string) => {
    const url = `${window.location.origin}/projects/${slug}`;
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
      handleCopyLink(slug);
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
    <section className="mobile-spacing" style={{ paddingTop: "10vh", minHeight: "100vh", height: "auto" }}>
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
            displayedProjects.map((project: any) => {
              const statusClass = project.status.toLowerCase().replace(" ", "-");
              return (
                <article key={project.id} className="details-container color-container" data-status={statusClass}>
                  <div className="menu-container">
                      <button 
                        className="menu-btn card-menu-btn" 
                        aria-label="More options"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === project.id ? null : project.id);
                        }}
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/><circle cx="12" cy="5" r="1"/></svg>
                      </button>
                      <div className={`options-menu ${openMenuId === project.id ? 'open' : ''}`}>
                          <button 
                            className="menu-option btn-copy-link"
                            onClick={(e) => { e.stopPropagation(); handleCopyLink(project.slug); }}
                          >
                            Copy Link
                          </button>
                          <button 
                            className="menu-option btn-share"
                            onClick={(e) => { e.stopPropagation(); handleShare(project.title, project.slug); }}
                          >
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
                      <Link href={`/projects/${project.slug}`} className="read-more-link" aria-label={`View ${project.title} Collection`}>
                        View Collection &rarr;
                      </Link>
                    ) : (
                      <>
                        <Link href={`/projects/${project.slug}`} className="read-more-link" aria-label={`Read more about ${project.title}`}>
                          Read More &rarr;
                        </Link>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {project.demo_url ? (
                            <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="btn btn-color-2 project-btn" aria-label={`View ${project.title}`}>
                              View
                            </a>
                          ) : (
                            <button className="btn btn-color-2 project-btn" disabled aria-label={`View ${project.title} (${project.status})`}>
                              View
                            </button>
                          )}
                          {project.repo_url && (
                            <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="btn btn-color-2 project-btn" aria-label={`Source Code for ${project.title}`}>
                              Code
                            </a>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <div id="empty-state-message" style={{ display: "block", gridColumn: "1 / -1", textAlign: "center" }}>
              <h2 className="title">No Projects Found</h2>
              <p>There are currently no projects matching this status. Check back later!</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Scroll Down chevron like in original projects.html */}
      <a href="#contact" className="scroll-down-link" aria-label="Scroll to contact section" onClick={(e) => {
        e.preventDefault();
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }}>
          <img src="/assets/arrow.webp" alt="Scroll down to contact section" className="icon arrow scroll-down" loading="lazy" title="Scroll down" style={{ width: "30px", height: "30px" }}/>
      </a>
    </section>
  );
}
