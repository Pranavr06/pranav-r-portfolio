export type NavLink = { name: string; href: string };

export function getNavLinks(pathname: string, fullNavLinks: NavLink[]): NavLink[] {
  const isMinimal = 
    pathname === "/contact" ||
    pathname === "/certificates" || 
    pathname === "/projects" || 
    pathname === "/blogs" || 
    pathname === "/testimonials" ||
    pathname === "/college-projects" ||
    pathname.startsWith("/admin") || 
    pathname.startsWith("/projects/") || 
    pathname.startsWith("/blogs/") || 
    pathname.startsWith("/certificates/") ||
    pathname.startsWith("/college-projects/") ||
    pathname.startsWith("/experiences");

  if (!isMinimal) {
    return fullNavLinks;
  }

  // 1. Main Projects Page
  if (pathname === "/projects") {
    return [{ name: "Home", href: "/" }];
  }

  // 2. Individual Project Pages
  if (pathname.startsWith("/projects/") && pathname !== "/projects") {
    return [{ name: "Home", href: "/" }, { name: "Projects", href: "/projects" }];
  }

  // 3. College Projects Main Page
  if (pathname === "/college-projects") {
    return [{ name: "Home", href: "/" }, { name: "Projects", href: "/projects" }];
  }

  // 4. Individual College Project Pages
  if (pathname.startsWith("/college-projects/") && pathname !== "/college-projects") {
    return [{ name: "Home", href: "/" }, { name: "College Projects", href: "/college-projects" }];
  }

  // Blogs logic
  if (pathname === "/blogs") {
    return [{ name: "Home", href: "/" }];
  }
  if (pathname.startsWith("/blogs/") && pathname !== "/blogs") {
    return [{ name: "Home", href: "/" }, { name: "Blogs", href: "/blogs" }];
  }

  // Testimonials logic
  if (pathname === "/testimonials") {
    return [{ name: "Home", href: "/" }];
  }

  // Certificates logic
  if (pathname === "/certificates") {
    return [{ name: "Home", href: "/" }];
  }
  if (pathname.startsWith("/certificates/") && pathname !== "/certificates") {
    return [{ name: "Home", href: "/" }, { name: "Certificates", href: "/certificates" }];
  }

  // Experiences logic
  if (pathname === "/experiences") {
    return [{ name: "Home", href: "/" }];
  }
  if (pathname === "/experiences/professional-journey") {
    return [{ name: "Home", href: "/" }, { name: "Experiences Hub", href: "/experiences" }];
  }
  if (pathname.startsWith("/experiences/")) {
    return [{ name: "Home", href: "/" }, { name: "Professional Journey", href: "/experiences/professional-journey" }];
  }

  // Default fallback for minimal layout
  return [{ name: "Home", href: "/" }];
}
