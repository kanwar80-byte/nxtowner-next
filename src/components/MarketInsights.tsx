"use client";
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type Article = {
  id: number;
  title: string;
  description: string;
  img: string;
  link: string;
  type: string;
};

function MarketInsightCard({ article }: { article: Article }) {
  const [imgSrc, setImgSrc] = useState(article.img);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);
  return (
    <Link href={article.link} className="group block bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-2xl hover:border-blue-200 transition-all duration-300">
      {/* Image with fallback */}
      <div className="relative h-48 w-full">
        <Image
          src={imgSrc}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => {
            if (!hasTriedFallback) {
              setImgSrc('/images/placeholder.jpg');
              setHasTriedFallback(true);
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute bottom-4 left-4 text-white text-xs font-bold px-3 py-1 bg-blue-600 rounded-full shadow-lg">
          {article.type}
        </span>
      </div>
      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-slate-500 mb-4">{article.description}</p>
        <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
          Read More <ArrowUpRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

const articles = [
  {
    id: 1,
    title: "Q3 2024 SaaS Valuation Multiples Report",
    description: "In-depth analysis of current SaaS acquisition multiples across Canada, with future predictions.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=700&h=400",
    link: "/resources/saas-report-q3-2024",
    type: "Report"
  },
  {
    id: 2,
    title: "Understanding Seller Discretionary Earnings (SDE)",
    description: "A comprehensive guide for business owners to accurately calculate and present their SDE.",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=700&h=400", // working Unsplash image
    link: "/resources/guide-to-sde",
    type: "Guide"
  },
  {
    id: 3,
    title: "The Impact of Interest Rates on Business Acquisitions",
    description: "How changes in the Bank of Canada rates affect acquisition financing and deal structures.",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=700&h=400",
    link: "/resources/interest-rate-impact",
    type: "Analysis"
  }
];

export default function MarketInsights() {
  return (
    <section className="py-14 md:py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-[#D4AF37] font-bold tracking-widest text-xs uppercase">Expert Analysis</span>
            <h2 className="text-4xl font-extrabold text-[#0B1221] mt-2">Market Insights</h2>
          </div>
          <Link href="/resources" className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
            Visit Resource Hub <ArrowUpRight size={20} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {articles.map((article) => (
            <MarketInsightCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
