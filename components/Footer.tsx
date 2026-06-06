"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavLinks } from "@/lib/navUtils";
import ScrollArrow from "@/components/ScrollArrow";

export default function Footer() {
  const pathname = usePathname();
  const isMinimal = pathname === "/certificates" || pathname === "/projects" || pathname === "/blogs" || pathname.startsWith("/admin") || pathname.startsWith("/projects/") || pathname.startsWith("/blogs/") || pathname.startsWith("/certificates/");

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

  const navLinks = getNavLinks(pathname, fullNavLinks);

  if (pathname?.startsWith('/admin')) return null;

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
      {!pathname?.startsWith('/admin') && (
        <ScrollArrow direction="up" targetId="top" altText="Back to top" />
      )}
    </footer>
  );
}
