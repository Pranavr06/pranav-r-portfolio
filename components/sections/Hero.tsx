"use client";

import Image from "next/image";
import ScrollArrow from "@/components/ScrollArrow";
import TypingEffect from "@/components/TypingEffect";
import { trackEvent } from "@/lib/analytics";

export default function Hero() {
  return (
    <section id="profile" className="hero-modern-section">
      {/* Ambient Background Glow Elements */}
      <div className="hero-glow hero-glow-1" aria-hidden="true" />
      <div className="hero-glow hero-glow-2" aria-hidden="true" />

      <div className="hero-container">
        {/* Left Column: Radial / Circular Profile Picture (No Border) */}
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
          </div>
        </div>

        {/* Right Column: Text, CTAs, Socials */}
        <div className="hero-content">
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

          {/* Action Buttons */}
          <div className="btn-container hero-btn-group">
            <a
              href="/assets/resume.pdf"
              className="btn btn-color-2"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Pranav R's resume"
              onClick={() => trackEvent("click_resume", "hero")}
            >
              Download CV
            </a>

            <a
              href="#contact"
              className="btn btn-color-2"
              aria-label="Navigate to contact section"
              onClick={() => trackEvent("click_contact_hero", "hero")}
            >
              Contact Info
            </a>
          </div>

          {/* Social Icons (LinkedIn & GitHub) */}
          <div id="socials-container" className="hero-socials-group">
            <a
              href="https://www.linkedin.com/in/pranavr06/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Pranav R's LinkedIn profile"
              data-tooltip="LinkedIn"
              onClick={() => trackEvent("click_linkedin", "hero")}
            >
              <img
                src="/assets/linkedin.webp"
                alt="LinkedIn profile icon"
                className="icon social-link"
                loading="lazy"
              />
            </a>

            <a
              href="https://github.com/Pranavr06"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Pranav R's GitHub profile"
              data-tooltip="GitHub"
              onClick={() => trackEvent("click_github", "hero")}
            >
              <img
                src="/assets/github.webp"
                alt="GitHub profile icon"
                className="icon social-link"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </div>

      <ScrollArrow targetId="about" altText="Scroll down to about section" />
    </section>
  );
}
