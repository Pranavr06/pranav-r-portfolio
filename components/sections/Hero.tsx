import Link from "next/link";
import Image from "next/image";
import ScrollArrow from "@/components/ScrollArrow";
import TypingEffect from "@/components/TypingEffect";

export default function Hero() {
  return (
    <section id="profile">
      <div className="section__pic-container">
        <Image
          src="/assets/profile-pic.webp"
          alt="Profile photo of Pranav R, aspiring engineer and tech innovator"
          width={400}
          height={400}
          priority
          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
        />
      </div>
      <div className="section__text">
        <p className="section__text__p1">Hello, I'm</p>
        <div className="title">
          <strong>PRANAV R</strong>
        </div>
        <p className="section__text__p2">
          <TypingEffect />
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
      <ScrollArrow targetId="about" altText="Scroll down to about section" />
    </section>
  );
}
