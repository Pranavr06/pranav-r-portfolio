"use client";

import { useState } from "react";
import Link from "next/link";

export default function BlogList({ initialBlogs }: { initialBlogs: any[] }) {
  const [filter, setFilter] = useState("latest");

  // Sort and filter logic based on legacy main.js
  const displayedBlogs = [...initialBlogs].sort((a, b) => {
    if (filter === "latest" || filter === "all" || filter === "popular") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (filter === "old") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    return 0;
  });

  return (
    <section className="mobile-spacing" style={{ paddingTop: "10vh", minHeight: "100vh", height: "auto" }}>
      <p className="section__text__p1">My Insights & Articles</p>
      <h1 className="title">Pranav R's Blog</h1>
      
      <div className="filter-container" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "2rem", padding: "0 5%" }}>
        <label htmlFor="blog-filter" className="visually-hidden">Filter Blog Posts</label>
        <select 
          id="blog-filter" 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: "0.5rem 1rem", borderRadius: "2rem", border: "1px solid #ccc", background: "transparent", color: "inherit", cursor: "pointer" }}
        >
          <option value="latest" style={{ color: "#000" }}>Latest</option>
          <option value="old" style={{ color: "#000" }}>Oldest</option>
          <option value="all" style={{ color: "#000" }}>All</option>
        </select>
      </div>

      <div className="blog-grid-container">
        {displayedBlogs.length > 0 ? (
          displayedBlogs.map((blog: any) => (
            <article key={blog.id} className="blog-card visible">
              <div className="blog-card-header">
                <img src={blog.image_url} alt={blog.title} className="blog-img" loading="lazy" />
                <h2 className="blog-title">{blog.title}</h2>
              </div>
              <div className="blog-content">
                <div className="blog-metadata">
                  <span className="blog-category">{blog.category}</span>
                  <span>
                    {blog.read_time_minutes} min read &bull;{" "}
                    <span className="blog-date">{new Date(blog.created_at).toLocaleDateString()}</span>
                  </span>
                </div>
                <p className="blog-excerpt">{blog.excerpt}</p>
                <div className="blog-footer">
                  <Link href={`/blogs/${blog.slug}`} className="blog-link" aria-label={`Read more about ${blog.title}`}>
                    Read More &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%", gridColumn: "1 / -1" }}>No blog posts found.</p>
        )}
      </div>
    </section>
  );
}
