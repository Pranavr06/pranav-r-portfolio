"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit2, ExternalLink, Info } from "lucide-react";
import AdminDrawer from "@/components/AdminDrawer";
import Tooltip from "@/components/admin/Tooltip";
import { useToast } from "@/components/ToastProvider";
import ConfirmModal from "@/components/ConfirmModal";

export default function ManageProjects() {
  const [projects, setProjects] = useState<any[]>([]);
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
  const [techStack, setTechStack] = useState("");
  const [status, setStatus] = useState("Completed");
  const [demoUrl, setDemoUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [displayOrder, setDisplayOrder] = useState("");

  useEffect(() => {
    fetchProjects();
  }, [router]);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .or('is_archived.is.null,is_archived.eq.false')
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
      
    if (!error && data) setProjects(data);
    setLoading(false);
  };

  const openDrawerForNew = () => {
    setEditingId(null);
    setTitle(""); setDescription(""); setContent(""); setImageUrl(""); 
    setTechStack(""); setDemoUrl(""); setRepoUrl(""); setSlug(""); 
    setSortOrder("0"); setDisplayOrder(""); setStatus("Completed");
    setDrawerOpen(true);
  };

  const openDrawerForEdit = (project: any) => {
    setEditingId(project.id);
    setTitle(project.title || "");
    setDescription(project.description || "");
    setContent(project.content || "");
    setImageUrl(project.image_url || "");
    setTechStack(project.tech_stack ? project.tech_stack.join(", ") : "");
    setStatus(project.status || "Completed");
    setDemoUrl(project.demo_url || "");
    setRepoUrl(project.repo_url || "");
    setSlug(project.slug || "");
    setSortOrder((project.sort_order || 0).toString());
    setDisplayOrder(project.display_order !== null ? project.display_order.toString() : "");
    setDrawerOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const techArray = techStack.split(",").map(t => t.trim()).filter(Boolean);
    
    const projectData = {
      title, description, content, image_url: imageUrl, 
      tech_stack: techArray, status, demo_url: demoUrl, repo_url: repoUrl, 
      slug, sort_order: parseInt(sortOrder) || 0, 
      display_order: displayOrder ? parseInt(displayOrder) : null
    };

    let error;

    if (editingId) {
      const res = await supabase.from("projects").update(projectData).eq("id", editingId);
      error = res.error;
    } else {
      const res = await supabase.from("projects").insert([{ ...projectData, is_archived: false }]);
      error = res.error;
    }

    if (error) {
      addToast("Error saving project: " + error.message, "error");
    } else {
      await supabase.from("activity_logs").insert([{ type: "project", action: editingId ? "updated" : "published", title }]);
      addToast(`Project ${editingId ? "updated" : "added"} successfully!`, "success");
      setDrawerOpen(false);
      fetchProjects();
    }
  };

  const handleSoftDelete = (id: string) => {
    setDeleteItem(id);
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;
    await supabase.from("projects").update({ is_archived: true }).eq("id", deleteItem);
    fetchProjects();
    addToast("Project moved to trash", "success");
    setDeleteItem(null);
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading projects...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Projects</h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
            Manage your portfolio projects.
          </p>
        </div>
        <button onClick={openDrawerForNew} className="admin-btn admin-btn-primary">
          <Plus size={16} style={{ marginRight: "0.5rem" }} />
          Add Project
        </button>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-header" style={{ gridTemplateColumns: "3fr 1fr 1fr 1.5fr" }}>
          <div>Project</div>
          <div>Status</div>
          <div>Display</div>
          <div style={{ textAlign: "right" }}>Actions</div>
        </div>
        
        {projects.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--admin-text-muted)" }}>No active projects found.</div>
        ) : (
          projects.map((p) => (
            <div key={p.id} className="admin-table-row" style={{ gridTemplateColumns: "3fr 1fr 1fr 1.5fr" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ 
                  width: "48px", height: "48px", borderRadius: "8px", 
                  backgroundColor: "var(--admin-border)", 
                  backgroundImage: `url(${p.image_url})`, 
                  backgroundSize: "cover", backgroundPosition: "center",
                  flexShrink: 0
                }} />
                <div>
                  <div style={{ fontWeight: 500 }}>{p.title}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)", display: "flex", gap: "0.5rem" }}>
                    <span>/{p.slug}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <span className={`admin-badge ${p.status === 'Completed' ? 'published' : p.status === 'Draft' ? 'draft' : 'neutral'}`}>
                  {p.status}
                </span>
              </div>
              
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Tooltip content="Sort Order">
                  <input 
                    type="number" 
                    min="0"
                    defaultValue={p.sort_order || 0}
                    onBlur={async (e) => {
                      const newSort = parseInt(e.target.value) || 0;
                      if (newSort !== (p.sort_order || 0)) {
                        await supabase.from("projects").update({ sort_order: Math.max(0, newSort) }).eq("id", p.id);
                        fetchProjects();
                        addToast("Sort order updated", "success");
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
                    defaultValue={p.display_order ?? ""}
                    onBlur={async (e) => {
                      const val = e.target.value;
                      const newDisplay = val === "" ? null : parseInt(val);
                      if (newDisplay !== p.display_order) {
                        await supabase.from("projects").update({ display_order: newDisplay !== null ? Math.max(0, newDisplay) : null }).eq("id", p.id);
                        fetchProjects();
                        addToast("Display order updated", "success");
                      }
                    }}
                    style={{ width: "45px", padding: "0.2rem 0.4rem", borderRadius: "4px", border: "1px solid var(--admin-border)", background: "transparent", color: "inherit", fontSize: "0.85rem" }}
                  />
                </Tooltip>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                <Tooltip content="View Live Project">
                  <a href={`/projects/${p.slug}`} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-icon" aria-label="View project">
                    <ExternalLink size={16} />
                  </a>
                </Tooltip>
                <Tooltip content="Edit Project">
                  <button onClick={() => openDrawerForEdit(p)} className="admin-btn admin-btn-icon" aria-label="Edit project">
                    <Edit2 size={16} />
                  </button>
                </Tooltip>
                <Tooltip content="Move to Trash" position="top">
                  <button onClick={() => handleSoftDelete(p.id)} className="admin-btn admin-btn-icon" style={{ color: "var(--admin-danger)" }} aria-label="Delete project">
                    <Trash2 size={16} />
                  </button>
                </Tooltip>
              </div>
            </div>
          ))
        )}
      </div>

      <AdminDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title={editingId ? "Edit Project" : "New Project"}>
        <form onSubmit={handleSaveProject} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Project Title</label>
            <input placeholder="E.g. E-Commerce Platform" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>URL Slug</label>
            <input placeholder="e.g. e-commerce-platform" value={slug} onChange={(e) => setSlug(e.target.value)} required style={inputStyle} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Short Description</label>
            <textarea placeholder="Brief summary of the project..." value={description} onChange={(e) => setDescription(e.target.value)} required style={{...inputStyle, minHeight: "80px", resize: "vertical"}} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Full Content (Markdown)</label>
            <textarea placeholder="Detailed project breakdown, challenges, solutions..." value={content} onChange={(e) => setContent(e.target.value)} style={{...inputStyle, minHeight: "200px", resize: "vertical", fontFamily: "monospace"}} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Cover Image</label>
            
            {imageUrl && (
              <div style={{ marginBottom: "0.5rem", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--admin-border)", position: "relative", width: "100%", aspectRatio: "16/9" }}>
                <img src={imageUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            
            <input placeholder="/assets/project-image.webp" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Tech Stack</label>
            <input placeholder="React, Node.js, PostgreSQL (comma separated)" value={techStack} onChange={(e) => setTechStack(e.target.value)} required style={inputStyle} />
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
                <option value="Completed">Completed (Published)</option>
                <option value="Draft">Draft (Hidden)</option>
                <option value="In Progress">In Progress</option>
                <option value="Planned">Planned</option>
              </select>
            </div>
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
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Links</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input placeholder="Demo URL" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} style={{...inputStyle, flex: 1}} />
              <input placeholder="GitHub Repo URL" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} style={{...inputStyle, flex: 1}} />
            </div>
          </div>

          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <button type="button" onClick={() => setDrawerOpen(false)} className="admin-btn admin-btn-secondary">Cancel</button>
            <button type="submit" className="admin-btn admin-btn-primary">{editingId ? "Save Changes" : "Create Project"}</button>
          </div>
        </form>
      </AdminDrawer>

      <ConfirmModal 
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        title="Move to Trash"
        message="Are you sure you want to move this project to the trash?"
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
  color: "var(--admin-text-main)",
  fontSize: "0.9rem"
};
