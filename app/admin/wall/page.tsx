"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  Pin, 
  Trash2, 
  Edit2, 
  Plus, 
  Search, 
  RotateCcw, 
  Heart, 
  Sparkles, 
  MessageSquare, 
  Eye, 
  AlertCircle 
} from "lucide-react";
import AdminDrawer from "@/components/AdminDrawer";
import ConfirmModal from "@/components/ConfirmModal";
import { useToast } from "@/components/ToastProvider";

interface WallNote {
  id: string;
  message: string;
  author_name: string;
  color: string;
  emoji: string;
  rotation?: number;
  likes_count: number;
  is_pinned: boolean;
  is_archived: boolean;
  created_at: string;
  ip_hash?: string;
}

const PALETTES = [
  { id: "yellow", name: "Yellow", hex: "#fef08a" },
  { id: "pink", name: "Pink", hex: "#fbcfe8" },
  { id: "green", name: "Green", hex: "#bbf7d0" },
  { id: "blue", name: "Blue", hex: "#bae6fd" },
  { id: "purple", name: "Purple", hex: "#e9d5ff" },
  { id: "orange", name: "Orange", hex: "#fed7aa" },
];

const EMOJIS = ["📌", "🚀", "💡", "🔥", "❤️", "☕", "💻", "🎉", "👾", "✨", "⭐", "⚡"];

