"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabaseBrowser } from "@/lib/supabase/client";
import Image from 'next/image';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';

export default function ComparisonQueue() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // FIX: Added .withDefault([]) to prevent "Cannot read length of null"
  const [selectedIds, setSelectedIds] = useQueryState(
    'selectedIds',
    parseAsArrayOf(parseAsString).withDefault([])
  );

  useEffect(() => {
    const fetchQueueDetails = async () => {
      if (selectedIds.length === 0) {
        setBusinesses([]);
        return;
      }
      setLoading(true);
      const { data } = await supabaseBrowser()
        .from('listings')
        .select('id, title, hero_image_url, ai_analysis(growth_score)')
        .in('id', selectedIds);
      
      setBusinesses(data || []);
      setLoading(false);
    };
    fetchQueueDetails();
  }, [selectedIds]);

  const removeFromQueue = (id: string) => {
    setSelectedIds(selectedIds.filter(item => item !== id));
  };

  return (
    <div className="w-full max-w-xs bg-white rounded-lg shadow p-4 flex flex-col gap-4 border border-gray-200">
      <h3 className="font-semibold text-lg">Comparison Queue</h3>
      
      {loading ? (
        <div className="text-sm text-muted-foreground animate-pulse">Updating...</div>
      ) : selectedIds.length === 0 ? (
        <div className="text-sm text-muted-foreground text-center py-8 bg-gray-50 rounded-md border-dashed border-2">
          Select 2+ deals to compare intelligence
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {businesses.map((biz) => (
            <div key={biz.id} className="flex items-center bg-slate-50 rounded px-2 py-2 relative group border border-transparent hover:border-blue-200">
              <div className="w-10 h-10 mr-2 flex-shrink-0 rounded overflow-hidden bg-gray-200 relative">
                {biz.hero_image_url && (
                  <Image 
                    src={biz.hero_image_url} 
                    alt={biz.title} 
                    fill 
                    className="object-cover" 
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate font-medium text-xs">{biz.title}</div>
                {biz.ai_analysis?.growth_score && (
                  <Badge className="mt-1 text-[10px] h-4" variant="secondary">
                    Score: {biz.ai_analysis.growth_score}
                  </Badge>
                )}
              </div>
              <button
                onClick={() => removeFromQueue(biz.id)}
                className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <Button
        className="w-full"
        disabled={selectedIds.length < 2}
        onClick={() => window.location.href = `/platform/compare?ids=${selectedIds.join(",")}`}
      >
        Compare Intelligence
      </Button>
    </div>
  );
}