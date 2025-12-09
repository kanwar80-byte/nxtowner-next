"use client";

import { useState } from "react";
import type { PartnerProfile } from "@/types/database";
import { ConsultationModal } from "./ConsultationModal";

interface PartnerCardProps {
  partner: PartnerProfile & {
    profiles: {
      full_name: string | null;
      avatar_url: string | null;
    };
  };
}

const PARTNER_TYPE_LABELS: Record<string, string> = {
  broker: "M&A Broker",
  cpa: "CPA / Accountant",
  lawyer: "Lawyer",
  lender: "Lender",
  consultant: "Consultant",
};

export function PartnerCard({ partner }: PartnerCardProps) {
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl border border-brand-border p-6 shadow-sm hover:shadow-md transition">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {partner.firm_name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-brand-text truncate">
                {partner.firm_name}
              </h3>
              {partner.is_featured && (
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                  Featured
                </span>
              )}
            </div>
            <p className="text-sm text-brand-muted">
              {PARTNER_TYPE_LABELS[partner.partner_type] || partner.partner_type}
            </p>
            {partner.years_experience && (
              <p className="text-xs text-brand-muted mt-1">
                {partner.years_experience} years experience
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        {partner.bio && (
          <p className="text-sm text-brand-text mb-4 line-clamp-3">
            {partner.bio}
          </p>
        )}

        {/* Specialties */}
        {partner.specialties && partner.specialties.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-brand-text uppercase tracking-wide mb-2">
              Specialties
            </p>
            <div className="flex flex-wrap gap-2">
              {partner.specialties.slice(0, 3).map((specialty) => (
                <span
                  key={specialty}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {specialty}
                </span>
              ))}
              {partner.specialties.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  +{partner.specialties.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Regions */}
        {partner.regions && partner.regions.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-brand-text uppercase tracking-wide mb-2">
              Regions Served
            </p>
            <p className="text-sm text-brand-muted">
              {partner.regions.slice(0, 2).join(", ")}
              {partner.regions.length > 2 && ` +${partner.regions.length - 2} more`}
            </p>
          </div>
        )}

        {/* Contact Buttons */}
        <div className="flex gap-3 pt-4 border-t border-brand-border">
          <button
            onClick={() => setShowConsultationModal(true)}
            className="flex-1 px-4 py-2 bg-brand-orange text-white font-semibold rounded-md hover:bg-orange-600 transition text-sm"
          >
            Book Consultation
          </button>
          {partner.website_url && (
            <a
              href={partner.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-brand-border text-brand-text font-semibold rounded-md hover:bg-gray-50 transition text-sm"
            >
              Website
            </a>
          )}
        </div>
      </div>

      {/* Consultation Modal */}
      {showConsultationModal && (
        <ConsultationModal
          partner={partner}
          onClose={() => setShowConsultationModal(false)}
        />
      )}
    </>
  );
}
