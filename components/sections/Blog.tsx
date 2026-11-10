"use client";

import Link from "next/link";
import FadeInSection from "@/components/FadeInSection";
import ScrollArrow from "@/components/ScrollArrow";

export default function Blog() {
  return (
    <FadeInSection id="blog" className="editorial-blog-section">
      <div className="editorial-blog-container">
        {/* Left Column: Blog Portrait */}
        <div className="editorial-blog-left">
          <div className="editorial-portrait-wrapper blog-portrait-wrapper">
            {/* Subtle Abstract Backdrop Elements */}
            <div className="editorial-portrait-aura" aria-hidden="true" />
            <div className="editorial-portrait-ring" aria-hidden="true" />
            <div className="editorial-portrait-crosshair ch-tl" aria-hidden="true" />
            <div className="editorial-portrait-crosshair ch-br" aria-hidden="true" />

            <img
              src="/assets/pranavr-blogs.webp"
              alt="Pranav R - Blog Author and Tech Writer"
              className="editorial-portrait-img blog-portrait-img"
              loading="lazy"
              width={1536}
              height={1024}
            />
          </div>
        </div>

        {/* Right Column: Editorial Blog Intro & CTA */}
        <div className="editorial-blog-right">
          {/* Main Heading: Italic serif accent with subtle underline */}
          <h2 className="editorial-heading">
            <span className="editorial-heading-accent">My Blogs</span>
          </h2>

          {/* Supporting Description */}
          <p className="editorial-description">
            Explore insights, architectural deep-dives, and tutorials on software development, artificial intelligence, cybersecurity, and modern tech innovations.
          </p>

          {/* Primary Call-to-Action */}
          <div className="editorial-cta-wrap">
            <Link
              href="/blogs"
              className="editorial-cta-btn"
              aria-label="View Blogs"
            >
              <span>View Blogs</span>
              <span className="editorial-cta-arrow" aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Smooth Scroll Navigation to Contact */}
      <div className="editorial-scroll-arrow">
        <ScrollArrow targetId="contact" altText="Scroll down to contact section" />
      </div>
    </FadeInSection>
  );
}
