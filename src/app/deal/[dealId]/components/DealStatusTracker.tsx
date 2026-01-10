"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Check, Lock } from "lucide-react";
import type { DealStatus } from "@/types/deal";

const STAGES: Array<{ id: number; label: string; statusKey: string }> = [
  { id: 1, label: "Discovery", statusKey: "discovery" },
  { id: 2, label: "NDA Signed", statusKey: "nda_signed" },
  { id: 3, label: "Diligence", statusKey: "diligence" },
  { id: 4, label: "Financing", statusKey: "financing" },
  { id: 5, label: "Offer", statusKey: "offer" },
  { id: 6, label: "Closing", statusKey: "closing" },
];

interface DealStatusTrackerProps {
  currentStage: number;
  status: DealStatus;
}

export default function DealStatusTracker({ currentStage, status }: DealStatusTrackerProps) {
  const isCancelled = status === "cancelled";
  const isClosed = status === "closed";

  return (
    <Card className="border-slate-800 bg-[#0B1221]">
      <CardContent className="p-6">
        <div className="w-full overflow-x-auto pb-4">
          <div className="flex items-center justify-between min-w-[800px] relative">
            {/* Progress line (background) */}
            <div 
              className={`absolute top-5 left-0 w-full h-0.5 -z-10 ${
                isCancelled ? "bg-red-500/20" : "bg-slate-800"
              }`}
            />

            {/* Progress line (active) */}
            {!isCancelled && (
              <div
                className={`absolute top-5 left-0 h-0.5 -z-10 transition-all duration-500 ${
                  isClosed ? "bg-green-500" : "bg-blue-600"
                }`}
                style={{
                  width: `${isClosed ? 100 : ((currentStage - 1) / (STAGES.length - 1)) * 100}%`,
                }}
              />
            )}

            {STAGES.map((stage) => {
              const isActive = stage.id === currentStage && !isClosed && !isCancelled;
              const isCompleted = stage.id < currentStage || isClosed;
              const isFuture = stage.id > currentStage && !isClosed && !isCancelled;
              const isCurrentStatus = stage.statusKey === status;

              return (
                <div key={stage.id} className="flex flex-col items-center gap-3">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-[#0B1221]
                      ${
                        isCancelled
                          ? "border-red-500/50 text-red-500/50"
                          : isActive || isCurrentStatus
                          ? "border-blue-600 text-blue-600 shadow-md shadow-blue-600/20 scale-110"
                          : isCompleted
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-slate-700 text-slate-500"
                      }
                    `}
                  >
                    {isCompleted && !isCancelled ? (
                      <Check className="w-5 h-5" />
                    ) : isFuture && stage.id > 3 ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          isActive || isCurrentStatus
                            ? "bg-blue-600"
                            : isCancelled
                            ? "bg-red-500/50"
                            : "bg-slate-600"
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium uppercase tracking-wide transition-colors text-center ${
                      isActive || isCurrentStatus
                        ? "text-blue-400 font-bold"
                        : isCompleted
                        ? "text-green-400"
                        : isCancelled
                        ? "text-red-400/50"
                        : "text-slate-500"
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
