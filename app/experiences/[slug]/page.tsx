import Image from "next/image";
import ScrollArrow from "@/components/ScrollArrow";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import ShareMenu from "@/components/ShareMenu";
import CodeBlock from "@/components/CodeBlock";
import ContactCTA from "@/components/ContactCTA";
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
                pre({ node, children, ...props }: any) {
                  return (
                    <CodeBlock className="code-block mb-0" isAccordion={slug === 'aic-nitte-internship'} {...props}>
                      {children}
                    </CodeBlock>
                  );
                },
                code({ node, className, children, ...props }: any) {
                  // Determine if this is block code (inside a pre) or inline code
                  // Block code usually has a language class or contains newlines
                  const isBlock = className?.includes('language-') || String(children).includes('\n');
                  
                  if (isBlock) {
                    return <code className={className} {...props}>{children}</code>;
                  }
                  
                  // Inline code becomes a pill tag
                  return (
                    <span className="tech-tag" style={{ margin: "0 0.4rem 0.5rem 0", display: "inline-block" }} {...props}>
                      {children}
                    </span>
                  );
                },
                img({ node, src, alt, ...props }: any) {
                  // Unconditionally map all local assets to the /assets/ root directory, 
                  // regardless of how messed up the database path is (e.g., ../experiences/assets/...)
                  const absoluteSrc = src && !src.startsWith("http") ? `/assets/${src.split('/').pop()}` : src;

                  if (absoluteSrc?.endsWith(".mp4") || absoluteSrc?.endsWith(".webm")) {
                    const isCrowdVideo = alt?.includes("crowd erupts in joy");
                    return (
                      <div className="video-wrapper mt-0 mb-0" style={{ flex: 1, minWidth: "0", width: "100%", maxWidth: isCrowdVideo ? "800px" : "354px", margin: "0 auto" }}>
                        <video src={absoluteSrc} controls autoPlay loop muted playsInline width="100%" preload="metadata" style={{ display: "block", width: "100%", height: "auto", borderRadius: "1rem" }} />
                        {alt && <figcaption>{alt}</figcaption>}
                      </div>
                    );
                  }
                  const isCertImage = alt?.toLowerCase().includes("internship certificate");
                  const isLunchPic = alt?.includes("home-style Indian lunch");
                  const isFormalPic = alt?.includes("MY BHARAT BUDGET QUEST photo area");
                  const isGroupPic = alt?.includes("glowing steps of the structure");
                  const isMonumentPic = alt?.includes("illuminated monument at night");
                  const isByogiPic = alt?.includes("BYOGI wellness facility");
                  const isGuestsPic = alt?.includes("esteemed guests");
                  const isSelfiePic = alt?.includes("memorable selfie");
                  const isMessagePic = alt?.includes("special message from the Hon'ble Prime Minister");
                  const isMandaviyaPic = alt?.includes("Union Minister Dr. Mansukh Mandaviya");
                  const isAuditoriumPic = alt?.includes("large indoor auditorium hosting");
                  const isAnthemPic = alt?.includes("National Anthem");
                  const isInnovationPic = alt?.includes("Innovation & Design Thinking");
                  
                  const isGridPic = alt?.includes("Stage program of NARI SHAKTI") || 
                                    alt?.includes("fellow VBYLD'26 finalists") || 
                                    alt?.includes("podium during the event") || 
                                    alt?.includes("event title screen");
                  
                  let imgWidth = "100%";
                  let imgMaxWidth = "100%";
                  
                  if (isInnovationPic) {
                    imgWidth = "calc(100% - 50px)";
                  } else if (isLunchPic || isFormalPic || isGroupPic) {
                    imgMaxWidth = "350px";
                  } else if (isMonumentPic || isByogiPic || isGuestsPic || isMessagePic || isMandaviyaPic || isAuditoriumPic || isAnthemPic) {
                    imgMaxWidth = "600px";
                  } else if (isSelfiePic) {
                    imgMaxWidth = "400px";
                  }

                  let flexStyle: any = 1;
                  let minWidthStyle = "0";
                  
                  if (isCertImage || isMandaviyaPic || isAuditoriumPic || isAnthemPic) {
                    flexStyle = "0 0 100%";
                  } else if (isGridPic) {
                    flexStyle = "1 1 calc(50% - 1rem)";
                    minWidthStyle = "250px";
                  }

                  return (
                    <figure className="project-image-container no-margin" style={{ flex: flexStyle, minWidth: minWidthStyle, display: "flex", flexDirection: "column", alignItems: "center", width: "100%", margin: "0" }}>
                      <img src={absoluteSrc} alt={alt} className="grid-img" loading="lazy" style={{ width: imgWidth, maxWidth: imgMaxWidth, borderRadius: "1rem", display: "block", objectFit: "cover", margin: "0 auto" }} />
                      {alt && <figcaption>{alt}</figcaption>}
                    </figure>
                  );
                },
                a({ node, href, children, ...props }: any) {
                  if (children?.toString() === "View Certificate") {
                    return (
                      <div className="btn-container add-margin-bottom" style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', marginTop: '-1.5rem' }}>
                        <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-color-2">
                          {children}
                        </a>
                        <ShareMenu 
                          title={`${experience.title} Certificate`} 
                          type="page" 
                          downloadUrl={href} 
                          downloadName={`${experience.title}_Certificate.pdf`}
                        />
                      </div>
                    );
                  }
                  return <a href={href} {...props}>{children}</a>;
                },
                h3({ node, children, ...props }: any) {
                  return <h3 className="experience-sub-title" style={{ marginTop: "1.5rem", marginBottom: "0.75rem" }} {...props}>{children}</h3>;
                },
                h4({ node, children, ...props }: any) {
                  return <h4 className="experience-sub-title" style={{ fontSize: "1.2rem", opacity: 0.9, marginTop: "1rem", marginBottom: "0.5rem" }} {...props}>{children}</h4>;
                },
                p({ node, children, ...props }: any) {
                  // Check if the paragraph contains only images/videos
                  let isOnlyMedia = false;
                  if (Array.isArray(children)) {
                    // Filter out whitespace strings
                    const elements = children.filter((c: any) => typeof c !== 'string' || c.trim() !== '');
                    if (elements.length > 0) {
                      isOnlyMedia = elements.every((c: any) => typeof c === 'object' && c !== null && c.props && (c.props.src || c.props.node?.tagName === 'img'));
                    }
                  } else if (typeof children === 'object' && children !== null && (children as any).props) {
                    isOnlyMedia = !!((children as any).props.src || (children as any).props.node?.tagName === 'img');
                  }

                  if (isOnlyMedia) {
                    return (
                      <div className="image-grid" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem", justifyContent: "center", width: "100%" }}>
                        {children}
                      </div>
                    );
                  }
                  
                  // Render paragraphs as divs to prevent hydration errors when they contain block-level elements
                  return <div className="md-p" style={{ marginBottom: "1rem" }} {...props}>{children}</div>;
                },
                figure({ node, children, className, ...props }: any) {
                  return (
                    <figure className={className} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "1rem auto" }} {...props}>
                      {children}
                    </figure>
                  );
                },
                figcaption({ node, children, className, ...props }: any) {
                  return (
                    <figcaption className={className} {...props}>
                      {children}
                    </figcaption>
                  );
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

        <ScrollArrow targetId="contact" altText="Scroll down to contact section" />
      </article>

      <section id="contact" className="mobile-spacing" style={{ paddingTop: "4rem", paddingBottom: "4rem", minHeight: "80vh", height: "auto", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 2rem", width: "100%" }}>
          <ContactCTA sourceType="project" sourceSlug={slug} />
        </div>
        
        <ScrollArrow direction="up" targetId="top" altText="Scroll to top of page" />
      </section>
    </main>
  );
}
