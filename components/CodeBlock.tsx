"use client";

import { useState, useRef, useEffect } from "react";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {}

export default function CodeBlock({ children, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
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

  return (
    <pre ref={preRef} {...props}>
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
}
