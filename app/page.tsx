import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Certificates from "@/components/sections/Certificates";
import Projects from "@/components/sections/Projects";
import Testimonials from "@/components/sections/Testimonials";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";
import SectionTracker from "@/components/SectionTracker";
import Script from "next/script";

export const dynamic = 'force-dynamic';

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Pranav R",
    "jobTitle": "Information Science Student & Tech Innovator",
    "affiliation": {
      "@type": "EducationalOrganization",
      "name": "NMAM Institute of Technology, NITTE",
      "url": "https://nmamit.nitte.edu.in/"
    },
    "url": "https://pranavr.netlify.app",
    "sameAs": [
      "https://www.linkedin.com/in/pranavr06/",
      "https://github.com/Pranavr06"
    ],
    "description": "Pranav R is an Information Science student at NMAMIT NITTE, passionate about tech innovation, cybersecurity, and UI/UX design. Explore his projects and skills.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Karkala",
      "addressRegion": "Karnataka",
      "addressCountry": "India"
    },
    "email": "mailto:pranavkundapura18@gmail.com",
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Tech Innovator",
      "skills": ["HTML", "CSS", "JavaScript", "SQL", "Git", "Python", "Cybersecurity", "UI/UX Design", "Machine Learning", "Data Analysis", "Entrepreneurship"]
    }
  };

  return (
    <main>
      <Script
        id="person-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SectionTracker sectionId="hero"><Hero /></SectionTracker>
      <SectionTracker sectionId="about"><About /></SectionTracker>
      <SectionTracker sectionId="experience"><Experience /></SectionTracker>
      <SectionTracker sectionId="certificates"><Certificates /></SectionTracker>
      <SectionTracker sectionId="projects"><Projects /></SectionTracker>
      <SectionTracker sectionId="testimonials"><Testimonials /></SectionTracker>
      <SectionTracker sectionId="blog"><Blog /></SectionTracker>
      <SectionTracker sectionId="contact"><Contact /></SectionTracker>
    </main>
  );
}
