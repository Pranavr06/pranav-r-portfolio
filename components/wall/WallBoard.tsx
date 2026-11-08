"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Plus, Search, Heart, Pin, Sparkles, RefreshCw, MessageSquare } from "lucide-react";
import StickyNoteCreator from "./StickyNoteCreator";
import ShareMenu from "@/components/ShareMenu";

interface Note {
  id: string;
  message: string;
  author_name: string;
  color: string;
  emoji: string;
  rotation?: number;
  likes_count: number;
  is_pinned?: boolean;
  created_at: string;
}

interface WallBoardProps {
  initialNotes: Note[];
  tableReady?: boolean;
}

const PALETTES = [
  { id: "all", name: "All Colors", hex: "conic-gradient(from 180deg at 50% 50%, #fef08a 0deg, #fbcfe8 60deg, #bae6fd 120deg, #bbf7d0 180deg, #e9d5ff 240deg, #fed7aa 300deg, #fef08a 360deg)" },
  { id: "yellow", name: "Yellow", hex: "#fef08a" },
  { id: "pink", name: "Pink", hex: "#fbcfe8" },
  { id: "green", name: "Green", hex: "#bbf7d0" },
  { id: "blue", name: "Blue", hex: "#bae6fd" },
  { id: "purple", name: "Purple", hex: "#e9d5ff" },
  { id: "orange", name: "Orange", hex: "#fed7aa" },
];

const SORT_OPTIONS = [
  { id: "newest", label: "All (newest first)" },
  { id: "popular", label: "Most Liked" },
  { id: "oldest", label: "Oldest" },
];

