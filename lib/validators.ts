// Validates a LinkedIn URL. Allows standard profiles and vanity URLs.
export function isValidLinkedInUrl(url: string): boolean {
  if (!url) return false;
  // Relaxed validation: accept any link containing 'linkedin'
  return url.toLowerCase().includes('linkedin');
}

// Validates a GitHub URL. Allows standard profiles.
export function isValidGithubUrl(url: string): boolean {
  if (!url) return false;
  // Relaxed validation: accept any link containing 'github'
  return url.toLowerCase().includes('github');
}
