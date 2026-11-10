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

interface OrbitCategory {
  name: string;
  icon: typeof GraduationCap;
  angle: number; // in degrees around orbit
}

const CATEGORIES: OrbitCategory[] = [
  { name: "Courses", icon: GraduationCap, angle: 0 },
  { name: "Hackathons", icon: Trophy, angle: 60 },
  { name: "Internships", icon: Briefcase, angle: 120 },
  { name: "Webinars", icon: Video, angle: 180 },
  { name: "Workshops", icon: Laptop, angle: 240 },
  { name: "Quizzes", icon: BrainCircuit, angle: 300 },
];

export default function Certificates() {
  return (
    <FadeInSection id="certificate" className="circular-certificates-section">
      {/* Eyebrow and Section Heading */}
      <div className="cert-header-wrap">
        <span className="cert-eyebrow">/ MY ACHIEVEMENTS</span>

        <h2 className="cert-heading">
          A Journey of Learning &amp; <span className="cert-heading-accent">Recognition</span>
        </h2>

        <p className="cert-subtext">
          Every course, competition and achievement represents another step in my journey of continuous learning.
        </p>
      </div>

      {/* Orbit Universe Stage */}
      <div className="cert-orbit-stage">
        {/* Soft Spotlight Glow Behind Portrait */}
        <div className="cert-spotlight" aria-hidden="true" />

        {/* Curved Orbital Path / Dotted Circular Guides */}
        <svg className="cert-orbit-guide-svg" viewBox="0 0 600 600" aria-hidden="true">
          <circle cx="300" cy="300" r="280" className="cert-guide-circle-outer" />
          <circle cx="300" cy="300" r="230" className="cert-guide-circle-main" />
          <path d="M 70 300 A 230 230 0 0 1 530 300" className="cert-guide-arc-highlight" />
          <circle cx="300" cy="300" r="175" className="cert-guide-circle-inner" />
        </svg>

        {/* Rotating Planetary Category Orbit */}
        <div className="cert-orbit-ring" role="region" aria-label="Achievement Categories Orbit">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                className="cert-orbit-slot"
                style={{
                  transform: `rotate(${cat.angle}deg) translateY(calc(-1 * var(--orbit-radius))) rotate(-${cat.angle}deg)`,
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

        {/* Central Portrait Holding Blank Certificate Board */}
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
