import React from 'react';
import ShareMenu from "@/components/ShareMenu";
import Link from 'next/link';

export default function CertificateCard({ cert }: { cert: any }) {
  return (
    <article className="details-container color-container visible" style={{ display: "flex", flexDirection: "column", position: "relative", textAlign: "center", padding: "1.5rem" }}>
      
      <div style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 5 }}>
        <ShareMenu 
          title={cert.title} 
          type="certificates" 
          downloadUrl={cert.pdf_url && cert.pdf_url !== "#" ? cert.pdf_url : undefined} 
        />
      </div>

      <div className="article-container" style={{ display: "flex", justifyContent: "center" }}>
        <img src={cert.image_url || "/assets/ieee-logo.webp"} alt={`${cert.title} logo`} className="certificate-logo" loading="lazy" style={{ width: "70px", height: "70px", marginBottom: "0.5rem", objectFit: "contain" }} />
      </div>
      
      <h3 className="experience-sub-title project-title" style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "0.3rem" }}>{cert.title}</h3>
      <p className="certificate-date" style={{ fontSize: "0.9rem", color: "gray", marginBottom: "0.5rem" }}>
        {cert.date.includes("Completed") ? cert.date : `Completed: ${cert.date}`}
      </p>
      
      <p style={{ flexGrow: 1, marginBottom: "0.8rem", color: "var(--text-color-light)", fontSize: "0.95rem" }}>{cert.description}</p>
      
      {cert.skills && cert.skills.length > 0 && (
        <div className="skill-tags" style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.8rem", justifyContent: "center" }}>
          {cert.skills.map((skill: string, index: number) => (
            <span key={index} className="custom-tag" style={{ padding: "0.2rem 0.6rem", fontSize: "0.85rem" }}>{skill}</span>
          ))}
        </div>
      )}
      
      {cert.category && (!cert.skills || cert.skills.length === 0) && (
        <div className="skill-tags" style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.8rem", justifyContent: "center" }}>
          <span className="custom-tag" style={{ padding: "0.2rem 0.6rem", fontSize: "0.85rem" }}>{cert.category}</span>
        </div>
      )}

      {cert.issuer && !cert.issuer.includes("Unknown") && (
        <p className="achievement-highlight-custom" style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
          {cert.issuer.includes("Issued by") || cert.issuer.includes("Organized by") || cert.issuer.includes("Completed in") ? cert.issuer : `Issued by ${cert.issuer}`}
        </p>
      )}

      <div className="btn-container" style={{ width: "100%", marginTop: "auto", paddingTop: "0.8rem", display: "flex", justifyContent: (cert.experience_url || cert.project_url) ? "space-between" : "center", alignItems: "center" }}>
        
        {cert.experience_url ? (
          <Link href={cert.experience_url} className="read-more-link" style={{ fontSize: "0.95rem" }}>
            View Experience &rarr;
          </Link>
        ) : cert.project_url ? (
          <Link href={cert.project_url} className="read-more-link" style={{ fontSize: "0.95rem" }}>
            View Project &rarr;
          </Link>
        ) : null}

        {cert.pdf_url && cert.pdf_url !== "#" && (
          <a href={cert.pdf_url} className="btn btn-color-2" style={{ padding: "0.4rem 1.2rem", fontSize: "0.95rem", borderRadius: "2rem", textDecoration: "none" }} target="_blank" rel="noopener noreferrer" aria-label={`View ${cert.title} certificate`}>
            Certificate
          </a>
        )}
      </div>
    </article>
  );
}
