"use client";

import { useState, useRef, useEffect } from "react";
import ExperienceCard from "@/components/cards/ExperienceCard";
import ShareMenu from "@/components/ShareMenu";

export default function ProfessionalJourneyList({ initialExperiences }: { initialExperiences: any[] }) {
  const [filter, setFilter] = useState("latest");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filterOptions = [
    { value: "latest", label: "Latest" },
    { value: "popular", label: "Popular" },
    { value: "old", label: "Oldest" },
    { value: "all", label: "All" }
  ];

  // Sort and filter logic
  const displayedExperiences = [...initialExperiences].sort((a, b) => {
    if (filter === "old") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    if (filter === "latest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (filter === "popular") {
      // Default order is assumed to be 'display_order' or relevance
      return (a.display_order || 0) - (b.display_order || 0);
    }
    // For 'all', respect original order (display_order usually)
    return (a.display_order || 0) - (b.display_order || 0);
  });

  return (
    <>
      <div className="filter-container" style={{ justifyContent: "center", marginBottom: "2rem", gap: "1rem" }}>
        <div className="custom-select-container" ref={filterRef}>
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
                onClick={() => {
                  setFilter(option.value);
                  setIsFilterDropdownOpen(false);
                }}
                role="option"
                aria-selected={filter === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <ShareMenu title="Professional Journey | Pranav R" type="page" />
      </div>
      
      <div className="project-details-container mt-3">
        <div className="project-grid">
          {displayedExperiences.length > 0 ? (
            displayedExperiences.map((exp: any) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))
          ) : (
            <p style={{ textAlign: "center", width: "100%", gridColumn: "1 / -1" }}>
              Professional journey details coming soon!
            </p>
          )}
        </div>
      </div>
    </>
  );
}
