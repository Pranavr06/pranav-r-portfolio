"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ContactCTAProps {
  sourceType: "blog" | "project" | "certificate" | "general";
  sourceSlug?: string;
  purpose?: string;
  ctaText?: string;
}

export default function ContactCTA({ sourceType, sourceSlug = "", purpose = "", ctaText = "Let's build something useful." }: ContactCTAProps) {
  const pathname = usePathname();
  
  const queryParams = new URLSearchParams();
  queryParams.set("source_type", sourceType);
  queryParams.set("source_page", pathname);
  
  if (sourceSlug) queryParams.set("source_slug", sourceSlug);
  if (purpose) queryParams.set("purpose", purpose);

  const contactUrl = `/contact?${queryParams.toString()}`;

  return (
    <div className="contact-cta-section">
      <p className="contact-cta-subtitle">Get in Touch</p>
      <h2 className="contact-cta-title">Contact Me</h2>
      
      <div className="contact-cta-card">
        <h3 className="contact-cta-card-title">{ctaText}</h3>
        <Link href={contactUrl} className="contact-cta-btn">
          Contact Me
        </Link>
      </div>

      <div className="contact-cta-links">
        <a href="mailto:pranav.r.contact@gmail.com" className="contact-cta-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" className="contact-cta-icon">
            <circle cx="12" cy="12" r="12" />
            <path d="M6 9l6 4 6-4v6a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9z" className="contact-cta-icon-inner"/>
            <path d="M18 8a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1l6 4 6-4z" className="contact-cta-icon-inner"/>
          </svg>
          Email
        </a>
        <a href="https://linkedin.com/in/pranavr2006" target="_blank" rel="noopener noreferrer" className="contact-cta-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" className="contact-cta-icon">
            <circle cx="12" cy="12" r="12" />
            <path d="M8 17H6V10h2v7zm-1-8c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm9 8h-2v-3.5c0-1-.8-1.5-1.5-1.5s-1.5.5-1.5 1.5V17h-2v-7h2v1c.5-1 1.5-1.5 2.5-1.5 1.5 0 2.5 1 2.5 3v4.5z" className="contact-cta-icon-inner"/>
          </svg>
          LinkedIn
        </a>
      </div>
    </div>
  );
}
