import Link from "next/link";

const POSTS = [
  { title: "5 Key Metrics to Value a Business", tag: "Buyer Guide", href: "/resources" },
  { title: "SaaS Valuation Multiples in 2025", tag: "Market", href: "/resources" },
  { title: "How to Structure an Asset Purchase Agreement", tag: "Legal", href: "/resources" },
  { title: "Franchise Resale: What Buyers Look For", tag: "Seller Guide", href: "/resources" },
];

export default function MarketInsights() {
  return (
    <section className="bg-white border border-brand-border rounded-2xl p-6 md:p-8">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-brand-text">Market Insights</h2>
          <p className="text-brand-muted mt-1">Guides, checklists, and deal intelligence.</p>
        </div>
        <Link
          href="/resources"
          className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold border border-brand-border text-brand-text hover:bg-gray-50"
        >
          View articles
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {POSTS.map((p) => (
          <Link
            key={p.title}
            href={p.href}
            className="rounded-2xl border border-brand-border p-5 hover:shadow-md transition bg-white"
          >
            <div className="text-xs font-semibold text-brand-muted uppercase tracking-wide">{p.tag}</div>
            <div className="mt-2 font-bold text-brand-text line-clamp-2">{p.title}</div>
            <div className="mt-4 text-sm font-semibold text-brand-orange">Read →</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden rounded-b-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-3xl"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-white/90 text-[#0A122A] text-xs font-semibold rounded-full shadow-sm border border-gray-200">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="text-center mt-8 sm:hidden">
          <a
            href="/resources"
            className="inline-block px-6 py-3 border-2 border-[#0A122A] text-[#0A122A] rounded-full font-semibold hover:bg-[#0A122A] hover:text-white hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
          >
            View All Articles
          </a>
        </div>
      </div>
    </section>
  );
}
