"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ShareMenu from "./ShareMenu";
import BlogCard from "./cards/BlogCard";
import ScrollArrow from "@/components/ScrollArrow";

export default function BlogList({ initialBlogs }: { initialBlogs: any[] }) {
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
    { value: "old", label: "Oldest" },
    { value: "all", label: "All" }
  ];

  // Sort and filter logic
  const displayedBlogs = [...initialBlogs].sort((a, b) => {
    if (filter === "old") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    // For 'latest' and 'all', we respect the backend sort_order
    return 0;
  });

  return (
    <section id="blogs" className="mobile-spacing" style={{ position: "relative", paddingTop: "10vh", minHeight: "100vh", height: "auto" }}>
      <p className="section__text__p1">My Insights & Articles</p>
      <h1 className="title">Pranav R's Blog</h1>
      
      <div className="filter-container">
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
        <ShareMenu title="Pranav R's Blog" type="page" />
      </div>

      <div className="blog-grid-container">
        {displayedBlogs.length > 0 ? (
          displayedBlogs.map((blog: any) => (
            <BlogCard key={blog.id} blog={blog} />
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%", gridColumn: "1 / -1" }}>No blog posts found.</p>
        )}
      </div>
      <ScrollArrow targetId="contact" altText="Scroll down to contact section" />
    </section>
  );
}
