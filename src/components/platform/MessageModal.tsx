"use client";

import { sendMessage } from "@/app/actions/deal-actions";
import { X } from "lucide-react";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  dealId: string;
};

export default function MessageModal({ isOpen, onClose, dealId }: Props) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setStatus("idle");

    try {
      const formData = new FormData();
      formData.append("dealId", dealId);
      formData.append("message", message);
      
      await sendMessage(formData);
      
      setStatus("success");
      setTimeout(() => {
        onClose();
        setMessage("");
        setStatus("idle");
      }, 1500);
    } catch (error) {
      console.error("Failed to send message:", error);
      setStatus("error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-semibold text-gray-900">Send Message</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="message"
              className="text-sm font-medium text-gray-700 block"
            >
              Your Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-none text-gray-900 p-3 border"
              placeholder="Hi, I'm interested in this deal..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          {status === "error" && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              Failed to send message. Please try again.
            </div>
          )}

          {status === "success" && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              Message sent successfully!
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending || status === "success"}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}