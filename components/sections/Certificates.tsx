"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import FadeInSection from "@/components/FadeInSection";
import ScrollArrow from "@/components/ScrollArrow";
import { supabase } from "@/lib/supabase";

interface CertificateItem {
  id: string;
  title: string;
  category?: string;
  slug?: string;
}

// Fallback certificates pre-populated directly from database for instant SSR and zero layout shift
const FALLBACK_CERTIFICATES: CertificateItem[] = [
  { id: "1", title: "Training in Artificial Intelligence and Machine Learning", category: "Courses" },
  { id: "2", title: "IICT AI & ML Summer Internship", category: "Internships" },
  { id: "3", title: "Smart India Hackathon 2026 – Internal Ideathon", category: "Hackathons" },
  { id: "4", title: "Certificate of Presentation - AIDE 2026", category: "Conferences" },
  { id: "5", title: "AIC Nitte Internship", category: "Internships" },
  { id: "6", title: "Python Course", category: "Courses" },
  { id: "7", title: "The Startup Chase 2.0 – Winners", category: "Competitions" },
  { id: "8", title: "MY Bharat Budget Quest 2026 – Final Round", category: "Competitions" },
  { id: "9", title: "Adobe Creative JAM (Hackathon)", category: "Hackathons" },
  { id: "10", title: "IEEE Day 2026 – Technical Paper Writing Competition", category: "Competitions" },
  { id: "11", title: "Nexathon 2026 – National Level 24-Hour Hackathon", category: "Hackathons" },
  { id: "12", title: "MATLAB Course", category: "Courses" },
  { id: "13", title: "MY Bharat Budget Quest 2026 - Essay", category: "Competitions" },
  { id: "14", title: "Foundations of Cryptography Workshop", category: "Workshops" },
  { id: "15", title: "Road Safety Workshop – NMAMIT", category: "Workshops" },
  { id: "16", title: "MY Bharat Budget Quest 2026", category: "Competitions" },
  { id: "17", title: "Cybersecurity Course", category: "Courses" },
  { id: "18", title: "Microsoft Azure Learning Challenge", category: "Courses" },
  { id: "19", title: "Certificate of Pledge (Cyber Awareness)", category: "Certifications" },
  { id: "20", title: "Financial Literacy & Markets", category: "Courses" },
  { id: "21", title: "Viksit Bharat 2025 Certification", category: "Certifications" },
  { id: "22", title: "Microsoft AI Learning Challenge", category: "Courses" },
  { id: "23", title: "AIML Webinar", category: "Webinars" },
  { id: "24", title: "Microsoft Applied AI Learning Challenge", category: "Courses" },
  { id: "25", title: "Vande Mataram - 150 Years Quiz", category: "Quizzes" },
  { id: "26", title: "Gyan Vigyan Quiz Certification", category: "Quizzes" },
  { id: "27", title: "Innovation Ambassador (Foundation)", category: "Certifications" },
  { id: "28", title: "Innovation Ambassador (Advanced)", category: "Certifications" },
  { id: "29", title: "Energy Conservation Certification", category: "Certifications" },
  { id: "30", title: "Innovation Ambassador (Re-Skill)", category: "Certifications" },
  { id: "31", title: "Swachh Bharat Mission Grameen Phase-II Certification", category: "Certifications" },
];

