"use client";

import { submitLOI } from "@/app/actions/deal-actions";
import { DollarSign, FileText, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  dealId: string;
};

export default function LOIModal({ isOpen, onClose, dealId }: Props) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [closingDate, setClosingDate] = useState("");
  const [terms, setTerms] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success">("idle");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("dealId", dealId);
      formData.append("amount", amount);
      formData.append("terms", terms);
      formData.append("closingDate", closingDate);

      // Call Real Server Action
      await submitLOI(formData);
      
      setStatus("success");
      
      // Refresh page to update "LOI Status" sidebar
      setTimeout(() => {
        router.refresh();
        onClose();
        setStatus("idle");
        setAmount("");
        setTerms("");
      }, 1500);
      
    } catch (error) {
      console.error("LOI Failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Submit Letter of Intent
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Offer Amount ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border text-gray-900"
                  placeholder="2,500,000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Target Closing Date</label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={closingDate}
                  onChange={(e) => setClosingDate(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Key Terms & Conditions</label>
            <textarea
              rows={4}
              required
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 border resize-none text-gray-900"
              placeholder="e.g. Subject to financing, 30 days due diligence..."
            />
          </div>

          {status === "success" && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg flex items-center gap-2">
              <span>✓</span> LOI Draft Submitted Successfully!
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || status === "success"}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Offer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}