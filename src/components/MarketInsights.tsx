'use client';

import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
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
      'Understand SDE, multiples, and how lenders look at cash flow when buying or selling a business.',
    image:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop',
    href: '/market-insights/how-to-value-a-business',
    tag: 'Valuation',
  },
  {
    id: 2,
    title: 'Buying a Gas Station: What Most Buyers Miss',
    description:
      'Fuel margins, cross-lease income, environmental risks, and how to underwrite correctly.',
    image:
      'https://images.unsplash.com/photo-1541976076758-347942db1974?q=80&w=1200&auto=format&fit=crop',
    href: '/market-insights/gas-station-buying-guide',
    tag: 'Operational',
  },
  {
    id: 3,
    title: 'SaaS Acquisitions: Red Flags & Metrics',
    description:
      'Churn, MRR quality, customer concentration, and what matters most in SaaS diligence.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    href: '/market-insights/saas-acquisition-metrics',
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
                  <Image
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
