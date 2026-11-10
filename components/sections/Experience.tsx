"use client";

import Link from "next/link";
import FadeInSection from "@/components/FadeInSection";
import ScrollArrow from "@/components/ScrollArrow";

export default function Experience() {
  return (
    <FadeInSection id="experience" className="editorial-experience-section">
      <div className="editorial-experience-container">
        {/* Left Column: Portrait holding binoculars (~45% width) */}
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

        {/* Right Column: Editorial Experience Intro, Highlights, and CTA (~55% width) */}
        <div className="editorial-experience-right">
          <span className="editorial-eyebrow">/ EXPERIENCE</span>

          <h2 className="editorial-heading">
            My Professional <span className="editorial-heading-accent">Journey</span>
          </h2>

          <p className="editorial-description">
            A journey of internships, hackathons, research presentations and achievements that have shaped my professional growth.
          </p>

          {/* Compact Professional Highlights (Minimal Inline Typography) */}
          <div className="editorial-highlights">
            <div className="editorial-highlight-row">
              <span className="editorial-highlight-index">01 // Internships</span>
              <p className="editorial-highlight-content">
                <strong>Full-Stack &amp; IoT</strong> at AIC-NITTE • <strong>AI/ML Engineering</strong> at IICT
              </p>
            </div>

            <div className="editorial-highlight-row">
              <span className="editorial-highlight-index">02 // Hackathons</span>
              <p className="editorial-highlight-content">
                <strong>National Finalist</strong> at MY Bharat Budget Quest 2026 &amp; Nexathon (YojanaSethu)
              </p>
            </div>

            <div className="editorial-highlight-row">
              <span className="editorial-highlight-index">03 // Research</span>
              <p className="editorial-highlight-content">
                <strong>IEEE AIDE 2026 Author</strong> on applied machine learning model architectures
              </p>
            </div>

            <div className="editorial-highlight-row">
              <span className="editorial-highlight-index">04 // Systems</span>
              <p className="editorial-highlight-content">
                <strong>Real-time AI proctoring</strong>, enterprise web applications &amp; secure infrastructure
              </p>
            </div>
          </div>

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
