import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import FadeInSection from "@/components/FadeInSection";

export default async function Blog() {
  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching blogs:", error);
  }

  return (
    <FadeInSection id="blog">
      <p className="section__text__p1">My Insights</p>
      <h2 className="title">Blog</h2>
      <div className="blog-grid-container">
        {blogs && blogs.length > 0 ? (
          blogs.map((blog: any) => (
            <article key={blog.id} className="blog-card">
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
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link href="/blogs" className="btn btn-color-2 view-more" aria-label="View more blog posts">
            View more
          </Link>
      </div>
    </FadeInSection>
  );
}
