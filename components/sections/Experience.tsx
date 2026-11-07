"use client";

import FadeInSection from "@/components/FadeInSection";
import ScrollArrow from "@/components/ScrollArrow";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Experience() {
  return (
    <FadeInSection id="experience" className="tomasz-about-section tomasz-experience-section">
      {/* Diagonal Left Background */}
      <div className="tomasz-left-bg" aria-hidden="true" />

      {/* Left Content (Title, Subtitle, Overview, Badges, CTAs) */}
      <div className="tomasz-left-content">
        <p className="tomasz-section-subtitle">My Professional Journey</p>
        <h2 className="tomasz-title">Experiences</h2>
        <p className="tomasz-role">Hands-On Internships • Research Publications • National Hackathons</p>

        <div className="tomasz-bio">
          <p>
            Bridging theoretical foundations with real-world engineering, my professional journey spans architecting full-stack systems at <strong>AIC-NITTE</strong>, presenting machine learning research at the <strong>IEEE AIDE 2026</strong> international conference, and building award-winning solutions in national hackathons like <strong>Nexathon (SDIT)</strong>.
          </p>
          <p>
            Explore my work organized into two dedicated hubs: <strong>Technical Expertise</strong> in scalable systems, AI pipelines, and cybersecurity defenses, alongside my <strong>Professional Journey</strong> chronicling key career milestones.
          </p>
        </div>

        <div className="tomasz-badges">
          <span className="tomasz-badge">💼 AIC-NITTE Internship</span>
          <span className="tomasz-badge">🏆 Nexathon SDIT Hackathon</span>
          <span className="tomasz-badge">📜 IEEE AIDE 2026 Author</span>
          <span className="tomasz-badge">🇮🇳 MY Bharat National Round</span>
        </div>

        <div className="tomasz-exp-actions">
          <Link href="/experiences" className="btn btn-color-1 tomasz-exp-btn">
            <span>Explore Experiences Hub</span>
            <ArrowRight size={16} />
          </Link>
          <Link href="/experiences/professional-journey" className="btn btn-color-2 tomasz-exp-btn-secondary">
            View Milestones
          </Link>
        </div>
      </div>

      {/* Right Content: Modern Visual Showcase */}
      <div className="tomasz-right-content tomasz-exp-right">
        <Link href="/experiences" className="tomasz-exp-showcase-link" aria-label="Explore Experiences Hub">
          <div className="tomasz-exp-showcase">
            <img
              src="/assets/professional-journey-banner.webp"
              alt="Pranav R - Professional Experiences and Technical Milestones"
              className="tomasz-exp-banner-img"
              loading="lazy"
            />
            <div className="tomasz-exp-overlay-card">
              <span className="tomasz-exp-card-pill">Interactive Hub</span>
              <h3 className="tomasz-exp-card-title">Technical Expertise &amp; Milestones</h3>
              <p className="tomasz-exp-card-desc">Architecture • Full-Stack • AI/ML • Hackathons</p>
            </div>
          </div>
        </Link>
      </div>

      <ScrollArrow targetId="certificate" altText="Scroll down to certificates section" />
    </FadeInSection>
  );
}
