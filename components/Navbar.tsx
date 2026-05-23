"use client";

import { useState, useEffect, useRef } from "react";
import React from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        toggleThemeRef.current();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.body.classList.toggle("dark-theme", newTheme === "dark");
      return newTheme;
    });
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

  const isMinimal = minimal || pathname === "/certificates" || pathname === "/projects" || pathname === "/blogs" || pathname.startsWith("/admin");
  const navLinks = isMinimal ? [{ name: "Home", href: "/" }] : fullNavLinks;

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
                {link.href === "/" ? (
                  <a href={link.href} aria-label={`Go to ${link.name} section`}>
                    {link.name}
                  </a>
                ) : (
                  <Link href={link.href} aria-label={`Go to ${link.name} section`} onClick={(e) => handleNavClick(e, link.href)}>
                    {link.name}
                  </Link>
                )}
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
                  {link.href === "/" ? (
                    <a
                      href={link.href}
                      className="menu-item"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="menu-item"
                      onClick={(e) => handleNavClick(e, link.href)}
                    >
                      {link.name}
                    </Link>
                  )}
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