export default function AdminWall() {
  const [notes, setNotes] = useState<WallNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableReady, setTableReady] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pinned" | "archived">("all");
  const [colorFilter, setColorFilter] = useState("all");

  // Drawer & Form State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<WallNote | null>(null);
  const [formMessage, setFormMessage] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [formColor, setFormColor] = useState("yellow");
  const [formEmoji, setFormEmoji] = useState("📌");
  const [formPinned, setFormPinned] = useState(false);
  const [formLikes, setFormLikes] = useState(0);
  const [saving, setSaving] = useState(false);

  // Delete Confirm Modal
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteIsPermanent, setDeleteIsPermanent] = useState(false);

  const router = useRouter();
  const { addToast } = useToast();

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }

      const res = await fetch("/api/admin/wall", {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (res.status === 401) {
        setError("Unauthorized access.");
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load notes");

      setNotes(data.notes || []);
      setTableReady(data.tableReady !== false);
    } catch (err: any) {
      setError(err.message || "Failed to fetch notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Filtered Notes
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      // Status filter
      if (statusFilter === "active" && n.is_archived) return false;
      if (statusFilter === "archived" && !n.is_archived) return false;
      if (statusFilter === "pinned" && (!n.is_pinned || n.is_archived)) return false;

      // Color filter
      if (colorFilter !== "all" && n.color !== colorFilter) return false;

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const msg = (n.message || "").toLowerCase();
        const author = (n.author_name || "").toLowerCase();
        if (!msg.includes(q) && !author.includes(q)) return false;
      }

      return true;
    });
  }, [notes, statusFilter, colorFilter, search]);

  // Metrics
  const stats = useMemo(() => {
    const total = notes.length;
    const active = notes.filter((n) => !n.is_archived).length;
    const pinned = notes.filter((n) => n.is_pinned && !n.is_archived).length;
    const archived = notes.filter((n) => n.is_archived).length;
    const totalLikes = notes.reduce((sum, n) => sum + (n.likes_count || 0), 0);
    return { total, active, pinned, archived, totalLikes };
  }, [notes]);

  // Open Drawer for New Note
  const handleOpenNew = () => {
    setEditingNote(null);
    setFormMessage("");
    setFormAuthor("Pranav R (Admin)");
    setFormColor("yellow");
    setFormEmoji("📌");
    setFormPinned(false);
    setFormLikes(0);
    setDrawerOpen(true);
  };

  // Open Drawer for Edit Note
  const handleOpenEdit = (note: WallNote) => {
    setEditingNote(note);
    setFormMessage(note.message);
    setFormAuthor(note.author_name);
    setFormColor(note.color || "yellow");
    setFormEmoji(note.emoji || "📌");
    setFormPinned(!!note.is_pinned);
    setFormLikes(note.likes_count || 0);
    setDrawerOpen(true);
  };

  // Save Note (Create or Update)
  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMessage.trim()) {
      addToast("Please enter a note message.", "error");
      return;
    }

    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const action = editingNote ? "update" : "create";
      const payload: any = {
        action,
        id: editingNote?.id,
        noteData: {
          message: formMessage.trim(),
          author_name: formAuthor.trim() || "Anonymous",
          color: formColor,
          emoji: formEmoji,
          is_pinned: formPinned,
          likes_count: formLikes
        }
      };

      const res = await fetch("/api/admin/wall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      addToast(editingNote ? "Sticky note updated!" : "New sticky note posted!", "success");
      setDrawerOpen(false);
      fetchNotes();
    } catch (err: any) {
      addToast(err.message || "Failed to save note", "error");
    } finally {
      setSaving(false);
    }
  };

  // Fast Toggle Pin
  const handleTogglePin = async (note: WallNote) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch("/api/admin/wall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ action: "toggle_pin", id: note.id })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to toggle pin");

      addToast(data.is_pinned ? "Note pinned to top!" : "Note unpinned", "success");
      setNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, is_pinned: data.is_pinned } : n))
      );
    } catch (err: any) {
      addToast(err.message, "error");
    }
  };

  // Soft Delete / Archive
  const handleArchiveNote = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch("/api/admin/wall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ action: "archive", id })
      });

      if (!res.ok) throw new Error("Failed to archive note");

      addToast("Note moved to archive / hidden from public wall", "info");
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_archived: true } : n))
      );
    } catch (err: any) {
      addToast(err.message, "error");
    }
  };

  // Restore Note
  const handleRestoreNote = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch("/api/admin/wall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ action: "restore", id })
      });

      if (!res.ok) throw new Error("Failed to restore note");

      addToast("Note restored to public wall!", "success");
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_archived: false } : n))
      );
    } catch (err: any) {
      addToast(err.message, "error");
    }
  };

  // Permanent Delete
  const handleConfirmPermanentDelete = async () => {
    if (!deleteConfirmId) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch("/api/admin/wall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ action: "delete", id: deleteConfirmId })
      });

      if (!res.ok) throw new Error("Failed to delete note");

      addToast("Note permanently removed", "info");
      setNotes((prev) => prev.filter((n) => n.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (err: any) {
      addToast(err.message, "error");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      
      {/* Top Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>Wall Notes</span>
          </h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
            Manage, review, edit, pin, and moderate community sticky notes.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <a
            href="/wall"
            target="_blank"
            className="admin-btn admin-btn-secondary"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Eye size={16} />
            View Live Wall
          </a>
          <button
            onClick={handleOpenNew}
            className="admin-btn admin-btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Plus size={16} />
            New Sticky Note
          </button>
        </div>
      </div>

      {/* Database Warning if table not yet migrated */}
      {!tableReady && (
        <div style={{
          backgroundColor: "rgba(234, 179, 8, 0.12)",
          border: "1px solid rgba(234, 179, 8, 0.3)",
          color: "#ca8a04",
          padding: "1rem 1.25rem",
          borderRadius: "0.75rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem"
        }}>
          <AlertCircle size={20} />
          <div>
            <strong>Database Migration Notice:</strong> Table <code>wall_notes</code> is not yet created in your Supabase database. Run <code>scripts/create_wall_notes.sql</code> in the Supabase SQL Editor to enable live database storage.
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="admin-metrics-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-label">Active Notes</span>
          <span className="admin-stat-value" style={{ color: "#3b82f6" }}>{stats.active}</span>
          <span className="admin-stat-sub">Visible on public wall</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-label">Pinned Notes</span>
          <span className="admin-stat-value" style={{ color: "#10b981" }}>{stats.pinned}</span>
          <span className="admin-stat-sub">Highlighted at top</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-label">Total Likes</span>
          <span className="admin-stat-value" style={{ color: "#ec4899" }}>{stats.totalLikes}</span>
          <span className="admin-stat-sub">Hearts from visitors</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-label">Archived / Hidden</span>
          <span className="admin-stat-value" style={{ color: "#64748b" }}>{stats.archived}</span>
          <span className="admin-stat-sub">Removed from view</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "1rem",
        backgroundColor: "var(--admin-card-bg)",
        padding: "1rem 1.25rem",
        borderRadius: "0.75rem",
        border: "1px solid var(--admin-border)"
      }}>
        {/* Search */}
        <div style={{ position: "relative", minWidth: "260px", flex: 1, maxWidth: "420px" }}>
          <Search size={16} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--admin-text-muted)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search note text or author..."
            className="admin-input"
            style={{ width: "100%", paddingLeft: "2.3rem" }}
          />
        </div>

        {/* Status Filters */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {(["all", "active", "pinned", "archived"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className="admin-btn"
              style={{
                textTransform: "capitalize",
                padding: "0.45rem 0.85rem",
                fontSize: "0.85rem",
                backgroundColor: statusFilter === st ? "var(--admin-btn-primary-bg, #3b82f6)" : "transparent",
                color: statusFilter === st ? "#ffffff" : "var(--admin-text-muted)",
                borderColor: statusFilter === st ? "transparent" : "var(--admin-border)"
              }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Color Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--admin-text-muted)" }}>Color:</span>
          <select
            value={colorFilter}
            onChange={(e) => setColorFilter(e.target.value)}
            className="admin-input"
            style={{ padding: "0.45rem 0.85rem", fontSize: "0.85rem", width: "auto" }}
          >
            <option value="all">All Colors</option>
            {PALETTES.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes Table */}
      <div style={{
        backgroundColor: "var(--admin-card-bg)",
        borderRadius: "0.75rem",
        border: "1px solid var(--admin-border)",
        overflow: "hidden"
      }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-text-muted)" }}>
            Loading wall notes...
          </div>
        ) : filteredNotes.length === 0 ? (
          <div style={{ padding: "3.5rem 1.5rem", textAlign: "center" }}>
            <MessageSquare size={36} color="var(--admin-text-muted)" style={{ margin: "0 auto 1rem auto" }} />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.25rem" }}>No sticky notes found</h3>
            <p style={{ color: "var(--admin-text-muted)", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
              {search ? "No notes matched your query." : "There are currently no notes in this view."}
            </p>
            <button onClick={handleOpenNew} className="admin-btn admin-btn-primary">
              <Plus size={16} /> Add First Note
            </button>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--admin-border)", color: "var(--admin-text-muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  <th style={{ padding: "0.9rem 1.25rem" }}>Color / Icon</th>
                  <th style={{ padding: "0.9rem 1.25rem", width: "42%" }}>Message</th>
                  <th style={{ padding: "0.9rem 1.25rem" }}>Author</th>
                  <th style={{ padding: "0.9rem 1.25rem" }}>Status</th>
                  <th style={{ padding: "0.9rem 1.25rem" }}>Likes</th>
                  <th style={{ padding: "0.9rem 1.25rem" }}>Created</th>
                  <th style={{ padding: "0.9rem 1.25rem", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotes.map((note) => {
                  const palette = PALETTES.find((p) => p.id === note.color) || PALETTES[0];
                  return (
                    <tr
                      key={note.id}
                      style={{
                        borderBottom: "1px solid var(--admin-border)",
                        opacity: note.is_archived ? 0.6 : 1,
                        transition: "background-color 0.15s ease"
                      }}
                    >
                      {/* Color & Emoji */}
                      <td style={{ padding: "0.9rem 1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <span
                            style={{
                              display: "inline-block",
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              backgroundColor: palette.hex,
                              border: "1px solid rgba(0,0,0,0.2)"
                            }}
                            title={palette.name}
                          />
                          <span style={{ fontSize: "1.1rem" }}>{note.emoji || "📌"}</span>
                        </div>
                      </td>

                      {/* Message Content */}
                      <td style={{ padding: "0.9rem 1.25rem" }}>
                        <div style={{ maxWidth: "420px", wordBreak: "break-word", lineHeight: 1.5 }}>
                          {note.message}
                        </div>
                      </td>

                      {/* Author */}
                      <td style={{ padding: "0.9rem 1.25rem", fontWeight: 500 }}>
                        {note.author_name || "Anonymous"}
                      </td>

                      {/* Pinned & Archived Status */}
                      <td style={{ padding: "0.9rem 1.25rem" }}>
                        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                          {note.is_pinned && (
                            <span style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              backgroundColor: "rgba(16, 185, 129, 0.12)",
                              color: "#10b981",
                              fontSize: "0.75rem",
                              padding: "0.2rem 0.5rem",
                              borderRadius: "4px",
                              fontWeight: 600
                            }}>
                              <Pin size={11} /> Pinned
                            </span>
                          )}
                          {note.is_archived ? (
                            <span style={{
                              backgroundColor: "rgba(239, 68, 68, 0.12)",
                              color: "#ef4444",
                              fontSize: "0.75rem",
                              padding: "0.2rem 0.5rem",
                              borderRadius: "4px",
                              fontWeight: 600
                            }}>
                              Archived
                            </span>
                          ) : (
                            <span style={{
                              backgroundColor: "rgba(59, 130, 246, 0.12)",
                              color: "#3b82f6",
                              fontSize: "0.75rem",
                              padding: "0.2rem 0.5rem",
                              borderRadius: "4px",
                              fontWeight: 600
                            }}>
                              Live
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Likes Count */}
                      <td style={{ padding: "0.9rem 1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#ec4899", fontWeight: 600 }}>
                          <Heart size={14} fill="#ec4899" />
                          <span>{note.likes_count || 0}</span>
                        </div>
                      </td>

                      {/* Created At */}
                      <td style={{ padding: "0.9rem 1.25rem", color: "var(--admin-text-muted)", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                        {new Date(note.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "0.9rem 1.25rem", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                          
                          {/* Pin Toggle */}
                          <button
                            type="button"
                            onClick={() => handleTogglePin(note)}
                            title={note.is_pinned ? "Unpin note" : "Pin to top"}
                            className="admin-btn admin-btn-icon"
                            style={{
                              padding: "0.4rem",
                              color: note.is_pinned ? "#10b981" : "var(--admin-text-muted)"
                            }}
                          >
                            <Pin size={16} fill={note.is_pinned ? "#10b981" : "none"} />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(note)}
                            title="Edit note"
                            className="admin-btn admin-btn-icon"
                            style={{ padding: "0.4rem" }}
                          >
                            <Edit2 size={16} />
                          </button>

                          {/* Archive or Restore */}
                          {note.is_archived ? (
                            <button
                              type="button"
                              onClick={() => handleRestoreNote(note.id)}
                              title="Restore note to live wall"
                              className="admin-btn admin-btn-icon"
                              style={{ padding: "0.4rem", color: "#10b981" }}
                            >
                              <RotateCcw size={16} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleArchiveNote(note.id)}
                              title="Archive (hide from wall)"
                              className="admin-btn admin-btn-icon"
                              style={{ padding: "0.4rem", color: "#f59e0b" }}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}

                          {/* Permanent Delete */}
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteConfirmId(note.id);
                              setDeleteIsPermanent(true);
                            }}
                            title="Delete permanently"
                            className="admin-btn admin-btn-icon"
                            style={{ padding: "0.4rem", color: "#ef4444" }}
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer: Add / Edit Note */}
      <AdminDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingNote ? "Edit Sticky Note" : "Create Sticky Note"}
      >
        <form onSubmit={handleSaveNote} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          {/* Note Message */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Note Message *</label>
              <span style={{ fontSize: "0.8rem", color: formMessage.length > 380 ? "#ef4444" : "var(--admin-text-muted)" }}>
                {formMessage.length} / 400
              </span>
            </div>
            <textarea
              value={formMessage}
              onChange={(e) => setFormMessage(e.target.value)}
              placeholder="Write the sticky note content..."
              maxLength={400}
              rows={4}
              required
              className="admin-input"
              style={{ width: "100%", resize: "vertical" }}
            />
          </div>

          {/* Author Name */}
          <div>
            <label style={{ fontWeight: 600, fontSize: "0.9rem", display: "block", marginBottom: "0.4rem" }}>
              Author Name
            </label>
            <input
              type="text"
              value={formAuthor}
              onChange={(e) => setFormAuthor(e.target.value)}
              placeholder="e.g. Pranav R (Admin)"
              maxLength={35}
              className="admin-input"
              style={{ width: "100%" }}
            />
          </div>

          {/* Color Selector */}
          <div>
            <label style={{ fontWeight: 600, fontSize: "0.9rem", display: "block", marginBottom: "0.5rem" }}>
              Sticky Note Color
            </label>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              {PALETTES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setFormColor(p.id)}
                  title={p.name}
                  style={{
                    backgroundColor: p.hex,
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: formColor === p.id ? "3px solid #000" : "1px solid rgba(0,0,0,0.15)",
                    cursor: "pointer",
                    transform: formColor === p.id ? "scale(1.15)" : "scale(1)",
                    transition: "transform 0.15s ease"
                  }}
                />
              ))}
            </div>
          </div>

          {/* Emoji Sticker Selector */}
          <div>
            <label style={{ fontWeight: 600, fontSize: "0.9rem", display: "block", marginBottom: "0.5rem" }}>
              Icon Badge
            </label>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setFormEmoji(e)}
                  style={{
                    fontSize: "1.2rem",
                    padding: "0.3rem 0.6rem",
                    borderRadius: "6px",
                    border: formEmoji === e ? "2px solid #3b82f6" : "1px solid var(--admin-border)",
                    backgroundColor: formEmoji === e ? "rgba(59, 130, 246, 0.15)" : "transparent",
                    cursor: "pointer"
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Pinned Checkbox */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.5rem 0" }}>
            <input
              type="checkbox"
              id="formPinned"
              checked={formPinned}
              onChange={(e) => setFormPinned(e.target.checked)}
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
            />
            <label htmlFor="formPinned" style={{ fontWeight: 500, fontSize: "0.92rem", cursor: "pointer" }}>
              Pin note to top of the wall
            </label>
          </div>

          {/* Likes Adjustment (When editing) */}
          {editingNote && (
            <div>
              <label style={{ fontWeight: 600, fontSize: "0.9rem", display: "block", marginBottom: "0.4rem" }}>
                Likes Count
              </label>
              <input
                type="number"
                min="0"
                value={formLikes}
                onChange={(e) => setFormLikes(parseInt(e.target.value, 10) || 0)}
                className="admin-input"
                style={{ width: "120px" }}
              />
            </div>
          )}

          {/* Preview */}
          <div style={{ marginTop: "0.5rem" }}>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--admin-text-muted)", fontWeight: 700 }}>
              Live Preview
            </span>
            <div
              style={{
                marginTop: "0.5rem",
                padding: "1.2rem",
                borderRadius: "0.75rem",
                backgroundColor: PALETTES.find((p) => p.id === formColor)?.hex || "#fef08a",
                color: "#1e293b",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                minHeight: "120px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span>{formEmoji}</span>
                  {formPinned && (
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.2rem" }}>
                      <Pin size={10} /> Pinned
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "0.95rem", lineHeight: 1.4 }}>
                  {formMessage.trim() || "Sticky note text preview..."}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", fontSize: "0.78rem", opacity: 0.8 }}>
                <span>~ {formAuthor.trim() || "Anonymous"}</span>
                <span>{formLikes} likes</span>
              </div>
            </div>
          </div>

          {/* Drawer Footer Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem", borderTop: "1px solid var(--admin-border)", paddingTop: "1rem" }}>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="admin-btn admin-btn-secondary"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={saving}
            >
              {saving ? "Saving..." : editingNote ? "Update Note" : "Post Note"}
            </button>
          </div>

        </form>
      </AdminDrawer>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleConfirmPermanentDelete}
        title="Permanently Delete Note"
        message="Are you sure you want to completely delete this sticky note from the database? This action cannot be undone."
        confirmText="Delete Permanently"
      />

    </div>
  );
}
