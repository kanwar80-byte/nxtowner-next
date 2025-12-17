import { Landmark, Scale, Search, Users } from 'lucide-react';

const services = [
  {
    title: "Brokers",
    description: "Connect with top-tier brokers to manage your exit or acquisition.",
    icon: Users,
  },
  {
    title: "Legal & Contracts",
    description: "Access deal-compliant agreements and specialized M&A counsel.",
    icon: Scale,
  },
  {
    title: "Due Diligence",
    description: "Verify financials and operational data before you buy.",
    icon: Search,
  },
  {
    title: "Financing",
    description: "Get matched with lenders specializing in business acquisitions.",
    icon: Landmark,
  }
];

export default function SelectServices() {
  return (
    <section className="py-14 md:py-16 bg-[#0B1221] text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Select Services for Your Deal</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Acquisitions are complex. We provide the infrastructure and partners to ensure your transaction is secure and compliant.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div key={index} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group cursor-pointer text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
                <service.icon className="w-8 h-8 text-blue-400 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
