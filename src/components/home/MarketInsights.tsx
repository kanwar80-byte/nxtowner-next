export default function MarketInsights() {
  const articles = [
    {
      id: 1,
      title: '5 Key Metrics to Evaluate Before Buying a Gas Station',
      category: 'Due Diligence',
      date: 'Dec 5, 2025',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
    },
    {
      id: 2,
      title: 'SaaS Valuation Multiples in 2025: What Buyers Are Paying',
      category: 'Market Trends',
      date: 'Dec 3, 2025',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    },
    {
      id: 3,
      title: 'How to Structure an Asset vs. Share Purchase Agreement',
      category: 'Legal',
      date: 'Nov 28, 2025',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop',
    },
    {
      id: 4,
      title: 'The Rise of Franchise Resales in Canadian Markets',
      category: 'Market Trends',
      date: 'Nov 25, 2025',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop',
    },
  ];

  return (
    <section className="bg-[#F8FAFC] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Market Insights</h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              Expert insights, valuation trends, and acquisition playbooks for operators, investors, and first-time buyers.
            </p>
          </div>
          <a
            href="/resources"
            className="hidden sm:inline-block px-6 py-3 border-2 border-[#0A122A] text-[#0A122A] rounded-full font-semibold hover:bg-[#0A122A] hover:text-white hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
          >
            View All Articles
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {articles.map((article, idx) => (
            <a
              key={article.id}
              href="/resources"
              className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 overflow-hidden group animate-fadeInUp"
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
