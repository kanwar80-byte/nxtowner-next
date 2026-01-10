"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, Sparkles, CheckSquare, Users } from "lucide-react";
import type { DealWorkspaceData } from "@/types/deal";
import DocumentsTab from "./tabs/DocumentsTab";
import AiAnalysisTab from "./tabs/AiAnalysisTab";
import TasksTab from "./tabs/TasksTab";
import PartnersTab from "./tabs/PartnersTab";

interface DealTabsProps {
  activeTab: "documents" | "ai" | "tasks" | "partners";
  onTabChange: (tab: "documents" | "ai" | "tasks" | "partners") => void;
  workspaceData: DealWorkspaceData;
}

const TABS = [
  { id: "documents" as const, label: "Documents", icon: FileText },
  { id: "ai" as const, label: "AI Analysis", icon: Sparkles },
  { id: "tasks" as const, label: "Tasks", icon: CheckSquare },
  { id: "partners" as const, label: "Partners", icon: Users },
];

export default function DealTabs({ activeTab, onTabChange, workspaceData }: DealTabsProps) {
  return (
    <div className="space-y-4">
      {/* Tab buttons */}
      <div className="inline-flex bg-[#0B1221] p-1.5 rounded-lg border border-slate-800 gap-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <Card className="border-slate-800 bg-[#0B1221]">
        <CardContent className="p-6">
          {activeTab === "documents" && <DocumentsTab dealId={workspaceData.deal.id} documents={workspaceData.documents} />}
          {activeTab === "ai" && <AiAnalysisTab dealId={workspaceData.deal.id} aiAnalysis={workspaceData.aiAnalysis} />}
          {activeTab === "tasks" && <TasksTab dealId={workspaceData.deal.id} tasks={workspaceData.tasks} />}
          {activeTab === "partners" && <PartnersTab dealId={workspaceData.deal.id} partners={workspaceData.partners} />}
        </CardContent>
      </Card>
    </div>
  );
}
