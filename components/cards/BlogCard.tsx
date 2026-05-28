import React from 'react';
import Link from 'next/link';
import ShareMenu from "@/components/ShareMenu";

export default function BlogCard({ blog }: { blog: any }) {
  return (
    <article className="blog-card visible">
      <div className="blog-card-header" style={{ position: "relative" }}>
        <img src={blog.image_url} alt={blog.title} className="blog-img" loading="lazy" />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", padding: "2rem 1.5rem 1rem 1.5rem", borderRadius: "0 0 1rem 1rem" }}>
          <h2 className="blog-title" style={{ color: "white", margin: 0, textShadow: "1px 1px 4px rgba(0,0,0,0.5)", fontSize: "1.2rem" }}>{blog.title}</h2>
        </div>
      </div>
      <div className="blog-content">
        <div className="blog-metadata" style={{ marginTop: "0.5rem" }}>
          <span className="blog-category">{blog.category}</span>
          <span>
            {blog.read_time_minutes} min read &bull;{" "}
            <span className="blog-date">
              {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </span>
        </div>
        <p className="blog-excerpt">{blog.excerpt}</p>
        <div className="blog-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href={`/blogs/${blog.slug}`} className="blog-link" aria-label={`Read more about ${blog.title}`}>
            Read More &rarr;
          </Link>
          <ShareMenu title={blog.title} slug={blog.slug} type="blogs" />
        </div>
      </div>
    </article>
  );
}
