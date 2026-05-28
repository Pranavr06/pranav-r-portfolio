import React from 'react';
import ShareMenu from "@/components/ShareMenu";

export default function CertificateCard({ cert }: { cert: any }) {
  return (
    <article className="details-container color-container visible" style={{ display: "flex", flexDirection: "column", position: "relative", textAlign: "center", padding: "2rem" }}>
      
      <div style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 5 }}>
        <ShareMenu 
          title={cert.title} 
          type="certificates" 
          downloadUrl={cert.pdf_url && cert.pdf_url !== "#" ? cert.pdf_url : undefined} 
        />
      </div>

      <div className="article-container" style={{ display: "flex", justifyContent: "center" }}>
        <img src={cert.image_url || "/assets/ieee-logo.webp"} alt={`${cert.title} logo`} className="certificate-logo" loading="lazy" style={{ width: "80px", height: "80px", marginBottom: "1rem", objectFit: "contain" }} />
      </div>
      
      <h3 className="experience-sub-title project-title" style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{cert.title}</h3>
      <p className="certificate-date" style={{ fontSize: "0.95rem", color: "gray", marginBottom: "1rem" }}>
        {cert.date.includes("Completed") ? cert.date : `Completed: ${cert.date}`}
      </p>
      
      <p style={{ flexGrow: 1, marginBottom: "1.5rem", color: "var(--text-color-light)", fontSize: "1rem" }}>{cert.description}</p>
      
      {cert.skills && cert.skills.length > 0 && (
        <div className="skill-tags" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem", justifyContent: "center" }}>
          {cert.skills.map((skill: string, index: number) => (
            <span key={index} className="custom-tag">{skill}</span>
          ))}
        </div>
      )}
      
      {cert.category && (!cert.skills || cert.skills.length === 0) && (
        <div className="skill-tags" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem", justifyContent: "center" }}>
          <span className="custom-tag">{cert.category}</span>
        </div>
      )}

      {cert.issuer && !cert.issuer.includes("Unknown") && (
        <p className="achievement-highlight-custom" style={{ fontSize: "0.95rem", marginTop: "1rem" }}>
          {cert.issuer.includes("Issued by") || cert.issuer.includes("Organized by") || cert.issuer.includes("Completed in") ? cert.issuer : `Issued by ${cert.issuer}`}
        </p>
      )}

      <div className="btn-container" style={{ marginTop: "auto", paddingTop: "1rem", display: "flex", justifyContent: "center" }}>
        {cert.pdf_url && cert.pdf_url !== "#" && (
          <a href={cert.pdf_url} className="btn btn-color-2" style={{ padding: "0.5rem 1.5rem", borderRadius: "2rem", textDecoration: "none" }} target="_blank" rel="noopener noreferrer" aria-label={`View ${cert.title} certificate`}>
            Certificate
          </a>
        )}
      </div>
    </article>
  );
}
