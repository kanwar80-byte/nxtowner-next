'use client';

import SafeImage from '@/components/shared/SafeImage';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

type Article = {
  id: number;
  title: string;
  description: string;
  image?: string;
  href: string;
  tag: string;
};

const ARTICLES: Article[] = [
  {
    id: 1,
    title: 'How to Value a Small Business in Canada',
    description:
      'A practical guide to SDE, market multiples, and what Canadian lenders look for in cash flow analysis.',
    image:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop',
    href: '/market-insights/how-to-value-a-business',
    tag: 'Valuation',
  },
  {
    id: 2,
    title: 'Understanding Seller Discretionary Earnings (SDE)',
    description:
      'How SDE is calculated in Canadian deals, and why it matters for buyers, sellers, and banks.',
    image:
      'https://images.unsplash.com/photo-1464983953574-0892a716854b?q=80&w=1200&auto=format&fit=crop',
    href: '/market-insights/sde-explained',
    tag: 'Valuation',
  },
  {
    id: 3,
    title: 'Gas Station Margins: What Actually Drives NOI',
    description:
      'A deep dive into fuel margins, cross-leases, and environmental diligence for Canadian gas stations.',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    href: '/market-insights/gas-station-margins',
    tag: 'Operational',
  },
  {
    id: 4,
    title: 'Due Diligence Checklist for Asset Deals',
    description:
      'Key documents and red flags for asset-based acquisitions in Canada, from leases to tax compliance.',
    image:
      'https://images.unsplash.com/photo-1515168833906-d2a3b82b302b?q=80&w=1200&auto=format&fit=crop',
    href: '/market-insights/due-diligence-checklist',
    tag: 'Due Diligence',
  },
  {
    id: 5,
    title: 'Lease vs Franchise: What Changes in Underwriting',
    description:
      'How lenders and buyers evaluate franchise vs. leased businesses in the Canadian market.',
    image:
      'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?q=80&w=1200&auto=format&fit=crop',
    href: '/market-insights/lease-vs-franchise',
    tag: 'Underwriting',
  },
  {
    id: 6,
    title: 'Digital Acquisitions: SaaS & E-Commerce in Canada',
    description:
      'What to watch for in churn, MRR, and customer concentration when buying digital businesses.',
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop',
    href: '/market-insights/digital-acquisitions',
    tag: 'Digital',
  },
];

export default function MarketInsights() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Market Insights
            </h2>
            <p className="mt-2 text-slate-600">
              Practical guidance for buyers, sellers, and operators.
            </p>
          </div>

          <Link
            href="/market-insights"
            className="hidden sm:inline-flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-700"
          >
            View all articles <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Articles */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((article) => (
            <article
              key={article.id}
              className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition"
            >
              {/* Image / Fallback */}
              <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-300">
                {article.image ? (
                  <SafeImage
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
                    No image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <span className="inline-block mb-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
                  {article.tag}
                </span>

                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {article.title}
                </h3>

                <p className="text-sm text-slate-600 mb-4">
                  {article.description}
                </p>

                <Link
                  href={article.href}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-slate-900 hover:text-blue-600"
                >
                  Read more <ArrowUpRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile link */}
        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/market-insights"
            className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-700"
          >
            View all articles <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
