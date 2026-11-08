import { supabase } from "@/lib/supabase";
import WallBoard from "@/components/wall/WallBoard";
import ContactCTA from "@/components/ContactCTA";
import "./wall.css";

export const metadata = {
  title: "The Wall | Pranav R",
  description: "An open community digital canvas. Share thoughts, feedback, shoutouts, or questions — zero login required!",
  openGraph: {
    title: "The Wall | Pranav R",
    description: "An open community digital canvas. Share thoughts, feedback, shoutouts, or questions — zero login required!",
    url: "https://pranavr.netlify.app/wall",
  }
};

export const dynamic = "force-dynamic";

export default async function WallPage() {
  let notes: any[] = [];
  let tableReady = true;

  try {
    const { data, error } = await supabase
      .from("wall_notes")
      .select("id, message, author_name, color, emoji, rotation, likes_count, is_pinned, created_at")
      .or("is_archived.is.null,is_archived.eq.false")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(120);

    if (error) {
      if (error.code === "PGRST205" || error.message?.includes("does not exist")) {
        tableReady = false;
      }
      notes = [];
    } else if (data && data.length > 0) {
      notes = data;
    } else {
      notes = [];
    }
  } catch (err) {
    notes = [];
  }

  return (
    <main className="wall-page-container">
      {/* Hero Header */}
      <div className="wall-hero">
        <div className="wall-badge-pill">
          <span>Open Canvas • No Login Required</span>
        </div>
        <h1 className="wall-title">The Wall</h1>
        <p className="wall-subtitle">
          An interactive, public corkboard canvas. Share your thoughts, feedback, engineering questions, or leave your shoutout — no login or sign-in needed.
        </p>
      </div>

      {/* Interactive Sticky Notes Board */}
      <WallBoard initialNotes={notes} tableReady={tableReady} />

      {/* Footer CTA */}
      <div style={{ maxWidth: "800px", margin: "5rem auto 0 auto", padding: "0 1rem" }}>
        <ContactCTA 
          sourceType="general" 
          purpose="Sticky Wall Inquiry" 
          ctaText="Want to collaborate or discuss a project?" 
        />
      </div>
    </main>
  );
}
