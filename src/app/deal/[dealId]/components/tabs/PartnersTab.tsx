"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, User, Mail, Building, BookOpen, Calendar } from "lucide-react";
import type { DealPartner, PartnerRole } from "@/types/deal";
// Date formatting helper
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

interface PartnersTabProps {
  dealId: string;
  partners: DealPartner[];
}

const ROLE_LABELS: Record<PartnerRole, string> = {
  broker: "Broker",
  lawyer: "Lawyer",
  accountant: "Accountant",
  banker: "Banker",
  advisor: "Advisor",
  other: "Other",
};

const ROLE_COLORS: Record<PartnerRole, string> = {
  broker: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  lawyer: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  accountant: "bg-green-500/10 text-green-400 border-green-500/20",
  banker: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  advisor: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  other: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  completed: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function PartnersTab({ dealId, partners: initialPartners }: PartnersTabProps) {
  const [partners, setPartners] = useState<DealPartner[]>(initialPartners);
  const [showBookForm, setShowBookForm] = useState(false);

  const handleBookPartner = async () => {
    // Placeholder for booking partner
    // TODO: Implement actual booking when partner system is wired
    alert(
      "Partner booking will be implemented when partner database is configured. This will allow you to search and book brokers, lawyers, accountants, and other professionals."
    );
    setShowBookForm(false);
  };

  const groupedByRole = partners.reduce((acc, partner) => {
    if (!acc[partner.role]) {
      acc[partner.role] = [];
    }
    acc[partner.role].push(partner);
    return acc;
  }, {} as Record<PartnerRole, DealPartner[]>);

  return (
    <div className="space-y-6">
      {/* Header with Book button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Partners</h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage brokers, lawyers, accountants, and other deal partners
          </p>
        </div>
        <Button
          onClick={() => setShowBookForm(!showBookForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Book Partner
        </Button>
      </div>

      {/* Book Partner Form (Placeholder) */}
      {showBookForm && (
        <Card className="border-slate-800 bg-slate-900/20">
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="text-base font-semibold text-white mb-2">Book a Partner</h3>
              <p className="text-sm text-slate-400 mb-4">
                Search and book professionals for this deal. This feature will connect you with
                verified brokers, lawyers, accountants, and advisors.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleBookPartner}>Open Partner Directory</Button>
              <Button variant="outline" onClick={() => setShowBookForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Partners List */}
      {partners.length === 0 ? (
        <div className="text-center py-12 border border-slate-800 rounded-lg bg-slate-900/20">
          <User className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 mb-2">No partners booked yet</p>
          <p className="text-sm text-slate-500">
            Book partners to get professional support for your deal
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByRole).map(([role, rolePartners]) => (
            <div key={role}>
              <h3 className="text-sm font-semibold text-slate-300 mb-3">
                {ROLE_LABELS[role as PartnerRole]} ({rolePartners.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rolePartners.map((partner) => (
                  <PartnerCard key={partner.id} partner={partner} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface PartnerCardProps {
  partner: DealPartner;
}

function PartnerCard({ partner }: PartnerCardProps) {
  const partnerInfo = partner.partner || {
    id: partner.partner_id,
    name: "Unknown Partner",
    email: "N/A",
    company: null,
  };

  return (
    <Card className="border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate">{partnerInfo.name}</h3>
              {partnerInfo.company && (
                <p className="text-sm text-slate-400 truncate flex items-center gap-1 mt-0.5">
                  <Building className="w-3 h-3" />
                  {partnerInfo.company}
                </p>
              )}
            </div>
          </div>
          <Badge variant="outline" className={ROLE_COLORS[partner.role]}>
            {ROLE_LABELS[partner.role]}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Mail className="w-3 h-3 shrink-0" />
            <span className="truncate">{partnerInfo.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3 h-3 shrink-0" />
            <span>Added {formatDate(partner.created_at)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <Badge variant="outline" className={STATUS_COLORS[partner.status]}>
            {STATUS_LABELS[partner.status] || partner.status}
          </Badge>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-400">
            <BookOpen className="w-4 h-4 mr-2" />
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
