"use client";

import { useState } from "react";
import { ChevronDown } from "@/components/icons";
import { cn } from "@/lib/utils";

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQAccordionProps {
  faqs: FAQItem[];
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const categories = [...new Set(faqs.map((f) => f.category))];

  return (
    <div className="space-y-12">
      {categories.map((category) => {
        const items = faqs.filter((f) => f.category === category);
        return (
          <div key={category}>
            <h2 className="mb-6 font-serif text-xl text-warm-white">{category}</h2>
            <div className="space-y-3">
              {items.map((faq) => {
                const isOpen = openId === faq._id;
                return (
                  <div key={faq._id} className="surface-card overflow-hidden rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : faq._id)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="font-medium text-warm-white">{faq.question}</span>
                      <ChevronDown
                        size={18}
                        className={cn("shrink-0 text-electric transition-transform", isOpen && "rotate-180")}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-deep-forest/40 px-6 py-5 text-sm text-metallic-silver leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
