"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [readTime, setReadTime] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [displayOrder, setDisplayOrder] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/admin/login");
      else fetchBlogs();
    };
    checkUser();
  }, [router]);

  const fetchBlogs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("blogs").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
    if (!error && data) setBlogs(data);
    setLoading(false);
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from("blogs").insert([{
      title, excerpt, content, read_time_minutes: parseInt(readTime), category, image_url: imageUrl, slug, sort_order: parseInt(sortOrder) || 0, display_order: displayOrder ? parseInt(displayOrder) : null
    }]);

    if (error) {
      alert("Error adding blog: " + error.message);
    } else {
      alert("Blog added successfully!");
      setTitle(""); setExcerpt(""); setContent(""); setReadTime(""); setCategory(""); setImageUrl(""); setSlug(""); setSortOrder("0"); setDisplayOrder("");
      fetchBlogs();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      await supabase.from("blogs").delete().eq("id", id);
      fetchBlogs();
    }
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: "20vh" }}>Loading...</div>;

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="title" style={{ fontSize: "2rem" }}>Manage Blogs</h1>
        <Link href="/admin" className="btn btn-color-2">Back to Dashboard</Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        <div className="details-container color-container" style={{ padding: "2rem", height: "fit-content" }}>
          <h2 style={{ marginBottom: "1rem" }}>Add New Blog Post</h2>
          <form onSubmit={handleAddBlog} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
            <input placeholder="Slug (e.g. my-blog-post)" value={slug} onChange={(e) => setSlug(e.target.value)} required style={inputStyle} />
            <input placeholder="Category (e.g. Tech)" value={category} onChange={(e) => setCategory(e.target.value)} required style={inputStyle} />
            <input placeholder="Read Time (minutes)" type="number" value={readTime} onChange={(e) => setReadTime(e.target.value)} required style={inputStyle} />
            <textarea placeholder="Excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required style={{...inputStyle, minHeight: "60px"}} />
            <textarea placeholder="Content (HTML or Text)" value={content} onChange={(e) => setContent(e.target.value)} required style={{...inputStyle, minHeight: "150px"}} />
            <input placeholder="Image URL (e.g. /assets/blog-1.webp)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required style={inputStyle} />
            <input type="number" placeholder="Sort Order (e.g. 1)" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={inputStyle} />
            <input type="number" placeholder="Display Order (Home)" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} style={inputStyle} />
            <button type="submit" className="btn btn-color-1">Add Blog Post</button>
          </form>
        </div>

        <div>
          <h2 style={{ marginBottom: "1rem" }}>Existing Blog Posts</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {blogs.map((b) => (
              <div key={b.id} className="details-container color-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: "0.9rem", color: "gray" }}>Category: {b.category} | {b.read_time_minutes} min read</p>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "0.5rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <span style={{ fontSize: "0.9rem", color: "gray" }}>Sort:</span>
                      <input 
                        type="number" 
                        defaultValue={b.sort_order || 0}
                        onBlur={async (e) => {
                          const newSort = parseInt(e.target.value) || 0;
                          if (newSort !== (b.sort_order || 0)) {
                            const { error } = await supabase.from("blogs").update({ sort_order: newSort }).eq("id", b.id);
                            if (error) alert("Error: " + error.message);
                            else { alert("Sort order updated"); fetchBlogs(); }
                          }
                        }}
                        style={{ width: "60px", padding: "0.2rem", borderRadius: "0.2rem", background: "rgba(255,255,255,0.1)", color: "inherit", border: "1px solid #ccc" }}
                      />
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <span style={{ fontSize: "0.9rem", color: "gray" }}>Display:</span>
                      <input 
                        type="number" 
                        placeholder="-"
                        defaultValue={b.display_order ?? ""}
                        onBlur={async (e) => {
                          const val = e.target.value;
                          const newOrder = val === "" ? null : parseInt(val);
                          if (newOrder !== (b.display_order ?? null)) {
                            const { error } = await supabase.from("blogs").update({ display_order: newOrder }).eq("id", b.id);
                            if (error) alert("Error: " + error.message);
                            else { alert(newOrder === null ? "Removed from Homepage" : "Display order updated"); fetchBlogs(); }
                          }
                        }}
                        style={{ width: "60px", padding: "0.2rem", borderRadius: "0.2rem", background: "rgba(255,255,255,0.1)", color: "inherit", border: "1px solid #ccc" }}
                      />
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDelete(b.id)} className="btn btn-color-2" style={{ color: "red", borderColor: "red" }}>Delete</button>
              </div>
            ))}
            {blogs.length === 0 && <p>No blog posts found. Add one!</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #ccc", background: "transparent", color: "inherit"
};
