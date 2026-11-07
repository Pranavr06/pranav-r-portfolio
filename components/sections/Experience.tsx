"use client";

import FadeInSection from "@/components/FadeInSection";
import ScrollArrow from "@/components/ScrollArrow";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Experience() {
  return (
    <FadeInSection id="experience" className="tomasz-about-section tomasz-experience-opposite">
      {/* Diagonal Right Background (Mirrored from About Me) */}
      <div className="tomasz-right-bg" aria-hidden="true" />

      {/* Left Content: Studio Portrait on Seamless Black */}
      <div className="tomasz-exp-left-pic">
        <img
          src="/assets/about-pic.webp"
          alt="Pranav R - Experiences Portrait"
          className="tomasz-portrait-img tomasz-exp-portrait-img"
          loading="lazy"
        />
      </div>

      {/* Right Content: Title, 2 Lines About Experience, Button for /experiences */}
      <div className="tomasz-right-content tomasz-exp-right-content">
        <p className="tomasz-section-subtitle">My Professional Journey</p>
        <h2 className="tomasz-title">Experiences</h2>

        <div className="tomasz-bio tomasz-exp-bio">
          <p>
            Bridging engineering theory with production systems across full-stack development, applied AI pipelines, and cybersecurity.
          </p>
          <p>
            From architecting enterprise platforms at AIC-NITTE to presenting published research at IEEE AIDE 2026 and building award-winning hackathon solutions.
          </p>
        </div>

        <div className="tomasz-exp-actions">
          <Link href="/experiences" className="btn btn-color-1 tomasz-exp-btn">
            <span>Explore Experiences</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <ScrollArrow targetId="certificate" altText="Scroll down to certificates section" />
    </FadeInSection>
  );
}

