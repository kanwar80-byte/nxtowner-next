'use client';

import { useState, useEffect } from 'react';

interface IntentStepProps {
  initialIntent?: string | null;
  onIntentSelect: (intent: string) => void;
}

export default function IntentStep({ initialIntent, onIntentSelect }: IntentStepProps) {
  const [selectedIntent, setSelectedIntent] = useState<string | null>(initialIntent || null);

  useEffect(() => {
    if (initialIntent) {
      setSelectedIntent(initialIntent);
    }
  }, [initialIntent]);

  const handleSelect = (intent: string) => {
    setSelectedIntent(intent);
    onIntentSelect(intent);
  };

  const intentOptions = [
    {
      value: 'understand_value',
      title: 'Understand my business value',
      description: 'Get an accurate valuation to understand what your business is worth',
    },
    {
      value: 'prepare_sale',
      title: 'Prepare for a future sale',
      description: 'Plan ahead and prepare your business for a successful sale',
    },
    {
      value: 'strategic_options',
      title: 'Explore strategic options',
      description: 'Evaluate different strategic paths and opportunities',
    },
    {
      value: 'benchmark',
      title: 'Benchmark against similar businesses',
      description: 'Compare your business performance with industry standards',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          What's your primary goal?
        </h2>
        <p className="text-slate-600 mb-6">
          Help us understand what you're looking to achieve with this valuation.
        </p>
        <div className="space-y-3">
          {intentOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedIntent === option.value
                  ? 'border-blue-600 bg-blue-50 shadow-sm'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="intent"
                value={option.value}
                checked={selectedIntent === option.value}
                onChange={() => handleSelect(option.value)}
                className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-semibold text-slate-900">{option.title}</div>
                <div className="text-sm text-slate-600 mt-1">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

