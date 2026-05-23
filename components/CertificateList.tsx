"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { showToast } from "@/components/Toast";

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
      <style>{`
        .custom-tag {
            background-color: #e0e0e0;
            color: #333;
            padding: 0.35rem 0.85rem;
            border-radius: 1.5rem;
            font-size: 0.85rem;
            font-weight: 500;
        }
        body.dark-theme .custom-tag, [data-theme="dark"] .custom-tag {
            background-color: #3a3a3a;
            color: #ddd;
        }
        .achievement-highlight-custom {
            font-style: italic;
            color: #007bff;
            margin: 1rem 0;
            font-weight: 700;
        }
        body.dark-theme .achievement-highlight-custom, [data-theme="dark"] .achievement-highlight-custom {
            color: #339af0;
        }
        .category-title-custom {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 1.5rem;
            border-bottom: 1px solid #d3d3d3;
            padding-bottom: 0.5rem;
            color: black;
            text-align: left;
        }
        body.dark-theme .category-title-custom, [data-theme="dark"] .category-title-custom {
            color: #fff;
            border-bottom: 1px solid #444;
        }
        .cert-section {
            padding-top: 10vh;
            padding-bottom: 10vh;
        }
        @media (max-width: 768px) {
            .cert-section {
                padding-top: 120px;
            }
        }
      `}</style>
      <section className="mobile-spacing cert-section">
      {subtitle && <p className="section__text__p1">{subtitle}</p>}
      <h1 className="title">{title} <span className="count-span">({initialCertificates.length})</span></h1>
      
      {!hideTabs && (
        <div className="filter-container" style={{ textAlign: "center", marginBottom: "2rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
          <label htmlFor="certificate-filter" className="visually-hidden" style={{ display: "none" }}>Filter Certificates</label>
          <select 
            id="certificate-filter" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem", border: "1px solid #ccc", fontSize: "1rem", backgroundColor: "var(--bg-color)", color: "var(--text-color)", cursor: "pointer", appearance: "auto" }}
          >
            <option value="All">All</option>
            <option value="course">Courses</option>
            <option value="hackathon">Hackathons</option>
            <option value="internship">Internships</option>
            <option value="webinar-workshop">Webinars & Workshops</option>
            <option value="govt-quiz">Government Quizzes</option>
          </select>

          <div className="menu-container page-menu" style={{ position: "relative" }} ref={(el) => { menuRefs.current['main'] = el; }}>
            <div className="custom-tooltip-wrapper">
              <button 
                className="menu-btn main-menu-btn-custom" 
                aria-label="More options" 
                onClick={() => setMainMenuOpen(!mainMenuOpen)}
                style={{ padding: "0.5rem 0.8rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", height: "100%", background: "none", border: "none" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/><circle cx="12" cy="5" r="1"/></svg>
              </button>
              <span className="custom-tooltip">More options</span>
            </div>
            {mainMenuOpen && (
              <div className="options-menu options-menu-custom" style={{ position: "absolute", top: "2.5rem", right: "0", borderRadius: "0.5rem", zIndex: 10, display: "flex", flexDirection: "column", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", minWidth: "150px" }}>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); showToast("Link copied to clipboard"); setMainMenuOpen(false); }} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "0.5rem 1rem" }}>Copy Link</button>
                <button onClick={async () => { 
                  setMainMenuOpen(false); 
                  if (navigator.share) {
                    try { await navigator.share({ title: "My Certificates", url: window.location.href }); } catch (err) {}
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    showToast("Link copied to clipboard");
                  }
                }} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "0.5rem 1rem" }}>Share</button>
              </div>
            )}
          </div>
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
                    <article key={cert.id} className="details-container color-container visible" style={{ display: "flex", flexDirection: "column", position: "relative", textAlign: "center", padding: "2rem" }}>
                      
                      <div className="menu-container" style={{ position: "absolute", top: "1rem", right: "1rem" }} ref={(el) => { menuRefs.current[cert.id] = el; }}>
                        <div className="custom-tooltip-wrapper">
                          <button className="menu-btn card-menu-btn" onClick={() => setOpenMenuId(openMenuId === cert.id ? null : cert.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-color)" }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/><circle cx="12" cy="5" r="1"/></svg>
                          </button>
                          <span className="custom-tooltip">More options</span>
                        </div>
                        {openMenuId === cert.id && (
                          <div className="options-menu options-menu-custom" style={{ position: "absolute", top: "2rem", right: "0", borderRadius: "0.5rem", zIndex: 10, display: "flex", flexDirection: "column", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", minWidth: "150px", textAlign: "left" }}>
                            <button onClick={() => { navigator.clipboard.writeText(window.location.href); showToast("Link copied to clipboard"); setOpenMenuId(null); }} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "0.5rem 1rem" }}>Copy Link</button>
                            <button onClick={async () => { 
                              setOpenMenuId(null);
                              if (navigator.share) {
                                try { await navigator.share({ title: cert.title, url: window.location.href }); } catch (err) {}
                              } else {
                                navigator.clipboard.writeText(window.location.href);
                                showToast("Link copied to clipboard");
                              }
                            }} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "0.5rem 1rem" }}>Share</button>
                            {cert.pdf_url && cert.pdf_url !== "#" && (
                              <button onClick={() => { 
                                const link = document.createElement('a');
                                link.href = cert.pdf_url;
                                link.download = `${cert.title.replace(/\s+/g, '_')}_Certificate.pdf`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                setOpenMenuId(null); 
                              }} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "0.5rem 1rem" }}>Download PDF</button>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="article-container" style={{ display: "flex", justifyContent: "center" }}>
                        <img src={cert.image_url || "/assets/ieee-logo.webp"} alt={`${cert.title} logo`} className="certificate-logo" loading="lazy" style={{ width: "80px", height: "80px", marginBottom: "1rem", objectFit: "contain" }} />
                      </div>
                      
                      <h3 className="experience-sub-title project-title" style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{cert.title}</h3>
                      <p className="certificate-date" style={{ fontSize: "0.95rem", color: "gray", marginBottom: "1rem" }}>
                        {cert.date.includes("Completed") ? cert.date : `Completed: ${cert.date}`}
                      </p>
                      
                      <p style={{ flexGrow: 1, marginBottom: "1.5rem", color: "var(--text-color-light)", fontSize: "1rem" }}>{cert.description}</p>
                      
                      {cert.skills && cert.skills.length > 0 && (
                        <div className="skill-tags" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem", justifyContent: "center" }}>
                          {cert.skills.map((skill: string, index: number) => (
                            <span key={index} className="custom-tag">{skill}</span>
                          ))}
                        </div>
                      )}

                      {cert.issuer && !cert.issuer.includes("Unknown") && (
                        <p className="achievement-highlight-custom" style={{ fontSize: "0.95rem", marginTop: "1rem" }}>
                          {cert.issuer.includes("Issued by") || cert.issuer.includes("Organized by") || cert.issuer.includes("Completed in") ? cert.issuer : `Issued by ${cert.issuer}`}
                        </p>
                      )}

                      <div className="btn-container" style={{ marginTop: "auto", paddingTop: "1rem", display: "flex", justifyContent: "center" }}>
                        {cert.pdf_url && cert.pdf_url !== "#" && (
                          <a href={cert.pdf_url} className="btn btn-color-2" style={{ padding: "0.5rem 1.5rem", borderRadius: "2rem", textDecoration: "none" }} target="_blank" rel="noopener noreferrer" aria-label={`View ${cert.title} certificate`}>
                            View
                          </a>
                        )}
                      </div>

                    </article>
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
    </section>
    </>
  );
}
