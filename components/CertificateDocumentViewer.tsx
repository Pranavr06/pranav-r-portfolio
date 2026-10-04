"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  ExternalLink,
  Download,
  Loader2
} from "lucide-react";

interface CertificateDocumentViewerProps {
  fileUrl: string;
  title: string;
  isImage?: boolean;
  canonicalSlug: string;
}

// Helper to load PDF.js dynamically
function loadPdfJs(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject();
  if ((window as any).pdfjsLib) {
    return Promise.resolve((window as any).pdfjsLib);
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src*="pdf.min.js"]');
    if (existing) {
      existing.addEventListener("load", () => {
        resolve((window as any).pdfjsLib);
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "/vendor/pdfjs/pdf.min.js";
    script.async = true;
    script.onload = () => {
      const pdfjs = (window as any).pdfjsLib;
      if (pdfjs) {
        pdfjs.GlobalWorkerOptions.workerSrc = "/vendor/pdfjs/pdf.worker.min.js";
        resolve(pdfjs);
      } else {
        reject(new Error("pdfjsLib not defined"));
      }
    };
    script.onerror = () => {
      // Fallback to CDN
      const cdnScript = document.createElement("script");
      cdnScript.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      cdnScript.onload = () => {
        const pdfjs = (window as any).pdfjsLib;
        if (pdfjs) {
          pdfjs.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          resolve(pdfjs);
        } else {
          reject(new Error("CDN pdfjsLib not defined"));
        }
      };
      cdnScript.onerror = reject;
      document.head.appendChild(cdnScript);
    };
    document.head.appendChild(script);
  });
}

export default function CertificateDocumentViewer({
  fileUrl,
  title,
  isImage = false,
  canonicalSlug,
}: CertificateDocumentViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const renderTaskRef = useRef<any>(null);

  // If it's a direct image, no PDF rendering needed
  if (isImage) {
    return (
      <div style={{ marginTop: "1rem", width: "100%" }}>
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "1.5rem",
            marginBottom: "1.25rem",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: "var(--text-color-light)",
              fontWeight: 600,
            }}
          >
            Certificate Preview
          </span>
        </div>

        <div className="cert-preview-container">
          <img src={fileUrl} alt={title} className="cert-image-preview" />
        </div>

        <div className="cert-preview-actions">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-color-2"
            style={{ padding: "0.5rem 1.4rem", fontSize: "0.9rem", borderRadius: "2rem", textDecoration: "none" }}
          >
            View Full Screen ↗
          </a>
          <a
            href={fileUrl}
            download={`${canonicalSlug}.webp`}
            className="btn btn-color-1"
            style={{ padding: "0.5rem 1.4rem", fontSize: "0.9rem", borderRadius: "2rem", textDecoration: "none" }}
          >
            Download Image
          </a>
        </div>
      </div>
    );
  }

  // Load PDF document
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    loadPdfJs()
      .then((pdfjs) => {
        if (isCancelled) return;
        return pdfjs.getDocument(fileUrl).promise;
      })
      .then((loadedPdf) => {
        if (isCancelled || !loadedPdf) return;
        setPdfDoc(loadedPdf);
        setNumPages(loadedPdf.numPages);
        setCurrentPage(1);
      })
      .catch((err) => {
        if (isCancelled) return;
        console.error("Error loading PDF:", err);
        setError("Unable to render inline preview. You can view or download the PDF below.");
        setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [fileUrl]);

  // Render current page to canvas
  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current || !containerRef.current) return;

    try {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      const page = await pdfDoc.getPage(currentPage);
      const canvas = canvasRef.current;
      const container = containerRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;

      const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2.5) : 1;
      const containerWidth = container.clientWidth || 800;
      
      const unscaledViewport = page.getViewport({ scale: 1 });
      const baseScale = (containerWidth / unscaledViewport.width) * zoomLevel;
      const viewport = page.getViewport({ scale: baseScale * dpr });

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = `${viewport.width / dpr}px`;
      canvas.style.height = `${viewport.height / dpr}px`;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      const renderTask = page.render(renderContext);
      renderTaskRef.current = renderTask;

      await renderTask.promise;
      setLoading(false);
    } catch (err: any) {
      if (err?.name !== "RenderingCancelledException") {
        console.error("Render error:", err);
        setLoading(false);
      }
    }
  }, [pdfDoc, currentPage, zoomLevel]);

  useEffect(() => {
    renderPage();
  }, [renderPage]);

  // Re-render on container resize (e.g. orientation change on mobile)
  useEffect(() => {
    let timeoutId: any;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        renderPage();
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [renderPage]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div style={{ marginTop: "1rem", width: "100%" }}>
      {/* Section Header */}
      <div
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          paddingTop: "1.5rem",
          marginBottom: "1rem",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}
      >
        <span
          style={{
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            color: "var(--text-color-light)",
            fontWeight: 600,
          }}
        >
          Certificate Preview
        </span>
      </div>

      {/* Toolbar (Zoom & Page controls) */}
      {!error && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.4rem 0.8rem",
            background: "rgba(0, 0, 0, 0.35)",
            backdropFilter: "blur(6px)",
            borderRadius: "10px",
            marginBottom: "0.75rem",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          {/* Zoom controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.75}
              aria-label="Zoom out"
              title="Zoom out"
              style={{
                background: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "var(--text-color, #fff)",
                borderRadius: "6px",
                padding: "0.25rem 0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                opacity: zoomLevel <= 0.75 ? 0.4 : 1,
              }}
            >
              <ZoomOut size={16} />
            </button>
            <span style={{ fontSize: "0.8rem", minWidth: "42px", textAlign: "center", color: "var(--text-color-light)" }}>
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 2.5}
              aria-label="Zoom in"
              title="Zoom in"
              style={{
                background: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "var(--text-color, #fff)",
                borderRadius: "6px",
                padding: "0.25rem 0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                opacity: zoomLevel >= 2.5 ? 0.4 : 1,
              }}
            >
              <ZoomIn size={16} />
            </button>
            {zoomLevel !== 1 && (
              <button
                onClick={handleResetZoom}
                aria-label="Reset zoom"
                title="Reset zoom"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-color-light)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: "0.25rem",
                }}
              >
                <RotateCcw size={15} />
              </button>
            )}
          </div>

          {/* Page controls (if multi-page) */}
          {numPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage <= 1}
                aria-label="Previous page"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#fff",
                  borderRadius: "6px",
                  padding: "0.2rem 0.4rem",
                  cursor: "pointer",
                  opacity: currentPage <= 1 ? 0.4 : 1,
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <span style={{ fontSize: "0.82rem", color: "var(--text-color-light)" }}>
                {currentPage} / {numPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, numPages))}
                disabled={currentPage >= numPages}
                aria-label="Next page"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#fff",
                  borderRadius: "6px",
                  padding: "0.2rem 0.4rem",
                  cursor: "pointer",
                  opacity: currentPage >= numPages ? 0.4 : 1,
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Quick badge */}
          <span style={{ fontSize: "0.75rem", color: "var(--text-color-light)", opacity: 0.75 }}>
            High-Resolution Preview
          </span>
        </div>
      )}

      {/* Main Canvas / Viewer Container */}
      <div
        ref={containerRef}
        className="cert-preview-container"
        style={{
          position: "relative",
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "340px",
          background: "#181818",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Loading Overlay */}
        {loading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(24, 24, 24, 0.9)",
              zIndex: 10,
              gap: "0.75rem",
            }}
          >
            <Loader2 size={32} className="spin-icon" style={{ color: "#0070f3" }} />
            <span style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.75)" }}>
              Rendering high-resolution preview...
            </span>
          </div>
        )}

        {/* Error Fallback */}
        {error ? (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              maxWidth: "420px",
            }}
          >
            <FileText size={48} style={{ color: "#0070f3", opacity: 0.8 }} />
            <p style={{ fontSize: "0.92rem", color: "rgba(255, 255, 255, 0.8)", margin: 0, lineHeight: 1.5 }}>
              {error}
            </p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-color-1"
              style={{
                padding: "0.5rem 1.4rem",
                fontSize: "0.9rem",
                borderRadius: "2rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <ExternalLink size={16} /> Open Document
            </a>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            style={{
              display: "block",
              maxWidth: zoomLevel <= 1 ? "100%" : "none",
              margin: "0 auto",
              borderRadius: "4px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.35)",
            }}
          />
        )}
      </div>

      {/* Action Buttons Below Preview */}
      <div className="cert-preview-actions" style={{ marginTop: "1rem" }}>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-color-2"
          style={{
            padding: "0.5rem 1.4rem",
            fontSize: "0.9rem",
            borderRadius: "2rem",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <ExternalLink size={15} /> View Full Screen ↗
        </a>
        <a
          href={fileUrl}
          download={`${canonicalSlug}.pdf`}
          className="btn btn-color-1"
          style={{
            padding: "0.5rem 1.4rem",
            fontSize: "0.9rem",
            borderRadius: "2rem",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <Download size={15} /> Download PDF
        </a>
      </div>
    </div>
  );
}
