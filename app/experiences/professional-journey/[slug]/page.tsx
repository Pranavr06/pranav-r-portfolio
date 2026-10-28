
import ScrollArrow from "@/components/ScrollArrow";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import ShareMenu from "@/components/ShareMenu";
import CodeBlock from "@/components/CodeBlock";
import ContactCTA from "@/components/ContactCTA";
import { slugify } from "@/lib/slug";
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function fetchExperience(rawSlug: string) {
  const slug = decodeURIComponent(rawSlug);
  
  // 1. Direct match on read_more_url
  const { data: directMatch } = await supabase
    .from("experiences")
    .select("*")
    .eq("read_more_url", `/experiences/professional-journey/${slug}`)
    .eq("is_published", true)
    .or("is_archived.is.null,is_archived.eq.false")
    .maybeSingle();

  if (directMatch) return directMatch;

  // 2. Resilient fallback: search all professional_journey items
  const { data: allExp } = await supabase
    .from("experiences")
    .select("*")
    .eq("category", "professional_journey")
    .eq("is_published", true)
    .or("is_archived.is.null,is_archived.eq.false");

  if (!allExp || allExp.length === 0) return null;

  const normalizedInput = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
  const slugifiedInput = slugify(slug);

  return allExp.find((exp) => {
    const lastPart = exp.read_more_url?.split("/").pop() || "";
    const normalizedLastPart = lastPart.toLowerCase().replace(/[^a-z0-9]/g, "");
    const slugifiedLastPart = slugify(lastPart);
    const slugifiedTitle = slugify(exp.title || "");
    const normalizedTitle = (exp.title || "").toLowerCase().replace(/[^a-z0-9]/g, "");

    return (
      lastPart.toLowerCase() === slug.toLowerCase() ||
      slugifiedLastPart === slugifiedInput ||
      normalizedLastPart === normalizedInput ||
      slugifiedTitle === slugifiedInput ||
      normalizedTitle === normalizedInput
    );
  }) || null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const experience = await fetchExperience(resolvedParams.slug);

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
  const slug = decodeURIComponent(resolvedParams.slug);
  const experience = await fetchExperience(resolvedParams.slug);

  if (!experience) {
    notFound();
  }

  // Resolve direct PDF url if certificate_url points to a /certificates/ page route
  let certificatePdfUrl = experience.certificate_url;
  if (certificatePdfUrl && !certificatePdfUrl.endsWith(".pdf") && !certificatePdfUrl.startsWith("http") && certificatePdfUrl !== "#") {
    const certSlug = certificatePdfUrl.split("/").pop();
    if (certSlug) {
      const { data: certRow } = await supabase
        .from("certificates")
        .select("pdf_url")
        .eq("slug", certSlug)
        .maybeSingle();
      if (certRow?.pdf_url) {
        certificatePdfUrl = certRow.pdf_url;
      }
    }
  }

  let displayContent = experience.content || "";

  // Transform Team & Contributions / Team Neural Forge into HTML cards
  const teamHeaderRegex = /##\s*(?:Team\s*(?:&|and)\s*Contributions|Team\s*Neural\s*Forge(?:\s*(?:&|and)\s*Synergy)?)/i;
  const teamMatch = displayContent.match(teamHeaderRegex);
  if (teamMatch && teamMatch.index !== undefined) {
    const startIndex = teamMatch.index + teamMatch[0].length;
    const rest = displayContent.slice(startIndex);
    const nextHeaderRegex = /\n\s*##\s+[^\n]+/g;
    const nextMatch = nextHeaderRegex.exec(rest);
    const endIndex = nextMatch ? startIndex + nextMatch.index : displayContent.length;
    
    const teamContent = displayContent.slice(startIndex, endIndex);
    const memberChunks = teamContent.split(/(?=\n\s*!\[)/);
    
    let cards: string[] = [];
    let nonCardText: string[] = [];
    
    for (const chunk of memberChunks) {
      const trimmed = chunk.trim();
      if (!trimmed) continue;
      
      const memberRegex = /^!\[([^\]]+)\]\(([^)]+)\)[\s\r\n]+###\s+(?:👑\s*)?\*?\*?([^\n*]+)\*?\*?[\s\r\n]+([^\n]+)[\s\r\n]*([\s\S]*)$/;
      const m = trimmed.match(memberRegex);
      if (m) {
        const [, alt, src, name, role, details] = m;
        const cleanRole = role.replace(/^\*\*Role:\*\*\s*/i, '').replace(/^\*+|\*+$/g, '').trim();
        const cleanSrc = src && !src.startsWith('http') ? `/assets/${src.split('/').pop()}` : src;
        
        let detailsHTML = '';
        const detailLines = (details || '').split('\n').map((l: string) => l.trim()).filter((l: string) => l !== '');
        if (detailLines.length > 0) {
          if (detailLines[0].startsWith('*') || detailLines[0].startsWith('-')) {
            detailsHTML = '<div class="team-details"><ul class="team-contributions-list team-contributions-margin" style="list-style-type: disc;">' + detailLines.map((l: string) => `<li>${l.replace(/^[\*\-]\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('') + '</ul></div>';
          } else {
            detailsHTML = '<div class="team-details"><p class="team-contribution">' + detailLines.map((l: string) => l.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')).join('<br/>') + '</p></div>';
          }
        }
        
        const isOwner = name.toLowerCase().includes('pranav r');
        const cardClass = isOwner ? 'team-card owner-card' : 'team-card';

        cards.push(
          `<div class="${cardClass}">\n  <div class="team-img-wrapper"><img src="${cleanSrc}" alt="${alt}" class="team-img" loading="lazy" /></div>\n  <div class="team-info">\n    <h3 class="team-name">${name.trim()}</h3>\n    <span class="team-role">${cleanRole}</span>\n    ${detailsHTML}\n  </div>\n</div>`
        );
      } else {
        nonCardText.push(chunk);
      }
    }
    
    if (cards.length > 0) {
      const introHTML = nonCardText.length > 0 ? '\n\n' + nonCardText.join('\n\n') + '\n\n' : '\n\n';
      const gridHTML = introHTML + '<div class="team-grid">\n' + cards.join('\n') + '\n</div>\n\n';
      displayContent = displayContent.slice(0, startIndex) + gridHTML + displayContent.slice(endIndex);
    }
  }

  // Clean up legacy inline "View Certificate" / "View Official Certificate" links at the start of content
  displayContent = displayContent.replace(/^\[View (?:Official )?Certificate\]\(.*?\)\s*\n*/i, '');

  return (
    <main id="main-content">
      <section id="blog-post" className="mobile-spacing" style={{ paddingTop: "10vh", paddingBottom: "10vh", minHeight: "100vh" }}>
        <div className="blog-banner">
          {experience.image_url && (
            <img 
              src={experience.image_url} 
              alt={`${experience.title} Banner`} 
              className="banner-img" 
            />
          )}
          <h1 className="banner-title">{experience.title}</h1>
        </div>
        
        <div className="post-metadata" style={{ display: "flex", justifyContent: "center", gap: "0.75rem", alignItems: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
          <span className="blog-category" style={{ margin: 0 }}>Professional Experience</span>
          
          {experience.tags && Array.isArray(experience.tags) && (
            <div className="tech-stack tech-stack-no-margin" style={{ margin: 0 }}>
              {experience.tags.map((tag: string, idx: number) => (
                <span key={idx} className="tech-tag">{tag}</span>
              ))}
            </div>
          )}
        </div>

        <div className="experience-actions" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.75rem", marginBottom: "2.5rem" }}>
          {certificatePdfUrl && certificatePdfUrl !== "#" && (
            <a 
              href={certificatePdfUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-color-2" 
              style={{ padding: "0.35rem 1.4rem", fontSize: "0.9rem", borderRadius: "2rem", display: "inline-flex", alignItems: "center", textDecoration: "none", fontWeight: "600" }}
            >
              Certificate
            </a>
          )}
          
          <ShareMenu 
            title={experience.title} 
            type="page" 
            downloadUrl={certificatePdfUrl && certificatePdfUrl !== "#" ? certificatePdfUrl : undefined} 
          />
        </div>

        {displayContent ? (
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
                img({ node, src, alt, className, ...props }: any) {
                  // Only team member card avatars inside .team-img-wrapper have class="team-img"
                  const isTeamImage = className?.includes("team-img") || 
                                      node?.properties?.className?.includes("team-img");

                  if (isTeamImage) {
                    const cleanSrc = src && !src.startsWith("http") ? `/assets/${src.split('/').pop()}` : src;
                    return <img src={cleanSrc} alt={alt} className="team-img" loading="lazy" />;
                  }

                  // Unconditionally map all local assets to the /assets/ root directory
                  const absoluteSrc = src && !src.startsWith("http") ? `/assets/${src.split('/').pop()}` : src;

                  if (absoluteSrc?.endsWith(".mp4") || absoluteSrc?.endsWith(".webm")) {
                    const isCrowdVideo = alt?.includes("crowd erupts in joy");
                    return (
                      <div className="video-wrapper mt-0 mb-0" style={{ flex: 1, minWidth: "0", width: "100%", maxWidth: isCrowdVideo ? "800px" : "354px", margin: "0 auto" }}>
                        <video src={absoluteSrc} controls autoPlay loop muted playsInline width="100%" preload="metadata" style={{ display: "block", width: "100%", height: "auto", borderRadius: "1rem" }} />
                        {alt && <figcaption className="post-content-figcaption" style={{ marginTop: "0.75rem", fontSize: "0.95rem", textAlign: "center", fontStyle: "italic" }}>{alt}</figcaption>}
                      </div>
                    );
                  }

                  const srcLower = absoluteSrc.toLowerCase();
                  const altLower = (alt || "").toLowerCase();

                  // Identify portrait/tall photos that need restrained dimensions on desktop
                  // Note: Use boundary checking so 'tea' does not match 'team' or 'teammate'
                  const isPortrait = /(-tea\b|_tea\b|\/tea\b|-carrom|-id-cards|-teamleader|lunch-pic|portrait)/i.test(srcLower) ||
                                     /\b(portrait|badge|id card)\b/i.test(altLower);

                  let imgMaxWidth = "100%";
                  let imgMaxHeight = "640px";

                  if (isPortrait) {
                    imgMaxWidth = "480px";
                    imgMaxHeight = "600px";
                  } else {
                    imgMaxWidth = "100%";
                    imgMaxHeight = "640px";
                  }

                  const captionText = alt && alt.trim() !== "" ? alt.trim() : null;

                  return (
                    <figure className="project-image-container no-margin" style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "2rem auto 2.5rem auto" }}>
                      <img 
                        src={absoluteSrc} 
                        alt={captionText || "Event photo"} 
                        className="grid-img" 
                        loading="lazy" 
                        style={{ 
                          width: "100%",
                          maxWidth: imgMaxWidth, 
                          maxHeight: imgMaxHeight, 
                          borderRadius: "1rem", 
                          display: "block", 
                          objectFit: "cover", 
                          margin: "0 auto",
                          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.12)"
                        }} 
                      />
                      {captionText && (
                        <figcaption 
                          className="post-content-figcaption"
                          style={{ 
                            marginTop: "0.85rem", 
                            fontSize: "1rem", 
                            fontWeight: 500, 
                            textAlign: "center", 
                            fontStyle: "italic", 
                            maxWidth: imgMaxWidth,
                            lineHeight: 1.5,
                            padding: "0 1rem"
                          }}
                        >
                          {captionText}
                        </figcaption>
                      )}
                    </figure>
                  );
                },
                a({ node, href, children, ...props }: any) {
                  const label = children?.toString();
                  if (label === "View Certificate" || label === "Download Certificate") {
                    const isDownload = label === "Download Certificate";
                    return (
                      <div className="btn-container add-margin-bottom" style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', marginTop: isDownload ? '0.75rem' : '-1.5rem', marginBottom: isDownload ? '2.5rem' : '1.5rem', width: '100%' }}>
                        <a href={href} target="_blank" rel="noopener noreferrer" download={isDownload ? true : undefined} className="btn btn-color-2">
                          {children}
                        </a>
                        {!isDownload && (
                          <ShareMenu 
                            title={`${experience.title} Certificate`} 
                            type="page" 
                            downloadUrl={href} 
                            downloadName={href?.split('/').pop() || `${experience.title}_Certificate.pdf`}
                          />
                        )}
                      </div>
                    );
                  }
                  return (
                    <a 
                      href={href} 
                      className="post-content-link" 
                      style={{ color: "#0070f3", textDecoration: "underline", textUnderlineOffset: "3px", fontWeight: 600 }} 
                      {...props}
                    >
                      {children}
                    </a>
                  );
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
                    <figcaption className={className ? `post-content-figcaption ${className}` : "post-content-figcaption"} {...props}>
                      {children}
                    </figcaption>
                  );
                }
              }}
            >
              {displayContent}
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
      </section>

      <section id="contact" className="mobile-spacing" style={{ paddingTop: "4rem", paddingBottom: "4rem", minHeight: "80vh", height: "auto", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 2rem", width: "100%" }}>
          <ContactCTA sourceType="project" sourceSlug={slug} />
        </div>
        

      </section>
    </main>
  );
}
