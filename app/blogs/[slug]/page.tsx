import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Contact from "@/components/sections/Contact";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !blog) {
    notFound();
  }

  return (
    <main>
      <section id="blog-post" className="mobile-spacing" style={{ paddingTop: "10vh", paddingBottom: "10vh", minHeight: "100vh" }}>
        <header className="blog-banner" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <img 
            src={blog.image_url} 
            alt={blog.title} 
            className="banner-img" 
            style={{ width: "100%", maxHeight: "500px", objectFit: "cover", borderRadius: "1rem", marginBottom: "2rem" }}
          />
          <h1 className="title banner-title" style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{blog.title}</h1>
        </header>

        <div className="post-metadata" style={{ display: "flex", justifyContent: "center", gap: "1rem", color: "#555", marginBottom: "3rem", flexWrap: "wrap" }}>
          <span className="post-category" style={{ fontWeight: "bold" }}>{blog.category}</span>
          <span>&bull;</span>
          <span className="reading-time">{blog.read_time_minutes} min read</span>
          <span>&bull;</span>
          <span className="post-date">{new Date(blog.created_at).toLocaleDateString()}</span>
        </div>

        <div className="post-content">
          <ReactMarkdown>
            {blog.content}
          </ReactMarkdown>
        </div>

        <div style={{ textAlign: "center", marginTop: "4rem", marginBottom: "4rem" }}>
          <Link href="/blogs" className="btn btn-color-2">
            &larr; Back to all blogs
          </Link>
        </div>
      </section>
      <Contact />
    </main>
  );
}
