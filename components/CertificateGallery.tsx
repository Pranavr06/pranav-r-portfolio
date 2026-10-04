"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Camera, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { CertificateImage } from "@/lib/certificateGalleries";

export default function CertificateGallery({
  images,
  title,
}: {
  images: CertificateImage[];
  title?: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIndex((prev) =>
      prev === null ? null : (prev - 1 + images.length) % images.length
    );
  }, [images.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIndex((prev) =>
      prev === null ? null : (prev + 1) % images.length
    );
  }, [images.length]);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (selectedIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, handleClose, handlePrev, handleNext]);

  if (!images || images.length === 0) return null;

  return (
    <div style={{ marginTop: "2rem", width: "100%" }}>
      {/* Section Header */}
      <div
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          paddingTop: "1.75rem",
          marginBottom: "1.25rem",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.6rem",
        }}
      >
        <Camera size={18} style={{ color: "var(--text-color-light, #888)" }} />
        <span
          style={{
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            color: "var(--text-color-light, #888)",
            fontWeight: 600,
          }}
        >
          Event & Achievement Photos ({images.length})
        </span>
      </div>

      {/* Gallery Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            images.length === 1
              ? "1fr"
              : images.length === 2
              ? "repeat(auto-fit, minmax(280px, 1fr))"
              : "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.25rem",
          marginTop: "1rem",
        }}
      >
        {images.map((img, index) => (
          <div
            key={index}
            onClick={() => setSelectedIndex(index)}
            style={{
              position: "relative",
              borderRadius: "14px",
              overflow: "hidden",
              cursor: "pointer",
              aspectRatio: "16 / 10",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
            }}
            className="cert-gallery-card"
          >
            <img
              src={img.url}
              alt={img.alt || img.caption || `${title || "Certificate"} Photo ${index + 1}`}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.4s ease",
              }}
              className="cert-gallery-img"
            />

            {/* Hover expand badge */}
            <div
              style={{
                position: "absolute",
                top: "0.6rem",
                right: "0.6rem",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(4px)",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                opacity: 0.9,
              }}
            >
              <Maximize2 size={16} />
            </div>

            {/* Caption Overlay */}
            {img.caption && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "0.75rem 1rem",
                  background:
                    "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%)",
                  color: "#fff",
                  fontSize: "0.85rem",
                  lineHeight: 1.35,
                  textAlign: "left",
                }}
              >
                {img.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          onClick={handleClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.88)",
            backdropFilter: "blur(10px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            animation: "fadeIn 0.2s ease-out",
          }}
          role="dialog"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            aria-label="Close photo preview"
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "1.5rem",
              background: "rgba(255, 255, 255, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              color: "#fff",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 100000,
              transition: "background 0.2s ease",
            }}
          >
            <X size={22} />
          </button>

          {/* Left Arrow */}
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              aria-label="Previous photo"
              style={{
                position: "absolute",
                left: "1.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                color: "#fff",
                borderRadius: "50%",
                width: "48px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 100000,
                transition: "background 0.2s ease, transform 0.2s ease",
              }}
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Right Arrow */}
          {images.length > 1 && (
            <button
              onClick={handleNext}
              aria-label="Next photo"
              style={{
                position: "absolute",
                right: "1.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                color: "#fff",
                borderRadius: "50%",
                width: "48px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 100000,
                transition: "background 0.2s ease, transform 0.2s ease",
              }}
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Main Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "92vw",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <img
              src={images[selectedIndex].url}
              alt={images[selectedIndex].caption || "Full size photo"}
              style={{
                maxWidth: "100%",
                maxHeight: "75vh",
                objectFit: "contain",
                borderRadius: "12px",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6)",
              }}
            />

            {/* Caption & Counter */}
            <div
              style={{
                marginTop: "1rem",
                textAlign: "center",
                color: "#fff",
                maxWidth: "600px",
              }}
            >
              {images[selectedIndex].caption && (
                <p style={{ fontSize: "1rem", marginBottom: "0.3rem", fontWeight: 500 }}>
                  {images[selectedIndex].caption}
                </p>
              )}
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "rgba(255, 255, 255, 0.65)",
                  letterSpacing: "0.5px",
                }}
              >
                Photo {selectedIndex + 1} of {images.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