export default function WallBoard({ initialNotes = [], tableReady = true }: WallBoardProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [search, setSearch] = useState("");
  const [selectedColor, setSelectedColor] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "oldest">("newest");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [likedNoteIds, setLikedNoteIds] = useState<Set<string>>(new Set());
  const [likingMap, setLikingMap] = useState<Record<string, boolean>>({});

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load liked note IDs from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("pranav_wall_liked_notes");
      if (stored) {
        setLikedNoteIds(new Set(JSON.parse(stored)));
      }
    } catch (e) {}
  }, []);

  const handleLike = async (noteId: string) => {
    if (likedNoteIds.has(noteId) || likingMap[noteId]) return;

    setLikingMap(prev => ({ ...prev, [noteId]: true }));

    // Optimistically update likes count
    setNotes(prev =>
      prev.map(n => (n.id === noteId ? { ...n, likes_count: (n.likes_count || 0) + 1 } : n))
    );

    const newLiked = new Set(likedNoteIds).add(noteId);
    setLikedNoteIds(newLiked);
    try {
      localStorage.setItem("pranav_wall_liked_notes", JSON.stringify(Array.from(newLiked)));
    } catch (e) {}

    try {
      await fetch("/api/wall/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note_id: noteId })
      });
    } catch (err) {
      console.warn("Failed to register like:", err);
    } finally {
      setLikingMap(prev => ({ ...prev, [noteId]: false }));
    }
  };

  const handleNoteCreated = (newNote: Note) => {
    setNotes(prev => [newNote, ...prev]);
  };

  // Filter & Sort Logic
  const filteredNotes = useMemo(() => {
    let result = [...notes];

    if (selectedColor !== "all") {
      result = result.filter(n => n.color === selectedColor);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        n =>
          (n.message && n.message.toLowerCase().includes(q)) ||
          (n.author_name && n.author_name.toLowerCase().includes(q))
      );
    }

    if (sortBy === "popular") {
      result.sort((a, b) => {
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        return (b.likes_count || 0) - (a.likes_count || 0);
      });
    } else if (sortBy === "oldest") {
      result.sort((a, b) => {
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });
    } else {
      // Default: "newest" / "All (newest first)"
      result.sort((a, b) => {
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    }

    return result;
  }, [notes, selectedColor, search, sortBy]);

  // Relative time helper
  const formatTimeAgo = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) return "just now";
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr}h ago`;
      const diffDays = Math.floor(diffHr / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch (e) {
      return "recently";
    }
  };

  // Generate deterministic subtle rotation for notes
  const getRotationStyle = (note: Note, index: number) => {
    if (typeof note.rotation === "number") {
      return `rotate(${note.rotation}deg)`;
    }
    const angles = [-2.2, 1.8, -1.5, 2.4, -0.8, 1.6, -1.9, 0.9];
    return `rotate(${angles[index % angles.length]}deg)`;
  };

  return (
    <>
      {/* Centered Sort Dropdown & Share Menu (matching Certificates design) */}
      <div className="filter-container" style={{ margin: "0 auto 2.5rem auto" }}>
        <div className="custom-select-container" ref={dropdownRef} style={{ width: "210px" }}>
          <button 
            type="button" 
            className="custom-select-btn" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            <span>{SORT_OPTIONS.find(o => o.id === sortBy)?.label || "All (newest first)"}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              style={{ 
                transform: dropdownOpen ? 'rotate(180deg)' : 'none', 
                transition: 'transform 0.2s ease', 
                flexShrink: 0, 
                marginLeft: '0.5rem' 
              }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div className={`custom-select-dropdown ${dropdownOpen ? 'open' : ''}`} role="listbox">
            {SORT_OPTIONS.map(opt => (
              <button 
                key={opt.id} 
                type="button" 
                className={`custom-select-option ${sortBy === opt.id ? 'selected' : ''}`}
                onClick={() => { setSortBy(opt.id as any); setDropdownOpen(false); }}
                role="option"
                aria-selected={sortBy === opt.id}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <ShareMenu title="The Wall | Pranav R" type="page" />
      </div>

      {/* Controls Bar */}
      <div className="wall-controls-bar">
        
        {/* Left: Search input */}
        <div style={{ position: "relative", minWidth: "220px", flex: 1, maxWidth: "340px" }}>
          <Search size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes or authors..."
            style={{
              width: "100%",
              padding: "0.6rem 1rem 0.6rem 2.5rem",
              borderRadius: "9999px",
              border: "1px solid var(--admin-border, #cbd5e1)",
              backgroundColor: "var(--admin-card-bg, #ffffff)",
              color: "inherit",
              fontSize: "0.9rem",
              outline: "none"
            }}
          />
        </div>

        {/* Center: Color Filter Chips */}
        <div className="wall-filter-group">
          <span style={{ fontSize: "0.82rem", color: "#94a3b8", fontWeight: 600, marginRight: "0.2rem" }}>
            Color:
          </span>
          {PALETTES.map((p) => (
            <button
              key={p.id}
              type="button"
              title={p.name}
              onClick={() => setSelectedColor(p.id)}
              className={`wall-color-dot ${selectedColor === p.id ? "active" : ""}`}
              style={{
                background: p.hex
              }}
            />
          ))}
        </div>

        {/* Right: Stick Button */}
        <div>
          <button
            onClick={() => setIsCreatorOpen(true)}
            className="btn btn-color-2"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 1.4rem",
              borderRadius: "9999px",
              fontSize: "0.92rem",
              fontWeight: 700,
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)"
            }}
          >
            <Plus size={18} />
            Stick a Note
          </button>
        </div>

      </div>

      {/* Counter bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", padding: "0 0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "var(--admin-text-muted, #64748b)" }}>
          <MessageSquare size={16} />
          <span>Showing <b>{filteredNotes.length}</b> sticky {filteredNotes.length === 1 ? 'note' : 'notes'}</span>
        </div>
        {search && (
          <button
            onClick={() => setSearch("")}
            style={{ background: "transparent", border: "none", color: "#3b82f6", fontSize: "0.85rem", cursor: "pointer", textDecoration: "underline" }}
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Corkboard Canvas */}
      <div className="wall-board-canvas">
        {filteredNotes.length > 0 ? (
          <div className="wall-grid">
            {filteredNotes.map((note, index) => {
              const isLiked = likedNoteIds.has(note.id);
              const rotationStyle = getRotationStyle(note, index);

              return (
                <div
                  key={note.id}
                  className={`sticky-note note-${note.color || "yellow"}`}
                  style={{ transform: rotationStyle }}
                >
                  {/* Top Frosted Tape */}
                  <div className="sticky-tape" />

                  {/* Header Row (Emoji + Pinned badge) */}
                  <div>
                    <div className="sticky-header-row">
                      <span className="sticky-emoji-badge">{note.emoji || "📌"}</span>
                      {note.is_pinned && (
                        <span className="sticky-pinned-badge">
                          <Pin size={10} style={{ transform: "rotate(45deg)" }} /> Pinned
                        </span>
                      )}
                    </div>

                    {/* Note Body Text */}
                    <div className="sticky-body">
                      {note.message}
                    </div>
                  </div>

                  {/* Note Footer */}
                  <div className="sticky-footer">
                    <span className="sticky-author" title={`Posted by ${note.author_name || "Anonymous"}`}>
                      ~ {note.author_name || "Anonymous"}
                    </span>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>
                        {formatTimeAgo(note.created_at)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleLike(note.id)}
                        className={`sticky-like-btn ${isLiked ? "liked" : ""}`}
                        title={isLiked ? "Liked!" : "Give a heart"}
                      >
                        <Heart
                          size={13}
                          fill={isLiked ? "#e11d48" : "none"}
                          color={isLiked ? "#e11d48" : "currentColor"}
                        />
                        <span>{note.likes_count || 0}</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem 1.5rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📝</div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.5rem" }}>No sticky notes found</h3>
            <p style={{ color: "var(--admin-text-muted, #64748b)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
              {search ? "No notes matched your search query." : "The wall is quiet right now. Be the first to drop a note!"}
            </p>
            <button
              onClick={() => setIsCreatorOpen(true)}
              className="btn btn-color-2"
              style={{ borderRadius: "2rem", padding: "0.7rem 1.5rem" }}
            >
              Stick the First Note
            </button>
          </div>
        )}
      </div>

      {/* Sticky Note Creator Modal */}
      <StickyNoteCreator
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        onNoteCreated={handleNoteCreated}
      />
    </>
  );
}
