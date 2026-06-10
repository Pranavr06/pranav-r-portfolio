import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import GithubSlugger from "github-slugger";
import ContactCTA from "@/components/ContactCTA";
import ShareMenu from "@/components/ShareMenu";
import TableOfContents from "@/components/TableOfContents";
import CodeBlock from "@/components/CodeBlock";
import { Metadata } from "next";
import Script from "next/script";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const { data: blog } = await supabase.from("blogs").select("*").eq("slug", slug).single();
  if (!blog) return { title: 'Blog Not Found' };
  
  return {
    title: `${blog.title} | Pranav R`,
    description: blog.excerpt || blog.description || `Read ${blog.title} by Pranav R.`,
    openGraph: {
      title: `${blog.title} | Pranav R`,
      description: blog.excerpt || blog.description || `Read ${blog.title} by Pranav R.`,
      url: `https://pranavr.netlify.app/blogs/${slug}`,
      images: blog.image_url ? [{ url: blog.image_url }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${blog.title} | Pranav R`,
      description: blog.excerpt || blog.description || `Read ${blog.title} by Pranav R.`,
      images: blog.image_url ? [blog.image_url] : [],
    },
    alternates: {
      canonical: `https://pranavr.netlify.app/blogs/${slug}`,
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !blog) {
    notFound();
  }

  // 1. Extract headings for TOC
  const slugger = new GithubSlugger();
  const headings: { id: string; text: string; level: number; index?: number }[] = [];
  
  // Find Atx headings (## Heading)
  const atxRegex = /^(#{2,3})\s+(.+)$/gm;
  let match;
  while ((match = atxRegex.exec(blog.content)) !== null) {
    headings.push({
      id: slugger.slug(match[2].trim()),
      text: match[2].trim(),
      level: match[1].length,
      index: match.index
    });
  }
  
  // Find Setext headings (Heading\n------)
  // \r? is necessary before the \n because Windows newlines will leave a \r at the end of the match otherwise
  const setextRegex = /^([^\n\r]+)\r?\n(-{3,}|={3,})$/gm;
  while ((match = setextRegex.exec(blog.content)) !== null) {
    // Only consider it a heading if it doesn't look like a markdown list or blockquote
    const text = match[1].trim();
    if (text && !text.startsWith('-') && !text.startsWith('>')) {
      const level = match[2].startsWith('=') ? 1 : 2;
      if (level === 2) {
        headings.push({
          id: slugger.slug(text),
          text: text,
          level: 2,
          index: match.index
        });
      }
    }
  }

  // Sort headings by their appearance in the text
  headings.sort((a, b) => (a as any).index - (b as any).index);

  // Filter out the 'Table of Contents' heading itself
  const filteredHeadings = headings.filter(h => !h.text.toLowerCase().includes('table of contents') && !h.text.toLowerCase().includes('contents'));

  // Sanitize rogue "Copy" text that was accidentally copy-pasted into the DB from ChatGPT code blocks
  // Also escape HTML tags wrapped in bold asterisks (e.g. **<header>**) so rehypeRaw doesn't hide them
  const cleanBlogContent = blog.content
    .replace(/\r?\nCopy\r?\n/g, '\n\n')
    .replace(/\*\*\<([a-zA-Z0-9]+)\>\*\*/g, '**&lt;$1&gt;**');

  // 2. Split content to place the new TOC where the old one was
  let beforeContent = "";
  let afterContent = cleanBlogContent;
  
  // Match "### Table of Contents", followed by any characters, until we hit two newlines and a word character or #
  const oldTocRegex = /###?\s+(?:Table of\s+)?Contents[\s\S]*?(?=\r?\n\r?\n[a-zA-Z0-9#])/i;
  
  const tocMatch = cleanBlogContent.match(oldTocRegex);
  if (tocMatch && tocMatch.index !== undefined) {
    beforeContent = cleanBlogContent.substring(0, tocMatch.index);
    afterContent = cleanBlogContent.substring(tocMatch.index + tocMatch[0].length);
  } else {
    // Fallback: Just put the TOC at the very beginning of the content if we can't find the old one
    beforeContent = "";
    afterContent = cleanBlogContent;
  }

  const mdIndex = blog.content ? blog.content.indexOf('\n\n') : -1;
  const blogContentMarkdown = mdIndex !== -1 ? blog.content.substring(mdIndex + 2) : blog.content || "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "image": [
      blog.image_url ? blog.image_url : "https://pranavr.netlify.app/assets/pranavr-og-image.png"
    ],
    "datePublished": blog.created_at,
    "dateModified": blog.updated_at || blog.created_at,
    "author": [{
        "@type": "Person",
        "name": "Pranav R",
        "url": "https://pranavr.netlify.app/"
      }]
  };

  return (
    <main>
      <Script
        id={`blog-schema-${blog.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section id="blog-post" className="mobile-spacing" style={{ paddingTop: "10vh", paddingBottom: "10vh", minHeight: "100vh" }}>
        <header className="blog-banner" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <img 
            src={blog.image_url} 
            alt={blog.title} 
            className="banner-img" 
            style={{ width: "100%", maxHeight: "500px", objectFit: "cover", borderRadius: "1rem", marginBottom: "2rem" }}
          />
          <h1 className="title banner-title" style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{blog.title}</h1>
        </header>

        <div className="post-metadata" style={{ display: "flex", justifyContent: "center", gap: "1.5rem", color: "#666", marginBottom: "3rem", flexWrap: "wrap", alignItems: "center" }}>
          <span className="post-category" style={{ fontWeight: "bold" }}>{blog.category}</span>
          <span className="reading-time">{blog.read_time_minutes} min read</span>
          <span className="post-date">{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <span className="post-author">By Pranav R</span>
          <ShareMenu title={blog.title} slug={blog.slug} type="blogs" />
        </div>

        <div className="post-content-container" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div className="post-content">
            {beforeContent && (
              <ReactMarkdown 
                rehypePlugins={[rehypeRaw, rehypeSlug]}
                components={{
                  pre: ({ node, ...props }) => <CodeBlock {...props} />
                }}
              >
                {beforeContent}
              </ReactMarkdown>
            )}
            
            <TableOfContents headings={filteredHeadings} />
            
            <ReactMarkdown 
              rehypePlugins={[rehypeRaw, rehypeSlug]}
              components={{
                pre: ({ node, ...props }) => <CodeBlock {...props} />
              }}
            >
              {afterContent}
            </ReactMarkdown>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "4rem", marginBottom: "4rem" }}>
          <Link href="/blogs" className="btn btn-color-2">
            &larr; Back to all blogs
          </Link>
        </div>
      </section>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 2rem" }}>
        <ContactCTA sourceType="blog" sourceSlug={blog.slug} purpose="Blog Discussion" ctaText={`Discuss "${blog.title}"`} />
      </div>
    </main>
  );
}
