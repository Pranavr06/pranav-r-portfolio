"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type TOCItem = {
  id: string;
  text: string;
  level: number;
};

function extractTOC(content: string): TOCItem[] {
  const headings: TOCItem[] = [];
  const lines = content.split("\n");
  
  lines.forEach((line) => {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      // Create a slug for the id
      const id = text.toLowerCase().replace(/[^\w]+/g, '-');
      headings.push({ id, text, level });
    }
  });
  
  return headings;
}

// Custom renderer to add IDs to headings
const HeadingRenderer = (props: any) => {
  const { level, children } = props;
  const text = Array.isArray(children) 
    ? children.map(c => typeof c === 'string' ? c : c.props?.children || '').join('')
    : typeof children === 'string' ? children : '';
    
  const id = text.toLowerCase().replace(/[^\w]+/g, '-');
  
  const Tag = `h${level}` as any;
  return <Tag id={id} style={{ scrollMarginTop: "80px" }}>{children}</Tag>;
};

export default function MarkdownViewer({ content }: { content: string }) {
  const [toc, setToc] = useState<TOCItem[]>([]);

  useEffect(() => {
    setToc(extractTOC(content));
  }, [content]);

  const scrollToHeading = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div style={{ display: "flex", gap: "2rem", height: "100%", alignItems: "flex-start" }}>
      
      {/* Markdown Content */}
      <div 
        className="markdown-body" 
        style={{ 
          flex: 1, 
          minWidth: 0, 
          padding: "1rem 2rem", 
          background: "var(--admin-bg)", 
          borderRadius: "8px",
          border: "1px solid var(--admin-border)",
          color: "var(--admin-text-main)",
          overflowY: "auto",
          height: "100%"
        }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          .markdown-body h1, .markdown-body h2, .markdown-body h3 {
            color: var(--admin-text-main);
            border-bottom: 1px solid var(--admin-border);
            padding-bottom: 0.3em;
            margin-top: 1.5em;
          }
          .markdown-body h1 { font-size: 2em; }
          .markdown-body h2 { font-size: 1.5em; }
          .markdown-body h3 { font-size: 1.25em; border-bottom: none; }
          .markdown-body a { color: #3b82f6; text-decoration: none; }
          .markdown-body a:hover { text-decoration: underline; }
          .markdown-body pre { background: var(--admin-card-bg); padding: 1em; border-radius: 6px; overflow-x: auto; border: 1px solid var(--admin-border); }
          .markdown-body code { background: var(--admin-card-bg); padding: 0.2em 0.4em; border-radius: 3px; font-family: monospace; font-size: 0.9em; border: 1px solid var(--admin-border); }
          .markdown-body pre code { border: none; padding: 0; }
          .markdown-body blockquote { border-left: 4px solid var(--admin-text-muted); padding-left: 1em; color: var(--admin-text-muted); margin-left: 0; }
          .markdown-body img { max-width: 100%; border-radius: 6px; }
          .markdown-body table { width: 100%; border-collapse: collapse; margin: 1em 0; }
          .markdown-body th, .markdown-body td { border: 1px solid var(--admin-border); padding: 0.5em; text-align: left; }
          .markdown-body th { background: var(--admin-card-hover); }
        `}} />
        <ReactMarkdown 
          components={{
            h1: HeadingRenderer,
            h2: HeadingRenderer,
            h3: HeadingRenderer,
            code(props) {
              const { children, className, node, ...rest } = props;
              const match = /language-(\w+)/.exec(className || '');
              const { ref, ...restWithoutRef } = rest as any;
              return match ? (
                <SyntaxHighlighter
                  {...restWithoutRef}
                  PreTag="div"
                  children={String(children).replace(/\n$/, '')}
                  language={match[1]}
                  style={vscDarkPlus as any}
                  customStyle={{
                    margin: "1em 0",
                    borderRadius: "6px",
                    border: "1px solid var(--admin-border)",
                    fontSize: "0.9em"
                  }}
                />
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              );
            }
          }}
        >
          {content || "*Empty note*"}
        </ReactMarkdown>
      </div>

      {/* Floating TOC */}
      {toc.length > 0 && (
        <div style={{ 
          width: "250px", 
          flexShrink: 0, 
          position: "sticky", 
          top: "0",
          background: "var(--admin-card-bg)",
          padding: "1rem",
          borderRadius: "8px",
          border: "1px solid var(--admin-border)",
          maxHeight: "calc(100vh - 200px)",
          overflowY: "auto"
        }}>
          <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--admin-text-muted)", margin: "0 0 1rem 0", fontWeight: 600 }}>Table of Contents</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {toc.map((item, idx) => (
              <li 
                key={idx} 
                style={{ 
                  paddingLeft: `${(item.level - 1) * 1}rem`,
                  fontSize: item.level === 1 ? "0.95rem" : item.level === 2 ? "0.85rem" : "0.75rem",
                  fontWeight: item.level === 1 ? 500 : 400
                }}
              >
                <a 
                  href={`#${item.id}`} 
                  onClick={(e) => scrollToHeading(item.id, e)}
                  style={{ 
                    color: "var(--admin-text-main)", 
                    textDecoration: "none", 
                    display: "block",
                    opacity: item.level === 1 ? 1 : 0.8,
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#3b82f6"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--admin-text-main)"}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
