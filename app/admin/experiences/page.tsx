"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit2, Info } from "lucide-react";
import AdminDrawer from "@/components/AdminDrawer";
import Tooltip from "@/components/admin/Tooltip";
import { useToast } from "@/components/ToastProvider";
import ConfirmModal from "@/components/ConfirmModal";

export default function ManageExperiences() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<string | null>(null);
  const router = useRouter();
  const { addToast } = useToast();

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [dateText, setDateText] = useState("");
  const [highlightText, setHighlightText] = useState("");
  const [description, setDescription] = useState("");
  const [bulletPoints, setBulletPoints] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");
  const [readMoreUrl, setReadMoreUrl] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");
  const [displayOrder, setDisplayOrder] = useState("");

  useEffect(() => {
    fetchExperiences();
  }, [router]);

  const fetchExperiences = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .or('is_archived.is.null,is_archived.eq.false')
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
      
    if (!error && data) setExperiences(data);
    setLoading(false);
  };

  const openDrawerForNew = () => {
    setEditingId(null);
    setTitle(""); setCategory(""); setDateText(""); setHighlightText(""); 
    setDescription(""); setBulletPoints(""); setTags(""); setImageUrl("");
    setCertificateUrl(""); setReadMoreUrl(""); setContent("");
    setIsPublished(true);
    setSortOrder("0"); setDisplayOrder("");
    setDrawerOpen(true);
  };

  const openDrawerForEdit = (exp: any) => {
    setEditingId(exp.id);
    setTitle(exp.title || "");
    setCategory(exp.category || "");
    setDateText(exp.date_text || "");
    setHighlightText(exp.highlight_text || "");
    setDescription(exp.description || "");
    setBulletPoints(exp.bullet_points ? exp.bullet_points.join("\n") : "");
    setTags(exp.tags ? exp.tags.join(", ") : "");
    setImageUrl(exp.image_url || "");
    setCertificateUrl(exp.certificate_url || "");
    setReadMoreUrl(exp.read_more_url || "");
    setContent(exp.content || "");
    setIsPublished(exp.is_published ?? true);
    setSortOrder((exp.sort_order || 0).toString());
    setDisplayOrder(exp.display_order !== null ? exp.display_order.toString() : "");
    setDrawerOpen(true);
  };

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const expData = {
      title, 
      category, 
      date_text: dateText, 
      highlight_text: highlightText, 
      description, 
      content,
      image_url: imageUrl, 
      certificate_url: certificateUrl,
      read_more_url: readMoreUrl,
      bullet_points: bulletPoints ? bulletPoints.split('\n').map(s => s.trim()).filter(Boolean) : null,
      tags: tags ? tags.split(',').map(s => s.trim()).filter(Boolean) : null,
      is_published: isPublished, 
      sort_order: Math.max(0, parseInt(sortOrder) || 0), 
      display_order: displayOrder ? Math.max(0, parseInt(displayOrder)) : null
    };

    let error;

    if (editingId) {
      const res = await supabase.from("experiences").update(expData).eq("id", editingId);
      error = res.error;
    } else {
      const res = await supabase.from("experiences").insert([{ ...expData, is_archived: false }]);
      error = res.error;
    }

    if (error) {
      addToast("Error saving experience: " + error.message, "error");
    } else {
      addToast(`Experience ${editingId ? "updated" : "added"} successfully!`, "success");
      setDrawerOpen(false);
      fetchExperiences();
    }
  };

  const handleSoftDelete = (id: string) => {
    setDeleteItem(id);
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;
    await supabase.from("experiences").update({ is_archived: true }).eq("id", deleteItem);
    fetchExperiences();
    addToast("Experience moved to trash", "success");
    setDeleteItem(null);
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading experiences...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Experiences</h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
            Manage your experiences, hackathons, and timelines.
          </p>
        </div>
        <button onClick={openDrawerForNew} className="admin-btn admin-btn-primary">
          <Plus size={16} style={{ marginRight: "0.5rem" }} />
          Add Experience
        </button>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-header" style={{ gridTemplateColumns: "3fr 1fr 1fr 1.5fr" }}>
          <div>Title</div>
          <div>Category</div>
          <div>Display</div>
          <div style={{ textAlign: "right" }}>Actions</div>
        </div>
        
        {experiences.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--admin-text-muted)" }}>No active experiences found.</div>
        ) : (
          experiences.map((exp) => (
            <div key={exp.id} className="admin-table-row" style={{ gridTemplateColumns: "3fr 1fr 1fr 1.5fr" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                {exp.image_url && (
                  <div style={{ 
                    width: "48px", height: "48px", borderRadius: "8px", 
                    backgroundColor: "var(--admin-border)", 
                    backgroundImage: `url(${exp.image_url})`, 
                    backgroundSize: "cover", backgroundPosition: "center",
                    flexShrink: 0
                  }} />
                )}
                <div>
                  <div style={{ fontWeight: 500 }}>
                    {exp.title}
                    {!exp.is_published && <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", padding: "0.1rem 0.4rem", borderRadius: "10px", backgroundColor: "rgba(107, 114, 128, 0.1)", color: "var(--admin-text-main)", fontWeight: 400 }}>Draft</span>}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>{exp.date_text}</div>
                </div>
              </div>
              
              <div>
                <span className="admin-badge neutral" style={{ backgroundColor: "var(--admin-card-hover)", color: "var(--admin-text-main)" }}>
                  {exp.category}
                </span>
              </div>
              
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Tooltip content="Sort Order">
                  <input 
                    type="number" 
                    min="0"
                    defaultValue={exp.sort_order || 0}
                    onBlur={async (e) => {
                      const newSort = parseInt(e.target.value) || 0;
                      if (newSort !== (exp.sort_order || 0)) {
                        await supabase.from("experiences").update({ sort_order: Math.max(0, newSort) }).eq("id", exp.id);
                        fetchExperiences();
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
                    defaultValue={exp.display_order ?? ""}
                    onBlur={async (e) => {
                      const val = e.target.value;
                      const newDisplay = val === "" ? null : parseInt(val);
                      if (newDisplay !== exp.display_order) {
                        await supabase.from("experiences").update({ display_order: newDisplay !== null ? Math.max(0, newDisplay) : null }).eq("id", exp.id);
                        fetchExperiences();
                      }
                    }}
                    style={{ width: "45px", padding: "0.2rem 0.4rem", borderRadius: "4px", border: "1px solid var(--admin-border)", background: "transparent", color: "inherit", fontSize: "0.85rem" }}
                  />
                </Tooltip>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                <Tooltip content="Edit Experience">
                  <button onClick={() => openDrawerForEdit(exp)} className="admin-btn admin-btn-icon">
                    <Edit2 size={16} />
                  </button>
                </Tooltip>
                <Tooltip content="Move to Trash" position="top-right">
                  <button onClick={() => handleSoftDelete(exp.id)} className="admin-btn admin-btn-icon" style={{ color: "var(--admin-danger)" }}>
                    <Trash2 size={16} />
                  </button>
                </Tooltip>
              </div>
            </div>
          ))
        )}
      </div>

      <AdminDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title={editingId ? "Edit Experience" : "New Experience"}>
        <form onSubmit={handleSaveExperience} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Title</label>
              <input placeholder="E.g. SIH 2024 Finalist" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Category</label>
              <input placeholder="E.g. Hackathon, Work" value={category} onChange={(e) => setCategory(e.target.value)} required style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Date Text</label>
              <input placeholder="E.g. December 2024" value={dateText} onChange={(e) => setDateText(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Highlight Text</label>
              <input placeholder="E.g. Winner, Top 10" value={highlightText} onChange={(e) => setHighlightText(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Description</label>
            <textarea placeholder="Brief description..." value={description} onChange={(e) => setDescription(e.target.value)} style={{...inputStyle, minHeight: "60px", resize: "vertical"}} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Bullet Points (One per line)</label>
            <textarea placeholder="Developed a highly scalable system...&#10;Integrated AI models..." value={bulletPoints} onChange={(e) => setBulletPoints(e.target.value)} style={{...inputStyle, minHeight: "100px", resize: "vertical"}} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Tags (Comma separated)</label>
            <input placeholder="React, Python, AWS" value={tags} onChange={(e) => setTags(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Image</label>
            {imageUrl && (
              <div style={{ marginBottom: "0.5rem", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--admin-border)", position: "relative", width: "100%", aspectRatio: "16/9" }}>
                <img src={imageUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            <input placeholder="/assets/experience-image.webp" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} style={inputStyle} />
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Read More URL</label>
              <input placeholder="Link to detailed post..." value={readMoreUrl} onChange={(e) => setReadMoreUrl(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Certificate URL</label>
              <input placeholder="Link to PDF/Image..." value={certificateUrl} onChange={(e) => setCertificateUrl(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Full Content (Markdown/HTML)</label>
            <textarea placeholder="Detailed markdown content..." value={content} onChange={(e) => setContent(e.target.value)} style={{...inputStyle, minHeight: "150px", resize: "vertical", fontFamily: "monospace"}} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                Global Sort Order
                <Tooltip content="Lower numbers appear first">
                  <Info size={14} style={{ color: "var(--admin-text-muted)", cursor: "help" }} />
                </Tooltip>
              </label>
              <input type="number" min="0" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                Home Display
                <Tooltip content="Leave blank to hide from Homepage. Enter number to show.">
                  <Info size={14} style={{ color: "var(--admin-text-muted)", cursor: "help" }} />
                </Tooltip>
              </label>
              <input type="number" min="0" placeholder="-" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Status</label>
              <select value={isPublished ? "Published" : "Draft"} onChange={(e) => setIsPublished(e.target.value === "Published")} style={inputStyle}>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <button type="button" onClick={() => setDrawerOpen(false)} className="admin-btn admin-btn-secondary">Cancel</button>
            <button type="submit" className="admin-btn admin-btn-primary">{editingId ? "Save Changes" : "Create Experience"}</button>
          </div>
        </form>
      </AdminDrawer>

      <ConfirmModal 
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        title="Move to Trash"
        message="Are you sure you want to move this experience to the trash?"
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
