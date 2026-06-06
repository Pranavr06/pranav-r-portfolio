"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit2, Book, Search, FileText, Eye, Edit, Image as ImageIcon } from "lucide-react";
import AdminDrawer from "@/components/AdminDrawer";
import ConfirmModal from "@/components/ConfirmModal";
import { useToast } from "@/components/ToastProvider";
import MarkdownViewer from "@/components/MarkdownTOC";

export default function AdminNotes() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"Saved" | "Saving..." | "Unsaved">("Saved");
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  
  // Search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNotebook, setActiveNotebook] = useState<string | null>(null);

  const router = useRouter();
  const { addToast } = useToast();

  // Form state
  const [title, setTitle] = useState("");
  const [notebook, setNotebook] = useState("Personal Notes");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("Published");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Track if fields are modified for auto-save
  useEffect(() => {
    if (editingId && !loading && drawerOpen && !previewMode) {
      setSaveStatus("Unsaved");
    }
  }, [title, notebook, content, tags, status]);

  // Auto-save debounce effect
  useEffect(() => {
    if (saveStatus !== "Unsaved" || !editingId || previewMode) return;
    
    const handler = setTimeout(() => {
      autoSaveNote();
    }, 2000);
    
    return () => clearTimeout(handler);
  }, [title, notebook, content, tags, status, saveStatus, editingId, previewMode]);

  useEffect(() => {
    fetchNotes();
  }, [router]);

  const fetchNotes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("admin_notes")
      .select("id, title, notebook, content, tags, status, updated_at, created_at, is_archived")
      .order("updated_at", { ascending: false });
      
    if (!error && data) setNotes(data);
    setLoading(false);
  };

  const openDrawerForNew = () => {
    setEditingId(null);
    setTitle(""); 
    setNotebook(activeNotebook || "Personal Notes"); 
    setContent("");
    setTags(""); 
    setStatus("Published");
    setPreviewMode(false);
    setSaveStatus("Saved");
    setDrawerOpen(true);
  };

  const openDrawerForEdit = (note: any) => {
    setEditingId(note.id);
    setTitle(note.title || "");
    setNotebook(note.notebook || "Personal Notes");
    setContent(note.content || "");
    setTags(note.tags ? note.tags.join(", ") : "");
    setStatus(note.status || "Published");
    setPreviewMode(true); 
    setSaveStatus("Saved");
    setDrawerOpen(true);
  };

  const autoSaveNote = async () => {
    if (!editingId) return;
    setSaveStatus("Saving...");
    
    const noteData = {
      title, 
      notebook, 
      content,
      tags: tags ? tags.split(',').map(s => s.trim()).filter(Boolean) : null,
      status, 
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from("admin_notes").update(noteData).eq("id", editingId);
    
    if (error) {
      console.error("Auto-save failed:", error);
      setSaveStatus("Unsaved");
    } else {
      setSaveStatus("Saved");
      fetchNotes(); // Silently update the list behind the drawer
    }
  };

  const uploadImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      addToast("Only image files are allowed", "error");
      return;
    }
    
    setSaveStatus("Saving...");
    const fileExt = file.name.split('.').pop() || "png";
    const fileName = `notes/${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

    // Insert a temporary loading placeholder at the cursor
    const loadingText = `\n![Uploading ${file.name}...]()\n`;
    const textarea = textareaRef.current;
    let insertPos = content.length;
    let newContent = content + loadingText;

    if (textarea) {
      insertPos = textarea.selectionStart;
      newContent = content.substring(0, insertPos) + loadingText + content.substring(textarea.selectionEnd);
      setContent(newContent);
    } else {
      setContent(newContent);
    }

    const { error: uploadError } = await supabase.storage
      .from('portfolio-media')
      .upload(fileName, file);

    if (uploadError) {
      addToast(`Upload failed: ${uploadError.message}`, "error");
      setContent(prev => prev.replace(loadingText, ""));
      setSaveStatus("Saved");
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(fileName);
      
      const imageMarkdown = `\n![Image](${publicUrl})\n`;
      setContent(prev => prev.replace(loadingText, imageMarkdown));
      setSaveStatus("Unsaved"); // trigger auto-save
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadImageFile(file);
      // Reset input value so the same file can be selected again
      e.target.value = '';
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) uploadImageFile(file);
        break;
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        uploadImageFile(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
  };

  const handleSaveNote = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const noteData = {
      title, 
      notebook, 
      content,
      tags: tags ? tags.split(',').map(s => s.trim()).filter(Boolean) : null,
      status, 
      updated_at: new Date().toISOString()
    };

    let error;

    if (editingId) {
      const res = await supabase.from("admin_notes").update(noteData).eq("id", editingId);
      error = res.error;
    } else {
      const res = await supabase.from("admin_notes").insert([{ ...noteData, is_archived: false }]);
      error = res.error;
    }

    if (error) {
      addToast("Error saving note: " + error.message, "error");
    } else {
      addToast(`Note ${editingId ? "updated" : "created"} successfully!`, "success");
      setDrawerOpen(false);
      fetchNotes();
    }
  };

  const confirmSoftDelete = async () => {
    if (!deleteNoteId) return;
    
    await supabase.from("admin_notes").update({ is_archived: true }).eq("id", deleteNoteId);
    fetchNotes();
    addToast("Moved to Trash", "success");
    setDeleteNoteId(null);
  };

  const handleSoftDelete = (id: string) => {
    setDeleteNoteId(id);
  };

  // Derived state for notebooks and filtering
  const notebooks = useMemo(() => {
    const set = new Set<string>();
    notes.forEach(n => set.add(n.notebook || "Personal Notes"));
    return Array.from(set).sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      if (n.is_archived) return false; // Hide archived from main view
      
      const search = searchQuery.toLowerCase();
      const matchesSearch = n.title?.toLowerCase().includes(search) || 
                            n.content?.toLowerCase().includes(search) ||
                            n.notebook?.toLowerCase().includes(search) ||
                            n.tags?.some((t: string) => t.toLowerCase().includes(search));
      const matchesNotebook = activeNotebook ? n.notebook === activeNotebook : true;
      return matchesSearch && matchesNotebook;
    });
  }, [notes, searchQuery, activeNotebook]);

  const stats = useMemo(() => {
    const relevant = activeNotebook ? notes.filter(n => n.notebook === activeNotebook) : notes;
    const active = relevant.filter(n => !n.is_archived);
    
    return {
      total: active.length,
      drafts: active.filter(n => n.status === "Draft").length,
      archived: relevant.filter(n => n.is_archived).length,
      lastUpdated: active.length > 0 ? new Date(Math.max(...active.map(n => new Date(n.updated_at).getTime()))).toLocaleDateString() : "Never"
    };
  }, [notes, activeNotebook]);

  if (loading) return <div style={{ padding: "2rem" }}>Loading notebook...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", animation: "fadeIn 0.3s ease" }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Digital Notebook</h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
            Your personal knowledge base and planning space.
          </p>
        </div>
        <button onClick={openDrawerForNew} className="admin-btn admin-btn-primary">
          <Plus size={16} style={{ marginRight: "0.5rem" }} />
          New Note
        </button>
      </div>

      <div className="notes-layout" style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Notebooks Sidebar */}
        <div className="notes-sidebar" style={{ width: "250px", flexShrink: 0, borderRight: "1px solid var(--admin-border)", paddingRight: "1.5rem" }}>
          <div style={{ position: "relative", marginBottom: "1.5rem" }}>
            <Search size={16} style={{ position: "absolute", left: "0.8rem", top: "50%", transform: "translateY(-50%)", color: "var(--admin-text-muted)" }} />
            <input 
              type="text" 
              placeholder="Search notes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", padding: "0.6rem 0.8rem 0.6rem 2.2rem", borderRadius: "6px", border: "1px solid var(--admin-border)", background: "var(--admin-bg)", color: "inherit", fontSize: "0.9rem" }}
            />
          </div>

          <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--admin-text-muted)", marginBottom: "0.8rem", fontWeight: 600 }}>Notebooks</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <li>
              <button 
                onClick={() => setActiveNotebook(null)}
                style={{ 
                  width: "100%", textAlign: "left", padding: "0.5rem 0.75rem", borderRadius: "6px", 
                  background: activeNotebook === null ? "var(--admin-card-hover)" : "transparent",
                  color: activeNotebook === null ? "var(--admin-text-main)" : "var(--admin-text-muted)",
                  border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem",
                  fontSize: "0.9rem", fontWeight: activeNotebook === null ? 500 : 400,
                  transition: "all 0.2s"
                }}
              >
                <Book size={16} /> All Notes
              </button>
            </li>
            {notebooks.map(nb => (
              <li key={nb}>
                <button 
                  onClick={() => setActiveNotebook(nb)}
                  style={{ 
                    width: "100%", textAlign: "left", padding: "0.5rem 0.75rem", borderRadius: "6px", 
                    background: activeNotebook === nb ? "var(--admin-card-hover)" : "transparent",
                    color: activeNotebook === nb ? "var(--admin-text-main)" : "var(--admin-text-muted)",
                    border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem",
                    fontSize: "0.9rem", fontWeight: activeNotebook === nb ? 500 : 400,
                    transition: "all 0.2s"
                  }}
                >
                  <Book size={16} /> {nb}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Notes Grid/List */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Notebook Stats Header */}
          <div className="notes-stats-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem", background: "var(--admin-card-bg)", borderRadius: "8px", border: "1px solid var(--admin-border)" }}>
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--admin-text-main)", margin: "0 0 0.25rem 0" }}>
                {activeNotebook || "All Notes"}
              </h2>
              <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem", color: "var(--admin-text-muted)" }}>
                <span title="Total Active"><strong>{stats.total}</strong> Notes</span>
                <span title="Drafts"><strong>{stats.drafts}</strong> Drafts</span>
                <span title="In Trash"><strong>{stats.archived}</strong> Archived</span>
              </div>
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--admin-text-muted)", textAlign: "right" }}>
              <div>Last Updated</div>
              <div style={{ fontWeight: 500, color: "var(--admin-text-main)" }}>{stats.lastUpdated}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {filteredNotes.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-text-muted)", gridColumn: "1 / -1", border: "1px dashed var(--admin-border)", borderRadius: "8px" }}>
                No notes found. Create one to get started!
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div 
                  key={note.id} 
                  className="admin-card"
                  onClick={() => openDrawerForEdit(note)}
                  style={{ 
                    cursor: "pointer", padding: "1.25rem", borderRadius: "8px", border: "1px solid var(--admin-border)", 
                    background: "var(--admin-card-bg)", transition: "all 0.2s ease", display: "flex", flexDirection: "column",
                    position: "relative", animation: "fadeIn 0.4s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--admin-text-muted)"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--admin-border)"}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 600, color: "var(--admin-text-main)" }}>{note.title}</h3>
                    {note.status === "Draft" && <span style={{ fontSize: "0.7rem", padding: "0.1rem 0.4rem", borderRadius: "10px", backgroundColor: "rgba(107, 114, 128, 0.1)", color: "var(--admin-text-main)", fontWeight: 500 }}>Draft</span>}
                  </div>
                  
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--admin-text-muted)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", flex: 1 }}>
                    {note.content?.replace(/[#*`_\[\]()]/g, '') || "Empty note..."}
                  </p>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--admin-border)" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <FileText size={12} /> {new Date(note.updated_at).toLocaleDateString()}
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleSoftDelete(note.id); }} 
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-text-muted)", padding: "0.2rem" }}
                      title="Move to Trash"
                      onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "var(--admin-text-muted)"}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <AdminDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title={editingId ? (previewMode ? title || "Untitled Note" : "Edit Note") : "New Note"} maxWidth="1000px">
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--admin-text-muted)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {editingId && !previewMode && (
                <>
                  <span style={{ 
                    display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", 
                    backgroundColor: saveStatus === "Saved" ? "#10b981" : saveStatus === "Saving..." ? "#fbbf24" : "#9ca3af" 
                  }}></span>
                  {saveStatus === "Saved" ? "Saved to Cloud" : saveStatus}
                </>
              )}
            </div>
            <button 
              onClick={() => setPreviewMode(!previewMode)} 
              className="admin-btn admin-btn-secondary"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              {previewMode ? <><Edit size={16} /> Edit Mode</> : <><Eye size={16} /> Preview Note</>}
            </button>
          </div>

          {previewMode ? (
            <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
              <MarkdownViewer content={content} />
            </div>
          ) : (
            <form onSubmit={handleSaveNote} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", height: "100%" }}>
              
              <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <input 
                    placeholder="Note Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                    style={{ ...inputStyle, fontSize: "1.2rem", fontWeight: 600, padding: "0.8rem 1rem", border: "none", borderBottom: "1px solid var(--admin-border)", borderRadius: "0", background: "transparent" }} 
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", justifyContent: "center" }}>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} style={{...inputStyle, border: "none", background: "var(--admin-card-hover)"}}>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-muted)", display: "flex", alignItems: "center", gap: "0.4rem" }}><Book size={14}/> Notebook</label>
                  <input placeholder="E.g. Portfolio, Startups" value={notebook} onChange={(e) => setNotebook(e.target.value)} required style={inputStyle} list="notebooks-list" />
                  <datalist id="notebooks-list">
                    {notebooks.map(nb => <option key={nb} value={nb} />)}
                  </datalist>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-muted)" }}>Tags (Comma separated)</label>
                  <input placeholder="react, ideas, meeting" value={tags} onChange={(e) => setTags(e.target.value)} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1, minHeight: "400px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-muted)" }}>Content (Markdown supported)</label>
                  <label className="admin-btn admin-btn-secondary" style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <ImageIcon size={14} /> Insert Image
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                  </label>
                </div>
                <div style={{ display: "flex", gap: "1rem", flex: 1, height: "100%" }}>
                  {/* Editor */}
                  <textarea 
                    ref={textareaRef}
                    placeholder="# Heading 1&#10;Write your thoughts here...&#10;(You can drag & drop or paste images here)" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    onPaste={handlePaste}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    style={{
                      ...inputStyle, 
                      flex: 1, 
                      fontFamily: "monospace", 
                      resize: "none", 
                      padding: "1rem",
                      lineHeight: "1.6",
                      background: "var(--admin-bg)",
                      height: "100%",
                      minHeight: "400px"
                    }} 
                  />
                </div>
              </div>

              <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem", paddingBottom: "2rem" }}>
                <button type="button" onClick={() => setDrawerOpen(false)} className="admin-btn admin-btn-secondary">Close</button>
                <button type="submit" className="admin-btn admin-btn-primary">{editingId ? "Save Note" : "Create Note"}</button>
              </div>
            </form>
          )}
        </div>
      </AdminDrawer>

      <ConfirmModal 
        isOpen={!!deleteNoteId}
        onClose={() => setDeleteNoteId(null)}
        onConfirm={confirmSoftDelete}
        title="Move to Trash"
        message="Are you sure you want to move this note to the Trash? You can restore it later if needed."
        confirmText="Move to Trash"
        cancelText="Cancel"
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
