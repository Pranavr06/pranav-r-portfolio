// Validates a LinkedIn URL. Allows standard profiles and vanity URLs.
export function isValidLinkedInUrl(url: string): boolean {
  if (!url) return false;
  // Allows optional http(s)://, optional www., linkedin.com/in/ followed by letters, numbers, hyphens
  const regex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;
  return regex.test(url.trim());
}

// Validates a GitHub URL. Allows standard profiles.
export function isValidGithubUrl(url: string): boolean {
  if (!url) return false;
  // Allows optional http(s)://, optional www., github.com/ followed by letters, numbers, hyphens
  const regex = /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/;
  return regex.test(url.trim());
}
