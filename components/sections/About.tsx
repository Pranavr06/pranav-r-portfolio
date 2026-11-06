"use client";

import FadeInSection from "@/components/FadeInSection";
import ScrollArrow from "@/components/ScrollArrow";
import { trackEvent } from "@/lib/analytics";

export default function About() {
  return (
    <FadeInSection id="about">
      <div className="tomasz-about-wrapper">
        <div className="tomasz-about-card">
          {/* Diagonal Left Background */}
          <div className="tomasz-left-bg" aria-hidden="true" />

          {/* Left Content (Text, Bio, Badges, Socials) */}
          <div className="tomasz-left-content">
            <span className="tomasz-greeting">Hi, I am</span>
            <h1 className="tomasz-name">Pranav R</h1>
            <p className="tomasz-role">Information Science Undergrad • Full-Stack Developer • AI/ML Engineer</p>

            <div className="tomasz-bio">
              <p>
                I am an <strong>Information Science &amp; Engineering undergraduate at NMAMIT, Nitte</strong>, specializing in <strong>Full-Stack Web Development</strong>, <strong>AI/ML systems</strong>, and <strong>Cybersecurity</strong>.
              </p>
              <p>
                From architecting real-time AI proctoring engines to conducting published research on machine learning models, I focus on turning complex challenges into robust, production-ready software.
              </p>
            </div>

            <div className="tomasz-badges">
              <span className="tomasz-badge">🎓 NMAMIT Nitte (B.Tech ISE)</span>
              <span className="tomasz-badge">💼 2+ Internships</span>
              <span className="tomasz-badge">🚀 6+ Projects</span>
              <span className="tomasz-badge">🏆 National Finalist</span>
            </div>

            <div className="tomasz-socials">
              <a
                href="#contact"
                className="tomasz-social-btn"
                aria-label="Send Email or Contact Pranav"
                data-tooltip="Contact Me"
                onClick={() => trackEvent("click_contact_about", "about")}
              >
                <span className="tomasz-at-icon">@</span>
              </a>
              <a
                href="https://github.com/Pranavr06"
                target="_blank"
                rel="noopener noreferrer"
                className="tomasz-social-btn"
                aria-label="Visit Pranav R's GitHub profile"
                data-tooltip="GitHub"
                onClick={() => trackEvent("click_github", "about")}
              >
                <svg className="tomasz-svg-icon" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/pranavr06/"
                target="_blank"
                rel="noopener noreferrer"
                className="tomasz-social-btn"
                aria-label="Visit Pranav R's LinkedIn profile"
                data-tooltip="LinkedIn"
                onClick={() => trackEvent("click_linkedin", "about")}
              >
                <svg className="tomasz-svg-icon" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right Content (Studio Portrait on Solid Black) */}
          <div className="tomasz-right-content">
            <img
              src="/assets/about-tomasz-portrait.webp"
              alt="Pranav R - About Me Portrait"
              className="tomasz-portrait-img"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <ScrollArrow targetId="experience" altText="Scroll down to experience section" />
    </FadeInSection>
  );
}
