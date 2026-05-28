"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './ToastProvider';

interface TestimonialCardMenuProps {
  testimonialId: string;
  ownerId: string;
  testimonialData: any; // for editing
}

export default function TestimonialCardMenu({ testimonialId, ownerId, testimonialData }: TestimonialCardMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
        // Simple client-side hint, backend will actually enforce this
        if (session.user.email === 'pranavkundapura06@gmail.com') {
          setIsAdmin(true);
        }
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/testimonials#${testimonialId}`;
    navigator.clipboard.writeText(url).then(() => {
      addToast('Link copied to clipboard!', 'success');
      setIsOpen(false);
    });
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/testimonials#${testimonialId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this testimonial',
          url: url
        });
        addToast('Shared successfully!', 'success');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          addToast('Failed to share.', 'error');
        }
      }
    } else {
      handleCopyLink();
    }
    setIsOpen(false);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/testimonials/${testimonialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });

      if (!res.ok) throw new Error('Failed to delete');
      
      addToast('Testimonial moved to archives successfully.', 'success');
      setIsDeleteModalOpen(false);
      // Quick reload to refresh the list
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      addToast('Error deleting testimonial. You may not have permission.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = () => {
    sessionStorage.setItem('editTestimonial', JSON.stringify(testimonialData));
    setIsOpen(false);
    
    // Redirect to the form page and scroll
    window.location.href = '/testimonials#testimonial-form';
    // Dispatch custom event in case we are already on the page
    window.dispatchEvent(new Event('testimonial-edit'));
  };



  const isOwner = currentUser?.id === ownerId;

  return (
    <div className="menu-container" ref={menuRef} style={{ position: 'relative' }}>
      <div className="custom-tooltip-wrapper">
        <button 
          className="menu-btn" 
          aria-label="More options" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="12" cy="19" r="1"/>
            <circle cx="12" cy="5" r="1"/>
          </svg>
        </button>
        <span className="custom-tooltip">More options</span>
      </div>

      <div className={`options-menu ${isOpen ? 'open' : ''}`}>
        {isOwner && (
          <button className="menu-option" onClick={handleEditClick}>Edit</button>
        )}
        <button className="menu-option btn-copy-link" onClick={handleCopyLink}>Copy Link</button>
        <button className="menu-option btn-share" onClick={handleShare}>Share</button>
        {(isOwner || isAdmin) && (
          <button className="menu-option" style={{ color: '#d93025' }} onClick={() => { setIsDeleteModalOpen(true); setIsOpen(false); }}>Delete</button>
        )}
      </div>

      {isDeleteModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="details-container color-container" style={{ padding: '2rem', width: '100%', maxWidth: '400px', position: 'relative', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem' }}>Delete Testimonial</h3>
            <p style={{ marginBottom: '0.5rem', fontSize: '0.95rem' }}>Are you sure you want to delete this testimonial?</p>
            <p style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: 'gray' }}>This testimonial will be moved to archives and can be restored later.</p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                disabled={isDeleting}
                style={{ padding: '0.5rem 1.5rem', borderRadius: '0.3rem', border: '1px solid #ccc', background: 'transparent', color: 'var(--text-color)', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                disabled={isDeleting}
                style={{ padding: '0.5rem 1.5rem', borderRadius: '0.3rem', border: 'none', background: '#d93025', color: '#fff', cursor: 'pointer' }}
              >
                {isDeleting ? 'Archiving...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
