"use client";

import FadeInSection from "@/components/FadeInSection";
import ScrollArrow from "@/components/ScrollArrow";

export default function About() {
  return (
    <FadeInSection id="about" className="tomasz-about-section">
      {/* Diagonal Left Background */}
      <div className="tomasz-left-bg" aria-hidden="true" />

      {/* Left Content (Title, Subtitle, Bio, Badges) */}
      <div className="tomasz-left-content">
        <h1 className="tomasz-title">About Me</h1>
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
      </div>

      {/* Right Content (Studio Portrait on Seamless Black) */}
      <div className="tomasz-right-content">
        <img
          src="/assets/about-tomasz-portrait.webp"
          alt="Pranav R - About Me Portrait"
          className="tomasz-portrait-img"
          loading="lazy"
        />
      </div>

      <ScrollArrow targetId="experience" altText="Scroll down to experience section" />
    </FadeInSection>
  );
}
