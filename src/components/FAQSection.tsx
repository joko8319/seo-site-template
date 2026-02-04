"use client";

import { useState } from "react";
import { FAQSchema } from "./StructuredData";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
  title?: string;
  className?: string;
}

export function FAQSection({ items, title = "Veelgestelde vragen", className = "" }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (items.length === 0) return null;

  return (
    <section className={`${className}`}>
      {/* FAQ Schema for SEO */}
      <FAQSchema items={items} />

      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900 pr-4">{item.question}</span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openIndex === index && (
              <div className="p-4 pt-0 bg-white">
                <p className="text-gray-600">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// Helper to extract FAQ from article content (looks for specific patterns)
export function extractFAQFromContent(content: string): FAQItem[] {
  const faqs: FAQItem[] = [];

  // Pattern 1: Look for <h3> or <h4> with question marks followed by content
  const questionPattern = /<h[34][^>]*>([^<]+\?)<\/h[34]>\s*<p>([^<]+)<\/p>/gi;
  let match;

  while ((match = questionPattern.exec(content)) !== null) {
    faqs.push({
      question: match[1].trim(),
      answer: match[2].trim(),
    });
  }

  return faqs;
}
