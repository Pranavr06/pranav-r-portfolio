import { supabase } from "@/lib/supabase";
import WallBoard from "@/components/wall/WallBoard";
import ShareMenu from "@/components/ShareMenu";
import ContactCTA from "@/components/ContactCTA";
import "./wall.css";

export const metadata = {
  title: "The Sticky Wall 📌 | Pranav R",
  description: "An open community digital canvas. Stick a note, drop feedback, shoutout, joke, or spam anything — zero login required!",
  openGraph: {
    title: "The Sticky Wall 📌 | Pranav R",
    description: "An open community digital canvas. Stick a note, drop feedback, shoutout, joke, or spam anything — zero login required!",
    url: "https://pranavr.netlify.app/wall",
  }
};

export const dynamic = "force-dynamic";

const STARTER_NOTES = [
  {
    id: "starter-1",
    message: "Welcome to The Wall! 📌 Leave any comment, joke, feedback, or shoutout here. No login required!",
    author_name: "Pranav R",
    color: "yellow",
    emoji: "📌",
    rotation: -1.5,
    likes_count: 12,
    is_pinned: true,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "starter-2",
    message: "Loved the YojanaSethu project showcase! Great architecture and real-time AI mock interview features. Keep building! 🚀",
    author_name: "Fellow Dev",
    color: "blue",
    emoji: "🚀",
    rotation: 2.1,
    likes_count: 8,
    is_pinned: false,
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: "starter-3",
    message: "The UI design on this portfolio is super smooth. Dark mode is chef's kiss 🤌🔥",
    author_name: "UI Enthusiast",
    color: "pink",
    emoji: "🔥",
    rotation: -2.0,
    likes_count: 15,
    is_pinned: false,
    created_at: new Date(Date.now() - 14400000).toISOString()
  },
  {
    id: "starter-4",
    message: "First time checking out your work, the Zero-Knowledge Vaultary project is very clean!",
    author_name: "CyberSec Geek",
    color: "green",
    emoji: "💡",
    rotation: 1.2,
    likes_count: 6,
    is_pinned: false,
    created_at: new Date(Date.now() - 28800000).toISOString()
  }
];

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
      notes = STARTER_NOTES;
    } else if (data && data.length > 0) {
      notes = data;
    } else {
      notes = STARTER_NOTES;
    }
  } catch (err) {
    notes = STARTER_NOTES;
  }

  return (
    <main className="wall-page-container">
      {/* Hero Header */}
      <div className="wall-hero">
        <div className="wall-badge-pill">
          <span>✨ 100% Open & Anonymous</span>
        </div>
        <h1 className="wall-title">The Sticky Wall 📌</h1>
        <p className="wall-subtitle">
          An interactive, public corkboard canvas. Drop your thoughts, secret shoutouts, feedback, questions, or spam whatever you like — no login or sign-in needed!
        </p>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
          <ShareMenu title="The Sticky Wall | Pranav R" type="page" />
        </div>
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
