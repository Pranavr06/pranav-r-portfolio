import Image from "next/image";
import TestimonialCardMenu from "../TestimonialCardMenu";

interface TestimonialCardProps {
  testimonial: {
    id: string;
    user_id: string;
    name: string;
    role: string;
    message: string;
    linkedin_url?: string;
    github_url?: string;
    avatar_url?: string;
    is_verified?: boolean;
    is_github_verified?: boolean;
    display_order?: number;
    sort_order?: number;
  };
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <figure className="testimonial-card" id={testimonial.id}>
      <blockquote>
        <p>"{testimonial.message}"</p>
      </blockquote>
      <figcaption className="testimonial-author">
        {testimonial.avatar_url ? (
          <img 
            src={testimonial.avatar_url} 
            alt={testimonial.name} 
            className="author-img"
            loading="lazy"
          />
        ) : (
          <div className="author-img" style={{ background: "#ccc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: "bold", color: "#fff" }}>
            {testimonial.name.charAt(0).toUpperCase()}
          </div>
        )}
        
        <div className="author-info">
          <div className="author-text">
            <h3>{testimonial.name}</h3>
            <p className="author-title">{testimonial.role}</p>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.2rem" }}>
              {testimonial.linkedin_url && testimonial.is_verified && (
                <div className="custom-tooltip-wrapper tooltip-bottom" style={{ display: "flex" }}>
                  <a href={testimonial.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", opacity: 0.7 }} aria-label={`${testimonial.name}'s LinkedIn`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                  <span className="custom-tooltip">Verified LinkedIn Profile</span>
                </div>
              )}
              {testimonial.github_url && testimonial.is_github_verified && (
                <div className="custom-tooltip-wrapper tooltip-bottom" style={{ display: "flex" }}>
                  <a href={testimonial.github_url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", opacity: 0.7 }} aria-label={`${testimonial.name}'s GitHub`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  </a>
                  <span className="custom-tooltip">Verified GitHub Profile</span>
                </div>
              )}
            </div>
          </div>
          
          <TestimonialCardMenu 
            testimonialId={testimonial.id} 
            ownerId={testimonial.user_id} 
            testimonialData={testimonial} 
          />
        </div>
      </figcaption>
    </figure>
  );
}
