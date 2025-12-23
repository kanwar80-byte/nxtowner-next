"use client";

import { FileText, Lock, MessageCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LOIModal from "./LOIModal";
import MessageModal from "./MessageModal";
import NDAModal from "./NDAModal";

type Props = {
  dealId: string;
  initialNdaStatus: boolean;
};

export default function SmartActionCenter({ dealId, initialNdaStatus }: Props) {
  const router = useRouter();
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isLOIOpen, setIsLOIOpen] = useState(false);
  const [isNDAOpen, setIsNDAOpen] = useState(false);
  
  // Initialize state with the Server Data
  const [isNDASigned, setIsNDASigned] = useState(initialNdaStatus);

  const handleNDASigned = () => {
    // 1. Update the local button state immediately (Visual feedback)
    setIsNDASigned(true);
    
    // 2. Force the page to refresh data (Unlocks the SecureVault component)
    router.refresh(); 
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
        
        <div className="space-y-3">
          {/* 1. Send Message (Always Available) */}
          <button
            onClick={() => setIsMessageOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Send Message
          </button>

          {/* 2. NDA Logic */}
          {!isNDASigned ? (
            <button
              onClick={() => setIsNDAOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-4 py-2.5 rounded-lg font-medium transition-colors"
            >
              <Lock className="w-4 h-4" />
              Sign NDA to Unlock
            </button>
          ) : (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-medium">Vault Unlocked</span>
            </div>
          )}

          {/* 3. LOI Logic (Locked until NDA signed) */}
          <button
            onClick={() => isNDASigned && setIsLOIOpen(true)}
            disabled={!isNDASigned}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors border ${
              isNDASigned
                ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                : "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FileText className="w-4 h-4" />
            Submit LOI
          </button>
        </div>
      </div>

      {/* Modals */}
      <MessageModal
        isOpen={isMessageOpen}
        onClose={() => setIsMessageOpen(false)}
        dealId={dealId}
      />
      
      <LOIModal
        isOpen={isLOIOpen}
        onClose={() => setIsLOIOpen(false)}
        dealId={dealId}
      />

      <NDAModal
        isOpen={isNDAOpen}
        onClose={() => setIsNDAOpen(false)}
        onSigned={handleNDASigned}
        dealId={dealId}
      />
    </>
  );
}