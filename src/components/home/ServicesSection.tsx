import { ArrowRight } from 'lucide-react';

// Removed ServicesSectionProps interface as mode is currently unused

export default function ServicesSection() {
  const services = [
    {
      icon: '🤝',
      title: 'M&A Brokers',
      description: 'Connect with experienced brokers to guide your transaction from start to finish.',
    },
    {
      icon: '⚖️',
      title: 'Legal & Contracts',
      description: 'Access legal professionals specialized in business acquisitions and sales.',
    },
    {
      icon: '🔍',
      title: 'Due Diligence & QoE',
      description: 'Comprehensive due diligence and quality of earnings analysis services.',
    },
    {
      icon: '💰',
      title: 'Financing & Lending',
      description: 'Explore financing options and connect with lenders for business acquisitions.',
    },
  ];

  return (
    <section className="bg-[#0A122A] text-white py-14 lg:py-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start mb-6 lg:mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Select Services for Your Deal
            </h2>
            <p className="mt-2 max-w-2xl text-slate-300">
              Our vetted partner network supports valuation, due diligence, financing, legal review, 
              and closing—so you don&apos;t have to build a deal team from scratch.
            </p>
          </div>
          <a
            href="/partners"
            className="text-white/80 font-bold flex items-center gap-1 hover:text-white transition-all text-sm"
          >
            View All <ArrowRight size={16} />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-7 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.18)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.24)] hover:-translate-y-1 hover:scale-[1.03] hover:bg-gradient-to-br hover:from-white/10 hover:via-white/5 hover:to-transparent transition-all duration-300 text-center animate-fadeInUp"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="text-4xl mb-4 flex items-center justify-center">{service.icon}</div>
              <h3 className="text-lg font-semibold mb-3">{service.title}</h3>
              <p className="text-sm text-gray-200 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-7">
          <a
            href="/partners"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#F97316] text-white rounded-full font-semibold shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.24)] hover:scale-[1.03] active:scale-[0.98] hover:bg-[#ea580c] transition-all duration-300"
          >
            View All Services
          </a>
        </div>
      </div>
    </section>
  );
}
