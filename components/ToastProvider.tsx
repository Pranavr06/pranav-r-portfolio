"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 9999,
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              color: '#fff',
              background: toast.type === 'success' ? '#188038' : toast.type === 'error' ? '#d93025' : '#333',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minWidth: '250px',
              maxWidth: '400px',
              animation: 'fadeIn 0.3s ease-out forwards',
            }}
          >
            <span style={{ fontSize: '0.95rem' }}>{toast.message}</span>
            <button 
              onClick={() => removeToast(toast.id)} 
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7, marginLeft: '15px' }}
              aria-label="Close toast"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
