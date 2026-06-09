"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit2, ExternalLink, Image as ImageIcon, Info } from "lucide-react";
import AdminDrawer from "@/components/AdminDrawer";
import Tooltip from "@/components/admin/Tooltip";
import { useToast } from "@/components/ToastProvider";
import ConfirmModal from "@/components/ConfirmModal";

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<string | null>(null);
  const router = useRouter();
  const { addToast } = useToast();

  // Form state
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [readTime, setReadTime] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("Published");
  const [sortOrder, setSortOrder] = useState("0");
  const [displayOrder, setDisplayOrder] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, [router]);

  const fetchBlogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .or('is_archived.is.null,is_archived.eq.false')
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
      
    if (!error && data) setBlogs(data);
    setLoading(false);
  };

  const openDrawerForNew = () => {
    setEditingId(null);
    setTitle(""); setExcerpt(""); setContent(""); setImageUrl(""); 
    setReadTime(""); setCategory(""); setSlug(""); setStatus("Published");
    setSortOrder("0"); setDisplayOrder("");
    setDrawerOpen(true);
  };

  const openDrawerForEdit = (blog: any) => {
    setEditingId(blog.id);
    setTitle(blog.title || "");
    setExcerpt(blog.excerpt || "");
    setContent(blog.content || "");
    setImageUrl(blog.image_url || "");
    setReadTime((blog.read_time_minutes || 0).toString());
    setCategory(blog.category || "");
    setSlug(blog.slug || "");
    setStatus(blog.status || "Published");
    setSortOrder((blog.sort_order || 0).toString());
    setDisplayOrder(blog.display_order !== null ? blog.display_order.toString() : "");
    setDrawerOpen(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const blogData = {
      title, excerpt, content, read_time_minutes: parseInt(readTime), category, image_url: imageUrl, slug, status, sort_order: parseInt(sortOrder) || 0, display_order: displayOrder ? parseInt(displayOrder) : null
    };

    let error;

    if (editingId) {
      const res = await supabase.from("blogs").update(blogData).eq("id", editingId);
      error = res.error;
    } else {
      const res = await supabase.from("blogs").insert([{ ...blogData, is_archived: false }]);
      error = res.error;
    }

    if (error) {
      addToast("Error saving blog: " + error.message, "error");
    } else {
      await supabase.from("activity_logs").insert([{ type: "blog", action: editingId ? "updated" : "published", title }]);
      addToast(`Blog post ${editingId ? "updated" : "added"} successfully!`, "success");
      setDrawerOpen(false);
      fetchBlogs();
    }
  };

  const handleSoftDelete = (id: string) => {
    setDeleteItem(id);
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;
    await supabase.from("blogs").update({ is_archived: true }).eq("id", deleteItem);
    fetchBlogs();
    addToast("Blog moved to trash", "success");
    setDeleteItem(null);
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading blogs...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Blogs</h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
            Manage your blog posts and articles.
          </p>
        </div>
        <button onClick={openDrawerForNew} className="admin-btn admin-btn-primary">
          <Plus size={16} style={{ marginRight: "0.5rem" }} />
          Add Post
        </button>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-header" style={{ gridTemplateColumns: "3fr 1fr 1fr 1.5fr" }}>
          <div>Post Title</div>
          <div>Category</div>
          <div>Display</div>
          <div style={{ textAlign: "right" }}>Actions</div>
        </div>
        
        {blogs.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--admin-text-muted)" }}>No active blogs found.</div>
        ) : (
          blogs.map((b) => (
            <div key={b.id} className="admin-table-row" style={{ gridTemplateColumns: "3fr 1fr 1fr 1.5fr" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ 
                  width: "48px", height: "48px", borderRadius: "8px", 
                  backgroundColor: "var(--admin-border)", 
                  backgroundImage: `url(${b.image_url})`, 
                  backgroundSize: "cover", backgroundPosition: "center",
                  flexShrink: 0
                }} />
                <div>
                  <div style={{ fontWeight: 500 }}>{b.title}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>/{b.slug}</div>
                </div>
              </div>
              
              <div>
                <span className={`admin-badge ${b.status === "Draft" ? "draft" : "published"}`} style={{ backgroundColor: b.status === "Draft" ? "rgba(107, 114, 128, 0.1)" : "rgba(59, 130, 246, 0.1)", color: b.status === "Draft" ? "var(--admin-text-main)" : "#3b82f6" }}>
                  {b.status || "Published"}
                </span>
                <div style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)", marginTop: "0.25rem" }}>{b.category}</div>
              </div>
              
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Tooltip content="Sort Order">
                  <input 
                    type="number" 
                    min="0"
                    defaultValue={b.sort_order || 0}
                    onBlur={async (e) => {
                      const newSort = parseInt(e.target.value) || 0;
                      if (newSort !== (b.sort_order || 0)) {
                        await supabase.from("blogs").update({ sort_order: Math.max(0, newSort) }).eq("id", b.id);
                        fetchBlogs();
                      }
                    }}
                    style={{ width: "45px", padding: "0.2rem 0.4rem", borderRadius: "4px", border: "1px solid var(--admin-border)", background: "transparent", color: "inherit", fontSize: "0.85rem" }}
                  />
                </Tooltip>
                <Tooltip content="Home Display Order">
                  <input 
                    type="number" 
                    min="0"
                    placeholder="-"
                    defaultValue={b.display_order ?? ""}
                    onBlur={async (e) => {
                      const val = e.target.value;
                      const newDisplay = val === "" ? null : parseInt(val);
                      if (newDisplay !== b.display_order) {
                        await supabase.from("blogs").update({ display_order: newDisplay !== null ? Math.max(0, newDisplay) : null }).eq("id", b.id);
                        fetchBlogs();
                      }
                    }}
                    style={{ width: "45px", padding: "0.2rem 0.4rem", borderRadius: "4px", border: "1px solid var(--admin-border)", background: "transparent", color: "inherit", fontSize: "0.85rem" }}
                  />
                </Tooltip>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                <Tooltip content="View Live Post">
                  <a href={`/blog/${b.slug}`} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-secondary" style={{ padding: "0.4rem" }}>
                    <ExternalLink size={16} />
                  </a>
                </Tooltip>
                <Tooltip content="Edit Blog">
                  <button onClick={() => openDrawerForEdit(b)} className="admin-btn admin-btn-secondary" style={{ padding: "0.4rem" }}>
                    <Edit2 size={16} />
                  </button>
                </Tooltip>
                <Tooltip content="Move to Trash" position="top">
                  <button onClick={() => handleSoftDelete(b.id)} className="admin-btn admin-btn-danger" style={{ padding: "0.4rem" }}>
                    <Trash2 size={16} />
                  </button>
                </Tooltip>
              </div>
            </div>
          ))
        )}
      </div>

      <AdminDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title={editingId ? "Edit Blog Post" : "New Blog Post"}>
        <form onSubmit={handleSaveBlog} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Post Title</label>
            <input placeholder="E.g. My Awesome Tech Article" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>URL Slug</label>
              <input placeholder="e.g. awesome-article" value={slug} onChange={(e) => setSlug(e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Category</label>
              <input placeholder="E.g. Tech, Cybersecurity" value={category} onChange={(e) => setCategory(e.target.value)} required style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Short Excerpt</label>
            <textarea placeholder="Brief summary of the post..." value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required style={{...inputStyle, minHeight: "80px", resize: "vertical"}} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Full Content (Markdown or HTML)</label>
            <textarea placeholder="Detailed post content..." value={content} onChange={(e) => setContent(e.target.value)} required style={{...inputStyle, minHeight: "200px", resize: "vertical", fontFamily: "monospace"}} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Cover Image</label>
            {imageUrl && (
              <div style={{ marginBottom: "0.5rem", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--admin-border)", position: "relative", width: "100%", aspectRatio: "16/9" }}>
                <img src={imageUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            <input placeholder="/assets/blog-image.webp" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required style={inputStyle} />
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Read Time (Mins)</label>
              <input type="number" min="0" value={readTime} onChange={(e) => setReadTime(e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                Global Sort
                <Tooltip content="Determines order across all pages. Lower numbers appear first.">
                  <Info size={14} style={{ color: "var(--admin-text-muted)", cursor: "help" }} />
                </Tooltip>
              </label>
              <input type="number" min="0" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <button type="button" onClick={() => setDrawerOpen(false)} className="admin-btn admin-btn-secondary">Cancel</button>
            <button type="submit" className="admin-btn admin-btn-primary">{editingId ? "Save Changes" : "Create Post"}</button>
          </div>
        </form>
      </AdminDrawer>

      <ConfirmModal 
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        title="Move to Trash"
        message="Are you sure you want to move this blog to the trash?"
        confirmText="Move to Trash"
        isDestructive={true}
      />
    </div>
  );
}

const inputStyle = {
  width: "100%", 
  padding: "0.6rem 0.8rem", 
  borderRadius: "6px", 
  border: "1px solid var(--admin-border)", 
  background: "var(--admin-bg)", 
  color: "inherit",
  fontSize: "0.9rem"
};
