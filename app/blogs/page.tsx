import { supabase } from "@/lib/supabase";
import BlogList from "@/components/BlogList";
import Contact from "@/components/sections/Contact";

export const metadata = {
  title: "Tech Articles & Guides | Pranav R's Blog",
  description: "Insights and tutorials on web development, cybersecurity, Git, UI/UX, and more.",
};

export const revalidate = 0;

export default async function BlogsPage() {
  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching blogs:", error);
  }

  return (
    <main>
      <BlogList initialBlogs={blogs || []} />
      <Contact />
    </main>
  );
}
