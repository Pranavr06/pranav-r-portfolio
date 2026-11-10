"use client";

import Link from "next/link";
import FadeInSection from "@/components/FadeInSection";
import ScrollArrow from "@/components/ScrollArrow";
import {
  GraduationCap,
  Trophy,
  Briefcase,
  Video,
  Laptop,
  BrainCircuit,
} from "lucide-react";

const CATEGORIES = [
  { name: "Courses", icon: GraduationCap },
  { name: "Hackathons", icon: Trophy },
  { name: "Internships", icon: Briefcase },
  { name: "Webinars", icon: Video },
  { name: "Workshops", icon: Laptop },
  { name: "Quizzes", icon: BrainCircuit },
];

export default function Certificates() {
  const total = CATEGORIES.length;
  const duration = 21; // Duration in seconds for full left-to-right arc flow

  return (
    <FadeInSection id="certificate" className="circular-certificates-section">
      {/* Section Heading: My Certificates */}
      <div className="cert-header-wrap">
        <h2 className="cert-heading">
          <span className="cert-heading-accent">My Certificates</span>
        </h2>
      </div>

      {/* Orbit Universe Stage */}
      <div className="cert-orbit-stage">
        {/* Soft Spotlight Glow Behind Portrait */}
        <div className="cert-spotlight" aria-hidden="true" />

        {/* Semicircular Guide Arcs */}
        <svg className="cert-orbit-guide-svg" viewBox="0 0 800 500" aria-hidden="true">
          <path d="M 50 370 A 350 350 0 0 1 750 370" className="cert-guide-arc-outer" />
          <path d="M 80 370 A 320 320 0 0 1 720 370" className="cert-guide-arc-main" />
          <path d="M 120 370 A 280 280 0 0 1 680 370" className="cert-guide-arc-inner" />
        </svg>

        {/* Semicircular Planetary Category Orbit (Left to Right, looping back to Left) */}
        <div className="cert-orbit-track" role="region" aria-label="Achievement Categories Semicircular Orbit">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            const delay = -1 * (duration / total) * idx;
            return (
              <div
                key={cat.name}
                className="cert-orbit-item"
                style={{
                  animationDelay: `${delay}s`,
                }}
              >
                <Link
                  href="/certificates"
                  className="cert-orbit-badge"
                  aria-label={`View ${cat.name} certificates`}
                >
                  <Icon className="cert-orbit-icon" size={15} strokeWidth={2.2} />
                  <span className="cert-orbit-name">{cat.name}</span>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Central Portrait Holding Blank Certificate Board (Enlarged) */}
        <div className="cert-portrait-wrapper">
          <img
            src="/assets/pranavr-certificate.webp"
            alt="Pranav R holding certificate of achievements"
            className="cert-portrait-img"
            width={1536}
            height={1024}
            loading="lazy"
          />

          {/* Prominent CTA Button directly over the blank certificate board */}
          <Link
            href="/certificates"
            className="cert-board-btn"
            aria-label="View Certificates"
          >
            <span className="cert-board-btn-text">View Certificates</span>
            <span className="cert-board-btn-arrow" aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>

      {/* Smooth Scroll Navigation to Projects */}
      <div className="cert-scroll-arrow">
        <ScrollArrow targetId="projects" altText="Scroll down to projects section" />
      </div>
    </FadeInSection>
  );
}
