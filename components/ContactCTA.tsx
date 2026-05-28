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
    <div style={{ margin: "3rem 0", padding: "2rem", textAlign: "center", background: "var(--bg-color)", borderRadius: "1rem", border: "1px solid rgba(0,0,0,0.1)", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
      <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", fontWeight: 600 }}>{ctaText}</h3>
      <Link href={contactUrl} className="btn btn-color-1" style={{ display: "inline-block", padding: "0.8rem 2rem", fontSize: "1.1rem" }}>
        Contact Me
      </Link>
    </div>
  );
}
