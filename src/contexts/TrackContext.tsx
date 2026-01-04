'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Track = 'all' | 'operational' | 'digital';

interface TrackContextType {
  track: Track;
  setTrack: (track: Track) => void;
}

const TrackContext = createContext<TrackContextType | undefined>(undefined);

const STORAGE_KEY = 'nx_track';

export function TrackProvider({ 
  children, 
  initialTrack 
}: { 
  children: ReactNode;
  initialTrack?: 'operational' | 'digital';
}) {
  // Initialize state from initialTrack prop (passed from server via cookies)
  // This ensures SSR and client first render match
  const [track, setTrackState] = useState<Track>(initialTrack || 'operational');

  // After mount, sync with localStorage if it differs from initialTrack
  // This allows the client to pick up changes made in other tabs/sessions
  // Use a ref to track if we've already synced to avoid issues with dependency array
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'operational' || stored === 'digital' || stored === 'all') {
        // Only update if different from initial value (initialTrack or 'operational' default)
        const initialValue = initialTrack || 'operational';
        if (stored !== initialValue) {
          setTrackState(stored as Track);
        }
      }
    } catch (error) {
      console.warn('Failed to read track from localStorage:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Persist to localStorage whenever track changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, track);
    } catch (error) {
      console.warn('Failed to save track to localStorage:', error);
    }
  }, [track]);

  const setTrack = (newTrack: Track) => {
    setTrackState(newTrack);
  };

  return (
    <TrackContext.Provider value={{ track, setTrack }}>
      {children}
    </TrackContext.Provider>
  );
}

export function useTrack() {
  const context = useContext(TrackContext);
  if (context === undefined) {
    throw new Error('useTrack must be used within a TrackProvider');
  }
  return context;
}


