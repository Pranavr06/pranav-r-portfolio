/**
 * Utility functions to normalize and sanitize internal URLs across portfolio sections.
 */

export function normalizeExperienceUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed || trimmed === "#") return null;

  // Fix legacy or shortened routes for MY Bharat Budget
  if (
    trimmed === "/experiences/my-bharat-budget" ||
    trimmed === "/experiences/my-bharat-budget-quest-2026" ||
    trimmed === "/experiences/professional-journey/my-bharat-budget"
  ) {
    return "/experiences/professional-journey/my-bharat-budget-quest-2026";
  }

  // Handle cases where /experiences/:slug was provided without professional-journey prefix
  if (
    trimmed.startsWith("/experiences/") &&
    !trimmed.startsWith("/experiences/professional-journey/") &&
    !trimmed.startsWith("/experiences/technical-expertise/")
  ) {
    const slug = trimmed.replace("/experiences/", "");
    return `/experiences/professional-journey/${slug}`;
  }

  return trimmed;
}

export function normalizeProjectUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed || trimmed === "#") return null;

  // Fix marketing prediction project legacy route
  if (
    trimmed === "/college-projects/marketing-prediction-project" ||
    trimmed === "/projects/college-projects/marketing-prediction-project" ||
    trimmed === "/college-projects/marketing-response-prediction"
  ) {
    return "/projects/college-projects/marketing-response-prediction";
  }

  if (trimmed.startsWith("/college-projects/")) {
    return `/projects${trimmed}`;
  }

  return trimmed;
}
