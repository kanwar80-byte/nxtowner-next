"use client";

import { createConsultationRequest } from "@/app/actions/partners";
import type { PartnerProfile } from "@/types/database";
import { supabase } from "@/utils/supabase/client";
import { useState } from "react";

interface ConsultationModalProps {
  partner: PartnerProfile;
  onClose: () => void;
}

export function ConsultationModal({ partner, onClose }: ConsultationModalProps) {
  const [formData, setFormData] = useState({
    requester_name: "",
    requester_email: "",
    requester_phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();

      await createConsultationRequest({
        partner_profile_id: partner.id,
        requester_id: user?.id || null,
        requester_name: formData.requester_name,
        requester_email: formData.requester_email,
        requester_phone: formData.requester_phone || null,
        message: formData.message,
        listing_id: null,
        status: "pending",
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Consultation request error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit consultation request"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-brand-text">
            Book Consultation
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {success ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✓</div>
              <h3 className="text-xl font-semibold text-brand-text mb-2">
                Request Sent!
              </h3>
              <p className="text-brand-muted">
                {partner.firm_name} will contact you soon at {formData.requester_email}
              </p>
            </div>
          ) : (
            <>
              {/* Partner Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-brand-text mb-1">
                  {partner.firm_name}
                </h3>
                <p className="text-sm text-brand-muted mb-2">
                  {partner.partner_type.toUpperCase()}
                </p>
                <p className="text-xs text-brand-muted">
                  You&apos;ll receive a response at the email you provide below
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="requester_name"
                    value={formData.requester_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 rounded-md border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="requester_email"
                    value={formData.requester_email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 rounded-md border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    name="requester_phone"
                    value={formData.requester_phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-md border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Tell us about your business needs..."
                    className="w-full px-3 py-2 rounded-md border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-brand-border text-brand-text font-semibold rounded-md hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-brand-orange text-white font-semibold rounded-md hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending..." : "Send Request"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
