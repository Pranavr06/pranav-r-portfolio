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

async function getGitHubData(username: string) {
  try {
    const [userRes, contribRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: { "User-Agent": "PranavR-Portfolio" },
        next: { revalidate: 3600 },
      }).catch(() => null),
      fetch(`https://github-contributions-api.jogruber.de/v4/${username}`, {
        next: { revalidate: 3600 },
      }).catch(() => null),
    ]);

    const user = userRes?.ok ? await userRes.json() : { login: username, public_repos: 11 };
    let contrib = contribRes?.ok ? await contribRes.json() : null;
    
    if (contrib && contrib.contributions) {
      if (!contrib.total) contrib.total = {};
      if (!contrib.total.lastYear) {
        const sortedDesc = [...contrib.contributions].sort((a: any, b: any) => b.date.localeCompare(a.date));
        contrib.total.lastYear = sortedDesc.slice(0, 365).reduce((s: number, c: any) => s + (c.count || 0), 0);
      }
    } else if (username.toLowerCase() === "pranavr06") {
      contrib = githubFallback;
    }

    return { user, contrib };
  } catch (err) {
    console.error("Error fetching GitHub data in page.tsx:", err);
    return {
      user: { login: username, public_repos: 11 },
      contrib: username.toLowerCase() === "pranavr06" ? githubFallback : null,
    };
  }
}

export default async function TechnicalExpertisePage() {
  const [hubResult, experiencesResult] = await Promise.all([
    supabase
      .from("experience_hubs")
      .select("*")
      .eq("href", "/experiences/technical-expertise")
      .maybeSingle(),
    supabase
      .from("experiences")
      .select("*")
      .eq("category", "technical_expertise")
      .eq("is_published", true)
      .or("is_archived.is.null,is_archived.eq.false")
      .order("display_order", { ascending: true }),
  ]);

  const hub = hubResult.data;
  const githubUsername = hub?.github_username || "Pranavr06";
  const githubUrl = hub?.github_url || `https://github.com/${githubUsername}`;
  const subtitle = hub?.subtitle || "Technologies & Architecture I Use in Production";
  const focusText = hub?.focus_text || "Core Focus: Scalable Full-Stack Architectures & Secure Systems";
  const showGithubGraph = hub?.show_github_graph ?? true;

  const githubData = showGithubGraph ? await getGitHubData(githubUsername) : null;
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
          pageSettings={{
            subtitle,
            focusText,
            showGithubGraph,
            githubUsername,
            githubUrl,
          }}
        />
        
        <ScrollArrow targetId="contact" altText="Scroll down to contact section" />
      </section>

      <Contact />
    </main>
  );
}
