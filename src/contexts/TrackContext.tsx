'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Track = 'all' | 'real_world' | 'digital';

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
  initialTrack?: 'real_world' | 'digital';
}) {
  // Initialize state from initialTrack prop (passed from server via cookies)
  // This ensures SSR and client first render match
  // Normalize 'all' to 'real_world' for homepage consistency
  const normalizeTrack = (t: Track): 'real_world' | 'digital' => {
    return t === 'digital' ? 'digital' : 'real_world';
  };
  
  const [track, setTrackState] = useState<Track>(initialTrack || 'real_world');

  // After mount, sync with localStorage if it differs from initialTrack
  // This allows the client to pick up changes made in other tabs/sessions
  // Normalize 'all' to 'real_world' and migrate 'operational' to 'real_world' to prevent homepage desync
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'real_world' || stored === 'digital' || stored === 'all' || stored === 'operational') {
        // Migrate 'operational' to 'real_world' and normalize 'all' to 'real_world' for homepage consistency
        let normalizedStored: 'real_world' | 'digital' = stored === 'digital' ? 'digital' : 'real_world';
        const initialValue = initialTrack || 'real_world';
        
        // Only update if different from initial value
        if (normalizedStored !== initialValue) {
          setTrackState(normalizedStored as Track);
          // Update localStorage to persist normalization/migration
          if (stored === 'all' || stored === 'operational') {
            localStorage.setItem(STORAGE_KEY, 'real_world');
          }
        }
      }
    } catch (error) {
      console.warn('Failed to read track from localStorage:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Persist to localStorage whenever track changes
  // Normalize 'all' to 'real_world' before storing
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      // Track can be 'all' | 'real_world' | 'digital', but we normalize 'all' to 'real_world' for storage
      const normalizedTrack: 'real_world' | 'digital' = track === 'all' || track === 'real_world' ? 'real_world' : 'digital';
      localStorage.setItem(STORAGE_KEY, normalizedTrack);
      // Update state if normalization occurred (track was 'all')
      if (track === 'all') {
        setTrackState('real_world');
      }
    } catch (error) {
      console.warn('Failed to save track to localStorage:', error);
    }
  }, [track]);

  const setTrack = (newTrack: Track) => {
    // Normalize 'all' to 'real_world' for homepage consistency
    const normalized = newTrack === 'all' ? 'real_world' : newTrack;
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


