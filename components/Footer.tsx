"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isMinimal = pathname === "/certificates" || pathname === "/projects" || pathname === "/blogs" || pathname.startsWith("/admin") || pathname.startsWith("/projects/");

  const fullNavLinks = [
    { name: "About", href: "/#about" },
    { name: "Experience", href: "/#experience" },
    { name: "Certificates", href: "/#certificate" },
    { name: "Projects", href: "/#projects" },
    { name: "Testimonials", href: "/#testimonials" },
    { name: "Blog", href: "/#blog" },
    { name: "Contact", href: "/#contact" },
    { name: "Admin", href: "/admin" },
  ];

  const navLinks = isMinimal 
    ? (pathname.startsWith("/projects/") && pathname !== "/projects" && pathname !== "/projects/college-projects")
      ? [{ name: "Home", href: "/" }, { name: "College Projects", href: "/projects/college-projects" }] 
      : pathname.startsWith("/projects/college-projects") || pathname.startsWith("/blogs/") || pathname.startsWith("/admin") || pathname.startsWith("/certificates/")
        ? [{ name: "Home", href: "/" }, { name: "Projects", href: "/projects" }] 
        : [{ name: "Home", href: "/" }] 
    : fullNavLinks;

  return (
    <footer>
      <nav>
        <div className="nav-links-container">
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} aria-label={`Go to ${link.name} section`}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <p id="copyright">
        Copyright © {new Date().getFullYear()}{" "}
        <Link href="/" className="no-underline" aria-label="Go to Pranav R's homepage">
          Pranav R
        </Link>{" "}
        - All rights reserved.
      </p>
    </footer>
  );
}
