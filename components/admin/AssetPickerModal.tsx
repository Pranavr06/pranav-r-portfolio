"use client";

import { useEffect, useState, useMemo } from "react";
import { X, Search, FileText, Film, FolderOpen } from "lucide-react";

export interface AssetInfo {
  name: string;
  path: string;
  ext: string;
  type: "image" | "pdf" | "video" | "other";
  isLogo: boolean;
  isCertificate: boolean;
}

interface AssetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (assetPath: string) => void;
  defaultCategory?: "all" | "logos" | "documents" | "images";
  title?: string;
}

export default function AssetPickerModal({
  isOpen,
  onClose,
  onSelect,
  defaultCategory = "all",
  title = "Select Asset from /public/assets",
}: AssetPickerModalProps) {
  const [assets, setAssets] = useState<AssetInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | "logos" | "documents" | "images">(defaultCategory);
  const [prevCategory, setPrevCategory] = useState(defaultCategory);

  if (defaultCategory !== prevCategory) {
    setPrevCategory(defaultCategory);
    setCategory(defaultCategory);
  }

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function loadAssets() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/assets");
        if (!res.ok) throw new Error("Failed to load assets");
        const data = await res.json();
        if (isMounted && data.assets) {
          setAssets(data.assets);
        }
      } catch (err) {
        console.error("Failed to load assets:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAssets();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const counts = useMemo(() => {
    return {
      all: assets.length,
      logos: assets.filter((a) => a.isLogo || (a.type === "image" && a.name.toLowerCase().includes("logo"))).length,
      documents: assets.filter((a) => a.type === "pdf" || a.isCertificate).length,
      images: assets.filter((a) => a.type === "image").length,
    };
  }, [assets]);

  const filteredAssets = useMemo(() => {
    let list = assets;

    if (category === "logos") {
      list = list.filter((a) => a.isLogo || (a.type === "image" && a.name.toLowerCase().includes("logo")));
    } else if (category === "documents") {
      list = list.filter((a) => a.type === "pdf" || a.isCertificate);
    } else if (category === "images") {
      list = list.filter((a) => a.type === "image");
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((a) => a.name.toLowerCase().includes(q) || a.path.toLowerCase().includes(q));
    }

    return list;
  }, [assets, category, search]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(6px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .asset-card {
          transition: all 0.15s ease;
          border: 1px solid var(--admin-border, #333);
          background: rgba(255, 255, 255, 0.02);
        }
        .asset-card:hover {
          border-color: #3b82f6 !important;
          background: rgba(59, 130, 246, 0.08) !important;
          transform: translateY(-2px);
        }
      `,
        }}
      />
      <div
        style={{
          background: "var(--admin-card-bg, #1e2124)",
          color: "var(--admin-text-main, #fff)",
          borderRadius: "14px",
          width: "100%",
          maxWidth: "760px",
          height: "85vh",
          maxHeight: "720px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          border: "1px solid var(--admin-border, #2d3139)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--admin-border, #2d3139)",
            background: "rgba(0, 0, 0, 0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <FolderOpen size={20} style={{ color: "#3b82f6" }} />
            <div>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 600 }}>{title}</h3>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--admin-text-muted, #9ca3af)" }}>
                Click any file to select it. All files are hosted in <code>/public/assets</code>.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--admin-text-muted, #9ca3af)",
              padding: "0.35rem",
              borderRadius: "6px",
              display: "flex",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search and Category Filters */}
        <div
          style={{
            padding: "0.85rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            borderBottom: "1px solid var(--admin-border, #2d3139)",
            background: "rgba(0, 0, 0, 0.08)",
          }}
        >
          {/* Search bar */}
          <div style={{ position: "relative", width: "100%" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--admin-text-muted, #9ca3af)",
              }}
            />
            <input
              type="text"
              placeholder="Search assets (e.g. sih, adobe, cisco, certificate, logo)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              style={{
                width: "100%",
                padding: "0.55rem 2.2rem 0.55rem 2.25rem",
                borderRadius: "8px",
                border: "1px solid var(--admin-border, #3a3f4b)",
                background: "var(--admin-bg, #14171a)",
                color: "inherit",
                fontSize: "0.88rem",
                outline: "none",
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--admin-text-muted, #9ca3af)",
                  padding: "2px",
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => setCategory("all")}
              style={{
                padding: "0.3rem 0.65rem",
                borderRadius: "20px",
                fontSize: "0.78rem",
                fontWeight: 500,
                border: "1px solid var(--admin-border, #3a3f4b)",
                cursor: "pointer",
                background: category === "all" ? "#3b82f6" : "transparent",
                color: category === "all" ? "#fff" : "var(--admin-text-muted, #9ca3af)",
              }}
            >
              All Assets ({counts.all})
            </button>
            <button
              type="button"
              onClick={() => setCategory("logos")}
              style={{
                padding: "0.3rem 0.65rem",
                borderRadius: "20px",
                fontSize: "0.78rem",
                fontWeight: 500,
                border: "1px solid var(--admin-border, #3a3f4b)",
                cursor: "pointer",
                background: category === "logos" ? "#3b82f6" : "transparent",
                color: category === "logos" ? "#fff" : "var(--admin-text-muted, #9ca3af)",
              }}
            >
              Logos ({counts.logos})
            </button>
            <button
              type="button"
              onClick={() => setCategory("documents")}
              style={{
                padding: "0.3rem 0.65rem",
                borderRadius: "20px",
                fontSize: "0.78rem",
                fontWeight: 500,
                border: "1px solid var(--admin-border, #3a3f4b)",
                cursor: "pointer",
                background: category === "documents" ? "#3b82f6" : "transparent",
                color: category === "documents" ? "#fff" : "var(--admin-text-muted, #9ca3af)",
              }}
            >
              PDFs & Certificates ({counts.documents})
            </button>
            <button
              type="button"
              onClick={() => setCategory("images")}
              style={{
                padding: "0.3rem 0.65rem",
                borderRadius: "20px",
                fontSize: "0.78rem",
                fontWeight: 500,
                border: "1px solid var(--admin-border, #3a3f4b)",
                cursor: "pointer",
                background: category === "images" ? "#3b82f6" : "transparent",
                color: category === "images" ? "#fff" : "var(--admin-text-muted, #9ca3af)",
              }}
            >
              Images ({counts.images})
            </button>
          </div>
        </div>

        {/* Assets Grid */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem 1.25rem",
          }}
        >
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-text-muted, #9ca3af)" }}>
              Loading assets...
            </div>
          ) : filteredAssets.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-text-muted, #9ca3af)" }}>
              No assets found matching your criteria.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {filteredAssets.map((asset) => {
                const isImg = asset.type === "image";
                const isPdf = asset.type === "pdf";

                return (
                  <button
                    key={asset.name}
                    type="button"
                    onClick={() => {
                      onSelect(asset.path);
                      onClose();
                    }}
                    title={`${asset.name} (${asset.path})`}
                    className="asset-card"
                    style={{
                      borderRadius: "10px",
                      padding: "0.5rem",
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.4rem",
                      overflow: "hidden",
                    }}
                  >
                    {/* Thumbnail preview */}
                    <div
                      style={{
                        width: "100%",
                        height: "85px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        position: "relative",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      {isImg ? (
                        <img
                          src={asset.path}
                          alt={asset.name}
                          loading="lazy"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            padding: "3px",
                          }}
                        />
                      ) : isPdf ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                          <FileText size={32} style={{ color: "#ef4444" }} />
                          <span
                            style={{
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              color: "#ef4444",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            PDF DOC
                          </span>
                        </div>
                      ) : (
                        <Film size={28} style={{ color: "#8b5cf6" }} />
                      )}

                      <span
                        style={{
                          position: "absolute",
                          bottom: "3px",
                          right: "3px",
                          fontSize: "0.62rem",
                          padding: "1px 4px",
                          borderRadius: "4px",
                          backgroundColor: "rgba(0, 0, 0, 0.7)",
                          color: "#e5e7eb",
                          textTransform: "uppercase",
                          fontWeight: 600,
                        }}
                      >
                        {asset.ext.replace(".", "")}
                      </span>
                    </div>

                    {/* File name */}
                    <div style={{ width: "100%", minWidth: 0 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.72rem",
                          fontWeight: 500,
                          color: "var(--admin-text-main, #f3f4f6)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {asset.name}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.65rem",
                          color: "var(--admin-text-muted, #9ca3af)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {asset.path}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "0.75rem 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid var(--admin-border, #2d3139)",
            background: "rgba(0, 0, 0, 0.15)",
          }}
        >
          <span style={{ fontSize: "0.78rem", color: "var(--admin-text-muted, #9ca3af)" }}>
            Showing {filteredAssets.length} of {assets.length} assets
          </span>
          <button
            type="button"
            onClick={onClose}
            className="admin-btn admin-btn-secondary"
            style={{ fontSize: "0.82rem", padding: "0.35rem 0.8rem" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
