'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/utils/supabase/client';
import { getSavedCount } from '@/lib/buyer/savedListings';
import { CheckCircle, Circle } from 'lucide-react';

interface GettingStartedProgress {
  hasBrowsed: boolean | null;
  hasSaved3: boolean;
  hasSignedNda: boolean | null;
  hasSentEnquiry: boolean | null;
}

export default function GettingStartedCard() {
  const [progress, setProgress] = useState<GettingStartedProgress>({
    hasBrowsed: null,
    hasSaved3: false,
    hasSignedNda: null,
    hasSentEnquiry: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProgress = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Check browse (listing_view event in last 7d)
        let hasBrowsed: boolean | null = null;
        try {
          const { count } = await supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .eq('event_name', 'listing_view')
            .eq('user_id', user.id)
            .gte('created_at', sevenDaysAgo.toISOString());
          hasBrowsed = (count || 0) > 0;
        } catch {
          // RLS or table missing - show null
        }

        // Check saved 3 listings (localStorage)
        const savedCount = getSavedCount();
        const hasSaved3 = savedCount >= 3;

        // Check NDA signed (nda_signed event in last 30d)
        let hasSignedNda: boolean | null = null;
        try {
          const { count } = await supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .eq('event_name', 'nda_signed')
            .eq('user_id', user.id)
            .gte('created_at', thirtyDaysAgo.toISOString());
          hasSignedNda = (count || 0) > 0;
        } catch {
          // RLS or table missing - show null
        }

        // Check enquiry sent (enquiry_sent event in last 30d)
        let hasSentEnquiry: boolean | null = null;
        try {
          const { count } = await supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .eq('event_name', 'enquiry_sent')
            .eq('user_id', user.id)
            .gte('created_at', thirtyDaysAgo.toISOString());
          hasSentEnquiry = (count || 0) > 0;
        } catch {
          // RLS or table missing - show null
        }

        setProgress({ hasBrowsed, hasSaved3, hasSignedNda, hasSentEnquiry });
      } catch (err) {
        // Fail gracefully
      } finally {
        setLoading(false);
      }
    };

    checkProgress();
    
    // Re-check saved count periodically and on storage events
    const handleStorageChange = () => {
      const savedCount = getSavedCount();
      setProgress(prev => ({ ...prev, hasSaved3: savedCount >= 3 }));
    };
    
    // Listen for storage events (cross-tab)
    window.addEventListener('storage', handleStorageChange);
    
    // Poll for localStorage changes (same-tab updates)
    const interval = setInterval(() => {
      const savedCount = getSavedCount();
      setProgress(prev => {
        if (prev.hasSaved3 !== (savedCount >= 3)) {
          return { ...prev, hasSaved3: savedCount >= 3 };
        }
        return prev;
      });
    }, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 mb-8">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-slate-700 rounded w-1/3"></div>
          <div className="h-4 bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  const steps = [
    {
      label: 'Browse listings',
      completed: progress.hasBrowsed === true,
      pending: progress.hasBrowsed === null,
    },
    {
      label: 'Save 3 listings',
      completed: progress.hasSaved3,
      pending: false,
    },
    {
      label: 'Sign 1 NDA',
      completed: progress.hasSignedNda === true,
      pending: progress.hasSignedNda === null,
    },
    {
      label: 'Send 1 enquiry',
      completed: progress.hasSentEnquiry === true,
      pending: progress.hasSentEnquiry === null,
    },
  ];

  const completedCount = steps.filter(s => s.completed).length;

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Getting Started</h2>
        <span className="text-sm text-slate-400">{completedCount} of 4 complete</span>
      </div>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            {step.completed ? (
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-slate-500 flex-shrink-0" />
            )}
            <span className={`text-sm ${step.completed ? 'text-green-400' : step.pending ? 'text-slate-500' : 'text-slate-300'}`}>
              {step.label}
              {step.pending && <span className="ml-2 text-xs">(Tracking warming up)</span>}
            </span>
          </div>
        ))}
      </div>
      {progress.hasBrowsed === null || progress.hasSignedNda === null || progress.hasSentEnquiry === null ? (
        <p className="mt-4 text-xs text-slate-500">
          Some tracking data may be unavailable. This is normal during setup.
        </p>
      ) : null}
    </div>
  );
}

