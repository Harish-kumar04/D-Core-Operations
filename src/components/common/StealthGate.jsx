import React, { useState, useEffect } from 'react';

/**
 * NOTE: StealthGate is a COSMETIC UI HIDING feature only (stealth screen lock).
 * It is NOT a security control. Real access control and authorization are handled
 * exclusively by Supabase Auth and Row Level Security (RLS) policies.
 */

const STEALTH_KEY = 'dcore_stealth_unlocked';

export const lockStealthMode = () => {
  try {
    localStorage.removeItem(STEALTH_KEY);
  } catch (e) {
    console.error(e);
  }
  window.location.href = window.location.origin;
};

export const StealthGate = ({ children }) => {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    try {
      // 1. Check secret URL parameters or hash
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash.toLowerCase();

      if (
        params.has('access') ||
        params.has('team') ||
        params.has('login') ||
        params.has('secret') ||
        params.has('dcore') ||
        hash.includes('dcore') ||
        hash.includes('login') ||
        hash.includes('team')
      ) {
        localStorage.setItem(STEALTH_KEY, 'true');
        return true;
      }

      // 2. Check saved stealth status in localStorage
      return localStorage.getItem(STEALTH_KEY) === 'true';
    } catch (e) {
      return false;
    }
  });

  // Listener for secret keyboard shortcut (Ctrl + Shift + D) or secret sequence "dcore" or triple-click
  useEffect(() => {
    if (isUnlocked) return;

    let typedSequence = '';
    let clickCount = 0;
    let clickTimer = null;

    const unlock = () => {
      setIsUnlocked(true);
      try {
        localStorage.setItem(STEALTH_KEY, 'true');
      } catch (e) {
        console.error(e);
      }
    };

    const handleKeyDown = (e) => {
      // Shortcut: Ctrl + Shift + D or Alt + Shift + D
      if ((e.ctrlKey || e.metaKey || e.altKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        unlock();
        return;
      }

      // Typing sequence 'dcore'
      typedSequence += e.key.toLowerCase();
      if (typedSequence.length > 10) {
        typedSequence = typedSequence.slice(-10);
      }
      if (typedSequence.includes('dcore')) {
        unlock();
      }
    };

    const handleTripleClick = () => {
      clickCount += 1;
      if (clickTimer) clearTimeout(clickTimer);
      if (clickCount >= 3) {
        unlock();
        clickCount = 0;
      } else {
        clickTimer = setTimeout(() => {
          clickCount = 0;
        }, 800);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleTripleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleTripleClick);
      if (clickTimer) clearTimeout(clickTimer);
    };
  }, [isUnlocked]);

  // If public visitor (not unlocked), render a COMPLETELY BLANK PAGE
  if (!isUnlocked) {
    return (
      <div
        className="min-h-screen bg-white w-full h-full cursor-default select-none"
        aria-hidden="true"
      >
        {/* 100% Blank Empty Screen for Public Visitors */}
      </div>
    );
  }

  return children;
};
