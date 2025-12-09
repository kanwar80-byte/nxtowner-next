"use client";

import { useState } from "react";
import {
  approvePartnerProfile,
  rejectPartnerProfile,
} from "@/app/actions/partners";
import type { PartnerProfile } from "@/types/database";

interface PartnerApprovalCardProps {
  partner: PartnerProfile & {
    profiles: {
      full_name: string | null;
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

export function PartnerApprovalCard({ partner }: PartnerApprovalCardProps) {
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);
  const [rejected, setRejected] = useState(false);

  const handleApprove = async () => {
    if (!confirm(`Approve ${partner.firm_name}?`)) return;

    setLoading(true);
    try {
      await approvePartnerProfile(partner.id);
      setApproved(true);
    } catch (error) {
      console.error("Failed to approve partner:", error);
      alert("Failed to approve partner");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm(`Reject ${partner.firm_name}? This action cannot be undone.`))
      return;

    setLoading(true);
    try {
      await rejectPartnerProfile(partner.id);
      setRejected(true);
    } catch (error) {
      console.error("Failed to reject partner:", error);
      alert("Failed to reject partner");
    } finally {
      setLoading(false);
    }
  };

  if (approved) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-4xl mb-3">✓</div>
        <p className="font-semibold text-green-800">
          {partner.firm_name} approved
        </p>
      </div>
    );
  }

  if (rejected) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-4xl mb-3">×</div>
        <p className="font-semibold text-red-800">
          {partner.firm_name} rejected
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-brand-border rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-brand-text mb-1">
          {partner.firm_name}
        </h3>
        <p className="text-sm text-brand-muted">
          {PARTNER_TYPE_LABELS[partner.partner_type] || partner.partner_type}
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <div>
          <p className="text-xs font-semibold text-brand-text uppercase tracking-wide">
            Contact Person
          </p>
          <p className="text-sm text-brand-muted">
            {partner.profiles.full_name || "Not provided"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-brand-text uppercase tracking-wide">
            Email
          </p>
          <p className="text-sm text-brand-muted">{partner.contact_email}</p>
        </div>

        {partner.contact_phone && (
          <div>
            <p className="text-xs font-semibold text-brand-text uppercase tracking-wide">
              Phone
            </p>
            <p className="text-sm text-brand-muted">{partner.contact_phone}</p>
          </div>
        )}

        {partner.years_experience && (
          <div>
            <p className="text-xs font-semibold text-brand-text uppercase tracking-wide">
              Years Experience
            </p>
            <p className="text-sm text-brand-muted">
              {partner.years_experience} years
            </p>
          </div>
        )}

        {partner.website_url && (
          <div>
            <p className="text-xs font-semibold text-brand-text uppercase tracking-wide">
              Website
            </p>
            <a
              href={partner.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-orange hover:underline"
            >
              {partner.website_url}
            </a>
          </div>
        )}

        {partner.bio && (
          <div>
            <p className="text-xs font-semibold text-brand-text uppercase tracking-wide mb-1">
              Bio
            </p>
            <p className="text-sm text-brand-muted">{partner.bio}</p>
          </div>
        )}

        {partner.specialties && partner.specialties.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-brand-text uppercase tracking-wide mb-2">
              Specialties
            </p>
            <div className="flex flex-wrap gap-2">
              {partner.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        {partner.regions && partner.regions.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-brand-text uppercase tracking-wide mb-2">
              Regions
            </p>
            <div className="flex flex-wrap gap-2">
              {partner.regions.map((region) => (
                <span
                  key={region}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                >
                  {region}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t border-brand-border">
        <button
          onClick={handleApprove}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Approve"}
        </button>
        <button
          onClick={handleReject}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Reject"}
        </button>
      </div>
    </div>
  );
}
