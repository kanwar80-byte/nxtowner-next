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
  // Normalize 'all' to 'operational' for homepage consistency
  const normalizeTrack = (t: Track): 'operational' | 'digital' => {
    return t === 'digital' ? 'digital' : 'operational';
  };
  
  const [track, setTrackState] = useState<Track>(initialTrack || 'operational');

  // After mount, sync with localStorage if it differs from initialTrack
  // This allows the client to pick up changes made in other tabs/sessions
  // Normalize 'all' to 'operational' to prevent homepage desync
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'operational' || stored === 'digital' || stored === 'all') {
        // Normalize 'all' to 'operational' for homepage consistency
        const normalizedStored = stored === 'all' ? 'operational' : stored;
        const initialValue = initialTrack || 'operational';
        
        // Only update if different from initial value
        if (normalizedStored !== initialValue) {
          setTrackState(normalizedStored as Track);
          // Update localStorage to persist normalization
          if (stored === 'all') {
            localStorage.setItem(STORAGE_KEY, 'operational');
          }
        }
      }
    } catch (error) {
      console.warn('Failed to read track from localStorage:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Persist to localStorage whenever track changes
  // Normalize 'all' to 'operational' before storing
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      // Track can be 'all' | 'operational' | 'digital', but we normalize 'all' to 'operational' for storage
      const normalizedTrack: 'operational' | 'digital' = track === 'all' || track === 'operational' ? 'operational' : 'digital';
      localStorage.setItem(STORAGE_KEY, normalizedTrack);
      // Update state if normalization occurred (track was 'all')
      if (track === 'all') {
        setTrackState('operational');
      }
    } catch (error) {
      console.warn('Failed to save track to localStorage:', error);
    }
  }, [track]);

  const setTrack = (newTrack: Track) => {
    // Normalize 'all' to 'operational' for homepage consistency
    const normalized = newTrack === 'all' ? 'operational' : newTrack;
    setTrackState(normalized);
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


