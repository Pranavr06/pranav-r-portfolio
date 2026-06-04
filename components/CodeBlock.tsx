"use client";

import { useState, useRef, useEffect } from "react";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  isAccordion?: boolean;
}

export default function CodeBlock({ children, isAccordion = false, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const handleCopy = () => {
    if (preRef.current) {
      // Get the text content from the inner <code> block, ignoring the button text
      const codeElement = preRef.current.querySelector("code");
      const textToCopy = codeElement ? codeElement.innerText : preRef.current.innerText;
      
      navigator.clipboard.writeText(textToCopy.trim()).then(() => {
        setCopied(true);
      });
    }
  };

  const codeContent = (
    <pre 
      ref={preRef} 
      {...props} 
      style={isAccordion ? { 
        marginTop: 0, 
        borderTopLeftRadius: 0, 
        borderTopRightRadius: 0,
        borderTop: 'none'
      } : { ...props.style, position: 'relative' }}
    >
      <button 
        className={`copy-code-btn ${copied ? 'copied' : ''}`} 
        onClick={handleCopy}
        aria-label="Copy code to clipboard"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      {children}
    </pre>
  );

  if (!isAccordion) {
    return codeContent;
  }

  return (
    <div className="code-accordion-container" style={{ marginBottom: "1.5rem" }}>
      <button 
        className="code-accordion-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '1rem 1.5rem',
          borderRadius: isOpen ? '0.75rem 0.75rem 0 0' : '0.75rem',
          cursor: 'pointer',
          fontWeight: '700',
          fontSize: '1.05rem',
          transition: 'all 0.2s ease',
          outline: 'none',
          boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isOpen ? "👇" : "👉"} {isOpen ? "Hide Full Code" : "View Full Code"}
        </span>
        <span style={{ fontSize: '1.4rem', fontWeight: 'bold', lineHeight: 1 }}>
          {isOpen ? "−" : "+"}
        </span>
      </button>

      {isOpen && codeContent}
    </div>
  );
}
