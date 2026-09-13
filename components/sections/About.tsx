"use client";

import Link from "next/link";
import FadeInSection from "@/components/FadeInSection";
import ScrollArrow from "@/components/ScrollArrow";

export default function About() {
  const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <FadeInSection id="about">
      <p className="section__text__p1">Get to know more</p>
      <h1 className="title">About Me</h1>
      <div className="section-container">
        <div className="section__pic-container">
          <img
            src="/assets/about-pic.webp"
            alt="Profile picture of Pranav R in about section"
            className="about-pic"
            loading="lazy"
          />
        </div>
        <div className="about-details-container">
          <div className="about-containers">
            <a
              href="#experience"
              onClick={(e) => scrollToSection(e, "experience")}
              className="details-container clickable-about-card"
              style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
              aria-label="Navigate to Experience section"
            >
              <img src="/assets/experience.webp" alt="Experience icon" className="icon" loading="lazy" />
              <h3>Experience</h3>
              <p>
                2+ Internships<br />
                National Finalist
              </p>
            </a>

            <a
              href="#experience"
              onClick={(e) => scrollToSection(e, "experience")}
              className="details-container clickable-about-card"
              style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
              aria-label="View Education and Academic background"
            >
              <img src="/assets/education.webp" alt="Education icon" className="icon" loading="lazy" />
              <h3>Education</h3>
              <p>
                B.Tech (ISE)<br />
                NMAMIT, Nitte
              </p>
            </a>

            <a
              href="#projects"
              onClick={(e) => scrollToSection(e, "projects")}
              className="details-container clickable-about-card"
              style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
              aria-label="Navigate to Projects section"
            >
              <img src="/assets/projects.webp" alt="Projects icon" className="icon" loading="lazy" />
              <h3>Projects</h3>
              <p>
                6+ Completed<br />
                AI &amp; Full-Stack
              </p>
            </a>
          </div>

          <div className="text-container">
            <p style={{ marginBottom: "1.25rem", lineHeight: "1.75" }}>
              I am an <strong>Information Science &amp; Engineering undergraduate at NMAMIT, Nitte</strong>, specializing in <strong>Full-Stack Web Development</strong>, <strong>AI/ML systems</strong>, and <strong>Cybersecurity</strong>.
            </p>
            <p style={{ lineHeight: "1.75" }}>
              From architecting real-time AI proctoring engines to conducting published research on machine learning models, I focus on turning complex challenges into robust, production-ready software.
            </p>
          </div>
        </div>
      </div>
      <ScrollArrow targetId="experience" altText="Scroll down to experience section" />
    </FadeInSection>
  );
}

