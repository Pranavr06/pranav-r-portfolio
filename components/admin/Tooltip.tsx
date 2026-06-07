"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export default function Tooltip({ content, children, position = "top", delay = 300 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const calculateCoords = () => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    let top = 0;
    let left = 0;

    // Simple estimation; effect will adjust precisely once rendered
    if (position === "top") {
      top = rect.top + window.scrollY - 8;
      left = rect.left + window.scrollX + rect.width / 2;
    } else if (position === "bottom") {
      top = rect.bottom + window.scrollY + 8;
      left = rect.left + window.scrollX + rect.width / 2;
    } else if (position === "left") {
      top = rect.top + window.scrollY + rect.height / 2;
      left = rect.left + window.scrollX - 8;
    } else if (position === "right") {
      top = rect.top + window.scrollY + rect.height / 2;
      left = rect.right + window.scrollX + 8;
    }

    setCoords({ top, left });
  };

  const showTooltip = () => {
    const id = setTimeout(() => {
      calculateCoords();
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      const handleScroll = () => calculateCoords();
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleScroll);
      };
    }
  }, [isVisible, position]);

  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      const tRect = tooltipRef.current.getBoundingClientRect();
      const rect = wrapperRef.current!.getBoundingClientRect();
      let top = 0;
      let left = 0;
      
      if (position === "top") {
        top = rect.top + window.scrollY - tRect.height - 8;
        left = rect.left + window.scrollX + rect.width / 2 - tRect.width / 2;
      } else if (position === "bottom") {
        top = rect.bottom + window.scrollY + 8;
        left = rect.left + window.scrollX + rect.width / 2 - tRect.width / 2;
      } else if (position === "left") {
        top = rect.top + window.scrollY + rect.height / 2 - tRect.height / 2;
        left = rect.left + window.scrollX - tRect.width - 8;
      } else if (position === "right") {
        top = rect.top + window.scrollY + rect.height / 2 - tRect.height / 2;
        left = rect.right + window.scrollX + 8;
      }
      setCoords({ top, left });
    }
  }, [isVisible, position, content]);

  return (
    <>
      <div 
        className="admin-tooltip-wrapper" 
        ref={wrapperRef}
        onMouseEnter={showTooltip} 
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        style={{ display: "inline-block" }}
      >
        {children}
      </div>
      {isVisible && typeof window !== "undefined" && createPortal(
        <div 
          ref={tooltipRef}
          className={`admin-tooltip portal-tooltip`}
          style={{ 
            top: `${coords.top}px`, 
            left: `${coords.left}px`,
            position: "absolute",
            zIndex: 99999,
            pointerEvents: "none"
          }}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
}
