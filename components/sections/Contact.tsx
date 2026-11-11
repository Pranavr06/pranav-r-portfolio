"use client";

import Link from "next/link";
import FadeInSection from "@/components/FadeInSection";
import ScrollArrow from "@/components/ScrollArrow";

export default function Contact({ hideArrow = false }: { hideArrow?: boolean }) {
  return (
    <FadeInSection id="contact" className="editorial-contact-section">
      <div className="editorial-contact-container">
        {/* Left Column: Heading, Description, and Contact CTAs */}
        <div className="editorial-contact-left">
          {/* Main Heading: Italic serif accent with subtle underline */}
          <h2 className="editorial-heading">
            <span className="editorial-heading-accent">Contact Me</span>
          </h2>

          {/* Supporting Description */}
          <p className="editorial-description">
            Have an idea, project inquiry, collaboration proposal, or just want to connect? Reach out and let&apos;s build something meaningful together.
          </p>

          {/* Action CTAs */}
          <div className="contact-actions-group">
            <Link
              href="/contact"
              className="editorial-cta-btn"
              aria-label="Send a Message"
            >
              <span>Send a Message</span>
              <span className="editorial-cta-arrow" aria-hidden="true">↗</span>
            </Link>

            <div className="contact-direct-links">
              <a
                href="mailto:pranavkundapura18@gmail.com?subject=Portfolio%20Inquiry%20-%20Connecting%20with%20Pranav%20R&body=Hi%20Pranav,%0D%0A%0D%0AI%20recently%20came%20across%20your%20portfolio%20and%20was%20impressed%20by%20your%20work.%20I%20would%20love%20to%20connect%20and%20discuss%20potential%20opportunities.%0D%0A%0D%0ABest%20regards,%0D%0A[Your%20Name]"
                className="contact-pill-link"
                aria-label="Email Pranav R"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <span>Email</span>
              </a>

              <a
                href="https://www.linkedin.com/in/pranavr06/"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-pill-link"
                aria-label="Connect with Pranav R on LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Portrait */}
        <div className="editorial-contact-right">
          <div className="editorial-portrait-wrapper contact-portrait-wrapper">
            {/* Subtle Abstract Backdrop Elements */}
            <div className="editorial-portrait-aura" aria-hidden="true" />
            <div className="editorial-portrait-ring" aria-hidden="true" />
            <div className="editorial-portrait-crosshair ch-tl" aria-hidden="true" />
            <div className="editorial-portrait-crosshair ch-br" aria-hidden="true" />

            <img
              src="/assets/pranavr-contact.webp"
              alt="Pranav R - Contact and Connect"
              className="editorial-portrait-img contact-portrait-img"
              loading="lazy"
              width={1086}
              height={1448}
            />
          </div>
        </div>
      </div>

      {/* Smooth Scroll Navigation back up to Hero section */}
      {!hideArrow && (
        <div className="editorial-scroll-arrow">
          <ScrollArrow direction="up" targetId="profile" altText="Scroll up to hero section" />
        </div>
      )}
    </FadeInSection>
  );
}
