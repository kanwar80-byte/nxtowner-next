import { getApprovedPartners } from "@/app/actions/partners";
import { PartnerCard } from "@/components/partners/PartnerCard";
import { PartnerFilters } from "@/components/partners/PartnerFilters";

export const revalidate = 0; // On-demand rendering

export const metadata = {
  title: "Partner Directory | NxtOwner",
  description: "Find trusted brokers, CPAs, lawyers, and lenders to help with your business transaction.",
};

type SearchParams = Promise<{
  type?: string;
  region?: string;
  specialty?: string;
}>;

export default async function PartnersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  
  const filters: {
    partner_type?: string;
    regions?: string[];
    specialties?: string[];
  } = {};

  if (params.type) {
    filters.partner_type = params.type;
  }

  if (params.region) {
    filters.regions = [params.region];
  }

  if (params.specialty) {
    filters.specialties = [params.specialty];
  }

  const partners = await getApprovedPartners(filters);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-6 py-16 sm:px-8 lg:px-12">
          <h1 className="text-4xl font-bold text-brand-text mb-4">
            Partner Directory
          </h1>
          <p className="text-lg text-brand-muted max-w-3xl">
            Connect with verified brokers, CPAs, lawyers, and lenders who specialize in business 
            acquisitions and sales. Our partners are here to help you navigate your transaction with confidence.
          </p>
        </div>
      </div>

      {/* Filters and Results */}
      <div className="max-w-7xl mx-auto px-6 py-12 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <PartnerFilters
              currentType={params.type}
              currentRegion={params.region}
              currentSpecialty={params.specialty}
            />
          </div>

          {/* Partner Cards */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-brand-muted">
                {partners.length} {partners.length === 1 ? "partner" : "partners"} found
              </p>
              {(params.type || params.region || params.specialty) && (
                <a
                  href="/partners"
                  className="text-sm text-brand-orange hover:underline font-semibold"
                >
                  Clear filters
                </a>
              )}
            </div>

            {partners.length === 0 ? (
              <div className="bg-white rounded-xl border border-brand-border p-12 text-center">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-xl font-semibold text-brand-text mb-2">
                  No partners found
                </h3>
                <p className="text-brand-muted mb-6">
                  Try adjusting your filters to see more results
                </p>
                <a
                  href="/partners"
                  className="inline-block px-6 py-3 bg-brand-orange text-white font-semibold rounded-md hover:bg-orange-600 transition"
                >
                  View all partners
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {partners.map((partner) => (
                  <PartnerCard key={partner.id} partner={partner} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Become a Partner CTA */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-6 py-16 sm:px-8 lg:px-12 text-center">
          <h2 className="text-3xl font-bold text-brand-text mb-4">
            Interested in becoming a partner?
          </h2>
          <p className="text-lg text-brand-muted mb-8 max-w-2xl mx-auto">
            Join our network of trusted professionals and connect with buyers and sellers 
            looking for expert guidance in business transactions.
          </p>
          <a
            href="/signup?role=partner"
            className="inline-block px-8 py-4 bg-brand-orange text-white font-semibold rounded-md hover:bg-orange-600 transition shadow-md hover:shadow-lg"
          >
            Apply as a Partner
          </a>
        </div>
      </div>
    </main>
  );
}
