"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit2, Info } from "lucide-react";
import AdminDrawer from "@/components/AdminDrawer";
import Tooltip from "@/components/admin/Tooltip";
import { useToast } from "@/components/ToastProvider";
import ConfirmModal from "@/components/ConfirmModal";

export default function ManageExperienceHubs() {
  const [hubs, setHubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<string | null>(null);
  const router = useRouter();
  const { addToast } = useToast();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [href, setHref] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");
  const [displayOrder, setDisplayOrder] = useState("");

  useEffect(() => {
    fetchHubs();
  }, [router]);

  const fetchHubs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("experience_hubs")
      .select("*")
      .or('is_archived.is.null,is_archived.eq.false')
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
      
    if (!error && data) setHubs(data);
    setLoading(false);
  };

  const openDrawerForNew = () => {
    setEditingId(null);
    setTitle(""); setDescription(""); setImageUrl("");
    setTags(""); setHref("");
    setIsPublished(true);
    setSortOrder("0"); setDisplayOrder("");
    setDrawerOpen(true);
  };

  const openDrawerForEdit = (hub: any) => {
    setEditingId(hub.id);
    setTitle(hub.title || "");
    setDescription(hub.description || "");
    setImageUrl(hub.image_url || "");
    setTags(hub.tags ? hub.tags.join(", ") : "");
    setHref(hub.href || "");
    setIsPublished(hub.is_published ?? true);
    setSortOrder((hub.sort_order || 0).toString());
    setDisplayOrder(hub.display_order !== null ? hub.display_order.toString() : "");
    setDrawerOpen(true);
  };

  const handleSaveHub = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const hubData = {
      title, 
      description, 
      image_url: imageUrl, 
      href,
      tags: tags ? tags.split(',').map(s => s.trim()).filter(Boolean) : null,
      is_published: isPublished, 
      sort_order: Math.max(0, parseInt(sortOrder) || 0), 
      display_order: displayOrder ? Math.max(0, parseInt(displayOrder)) : null
    };

    let error;

    if (editingId) {
      const res = await supabase.from("experience_hubs").update(hubData).eq("id", editingId);
      error = res.error;
    } else {
      const res = await supabase.from("experience_hubs").insert([{ ...hubData, is_archived: false }]);
      error = res.error;
    }

    if (error) {
      addToast("Error saving experience hub: " + error.message, "error");
    } else {
      addToast(`Experience hub ${editingId ? "updated" : "added"} successfully!`, "success");
      setDrawerOpen(false);
      fetchHubs();
    }
  };

  const handleSoftDelete = (id: string) => {
    setDeleteItem(id);
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;
    await supabase.from("experience_hubs").update({ is_archived: true }).eq("id", deleteItem);
    fetchHubs();
    addToast("Experience hub moved to trash", "success");
    setDeleteItem(null);
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading experience hubs...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Experience Hubs</h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
            Manage the main experience categories displayed on the home page.
          </p>
        </div>
        <button onClick={openDrawerForNew} className="admin-btn admin-btn-primary">
          <Plus size={16} style={{ marginRight: "0.5rem" }} />
          Add Hub
        </button>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-header" style={{ gridTemplateColumns: "3fr 1fr 1fr 1.5fr" }}>
          <div>Title</div>
          <div>Path (href)</div>
          <div>Display</div>
          <div style={{ textAlign: "right" }}>Actions</div>
        </div>
        
        {hubs.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--admin-text-muted)" }}>No experience hubs found.</div>
        ) : (
          hubs.map((hub) => (
            <div key={hub.id} className="admin-table-row" style={{ gridTemplateColumns: "3fr 1fr 1fr 1.5fr" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                {hub.image_url && (
                  <div style={{ 
                    width: "80px", height: "45px", borderRadius: "8px", 
                    backgroundColor: "var(--admin-border)", 
                    backgroundImage: `url(${hub.image_url})`, 
                    backgroundSize: "cover", backgroundPosition: "center",
                    flexShrink: 0
                  }} />
                )}
                <div>
                  <div style={{ fontWeight: 500 }}>
                    {hub.title}
                    {!hub.is_published && <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", padding: "0.1rem 0.4rem", borderRadius: "10px", backgroundColor: "rgba(107, 114, 128, 0.1)", color: "var(--admin-text-main)", fontWeight: 400 }}>Draft</span>}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)", marginTop: "0.2rem", maxWidth: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {hub.description}
                  </div>
                </div>
              </div>
              
              <div>
                <span style={{ fontSize: "0.85rem", fontFamily: "monospace", color: "var(--admin-text-muted)" }}>
                  {hub.href}
                </span>
              </div>
              
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Tooltip content="Sort Order">
                  <input 
                    type="number" 
                    min="0"
                    defaultValue={hub.sort_order || 0}
                    onBlur={async (e) => {
                      const newSort = parseInt(e.target.value) || 0;
                      if (newSort !== (hub.sort_order || 0)) {
                        await supabase.from("experience_hubs").update({ sort_order: Math.max(0, newSort) }).eq("id", hub.id);
                        fetchHubs();
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
                    defaultValue={hub.display_order ?? ""}
                    onBlur={async (e) => {
                      const val = e.target.value;
                      const newDisplay = val === "" ? null : parseInt(val);
                      if (newDisplay !== hub.display_order) {
                        await supabase.from("experience_hubs").update({ display_order: newDisplay !== null ? Math.max(0, newDisplay) : null }).eq("id", hub.id);
                        fetchHubs();
                      }
                    }}
                    style={{ width: "45px", padding: "0.2rem 0.4rem", borderRadius: "4px", border: "1px solid var(--admin-border)", background: "transparent", color: "inherit", fontSize: "0.85rem" }}
                  />
                </Tooltip>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                <Tooltip content="Edit Hub">
                  <button onClick={() => openDrawerForEdit(hub)} className="admin-btn admin-btn-icon" aria-label="Edit hub">
                    <Edit2 size={16} />
                  </button>
                </Tooltip>
                <Tooltip content="Move to Trash" position="top">
                  <button onClick={() => handleSoftDelete(hub.id)} className="admin-btn admin-btn-icon" style={{ color: "var(--admin-danger)" }} aria-label="Delete hub">
                    <Trash2 size={16} />
                  </button>
                </Tooltip>
              </div>
            </div>
          ))
        )}
      </div>

      <AdminDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title={editingId ? "Edit Experience Hub" : "New Experience Hub"}>
        <form onSubmit={handleSaveHub} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Title</label>
            <input placeholder="E.g. Technical Expertise" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Description</label>
            <textarea placeholder="Brief description..." value={description} onChange={(e) => setDescription(e.target.value)} style={{...inputStyle, minHeight: "80px", resize: "vertical"}} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Tags (Comma separated)</label>
            <input placeholder="React, Node.js, Next.js" value={tags} onChange={(e) => setTags(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Image</label>
            {imageUrl && (
              <div style={{ marginBottom: "0.5rem", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--admin-border)", position: "relative", width: "100%", aspectRatio: "16/9" }}>
                <img src={imageUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            <input placeholder="/assets/hub-image.webp" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} style={inputStyle} />
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Link Path (href)</label>
            <input placeholder="E.g. /experiences/technical-expertise" value={href} onChange={(e) => setHref(e.target.value)} style={inputStyle} />
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
            <button type="submit" className="admin-btn admin-btn-primary">{editingId ? "Save Changes" : "Create Hub"}</button>
          </div>
        </form>
      </AdminDrawer>

      <ConfirmModal 
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        title="Move to Trash"
        message="Are you sure you want to move this experience hub to the trash?"
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
