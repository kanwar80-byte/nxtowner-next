"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * V17 Search Bar Component
 * Navigates to /search?q= on submit (does not call API directly)
 */
export default function SearchBarV17() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Navigate to search page with query
    const encoded = encodeURIComponent(query.trim());
    router.push(`/search?q=${encoded}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search businesses, categories, locations..."
            className="pl-10 h-12 bg-white dark:bg-zinc-900 border-slate-300 dark:border-zinc-700"
          />
        </div>
        <Button type="submit" className="h-12 px-6">
          Search
        </Button>
      </div>
    </form>
  );
}


