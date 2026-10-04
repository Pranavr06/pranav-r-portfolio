"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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

  // Swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 45;

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

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > minSwipeDistance) {
      // Swiped Left -> Next
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Prev
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

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
              padding: "0.75rem 0.5rem 1rem 0.5rem",
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

            {/* Central Image View with Swipe Touch Handlers */}
            <div
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                flex: 1,
                width: "100%",
                maxWidth: "1100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                minHeight: 0,
                padding: "0.25rem",
                boxSizing: "border-box",
                touchAction: "pan-y",
                userSelect: "none",
                WebkitUserSelect: "none",
              }}
            >
              {/* Previous Button (Desktop only - hidden on mobile) */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous photo"
                  className="cert-lightbox-nav-btn cert-lightbox-nav-prev"
                >
                  <ChevronLeft size={28} />
                </button>
              )}

              {/* The Enlarged Image */}
              <img
                src={images[selectedIndex].url}
                alt={images[selectedIndex].caption || "Full size enlarged photo"}
                draggable={false}
                style={{
                  maxWidth: "96vw",
                  maxHeight: "75vh",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "10px",
                  boxShadow: "0 12px 48px rgba(0, 0, 0, 0.8)",
                  display: "block",
                  pointerEvents: "auto",
                }}
              />

              {/* Next Button (Desktop only - hidden on mobile) */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next photo"
                  className="cert-lightbox-nav-btn cert-lightbox-nav-next"
                >
                  <ChevronRight size={28} />
                </button>
              )}
            </div>

            {/* Bottom Caption Bar with Pagination Dots */}
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "800px",
                textAlign: "center",
                padding: "0.5rem 1rem 0.5rem 1rem",
                color: "#fff",
                zIndex: 1000000,
                boxSizing: "border-box",
              }}
            >
              {/* Dot Indicators */}
              {images.length > 1 && (
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "0.6rem",
                  }}
                >
                  {images.map((_, i) => (
                    <span
                      key={i}
                      style={{
                        width: i === selectedIndex ? "18px" : "6px",
                        height: "6px",
                        borderRadius: "3px",
                        backgroundColor:
                          i === selectedIndex
                            ? "#ffffff"
                            : "rgba(255, 255, 255, 0.35)",
                        transition: "all 0.25s ease",
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Caption */}
              {images[selectedIndex].caption && (
                <p
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    margin: 0,
                    lineHeight: 1.45,
                    color: "rgba(255, 255, 255, 0.95)",
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
