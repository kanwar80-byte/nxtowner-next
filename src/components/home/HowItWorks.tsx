import { ArrowRight, CheckCircle2, FileText, Handshake, LineChart, ShieldCheck } from 'lucide-react';
import React from 'react';

const steps = [
  {
    icon: FileText,
    title: 'List',
    description: 'List your business with AI-powered insights',
  },
  {
    icon: ShieldCheck,
    title: 'Verify',
    description: 'Get verified with bank-grade data analysis',
  },
  {
    icon: LineChart,
    title: 'Analyze',
    description: 'Receive comprehensive valuation & NxtScore',
  },
  {
    icon: Handshake,
    title: 'Negotiate',
    description: 'Connect with serious buyers in secure deal rooms',
  },
  {
    icon: CheckCircle2,
    title: 'Close',
    description: 'Complete your transaction with confidence',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="bg-slate-900 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-100">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="flex flex-col items-center text-center relative">
                <div className="flex items-center mb-4">
                  <span className="bg-yellow-400 text-slate-900 font-bold rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    {idx + 1}
                  </span>
                  <Icon className="w-8 h-8 text-yellow-400" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-semibold text-lg text-slate-100 mb-1">{step.title}</div>
                  <div className="text-slate-400 text-sm">{step.description}</div>
                </div>
                {idx < steps.length - 1 && (
                  <span className="hidden md:block absolute right-[-32px] top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-yellow-400" aria-hidden="true" />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
