"use client";

import { useState } from "react";
import { createPartnerProfile } from "@/app/actions/partners";
import { useRouter } from "next/navigation";
import type { PartnerType } from "@/types/database";

const PARTNER_TYPES: { value: PartnerType; label: string }[] = [
  { value: "broker", label: "M&A Broker" },
  { value: "cpa", label: "CPA / Accountant" },
  { value: "lawyer", label: "Lawyer" },
  { value: "lender", label: "Lender" },
  { value: "consultant", label: "Consultant" },
];

const SPECIALTIES = [
  "Gas Stations",
  "QSR / Restaurants",
  "Retail",
  "C-Stores",
  "SaaS",
  "E-Commerce",
  "Content / Media",
  "Manufacturing",
  "Healthcare",
  "Real Estate",
];

const REGIONS = [
  "Ontario",
  "British Columbia",
  "Alberta",
  "Quebec",
  "Saskatchewan",
  "Manitoba",
  "Nova Scotia",
  "New Brunswick",
  "Nationwide",
];

interface PartnerProfileFormProps {
  profileId: string;
}

export function PartnerProfileForm({ profileId }: PartnerProfileFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firm_name: "",
    partner_type: "" as PartnerType,
    specialties: [] as string[],
    regions: [] as string[],
    years_experience: 0,
    website_url: "",
    contact_email: "",
    contact_phone: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await createPartnerProfile({
        profile_id: profileId,
        firm_name: formData.firm_name,
        partner_type: formData.partner_type,
        specialties: formData.specialties,
        regions: formData.regions,
        years_experience: formData.years_experience || null,
        website_url: formData.website_url || null,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone || null,
        bio: formData.bio || null,
        is_featured: false,
        status: "pending",
      });

      router.refresh();
    } catch (err) {
      console.error("Partner profile creation error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create partner profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleArrayToggle = (field: "specialties" | "regions", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  return (
    <div className="bg-white rounded-lg border border-brand-border p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Firm Name */}
        <div>
          <label className="block text-sm font-semibold text-brand-text mb-2">
            Firm Name *
          </label>
          <input
            type="text"
            value={formData.firm_name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, firm_name: e.target.value }))
            }
            required
            className="w-full px-4 py-3 rounded-md border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
        </div>

        {/* Partner Type */}
        <div>
          <label className="block text-sm font-semibold text-brand-text mb-2">
            Partner Type *
          </label>
          <select
            value={formData.partner_type}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                partner_type: e.target.value as PartnerType,
              }))
            }
            required
            className="w-full px-4 py-3 rounded-md border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            <option value="">Select a type...</option>
            {PARTNER_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Contact Email */}
        <div>
          <label className="block text-sm font-semibold text-brand-text mb-2">
            Contact Email *
          </label>
          <input
            type="email"
            value={formData.contact_email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, contact_email: e.target.value }))
            }
            required
            className="w-full px-4 py-3 rounded-md border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
        </div>

        {/* Contact Phone */}
        <div>
          <label className="block text-sm font-semibold text-brand-text mb-2">
            Contact Phone
          </label>
          <input
            type="tel"
            value={formData.contact_phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, contact_phone: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-md border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
        </div>

        {/* Years Experience */}
        <div>
          <label className="block text-sm font-semibold text-brand-text mb-2">
            Years of Experience
          </label>
          <input
            type="number"
            value={formData.years_experience || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                years_experience: parseInt(e.target.value) || 0,
              }))
            }
            min="0"
            className="w-full px-4 py-3 rounded-md border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
        </div>

        {/* Website URL */}
        <div>
          <label className="block text-sm font-semibold text-brand-text mb-2">
            Website URL
          </label>
          <input
            type="url"
            value={formData.website_url}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, website_url: e.target.value }))
            }
            placeholder="https://yourfirm.com"
            className="w-full px-4 py-3 rounded-md border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
        </div>

        {/* Specialties */}
        <div>
          <label className="block text-sm font-semibold text-brand-text mb-2">
            Specialties (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SPECIALTIES.map((specialty) => (
              <label
                key={specialty}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.specialties.includes(specialty)}
                  onChange={() => handleArrayToggle("specialties", specialty)}
                  className="w-4 h-4 text-brand-orange focus:ring-brand-orange rounded"
                />
                <span className="text-sm text-brand-text">{specialty}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Regions */}
        <div>
          <label className="block text-sm font-semibold text-brand-text mb-2">
            Regions Served (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {REGIONS.map((region) => (
              <label
                key={region}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.regions.includes(region)}
                  onChange={() => handleArrayToggle("regions", region)}
                  className="w-4 h-4 text-brand-orange focus:ring-brand-orange rounded"
                />
                <span className="text-sm text-brand-text">{region}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-semibold text-brand-text mb-2">
            Professional Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, bio: e.target.value }))
            }
            rows={4}
            placeholder="Tell potential clients about your experience and approach..."
            className="w-full px-4 py-3 rounded-md border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-brand-orange text-white font-semibold rounded-md hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit for Approval"}
        </button>

        <p className="text-xs text-brand-muted text-center">
          Your profile will be reviewed by our team before being listed in the directory
        </p>
      </form>
    </div>
  );
}
