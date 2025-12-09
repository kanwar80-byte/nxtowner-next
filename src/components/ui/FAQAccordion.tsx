'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type FAQItem = {
  question: string;
  answer: string;
};

type FAQAccordionProps = {
  items: FAQItem[];
};

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());

  const toggleIndex = (idx: number) => {
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {items.map((item, idx) => {
        const isOpen = openIndexes.has(idx);
        const contentId = `faq-item-${idx}`;
        return (
          <div key={item.question} className="border border-slate-200 rounded-lg bg-white shadow-sm">
            <button
              type="button"
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50"
              aria-expanded={isOpen}
              aria-controls={contentId}
              onClick={() => toggleIndex(idx)}
            >
              <span className="text-base sm:text-lg font-semibold text-slate-900">{item.question}</span>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-transform ${
                  isOpen ? 'rotate-180 bg-slate-100' : 'bg-white'
                }`}
              >
                <ChevronDown className="h-4 w-4" />
              </span>
            </button>
            {isOpen && (
              <div id={contentId} className="px-5 pb-5 text-sm sm:text-base text-slate-700 leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
