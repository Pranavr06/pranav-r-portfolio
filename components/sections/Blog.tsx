import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import FadeInSection from "@/components/FadeInSection";
import BlogCard from "@/components/cards/BlogCard";
import ScrollArrow from "@/components/ScrollArrow";

export default async function Blog() {
  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("*")
    .not("display_order", "is", null)
    .order("display_order", { ascending: true })
    .limit(3);

  if (error) {
    console.error("Error fetching blogs:", error?.message || error?.details || JSON.stringify(error) || "Unknown error");
  }

  return (
    <FadeInSection id="blog">
      <p className="section__text__p1">My Insights</p>
      <h2 className="title">Blog</h2>
      <div className="blog-grid-container">
        {blogs && blogs.length > 0 ? (
          blogs.map((blog: any) => (
            <BlogCard key={blog.id} blog={blog} />
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
      <ScrollArrow targetId="contact" altText="Scroll down to contact section" />
    </FadeInSection>
  );
}
