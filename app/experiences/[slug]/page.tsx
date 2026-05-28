import Image from "next/image";
import ScrollArrow from "@/components/ScrollArrow";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const { data: experience } = await supabase
    .from("experiences")
    .select("title, description")
    .eq("read_more_url", `/experiences/${slug}`)
    .maybeSingle();

  if (!experience) {
    return {
      title: "Experience Not Found | Pranav R",
    };
  }

  return {
    title: `${experience.title} | Pranav R`,
    description: experience.description,
  };
}

export default async function ExperienceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const { data: experience, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("read_more_url", `/experiences/${slug}`)
    .maybeSingle();

  if (error || !experience) {
    console.error("Error fetching experience details:", error?.message);
    notFound();
  }

  return (
    <main id="main-content">
      <article id="blog-post">
        <div className="blog-banner">
          {experience.image_url && (
            <Image 
              src={experience.image_url} 
              alt={`${experience.title} Banner`} 
              className="banner-img" 
              width={1200} 
              height={400} 
              priority 
            />
          )}
          <h1 className="banner-title">{experience.title}</h1>
        </div>
        
        <div className="post-metadata">
          <span className="blog-category">Professional Experience</span>
          {experience.tags && Array.isArray(experience.tags) && (
            <div className="tech-stack tech-stack-no-margin">
              {experience.tags.map((tag: string, idx: number) => (
                <span key={idx} className="tech-tag">{tag}</span>
              ))}
            </div>
          )}
        </div>

        {experience.content ? (
          <div className="post-content">
            <ReactMarkdown 
              rehypePlugins={[rehypeRaw]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline ? (
                    <span className="code-block-container mt-1" style={{ display: "block" }}>
                      <pre className="code-block mb-0" {...props}>
                        <code className={className}>{children}</code>
                      </pre>
                    </span>
                  ) : (
                    <span className="tech-tag" style={{ margin: "0 0.4rem 0.5rem 0", display: "inline-block" }} {...props}>
                      {children}
                    </span>
                  );
                },
                img({ node, src, alt, ...props }: any) {
                  if (src?.endsWith(".mp4")) {
                    return (
                      <span className="video-wrapper video-portrait mt-0 mb-0" style={{ width: "100%", maxWidth: "400px", margin: "0 auto", display: "block" }}>
                        <video autoPlay loop muted width="100%" preload="metadata" className="video-rounded" style={{ display: "block" }}>
                          <source src={src} type="video/mp4" />
                        </video>
                        {alt && <span className="video-caption mt-1" style={{ display: "block" }}>{alt}</span>}
                      </span>
                    );
                  }
                  return (
                    <span className="project-image-container no-margin" style={{ flex: 1, minWidth: "250px", display: "block" }}>
                      <img src={src} alt={alt} className="grid-img" loading="lazy" style={{ width: "100%", borderRadius: "1rem", display: "block" }} />
                      {alt && <span style={{ display: "block", fontSize: "1.05rem", color: "#444", fontWeight: "700", marginTop: "0.5rem", textAlign: "center" }}>{alt}</span>}
                    </span>
                  );
                },
                a({ node, href, children, ...props }: any) {
                  if (children?.toString() === "View Certificate") {
                    return (
                      <span className="btn-container add-margin-bottom" style={{ display: "block", marginBottom: "1.5rem" }}>
                        <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-color-2" style={{ display: "inline-block" }}>
                          {children}
                        </a>
                      </span>
                    );
                  }
                  return <a href={href} {...props}>{children}</a>;
                },
                p({ node, children, ...props }: any) {
                  // Check if the paragraph contains only images/videos (in React, children would be an array of objects)
                  const hasOnlyMedia = Array.isArray(children) && children.every((child: any) => 
                    typeof child === "object" && child?.props?.src
                  );
                  if (hasOnlyMedia || (typeof children === "object" && (children as any)?.props?.src)) {
                    return (
                      <span className="image-grid" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem", justifyContent: "center", width: "100%" }}>
                        {children}
                      </span>
                    );
                  }
                  return <p {...props}>{children}</p>;
                }
              }}
            >
              {experience.content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="post-content">
            <p style={{ textAlign: "center", marginTop: "4rem" }}>
              Detailed content for this experience is coming soon!
            </p>
          </div>
        )}

      </article>

      <ScrollArrow targetId="contact" altText="Scroll down to contact section" />
    </main>
  );
}
