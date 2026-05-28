"use client";

import FadeInSection from "@/components/FadeInSection";
import ScrollArrow from "@/components/ScrollArrow";
import ContactCTA from "@/components/ContactCTA";

export default function Contact() {
  return (
    <FadeInSection id="contact">
      <p className="section__text__p1">Get in Touch</p>
      <h2 className="title">Contact Me</h2>
      <div className="contact-form-container">
        <ContactCTA sourceType="general" />
      </div>
      <div className="contact-info-upper-container">
        <div className="contact-info-container">
          <a
            href="mailto:pranavkundapura18@gmail.com?subject=Professional%20Inquiry"
            className="contact-link"
            aria-label="Send email to Pranav R"
          >
            <img src="/assets/email.webp" alt="Email contact icon" className="icon contact-icon" loading="lazy" />
            <span className="contact-text">Email</span>
          </a>
        </div>
        <div className="contact-info-container">
          <a
            href="https://www.linkedin.com/in/pranavr06/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
            aria-label="Visit Pranav R's LinkedIn profile"
          >
            <img src="/assets/linkedin.webp" alt="LinkedIn contact icon" className="icon contact-icon" loading="lazy" />
            <span className="contact-text">LinkedIn</span>
          </a>
        </div>
      </div>
      <ScrollArrow direction="up" targetId="top" altText="Scroll to top of page" />
    </FadeInSection>
  );
}
