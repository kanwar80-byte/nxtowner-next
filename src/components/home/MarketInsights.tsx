
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SafeImage from '../shared/SafeImage';

const ARTICLES = [
  {
    tag: 'Valuation',
    title: '5 Key Metrics to Value a Business',
    desc: 'Understanding EBITDA, SDE, and multiples in the Canadian market.',
    readTime: '5 min read',
  },
  {
    tag: 'Trends',
    title: 'SaaS Valuation Multiples in 2025',
    desc: 'How AI and churn rates are affecting software exit prices this year.',
    readTime: '4 min read',
  },
  {
    tag: 'Legal',
    title: 'How to Structure an Asset Purchase Agreement',
    desc: 'Asset vs. Share sales: Tax implications for Canadian sellers.',
    readTime: '7 min read',
  },
  {
    tag: 'Franchise',
    title: 'Franchise Resale: What Buyers Look For',
    desc: 'Why approved transferability is the #1 deal killer.',
    readTime: '6 min read',
  },
];

export default function MarketInsights() {
  return (
    <div className="w-full">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h2 className="text-3xl font-bold text-[#0a192f]">Market Insights</h2>
                <p className="text-gray-500 mt-2">Guides, data, and sell-side intelligence.</p>
            </div>
            <Link href="/resources" className="hidden md:inline-flex px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50">
                View all articles
            </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ARTICLES.map((article, index) => (
                <div key={index} className="flex flex-col h-full bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer">
                  <div className="mb-4 relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                    <SafeImage
                      src={`https://picsum.photos/seed/market-${index + 1}/600/400`}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-2 left-2 inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded uppercase tracking-wide">
                      {article.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-800 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 flex-grow">
                    {article.desc}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400 font-medium">{article.readTime}</span>
                    <span className="text-orange-600 text-sm font-semibold flex items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      Read <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
            ))}
        </div>
    </div>
  );
}