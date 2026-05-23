import Link from "next/link";
import FadeInSection from "@/components/FadeInSection";

export default function About() {
  return (
    <FadeInSection id="about">
      <p className="section__text__p1">Get to know more</p>
      <h1 className="title">About Me</h1>
      <div className="section-container">
        <div className="section__pic-container">
          <img
            src="/assets/about-pic.webp"
            alt="Profile picture of Pranav R in about section"
            className="about-pic"
            loading="lazy"
          />
        </div>
        <div className="about-details-container">
          <div className="about-containers">
            <div className="details-container">
              <img src="/assets/experience.webp" alt="Experience icon" className="icon" loading="lazy" />
              <h3>Experience</h3>
              <p>
                Beginner<br />
                Student
              </p>
            </div>
            <div className="details-container">
              <img src="/assets/education.webp" alt="Education icon" className="icon" loading="lazy" />
              <h3>Education</h3>
              <p>
                BTech<br />
                Undergraduate
              </p>
            </div>
          </div>
          <div className="text-container">
            <p>
              As an Information Science student at NMAMIT NITTE, I specialize in building scalable and secure web
              applications. With a strong foundation in full-stack development and a keen interest in cybersecurity, I am
              passionate about transforming complex problems into elegant and robust digital solutions. My curiosity
              also extends to Python, 3D modeling, and UI/UX design, which provide a versatile edge to my technical
              skill set. This portfolio is a curated showcase of my journey and projects. I invite you to explore my
              work and connect for potential collaborations.
            </p>
          </div>
        </div>
      </div>
      <Link href="#experience" className="scroll-down-link" aria-label="Scroll to experience section">
        <img
          src="/assets/arrow.webp"
          alt="Scroll down to experience section"
          className="icon arrow scroll-down"
          style={{ width: "30px", height: "30px" }}
          title="Scroll down"
        />
      </Link>
    </FadeInSection>
  );
}
