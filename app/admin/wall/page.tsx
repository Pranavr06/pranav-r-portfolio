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
  AlertCircle,
  Globe,
  Smartphone,
  Info,
  X,
  Shield,
  Ban,
  CheckCircle,
  HelpCircle
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
  ip_address?: string;
  location?: string;
  device_info?: string;
  user_agent?: string;
}

interface BannedWord {
  id: string;
  word: string;
  created_at: string;
  created_by?: string;
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

const PRESET_SUGGESTIONS = [
  "scam",
  "telegram group",
  "whatsapp group",
  "free money",
  "casino",
  "lottery winner",
  "dm for promo",
  "free followers",
  "invest here",
  "crypto giveaway"
];

export default function AdminWall() {
  const [activeTab, setActiveTab] = useState<"notes" | "banned_words">("notes");
  const [notes, setNotes] = useState<WallNote[]>([]);
  const [bannedWords, setBannedWords] = useState<BannedWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableReady, setTableReady] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pinned" | "archived">("all");
  const [colorFilter, setColorFilter] = useState("all");

  // Banned Words State
  const [newWordInput, setNewWordInput] = useState("");
  const [addingWord, setAddingWord] = useState(false);
  const [testPhrase, setTestPhrase] = useState("");

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

  // Telemetry inspection modal state
  const [selectedTelemetryNote, setSelectedTelemetryNote] = useState<WallNote | null>(null);

