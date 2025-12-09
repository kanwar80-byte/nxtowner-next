export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Get started with core features",
      features: ["Browse listings", "Saved favorites (5)", "Basic valuation", "Email support"],
    },
    {
      name: "Pro",
      price: "$29/mo",
      description: "Everything to find your deal",
      features: ["Unlimited browsing", "Saved favorites (unlimited)", "Advanced valuation", "Priority support", "Deal room access", "Market insights"],
      highlighted: true,
    },
    {
      name: "Elite",
      price: "$99/mo",
      description: "Full acquisition toolkit",
      features: ["All Pro features", "1-on-1 broker consultation", "Custom reports", "API access", "Team accounts (5)", "Dedicated support"],
    },
  ];

  return (
    <main>
      <section className="bg-[#0A122A] text-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-6xl font-extrabold tracking-tight">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Choose the plan that fits your business acquisition goals.</p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-8 border transition-all ${plan.highlighted ? "bg-gradient-to-br from-orange-50 to-white border-[#F97316] shadow-xl" : "bg-white border-gray-200 shadow-md hover:shadow-lg"}`}>
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <div className="text-4xl font-bold text-[#F97316] mb-2">{plan.price}</div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="text-[#16A34A]">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full rounded-full py-3 font-semibold transition-all ${plan.highlighted ? "bg-[#F97316] text-white hover:shadow-lg hover:scale-[1.02]" : "border-2 border-gray-300 text-gray-900 hover:border-[#F97316] hover:text-[#F97316]"}`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
