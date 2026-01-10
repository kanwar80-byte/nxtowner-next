"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Deal } from "@/types/deal";

interface ComparePickerProps {
  selectedDealIds: string[];
  onDealIdsChange: (dealIds: string[]) => void;
  existingDeals: Deal[];
}

export default function ComparePicker({
  selectedDealIds,
  onDealIdsChange,
  existingDeals,
}: ComparePickerProps) {
  const selectedDeals = existingDeals.filter(deal => selectedDealIds.includes(deal.id));
  const maxDeals = 4;

  const handleRemove = (dealId: string) => {
    onDealIdsChange(selectedDealIds.filter(id => id !== dealId));
  };

  const canAddMore = selectedDealIds.length < maxDeals;

  return (
    <Card className="border-slate-800 bg-[#0B1221]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">
          Selected Deals ({selectedDealIds.length}/{maxDeals})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedDeals.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">
            No deals selected. Add deals from the browse page to compare.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedDeals.map((deal) => (
              <Badge
                key={deal.id}
                variant="outline"
                className="border-blue-500/20 bg-blue-500/10 text-blue-400 px-3 py-1.5 flex items-center gap-2"
              >
                <span className="text-sm">{deal.listing?.title || deal.id.slice(0, 8)}</span>
                <button
                  onClick={() => handleRemove(deal.id)}
                  className="ml-1 hover:text-red-400 transition-colors"
                  aria-label={`Remove ${deal.listing?.title || deal.id}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        {!canAddMore && (
          <p className="text-xs text-amber-400 mt-3">
            Maximum {maxDeals} deals can be compared at once.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
