"use client";

import Link from "next/link";
import FadeInSection from "@/components/FadeInSection";
import ScrollArrow from "@/components/ScrollArrow";

export default function Projects() {
  return (
    <FadeInSection id="projects" className="editorial-projects-section">
      <div className="editorial-projects-container">
        {/* Left Column: Lifestyle Portrait (Pranav relaxing on wooden bench with blue mojito) */}
        <div className="editorial-projects-left">
          <div className="lifestyle-portrait-wrapper">
            <img
              src="/assets/pranavr-project.webp"
              alt="Pranav R relaxing on a wooden bench in a light sage-green shirt holding a blue mojito"
              className="lifestyle-portrait-img"
              loading="lazy"
              width={1536}
              height={1024}
            />
          </div>
        </div>

        {/* Right Column: Projects Editorial Introduction & CTA */}
        <div className="editorial-projects-right">
          {/* Eyebrow Label */}
          <span className="editorial-eyebrow">03 / SELECTED WORK</span>

          {/* Main Heading: Italic serif accent with subtle underline */}
          <h2 className="editorial-heading">
            <span className="editorial-heading-accent">Ideas Into Reality.</span>
          </h2>

          {/* Supporting Description */}
          <p className="editorial-description">
            From creative experiments to practical applications, explore a collection of projects I&apos;ve designed, developed and brought to life.
          </p>

          {/* Primary Call-to-Action */}
          <div className="editorial-cta-wrap">
            <Link
              href="/projects"
              className="editorial-cta-btn"
              aria-label="Explore My Projects"
            >
              <span>Explore My Projects</span>
              <span className="editorial-cta-arrow" aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Smooth Scroll Navigation to Testimonials */}
      <div className="editorial-scroll-arrow">
        <ScrollArrow targetId="testimonials" altText="Scroll down to testimonials section" />
      </div>
    </FadeInSection>
  );
}
