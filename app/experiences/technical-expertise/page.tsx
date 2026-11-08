import { supabase } from "@/lib/supabase";
import ScrollArrow from "@/components/ScrollArrow";
import Contact from "@/components/sections/Contact";
import TechnicalExpertiseClient from "@/components/experience/TechnicalExpertiseClient";
import githubFallback from "@/lib/githubFallback.json";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technical Expertise | Pranav R",
  description: "A comprehensive overview of my technical capabilities, showcasing scalable architecture, full-stack development, and secure systems I've built.",
};

export const revalidate = 60; // revalidate every 60 seconds

async function getGitHubData() {
  try {
    const [userRes, contribRes] = await Promise.all([
      fetch("https://api.github.com/users/Pranavr06", {
        headers: { "User-Agent": "PranavR-Portfolio" },
        next: { revalidate: 3600 },
      }).catch(() => null),
      fetch("https://github-contributions-api.jogruber.de/v4/Pranavr06?y=last", {
        next: { revalidate: 3600 },
      }).catch(() => null),
    ]);

    const user = userRes?.ok ? await userRes.json() : { login: "Pranavr06", public_repos: 11 };
    const contrib = contribRes?.ok ? await contribRes.json() : githubFallback;

    return { user, contrib };
  } catch (err) {
    console.error("Error fetching GitHub data in page.tsx:", err);
    return {
      user: { login: "Pranavr06", public_repos: 11 },
      contrib: githubFallback,
    };
  }
}

export default async function TechnicalExpertisePage() {
  const [experiencesResult, githubData] = await Promise.all([
    supabase
      .from("experiences")
      .select("*")
      .eq("category", "technical_expertise")
      .eq("is_published", true)
      .or("is_archived.is.null,is_archived.eq.false")
      .order("display_order", { ascending: true }),
    getGitHubData(),
  ]);

  const experiences = experiencesResult.data || [];

  if (experiencesResult.error) {
    console.error("Error fetching technical expertise experiences:", experiencesResult.error.message);
  }

  return (
    <main id="main-content">
      <section id="expertise-section" className="mobile-spacing fade-in-section" style={{ paddingTop: "2rem", marginTop: 0 }}>
        <TechnicalExpertiseClient 
          experiences={experiences} 
          githubData={githubData} 
        />
        
        <ScrollArrow targetId="contact" altText="Scroll down to contact section" />
      </section>

      <Contact />
    </main>
  );
}
