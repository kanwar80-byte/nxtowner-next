import { Check, Lock } from "lucide-react";

const STAGES = [
  { id: 1, label: "Discovery" },
  { id: 2, label: "Inquiry" },
  { id: 3, label: "NDA" },
  { id: 4, label: "Diligence" },
  { id: 5, label: "LOI" },
  { id: 6, label: "Closing Prep" },
  { id: 7, label: "Closing" },
  { id: 8, label: "Closed" },
];

export default function DealTracker({ currentStage }: { currentStage: number }) {
  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex items-center justify-between min-w-[700px] relative">
        
        {/* Progress Line (Background) */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-100 -z-10" />

        {/* Progress Line (Active) - Simple calculation for width based on stage */}
        <div 
          className="absolute top-5 left-0 h-0.5 bg-blue-600 -z-10 transition-all duration-500" 
          style={{ width: `${((currentStage - 1) / (STAGES.length - 1)) * 100}%` }}
        />

        {STAGES.map((stage) => {
          const isActive = stage.id === currentStage;
          const isCompleted = stage.id < currentStage;
          const isFuture = stage.id > currentStage;

          return (
            <div key={stage.id} className="flex flex-col items-center gap-3">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-white
                  ${isActive ? "border-blue-600 text-blue-600 shadow-md scale-110" : ""}
                  ${isCompleted ? "border-blue-600 bg-blue-600 text-white" : ""}
                  ${isFuture ? "border-gray-200 text-gray-300" : ""}
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : isFuture && stage.id > 4 ? ( // Show lock for future stages after diligence
                  <Lock className="w-4 h-4" />
                ) : (
                  <div className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-blue-600" : "bg-gray-300"}`} />
                )}
              </div>
              <span
                className={`text-xs font-medium uppercase tracking-wide transition-colors
                  ${isActive ? "text-blue-600 font-bold" : ""}
                  ${isCompleted ? "text-gray-900" : ""}
                  ${isFuture ? "text-gray-300" : ""}
                `}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}