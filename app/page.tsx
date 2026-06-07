import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Certificates from "@/components/sections/Certificates";
import Projects from "@/components/sections/Projects";
import Testimonials from "@/components/sections/Testimonials";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";
import SectionTracker from "@/components/SectionTracker";

export default function Home() {
  return (
    <main>
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
