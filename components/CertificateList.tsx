"use client";

import { useState, useEffect, useRef } from "react";
import ShareMenu from "@/components/ShareMenu";
import CertificateCard from "@/components/cards/CertificateCard";
import ScrollArrow from "@/components/ScrollArrow";

export default function CertificateList({ 
  initialCertificates, 
  title = "Certificates", 
  subtitle = "My Achievements",
  hideTabs = false
}: { 
  initialCertificates: any[], 
  title?: string, 
  subtitle?: string,
  hideTabs?: boolean
}) {
  const [filter, setFilter] = useState("All");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [mainMenuOpen, setMainMenuOpen] = useState(false);
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mainMenuOpen && menuRefs.current['main'] && !menuRefs.current['main'].contains(event.target as Node)) {
        setMainMenuOpen(false);
      }
      if (openMenuId && menuRefs.current[openMenuId] && !menuRefs.current[openMenuId].contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mainMenuOpen, openMenuId]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.substring(1);
      if (hash) {
        setTimeout(() => {
          setFilter("All");
          const targetEl = document.getElementById(hash);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
            targetEl.style.transition = "box-shadow 0.4s ease, border-color 0.4s ease";
            targetEl.style.boxShadow = "0 0 25px rgba(0, 112, 243, 0.7)";
            targetEl.style.borderColor = "#0070f3";
            setTimeout(() => {
              targetEl.style.boxShadow = "";
              targetEl.style.borderColor = "";
            }, 3000);
          }
        }, 300);
      }
    }
  }, []);

  const displayedCertificates = initialCertificates.filter(cert => {
    if (filter === "All") return true;
    return cert.category === filter;
  });

  const categoryMap: Record<string, string> = {
    "course": "Courses",
    "hackathon": "Hackathons",
    "internship": "Internships",
    "webinar-workshop": "Webinars & Workshops",
    "govt-quiz": "Government Quizzes",
    "academic": "Academic",
    "professional": "Professional",
    "technical": "Technical"
  };

  const allCategories = ["course", "hackathon", "internship", "webinar-workshop", "govt-quiz"];
  const categoriesToRender = filter === "All" ? allCategories : [filter];

  return (
    <>
      <section className="mobile-spacing cert-section" style={{ position: "relative", paddingTop: "2rem", marginTop: 0 }}>
      {subtitle && <p className="section__text__p1">{subtitle}</p>}
      <h1 className="title">{title} <span className="count-span">({initialCertificates.length})</span></h1>
      
      {!hideTabs && (
        <div className="filter-container">
          {/* Custom Status Dropdown */}
          <div className="custom-select-container" ref={(el) => { menuRefs.current['main'] = el; }}>
            <button 
              className="custom-select-btn"
              onClick={() => setMainMenuOpen(!mainMenuOpen)}
              aria-haspopup="listbox"
              aria-expanded={mainMenuOpen}
            >
              {filter === "All" ? "All" : categoryMap[filter] || filter}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div className={`custom-select-dropdown ${mainMenuOpen ? 'open' : ''}`} role="listbox">
              <button
                className={`custom-select-option ${filter === "All" ? 'selected' : ''}`}
                onClick={() => { setFilter("All"); setMainMenuOpen(false); }}
                role="option"
                aria-selected={filter === "All"}
              >
                All
              </button>
              {allCategories.map((key) => (
                <button
                  key={key}
                  className={`custom-select-option ${filter === key ? 'selected' : ''}`}
                  onClick={() => { setFilter(key); setMainMenuOpen(false); }}
                  role="option"
                  aria-selected={filter === key}
                >
                  {categoryMap[key] || key}
                </button>
              ))}
            </div>
          </div>
          <ShareMenu title="Pranav R's Certificates" type="page" />
        </div>
      )}

      <div className="experience-details-container">
        {displayedCertificates.length > 0 ? (
          categoriesToRender.map(catKey => {
            const categoryCerts = displayedCertificates.filter(c => c.category === catKey);
            if (categoryCerts.length === 0) return null;

            return (
              <div key={catKey}>
                <h2 className="category-title-custom">
                  {categoryMap[catKey] || catKey}
                </h2>
                <div className="about-containers" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "2rem", maxWidth: "1200px", margin: "0 auto", marginBottom: "3rem" }}>
                  {categoryCerts.map((cert: any) => (
                    <CertificateCard key={cert.id} cert={cert} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: "center", width: "100%", padding: "2rem" }}>
            <h2 className="title" style={{ fontSize: "2rem" }}>No Certificates Found</h2>
            <p>There are currently no certificates matching this category.</p>
          </div>
        )}
      </div>
      <ScrollArrow targetId="contact" altText="Scroll down to contact section" />
    </section>
    </>
  );
}
