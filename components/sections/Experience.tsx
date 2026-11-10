"use client";

import Link from "next/link";
import FadeInSection from "@/components/FadeInSection";
import ScrollArrow from "@/components/ScrollArrow";

export default function Experience() {
  return (
    <FadeInSection id="experience" className="editorial-experience-section">
      <div className="editorial-experience-container">
        {/* Left Column: Portrait holding binoculars (same size as About Me section) */}
        <div className="editorial-experience-left">
          <div className="editorial-portrait-wrapper">
            {/* Subtle Abstract Backdrop Elements */}
            <div className="editorial-portrait-aura" aria-hidden="true" />
            <div className="editorial-portrait-ring" aria-hidden="true" />
            <div className="editorial-portrait-crosshair ch-tl" aria-hidden="true" />
            <div className="editorial-portrait-crosshair ch-br" aria-hidden="true" />

            {/* Supplied Binoculars Portrait Asset */}
            <img
              src="/assets/pranavr-experience.webp"
              alt="Pranav R holding binoculars, representing exploration, curiosity, and looking towards professional opportunities"
              className="editorial-portrait-img"
              loading="lazy"
              width={1254}
              height={1254}
            />
          </div>
        </div>

        {/* Right Column: Editorial Experience Intro and CTA */}
        <div className="editorial-experience-right">
          <h2 className="editorial-heading">
            <span className="editorial-heading-accent">My Experience</span>
          </h2>

          <p className="editorial-description">
            A journey of internships, hackathons, research presentations and achievements that have shaped my professional growth.
          </p>

          {/* Call-to-Action Button */}
          <div className="editorial-cta-wrap">
            <Link
              href="/experiences"
              className="editorial-cta-btn"
              aria-label="Explore My Experience"
            >
              <span>Explore My Experience</span>
              <span className="editorial-cta-arrow" aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Smooth Scroll Navigation to Certificates */}
      <div className="editorial-scroll-arrow">
        <ScrollArrow targetId="certificate" altText="Scroll down to certificates section" />
      </div>
    </FadeInSection>
  );
}