export default function Certificates() {
  const [certificates, setCertificates] = useState<CertificateItem[]>(FALLBACK_CERTIFICATES);

  useEffect(() => {
    async function fetchLiveCertificates() {
      try {
        const { data, error } = await supabase
          .from("certificates")
          .select("id, title, category, slug")
          .or("is_archived.is.null,is_archived.eq.false")
          .or("status.is.null,status.eq.Published")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          setCertificates(data);
        }
      } catch (err) {
        console.warn("Using fallback certificates list", err);
      }
    }
    fetchLiveCertificates();
  }, []);

  // Partition certificates into 4 alternating rows and quadruple for seamless infinite marquee loop
  const { row1, row2, row3, row4 } = useMemo(() => {
    const r1: CertificateItem[] = [];
    const r2: CertificateItem[] = [];
    const r3: CertificateItem[] = [];
    const r4: CertificateItem[] = [];

    certificates.forEach((cert, idx) => {
      const mod = idx % 4;
      if (mod === 0) r1.push(cert);
      else if (mod === 1) r2.push(cert);
      else if (mod === 2) r3.push(cert);
      else r4.push(cert);
    });

    return {
      row1: [...r1, ...r1, ...r1, ...r1],
      row2: [...r2, ...r2, ...r2, ...r2],
      row3: [...r3, ...r3, ...r3, ...r3],
      row4: [...r4, ...r4, ...r4, ...r4],
    };
  }, [certificates]);

  return (
    <FadeInSection id="certificate" className="editorial-certificates-section">
      {/* Foreground Editorial Two-Column Layout */}
      <div className="editorial-cert-container">
        {/* Left Column: Heading and Description (Clean, no background marquee text behind text area) */}
        <div className="editorial-cert-left">
          <h2 className="editorial-heading">
            <span className="editorial-heading-accent">My Certificates</span>
          </h2>

          <p className="editorial-description">
            A curated showcase of industry certifications, hackathon recognitions, technical workshops, and academic milestones from leading organizations and competitions.
          </p>
        </div>

        {/* Right Column: Portrait holding certificate + Marquee Tickers strictly in background of picture */}
        <div className="editorial-cert-right">
          {/* Ambient Marquee Layer ONLY behind the portrait */}
          <div className="cert-portrait-marquee-bg" aria-hidden="true">
            {/* Row 1: Left to Right */}
            <div className="cert-bg-marquee-row row-ltr">
              <div className="cert-bg-marquee-track track-ltr">
                {row1.map((cert, idx) => (
                  <span key={`bg-r1-${idx}`} className="cert-bg-marquee-item">
                    <span className="cert-bg-title">{cert.title}</span>
                    <span className="cert-bg-separator">✦</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Row 2: Right to Left */}
            <div className="cert-bg-marquee-row row-rtl">
              <div className="cert-bg-marquee-track track-rtl">
                {row2.map((cert, idx) => (
                  <span key={`bg-r2-${idx}`} className="cert-bg-marquee-item">
                    <span className="cert-bg-title">{cert.title}</span>
                    <span className="cert-bg-separator">✦</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Row 3: Left to Right */}
            <div className="cert-bg-marquee-row row-ltr row-3">
              <div className="cert-bg-marquee-track track-ltr">
                {row3.map((cert, idx) => (
                  <span key={`bg-r3-${idx}`} className="cert-bg-marquee-item">
                    <span className="cert-bg-title">{cert.title}</span>
                    <span className="cert-bg-separator">✦</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Row 4: Right to Left */}
            <div className="cert-bg-marquee-row row-rtl row-extra">
              <div className="cert-bg-marquee-track track-rtl">
                {row4.map((cert, idx) => (
                  <span key={`bg-r4-${idx}`} className="cert-bg-marquee-item">
                    <span className="cert-bg-title">{cert.title}</span>
                    <span className="cert-bg-separator">✦</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Portrait Wrapper in Foreground */}
          <div className="editorial-portrait-wrapper">
            {/* Subtle Abstract Backdrop Elements */}
            <div className="editorial-portrait-aura cert-gold-aura" aria-hidden="true" />
            <div className="editorial-portrait-ring cert-gold-ring" aria-hidden="true" />
            <div className="editorial-portrait-crosshair ch-tl" aria-hidden="true" />
            <div className="editorial-portrait-crosshair ch-br" aria-hidden="true" />

            {/* Frame wrapping image & button for pixel-perfect relative positioning */}
            <div className="cert-portrait-frame">
              {/* Supplied Certificate Portrait Asset (Tightly cropped, matching About Me portrait scale) */}
              <img
                src="/assets/pranavr-certificate.webp"
                alt="Pranav R holding certificate of achievements"
                className="editorial-portrait-img cert-portrait-img"
                width={1036}
                height={1024}
                loading="lazy"
              />

              {/* Interactive Board CTA Button */}
              <Link
                href="/certificates"
                className="cert-board-btn"
                aria-label="View Certificates from board"
              >
                <span className="cert-board-btn-text">View Certificates</span>
                <span className="cert-board-btn-arrow" aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Smooth Scroll Navigation to Projects */}
      <div className="editorial-scroll-arrow">
        <ScrollArrow targetId="projects" altText="Scroll down to projects section" />
      </div>
    </FadeInSection>
  );
}
