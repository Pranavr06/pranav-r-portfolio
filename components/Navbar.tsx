"use client";

import { useState, useEffect, useRef } from "react";
import React from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { showToast } from "@/components/Toast";

export default function Navbar({ minimal = false }: { minimal?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const targetId = href.substring(2);
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
      setMenuOpen(false);
    } else if (href === "/" || href.startsWith("/#")) {
      e.preventDefault();
      router.push(href);
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    // Check initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.classList.toggle("dark-theme", savedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.body.classList.add("dark-theme");
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme" && e.newValue) {
        setTheme(e.newValue);
        document.body.classList.toggle("dark-theme", e.newValue === "dark");
      }
    };
    window.addEventListener("storage", handleStorageChange);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        toggleThemeRef.current();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.classList.toggle("dark-theme", newTheme === "dark");
    showToast(`Theme switched to ${newTheme === "light" ? "Light" : "Dark"}`);
  };

  const toggleThemeRef = React.useRef(toggleTheme);
  useEffect(() => {
    toggleThemeRef.current = toggleTheme;
  }, [theme]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const fullNavLinks = [
    { name: "About", href: "/#about" },
    { name: "Experience", href: "/#experience" },
    { name: "Certificates", href: "/#certificate" },
    { name: "Projects", href: "/#projects" },
    { name: "Testimonials", href: "/#testimonials" },
    { name: "Blog", href: "/#blog" },
    { name: "Contact", href: "/#contact" },
  ];

  const isMinimal = minimal || pathname === "/certificates" || pathname === "/projects" || pathname === "/blogs" || pathname.startsWith("/admin") || pathname.startsWith("/projects/");
  
  const navLinks = isMinimal 
    ? (pathname.startsWith("/projects/") && pathname !== "/projects" && pathname !== "/projects/college-projects")
      ? [{ name: "Home", href: "/" }, { name: "College Projects", href: "/projects/college-projects" }] 
      : pathname.startsWith("/projects/college-projects") || pathname.startsWith("/blogs/") || pathname.startsWith("/admin") || pathname.startsWith("/certificates/")
        ? [{ name: "Home", href: "/" }, { name: "Projects", href: "/projects" }] 
        : [{ name: "Home", href: "/" }] 
    : fullNavLinks;

  return (
    <>
      <nav id="desktop-nav">
        <a href="/" className="logo-link" aria-label="Go to homepage">
          <img src="/assets/logo.svg" alt="Pranav R logo" className="logo" />
        </a>
        <div>
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a 
                  href={link.href} 
                  aria-label={`Go to ${link.name} section`} 
                  onClick={link.href !== "/" ? (e) => handleNavClick(e as any, link.href) : undefined}
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li>
              <div className="custom-tooltip-wrapper tooltip-bottom">
                <button
                  className="theme-toggle"
                  onClick={toggleTheme}
                  aria-label="Toggle light or dark theme"
                >
                  {theme === "light" ? "🌙" : "🌞"}
                </button>
                <span className="custom-tooltip">Switch to {theme === "light" ? "Dark" : "Light"} Mode (Ctrl + Alt + L)</span>
              </div>
            </li>
          </ul>
        </div>
      </nav>

      <nav id="hamburger-nav">
        <a href="/" className="logo-link" aria-label="Go to homepage">
          <img src="/assets/logo.svg" alt="Pranav R logo" className="logo" />
        </a>
        <div className="hamburger-menu">
          <div
            className={`hamburger-icon ${menuOpen ? "open" : ""}`}
            role="button"
            onClick={toggleMenu}
            aria-label="Toggle mobile navigation menu"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className={`menu-links ${menuOpen ? "open" : ""}`}>
            <ul>
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="menu-item"
                    onClick={link.href !== "/" ? (e) => handleNavClick(e as any, link.href) : undefined}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <button
                  className="theme-toggle menu-item"
                  onClick={() => {
                    toggleTheme();
                    setMenuOpen(false);
                  }}
                  aria-label="Toggle theme"
                >
                  {theme === "light" ? "🌙 Dark Mode" : "🌞 Light Mode"}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
