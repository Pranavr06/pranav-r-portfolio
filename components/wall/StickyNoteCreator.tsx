"use client";

import { useState } from "react";
import { X, Sparkles, Send } from "lucide-react";

interface StickyNoteCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onNoteCreated: (note: any) => void;
}

const PALETTES = [
  { id: "yellow", name: "Classic Yellow", hex: "#fef08a" },
  { id: "pink", name: "Cotton Pink", hex: "#fbcfe8" },
  { id: "green", name: "Mint Green", hex: "#bbf7d0" },
  { id: "blue", name: "Sky Blue", hex: "#bae6fd" },
  { id: "purple", name: "Lavender", hex: "#e9d5ff" },
  { id: "orange", name: "Sunset Peach", hex: "#fed7aa" },
];

const EMOJIS = ["📌", "🚀", "💡", "🔥", "❤️", "☕", "💻", "🎉", "👾", "✨", "⭐", "⚡"];

export default function StickyNoteCreator({ isOpen, onClose, onNoteCreated }: StickyNoteCreatorProps) {
  const [message, setMessage] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [color, setColor] = useState("yellow");
  const [emoji, setEmoji] = useState("📌");
  const [honeypot, setHoneypot] = useState(""); // Anti-spam honeypot
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please write something on your sticky note.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const clientTime = Date.now().toString();
      let clientTz = "";
      try {
        clientTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      } catch (e) {}

      const res = await fetch("/api/wall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-wall-client-sig": "pranav-wall-v1",
          "x-wall-client-time": clientTime,
          "x-client-timezone": clientTz,
        },
        body: JSON.stringify({
          message: message.trim(),
          author_name: authorName.trim() || "Anonymous",
          color,
          emoji,
          website_url: honeypot, // Honeypot trap for automated bots
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to stick note to the wall.");
      }

      onNoteCreated(data.note);
      setMessage("");
      setAuthorName("");
      setHoneypot("");
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred while posting your note.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="wall-modal-overlay" onClick={onClose}>
      <div className="wall-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div>
            <h3 style={{ fontSize: "1.35rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>Stick a Note</span>
              <Sparkles size={18} color="#eab308" />
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--admin-text-muted, #64748b)", margin: "0.2rem 0 0 0" }}>
              No sign-in required. Share thoughts or leave a note.
            </p>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close modal"
            style={{ 
              background: "transparent", 
              border: "none", 
              cursor: "pointer", 
              padding: "0.4rem", 
              borderRadius: "50%",
              color: "inherit"
            }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: "rgba(239, 68, 68, 0.12)", 
            color: "#ef4444", 
            padding: "0.75rem 1rem", 
            borderRadius: "0.75rem", 
            fontSize: "0.88rem",
            marginBottom: "1rem",
            border: "1px solid rgba(239, 68, 68, 0.2)"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Honeypot field - invisible to humans, attracts bots */}
          <input
            type="text"
            name="website_url"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          
          {/* Note Message Input */}
          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <label style={{ fontSize: "0.88rem", fontWeight: 600 }}>Your Message</label>
              <span style={{ fontSize: "0.75rem", color: message.length > 380 ? "#ef4444" : "#94a3b8" }}>
                {message.length} / 400
              </span>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave a message, feedback, question, or anything on your mind..."
              maxLength={400}
              rows={4}
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: "0.85rem",
                border: "1px solid var(--admin-border, #cbd5e1)",
                backgroundColor: "var(--admin-card-bg, #ffffff)",
                color: "inherit",
                fontSize: "0.95rem",
                lineHeight: 1.5,
                outline: "none",
                resize: "vertical"
              }}
            />
          </div>

          {/* Color Palette Selector */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ fontSize: "0.88rem", fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
              Sticky Note Color
            </label>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
              {PALETTES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  title={p.name}
                  onClick={() => setColor(p.id)}
                  style={{
                    backgroundColor: p.hex,
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    border: color === p.id ? "3px solid #000" : "1px solid rgba(0,0,0,0.15)",
                    cursor: "pointer",
                    transform: color === p.id ? "scale(1.15)" : "scale(1)",
                    transition: "transform 0.2s ease, border 0.2s ease",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                  }}
                />
              ))}
            </div>
          </div>

          {/* Icon Sticker Selector */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ fontSize: "0.88rem", fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
              Pick an Icon Badge
            </label>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  style={{
                    fontSize: "1.2rem",
                    padding: "0.3rem 0.5rem",
                    borderRadius: "0.5rem",
                    border: emoji === e ? "2px solid #3b82f6" : "1px solid transparent",
                    backgroundColor: emoji === e ? "rgba(59, 130, 246, 0.15)" : "transparent",
                    cursor: "pointer",
                    transition: "transform 0.15s ease"
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Author Name Input */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontSize: "0.88rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
              Author Name (Optional)
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Fellow Dev, Sarah, or leave blank for Anonymous"
              maxLength={35}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "0.85rem",
                border: "1px solid var(--admin-border, #cbd5e1)",
                backgroundColor: "var(--admin-card-bg, #ffffff)",
                color: "inherit",
                fontSize: "0.92rem",
                outline: "none"
              }}
            />
          </div>

          {/* Live Note Preview */}
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8", fontWeight: 700 }}>
              Live Note Preview
            </span>
            <div className={`sticky-note note-${color}`} style={{ marginTop: "0.5rem", minHeight: "150px", transform: "rotate(-1deg)" }}>
              <div className="sticky-tape" />
              <div>
                <div className="sticky-header-row">
                  <span className="sticky-emoji-badge">{emoji}</span>
                </div>
                <div className="sticky-body" style={{ fontSize: "0.95rem" }}>
                  {message.trim() || "Your message will appear right here on the sticky note..."}
                </div>
              </div>
              <div className="sticky-footer" style={{ fontSize: "0.78rem" }}>
                <span className="sticky-author">~ {authorName.trim() || "Anonymous"}</span>
                <span>Just now</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn btn-color-1"
              style={{ padding: "0.7rem 1.25rem", borderRadius: "2rem" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-color-2"
              style={{ 
                padding: "0.7rem 1.75rem", 
                borderRadius: "2rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                opacity: submitting ? 0.7 : 1
              }}
            >
              <Send size={16} />
              {submitting ? "Sticking..." : "Stick Note"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
