/**
 * Checks if a given email belongs to an administrator.
 * Uses the NEXT_PUBLIC_ADMIN_EMAILS environment variable (comma-separated list).
 * Fallback to ADMIN_EMAIL for backward compatibility.
 */
export const checkIsAdmin = (email: string | undefined | null): boolean => {
  if (!email) return false;
  
  const envEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS || process.env.ADMIN_EMAIL || "pranavkundapura06@gmail.com,pranavkundapura18@gmail.com";
  
  const adminEmails = envEmails.split(",").map(e => e.trim().toLowerCase());
  return adminEmails.includes(email.toLowerCase());
};
