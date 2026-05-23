"use client";

import { useState } from "react";
import Link from "next/link";

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

  const displayedProjects = initialProjects.filter(project => {
    if (hideCollegeProjects && project.status === "College") return false;
    
    if (filter === "all") return true;
    if (filter === "completed") return project.status === "Completed";
    if (filter === "in-progress") return project.status === "In Progress";
    if (filter === "collection") return project.status === "Collection";
    return true;
  });

  return (
    <section className="mobile-spacing" style={{ paddingTop: "10vh", minHeight: "100vh", height: "auto" }}>
      {subtitle && <p className="section__text__p1">{subtitle}</p>}
      <h1 className="title">{title}</h1>
      
      {!hideTabs && (
        <div className="filter-container">
          <label htmlFor="project-filter" className="visually-hidden">Filter Projects by Status</label>
          <select 
            id="project-filter" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="planned">Planned</option>
          </select>
          <div className="menu-container page-menu">
              <button className="menu-btn" aria-label="More options">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/><circle cx="12" cy="5" r="1"/></svg>
              </button>
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
                      <button className="menu-btn card-menu-btn" aria-label="More options">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/><circle cx="12" cy="5" r="1"/></svg>
                      </button>
                      <div className="options-menu">
                          <button className="menu-option btn-copy-link">Copy Link</button>
                          <button className="menu-option btn-share">Share</button>
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
                    <Link href={`/projects/${project.slug}`} className="read-more-link" aria-label={`Read more about ${project.title}`}>
                      Read More &rarr;
                    </Link>
                    {project.demo_url ? (
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="btn btn-color-2 project-btn" aria-label={`View ${project.title}`}>
                        View
                      </a>
                    ) : (
                      <button className="btn btn-color-2 project-btn" disabled aria-label={`View ${project.title} (${project.status})`}>
                        View
                      </button>
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
          <img src="/assets/arrow.webp" alt="Scroll down to contact section" className="icon arrow scroll-down" loading="lazy" title="Scroll down"/>
      </a>
    </section>
  );
}