  // Delete Confirm Modal
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteIsPermanent, setDeleteIsPermanent] = useState(false);

  const router = useRouter();
  const { addToast } = useToast();

  const fetchWallData = async () => {
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
      setBannedWords(data.bannedWords || []);
      setTableReady(data.tableReady !== false);
    } catch (err: any) {
      setError(err.message || "Failed to fetch notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallData();
  }, []);

  // Filtered Notes
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      if (statusFilter === "active" && n.is_archived) return false;
      if (statusFilter === "archived" && !n.is_archived) return false;
      if (statusFilter === "pinned" && (!n.is_pinned || n.is_archived)) return false;

      if (colorFilter !== "all" && n.color !== colorFilter) return false;

      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const msg = (n.message || "").toLowerCase();
        const author = (n.author_name || "").toLowerCase();
        const ip = (n.ip_address || "").toLowerCase();
        const loc = (n.location || "").toLowerCase();
        const dev = (n.device_info || "").toLowerCase();
        if (!msg.includes(q) && !author.includes(q) && !ip.includes(q) && !loc.includes(q) && !dev.includes(q)) return false;
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

  // Handle Add Banned Word(s)
  const handleAddBannedWord = async (e?: React.FormEvent, directWord?: string) => {
    if (e) e.preventDefault();
    const rawInput = directWord || newWordInput;
    if (!rawInput.trim()) return;

    // Support comma-separated batch input e.g. "scam, casino, promo"
    const wordsToAdd = rawInput
      .split(",")
      .map((w) => w.trim().toLowerCase())
      .filter((w) => w.length > 0);

    if (wordsToAdd.length === 0) return;

    try {
      setAddingWord(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      for (const w of wordsToAdd) {
        // Prevent duplicate local add
        if (bannedWords.some((b) => b.word.toLowerCase() === w)) {
          addToast(`"${w}" is already on the blacklist.`, "info");
          continue;
        }

        const res = await fetch("/api/admin/wall", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ action: "add_banned_word", word: w })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `Failed to add "${w}"`);
        }

        setBannedWords((prev) => [data.bannedWord || { id: `local-${Date.now()}`, word: w, created_at: new Date().toISOString() }, ...prev]);
        addToast(`Restricted word added: "${w}"`, "success");
      }

      setNewWordInput("");
    } catch (err: any) {
      addToast(err.message || "Failed to add word", "error");
    } finally {
      setAddingWord(false);
    }
  };

  // Handle Delete Banned Word
  const handleDeleteBannedWord = async (wordObj: BannedWord) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch("/api/admin/wall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ action: "delete_banned_word", id: wordObj.id, word: wordObj.word })
      });

      if (!res.ok) throw new Error("Failed to remove word");

      setBannedWords((prev) => prev.filter((w) => w.id !== wordObj.id && w.word !== wordObj.word));
      addToast(`Removed "${wordObj.word}" from blacklist`, "info");
    } catch (err: any) {
      addToast(err.message || "Failed to delete word", "error");
    }
  };

  // Live Test Filter Simulator
  const testSimulationResult = useMemo(() => {
    if (!testPhrase.trim()) return null;
    const lower = testPhrase.toLowerCase();
    for (const bw of bannedWords) {
      const w = bw.word.toLowerCase().trim();
      if (!w) continue;
      if (w.includes(" ")) {
        if (lower.includes(w)) return { blocked: true, word: w };
      } else {
        const regex = new RegExp(`\\b${w}\\b`, "i");
        if (regex.test(lower)) return { blocked: true, word: w };
      }
    }
    return { blocked: false };
  }, [testPhrase, bannedWords]);

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
      fetchWallData();
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
            Manage sticky notes, review IP telemetry, and customize forbidden word filters.
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

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--admin-border)", paddingBottom: "0.75rem" }}>
        <button
          type="button"
          onClick={() => setActiveTab("notes")}
          className="admin-btn"
          style={{
            backgroundColor: activeTab === "notes" ? "var(--admin-btn-primary-bg, #3b82f6)" : "transparent",
            color: activeTab === "notes" ? "#ffffff" : "var(--admin-text-muted)",
            borderColor: activeTab === "notes" ? "transparent" : "var(--admin-border)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: 600,
            fontSize: "0.9rem",
            padding: "0.55rem 1.15rem",
            borderRadius: "0.6rem"
          }}
        >
          <MessageSquare size={16} />
          <span>Sticky Notes ({notes.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("banned_words")}
          className="admin-btn"
          style={{
            backgroundColor: activeTab === "banned_words" ? "var(--admin-btn-primary-bg, #3b82f6)" : "transparent",
            color: activeTab === "banned_words" ? "#ffffff" : "var(--admin-text-muted)",
            borderColor: activeTab === "banned_words" ? "transparent" : "var(--admin-border)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: 600,
            fontSize: "0.9rem",
            padding: "0.55rem 1.15rem",
            borderRadius: "0.6rem"
          }}
        >
          <Shield size={16} />
          <span>Forbidden Words Filter ({bannedWords.length})</span>
        </button>
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
            <strong>Database Migration Notice:</strong> Table <code>wall_notes</code> or <code>wall_banned_words</code> is not yet created in your Supabase database. Run <code>scripts/create_wall_notes.sql</code> in the Supabase SQL Editor to enable live storage.
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 1: STICKY NOTES MANAGEMENT                                 */}
      {/* ============================================================== */}
      {activeTab === "notes" && (
        <>
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
                placeholder="Search message, author, IP, or location..."
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
                      <th style={{ padding: "0.9rem 1.25rem", width: "38%" }}>Message & Telemetry</th>
                      <th style={{ padding: "0.9rem 1.25rem" }}>Author</th>
                      <th style={{ padding: "0.9rem 1.25rem" }}>Origin / IP</th>
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

                          <td style={{ padding: "0.9rem 1.25rem" }}>
                            <div style={{ maxWidth: "380px", wordBreak: "break-word", lineHeight: 1.5, fontWeight: 500 }}>
                              {note.message}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.35rem", fontSize: "0.75rem", color: "var(--admin-text-muted)", flexWrap: "wrap" }}>
                              {note.location && (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                                  <Globe size={11} color="#3b82f6" /> {note.location}
                                </span>
                              )}
                              {note.device_info && (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                                  <Smartphone size={11} color="#10b981" /> {note.device_info.split("(")[0].trim()}
                                </span>
                              )}
                            </div>
                          </td>

                          <td style={{ padding: "0.9rem 1.25rem", fontWeight: 600 }}>
                            {note.author_name || "Anonymous"}
                          </td>

                          <td style={{ padding: "0.9rem 1.25rem" }}>
                            <div style={{ fontSize: "0.82rem" }}>
                              <span style={{ fontFamily: "monospace", display: "block", color: "var(--admin-text-main)" }}>
                                {note.ip_address || (note.ip_hash ? `${note.ip_hash.slice(0, 8)}...` : "Unknown IP")}
                              </span>
                              <button
                                type="button"
                                onClick={() => setSelectedTelemetryNote(note)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  padding: 0,
                                  color: "#3b82f6",
                                  fontSize: "0.75rem",
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                  marginTop: "0.2rem"
                                }}
                              >
                                Inspect Origin &rarr;
                              </button>
                            </div>
                          </td>

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

                          <td style={{ padding: "0.9rem 1.25rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#ec4899", fontWeight: 600 }}>
                              <Heart size={14} fill="#ec4899" />
                              <span>{note.likes_count || 0}</span>
                            </div>
                          </td>

                          <td style={{ padding: "0.9rem 1.25rem", color: "var(--admin-text-muted)", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                            {new Date(note.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                          </td>

                          <td style={{ padding: "0.9rem 1.25rem", textAlign: "right" }}>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                              <button
                                type="button"
                                onClick={() => setSelectedTelemetryNote(note)}
                                title="Inspect IP & Device Details"
                                className="admin-btn admin-btn-icon"
                                style={{ padding: "0.4rem", color: "#3b82f6" }}
                              >
                                <Info size={16} />
                              </button>

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

                              <button
                                type="button"
                                onClick={() => handleOpenEdit(note)}
                                title="Edit note"
                                className="admin-btn admin-btn-icon"
                                style={{ padding: "0.4rem" }}
                              >
                                <Edit2 size={16} />
                              </button>

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
        </>
      )}

      {/* ============================================================== */}
      {/* TAB 2: FORBIDDEN / BANNED WORDS FILTER                         */}
      {/* ============================================================== */}
      {activeTab === "banned_words" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Add Word Card */}
          <div style={{
            backgroundColor: "var(--admin-card-bg)",
            borderRadius: "0.75rem",
            border: "1px solid var(--admin-border)",
            padding: "1.5rem"
          }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "0 0 0.35rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Shield size={18} color="#ef4444" />
              <span>Add Words or Phrases to Blacklist</span>
            </h3>
            <p style={{ color: "var(--admin-text-muted)", fontSize: "0.9rem", margin: "0 0 1.25rem 0" }}>
              Any visitor attempting to stick a note containing these words or phrases will be immediately rejected with an error. Multiple words can be added separated by commas.
            </p>

            <form onSubmit={(e) => handleAddBannedWord(e)} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <input
                type="text"
                value={newWordInput}
                onChange={(e) => setNewWordInput(e.target.value)}
                placeholder="e.g. scam, offensive-word, promo link, casino..."
                className="admin-input"
                style={{ flex: 1, minWidth: "280px" }}
                disabled={addingWord}
              />
              <button
                type="submit"
                disabled={addingWord || !newWordInput.trim()}
                className="admin-btn admin-btn-primary"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.4rem" }}
              >
                <Plus size={16} />
                {addingWord ? "Adding..." : "Add to Blacklist"}
              </button>
            </form>

            {/* Quick Preset Suggestions */}
            <div style={{ marginTop: "1.25rem" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)", fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
                Quick Preset Suggestions:
              </span>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {PRESET_SUGGESTIONS.map((preset) => {
                  const alreadyAdded = bannedWords.some((b) => b.word.toLowerCase() === preset.toLowerCase());
                  return (
                    <button
                      key={preset}
                      type="button"
                      disabled={alreadyAdded || addingWord}
                      onClick={() => handleAddBannedWord(undefined, preset)}
                      className="admin-btn"
                      style={{
                        fontSize: "0.78rem",
                        padding: "0.3rem 0.65rem",
                        borderRadius: "9999px",
                        backgroundColor: alreadyAdded ? "rgba(16, 185, 129, 0.1)" : "var(--admin-bg)",
                        color: alreadyAdded ? "#10b981" : "var(--admin-text-main)",
                        borderColor: alreadyAdded ? "rgba(16, 185, 129, 0.3)" : "var(--admin-border)",
                        opacity: alreadyAdded ? 0.7 : 1,
                        cursor: alreadyAdded ? "default" : "pointer"
                      }}
                    >
                      {alreadyAdded ? "✓ Added" : `+ ${preset}`}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Currently Blocked Words Grid */}
          <div style={{
            backgroundColor: "var(--admin-card-bg)",
            borderRadius: "0.75rem",
            border: "1px solid var(--admin-border)",
            padding: "1.5rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Ban size={18} color="#f59e0b" />
                <span>Currently Blacklisted ({bannedWords.length})</span>
              </h3>
              <span style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>
                Click (✕) to unblock any word
              </span>
            </div>

            {bannedWords.length === 0 ? (
              <p style={{ color: "var(--admin-text-muted)", fontSize: "0.9rem", textAlign: "center", padding: "2rem 0" }}>
                No forbidden words currently active.
              </p>
            ) : (
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                {bannedWords.map((item) => (
                  <div
                    key={item.id || item.word}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.45rem 0.85rem",
                      borderRadius: "0.5rem",
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.25)",
                      color: "#ef4444",
                      fontSize: "0.88rem",
                      fontWeight: 600
                    }}
                  >
                    <span>{item.word}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteBannedWord(item)}
                      title={`Remove "${item.word}" from blacklist`}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#ef4444",
                        display: "flex",
                        alignItems: "center",
                        padding: 0
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Filter Tester Simulator */}
          <div style={{
            backgroundColor: "var(--admin-card-bg)",
            borderRadius: "0.75rem",
            border: "1px solid var(--admin-border)",
            padding: "1.5rem"
          }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 0.35rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <HelpCircle size={18} color="#3b82f6" />
              <span>Interactive Filter Simulator</span>
            </h3>
            <p style={{ color: "var(--admin-text-muted)", fontSize: "0.88rem", margin: "0 0 1rem 0" }}>
              Type sample note text below to verify in real-time whether your filter will block or allow it.
            </p>

            <textarea
              value={testPhrase}
              onChange={(e) => setTestPhrase(e.target.value)}
              placeholder="Type test note content (e.g. 'Hey check out this scam site' or 'Great project!')..."
              rows={3}
              className="admin-input"
              style={{ width: "100%", resize: "vertical", marginBottom: "0.75rem" }}
            />

            {testPhrase.trim() && testSimulationResult && (
              <div style={{
                padding: "0.85rem 1rem",
                borderRadius: "0.6rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: 600,
                backgroundColor: testSimulationResult.blocked ? "rgba(239, 68, 68, 0.12)" : "rgba(16, 185, 129, 0.12)",
                color: testSimulationResult.blocked ? "#ef4444" : "#10b981",
                border: testSimulationResult.blocked ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(16, 185, 129, 0.3)"
              }}>
                {testSimulationResult.blocked ? (
                  <>
                    <Ban size={18} />
                    <span>BLOCKED: Note contains blacklisted word &ldquo;{testSimulationResult.word}&rdquo;.</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    <span>ALLOWED: Clean note content. Meets all filter criteria.</span>
                  </>
                )}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Telemetry Origin Modal */}
      {selectedTelemetryNote && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem"
          }}
          onClick={() => setSelectedTelemetryNote(null)}
        >
          <div 
            style={{
              backgroundColor: "var(--admin-card-bg)",
              border: "1px solid var(--admin-border)",
              borderRadius: "1rem",
              padding: "1.75rem",
              maxWidth: "520px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Info size={20} color="#3b82f6" />
                <span>Sticky Note Origin & Telemetry</span>
              </h3>
              <button 
                onClick={() => setSelectedTelemetryNote(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-text-muted)" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ padding: "0.85rem", borderRadius: "8px", backgroundColor: "var(--admin-bg)", border: "1px solid var(--admin-border)" }}>
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--admin-text-muted)", fontWeight: 700 }}>
                  Posted By
                </span>
                <div style={{ fontWeight: 600, fontSize: "0.95rem", marginTop: "0.2rem" }}>
                  {selectedTelemetryNote.author_name || "Anonymous"}
                </div>
                <div style={{ marginTop: "0.4rem", fontSize: "0.9rem", color: "var(--admin-text-muted)", fontStyle: "italic", lineHeight: 1.4 }}>
                  &ldquo;{selectedTelemetryNote.message}&rdquo;
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div style={{ padding: "0.85rem", borderRadius: "8px", backgroundColor: "var(--admin-bg)", border: "1px solid var(--admin-border)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78rem", color: "var(--admin-text-muted)", fontWeight: 600 }}>
                    <Globe size={14} color="#3b82f6" /> Location
                  </span>
                  <div style={{ fontWeight: 600, fontSize: "0.92rem", marginTop: "0.35rem" }}>
                    {selectedTelemetryNote.location || "Unknown Location"}
                  </div>
                </div>

                <div style={{ padding: "0.85rem", borderRadius: "8px", backgroundColor: "var(--admin-bg)", border: "1px solid var(--admin-border)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78rem", color: "var(--admin-text-muted)", fontWeight: 600 }}>
                    <Smartphone size={14} color="#10b981" /> Device Model
                  </span>
                  <div style={{ fontWeight: 600, fontSize: "0.92rem", marginTop: "0.35rem" }}>
                    {selectedTelemetryNote.device_info || "Desktop / PC"}
                  </div>
                </div>
              </div>

              <div style={{ padding: "0.85rem", borderRadius: "8px", backgroundColor: "var(--admin-bg)", border: "1px solid var(--admin-border)" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", fontWeight: 600 }}>
                  Client IP Address
                </span>
                <div style={{ fontWeight: 600, fontSize: "0.95rem", marginTop: "0.25rem", fontFamily: "monospace", color: "#3b82f6" }}>
                  {selectedTelemetryNote.ip_address || "Not recorded directly (hashed: " + (selectedTelemetryNote.ip_hash?.slice(0, 10) || "none") + ")"}
                </div>
              </div>

              {selectedTelemetryNote.user_agent && (
                <div style={{ padding: "0.85rem", borderRadius: "8px", backgroundColor: "var(--admin-bg)", border: "1px solid var(--admin-border)" }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", fontWeight: 600 }}>
                    User-Agent Header
                  </span>
                  <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--admin-text-muted)", marginTop: "0.3rem", wordBreak: "break-all" }}>
                    {selectedTelemetryNote.user_agent}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setSelectedTelemetryNote(null)}
                className="admin-btn admin-btn-secondary"
                style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

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
