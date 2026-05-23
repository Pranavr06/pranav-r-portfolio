import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section id="profile">
      <div className="section__pic-container">
        <img
          src="/assets/profile-pic.webp"
          alt="Profile photo of Pranav R, aspiring engineer and tech innovator"
          loading="lazy"
        />
      </div>
      <div className="section__text">
        <p className="section__text__p1">Hello, I'm</p>
        <div className="title">
          <strong>PRANAV R</strong>
        </div>
        <p className="section__text__p2">
          <span className="typing">Tech Innovator</span>
        </p>
        <div className="btn-container">
          <a
            href="/assets/resume.pdf"
            className="btn btn-color-2"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download Pranav R's resume"
          >
            Download CV
          </a>
          <a href="#contact" className="btn btn-color-2" aria-label="Go to contact information">
            Contact Info
          </a>
        </div>
        <div id="socials-container">
          <a
            href="https://www.linkedin.com/in/pranavr06/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Pranav R's LinkedIn profile"
            title="LinkedIn"
          >
            <img src="/assets/linkedin.webp" alt="LinkedIn profile icon" className="icon social-link" loading="lazy" />
          </a>
          <a
            href="https://github.com/PranavR06"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Pranav R's GitHub profile"
            title="GitHub"
          >
            <img src="/assets/github.webp" alt="GitHub profile icon" className="icon social-link" loading="lazy" />
          </a>
        </div>
      </div>
      <a href="#about" className="scroll-down-link" aria-label="Scroll to about section">
        <img
          src="/assets/arrow.webp"
          alt="Scroll down to about section"
          className="icon arrow scroll-down bounce"
          style={{ width: "30px", height: "30px" }}
          title="Scroll down"
        />
      </a>
    </section>
  );
}
