export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  if (!url) return true; // Optional fields return true if empty
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
