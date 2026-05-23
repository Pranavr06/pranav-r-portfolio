"use client";

import { useEffect, useState } from "react";

export function showToast(message: string) {
  if (typeof window !== "undefined") {
    const event = new CustomEvent('show-toast', { detail: message });
    window.dispatchEvent(event);
  }
}

export default function ToastContainer() {
  const [toast, setToast] = useState<{message: string, id: number} | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleToast = (e: any) => {
      setToast({ message: e.detail, id: Date.now() });
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => setToast(null), 3000);
    };

    window.addEventListener('show-toast', handleToast);
    return () => {
      window.removeEventListener('show-toast', handleToast);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  if (!toast) return null;

  return (
    <div key={toast.id} className="toast-notification show">
      {toast.message}
    </div>
  );
}
