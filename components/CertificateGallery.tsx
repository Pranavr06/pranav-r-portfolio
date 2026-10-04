"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Camera, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { CertificateImage } from "@/lib/certificateGalleries";

export default function CertificateGallery({
  images,
  title,
  galleryTitle,
}: {
  images: CertificateImage[];
  title?: string;
  galleryTitle?: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const displayHeading = galleryTitle || (title ? "Event Photos & Highlights" : "Event Photos");

  return (
    <div className="details-container color-container cert-gallery-container">
      {/* Section Header */}
      <div className="cert-gallery-header">
        <div className="cert-gallery-subtitle">
          <Camera size={17} />
          <span>Event & Achievement Photos ({images.length})</span>
        </div>
        <h2 className="cert-gallery-title">
          {displayHeading}
        </h2>
      </div>

      {/* Vertical Stack: One Photo Below the Other */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.75rem",
          width: "100%",
        }}
      >
        {images.map((img, index) => (
          <div
            key={index}
            onClick={() => setSelectedIndex(index)}
            className="cert-gallery-card"
          >
            {/* Image Wrapper */}
            <div className="cert-gallery-img-wrapper">
              <img
                src={img.url}
                alt={img.alt || img.caption || `${title || "Certificate"} Photo ${index + 1}`}
                loading="lazy"
                className="cert-gallery-img"
              />
            </div>

            {/* Expand / Fullscreen Button Badge */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(index);
              }}
              aria-label="Enlarge photo in full screen"
              title="Click to view full screen"
              className="cert-gallery-expand-btn"
            >
              <Maximize2 size={18} />
            </button>

            {/* Theme-Sensitive Caption Bar */}
            {img.caption && (
              <div className="cert-gallery-caption-bar">
                <span>{img.caption}</span>
                <span className="cert-gallery-counter">
                  Photo {index + 1} of {images.length}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal (rendered via Portal directly to body) */}
      {mounted &&
        selectedIndex !== null &&
        createPortal(
          <div
            onClick={handleClose}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.95)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              zIndex: 999999,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              boxSizing: "border-box",
            }}
            role="dialog"
            aria-modal="true"
          >
            {/* Top Bar with Counter and Close Button */}
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "1100px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 1rem",
                color: "#fff",
                zIndex: 1000000,
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  fontSize: "0.95rem",
                  color: "rgba(255, 255, 255, 0.75)",
                  fontWeight: 500,
                }}
              >
                Photo {selectedIndex + 1} of {images.length}
              </div>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Close photo preview"
                style={{
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
                  transition: "background 0.2s ease, transform 0.2s ease",
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Central Image View with Navigation Chevrons */}
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                flex: 1,
                width: "100%",
                maxWidth: "1100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                minHeight: 0,
                padding: "0.5rem",
                boxSizing: "border-box",
              }}
            >
              {/* Previous Button */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous photo"
                  style={{
                    position: "absolute",
                    left: "0.5rem",
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
                    zIndex: 1000000,
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    transition: "background 0.2s ease, transform 0.2s ease",
                  }}
                >
                  <ChevronLeft size={28} />
                </button>
              )}

              {/* The Enlarged Image */}
              <img
                src={images[selectedIndex].url}
                alt={images[selectedIndex].caption || "Full size enlarged photo"}
                style={{
                  maxWidth: "92vw",
                  maxHeight: "75vh",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "10px",
                  boxShadow: "0 12px 48px rgba(0, 0, 0, 0.8)",
                  display: "block",
                }}
              />

              {/* Next Button */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next photo"
                  style={{
                    position: "absolute",
                    right: "0.5rem",
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
                    zIndex: 1000000,
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    transition: "background 0.2s ease, transform 0.2s ease",
                  }}
                >
                  <ChevronRight size={28} />
                </button>
              )}
            </div>

            {/* Bottom Caption Bar */}
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "800px",
                textAlign: "center",
                padding: "0.5rem 1rem 1rem 1rem",
                color: "#fff",
                zIndex: 1000000,
                boxSizing: "border-box",
              }}
            >
              {images[selectedIndex].caption && (
                <p
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 500,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {images[selectedIndex].caption}
                </p>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
