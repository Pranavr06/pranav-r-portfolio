"use client";

import Image from "next/image";
import ScrollArrow from "@/components/ScrollArrow";
import TypingEffect from "@/components/TypingEffect";
import { trackEvent } from "@/lib/analytics";
import { FileDown, ArrowRight, Mail, Code, Cpu } from "lucide-react";

export default function Hero() {
  return (
    <section id="profile" className="hero-modern-section">
      {/* Ambient Background Glow Elements */}
      <div className="hero-glow hero-glow-1" aria-hidden="true" />
      <div className="hero-glow hero-glow-2" aria-hidden="true" />

      <div className="hero-container">
        {/* Left Column: Text, Status, CTAs */}
        <div className="hero-content">
          {/* Status Badge */}
          <div className="hero-status-pill">
            <span className="hero-status-dot" aria-hidden="true">
              <span className="hero-status-ping" />
            </span>
            <span>Available for Opportunities</span>
          </div>

          <p className="hero-greeting">Hello, I'm</p>

          <h1 className="hero-name">
            PRANAV <span className="hero-name-highlight">R</span>
          </h1>

          {/* Dynamic Animated Role */}
          <div className="hero-role-wrapper">
            <span className="hero-role-prefix">&gt; </span>
            <span className="hero-role-text">
              <TypingEffect
                words={[
                  "FULL-STACK DEVELOPER",
                  "AI & ML ENGINEER",
                  "CYBERSECURITY ENTHUSIAST",
                  "TECH INNOVATOR",
                ]}
              />
            </span>
          </div>

          <p className="hero-description">
            Information Science undergraduate at <strong>NMAMIT, Nitte</strong>.
            Architecting real-time AI systems, high-performance web applications,
            and secure digital infrastructure.
          </p>

          {/* Primary Action Buttons */}
          <div className="hero-actions">
            <a
              href="/assets/resume.pdf"
              className="hero-btn-primary"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Pranav R's resume"
              onClick={() => trackEvent("click_resume", "hero")}
            >
              <FileDown size={18} strokeWidth={2.2} />
              <span>Download CV</span>
            </a>

            <a
              href="#contact"
              className="hero-btn-secondary"
              aria-label="Navigate to contact section"
              onClick={() => trackEvent("click_contact_hero", "hero")}
            >
              <span>Contact Info</span>
              <ArrowRight size={16} strokeWidth={2} />
            </a>
          </div>

          {/* Social Links Row */}
          <div className="hero-socials">
            <span className="hero-social-label">Connect:</span>
            <a
              href="https://github.com/Pranavr06"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-btn"
              data-tooltip="GitHub"
              aria-label="GitHub Profile"
              onClick={() => trackEvent("click_github", "hero")}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            <a
              href="https://www.linkedin.com/in/pranavr06/"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-btn"
              data-tooltip="LinkedIn"
              aria-label="LinkedIn Profile"
              onClick={() => trackEvent("click_linkedin", "hero")}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            <a
              href="mailto:pranavkundapura18@gmail.com"
              className="hero-social-btn"
              data-tooltip="Email"
              aria-label="Send Email"
              onClick={() => trackEvent("click_email", "hero")}
            >
              <Mail size={18} strokeWidth={2} />
            </a>
          </div>
        </div>

        {/* Right Column: Glowing Portrait Card */}
        <div className="hero-visual-wrapper">
          <div className="hero-card-glow-backdrop" aria-hidden="true" />
          <div className="hero-portrait-card">
            <Image
              src="/assets/profile-pic.webp"
              alt="Profile photo of Pranav R, tech innovator and full-stack developer"
              width={420}
              height={420}
              priority
              className="hero-portrait-image"
            />

            {/* Floating Tech Badges */}
            <div className="hero-floating-badge badge-top-right">
              <Code size={16} className="badge-icon badge-icon-blue" />
              <span>Full-Stack</span>
            </div>

            <div className="hero-floating-badge badge-bottom-left">
              <Cpu size={16} className="badge-icon badge-icon-purple" />
              <span>AI Systems</span>
            </div>
          </div>
        </div>
      </div>

      <ScrollArrow targetId="about" altText="Scroll down to about section" />
    </section>
  );
}
