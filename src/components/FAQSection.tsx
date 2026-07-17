import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { FAQS, FAQItem } from "../data";

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>("f1"); // First item open by default

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section 
      id="faq" 
      className="py-24 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(9, 9, 11, 0.96), rgba(15, 12, 12, 0.85), rgba(9, 9, 11, 0.98)), url("https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?auto=format&fit=crop&q=80&w=1600")`
      }}
    >
      {/* Background visual light effects */}
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-red-500 border-b-2 border-red-600 pb-1 inline-block">
            Frequently Asked
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Have Any Questions?
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Find immediate answers regarding pricing, operations, personal trainers, and locker rules below.
          </p>
        </div>

        {/* FAQs Accordion Grid */}
        <div className="space-y-4">
          {FAQS.map((faq: FAQItem) => {
            const isOpen = openId === faq.id;
            
            return (
              <div
                key={faq.id}
                className={`rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-zinc-900/80 border border-red-600/30 shadow-md shadow-red-600/5"
                    : "bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700/80"
                }`}
              >
                {/* Trigger Button */}
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-5 sm:py-6 flex items-center justify-between gap-4 text-left font-semibold cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    <HelpCircle className={`h-5 w-5 shrink-0 transition-colors ${isOpen ? "text-red-500" : "text-zinc-500"}`} />
                    <span className="font-display text-sm sm:text-base text-white hover:text-red-500 transition-colors">
                      {faq.question}
                    </span>
                  </div>
                  <div className="p-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400">
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-red-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </button>

                {/* Answer Collapsible Area */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-60 border-t border-zinc-800/60" : "max-h-0"
                  }`}
                >
                  <div className="px-6 py-5 sm:py-6 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-12 text-center p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-3xl space-y-4">
          <h4 className="font-display font-bold text-white text-base">Still have questions?</h4>
          <p className="text-zinc-400 text-xs max-w-md mx-auto">
            If you didn&apos;t find your answers here, send our active admissions office a direct line. We respond in under 3 hours.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-600/10 active:scale-95"
          >
            Ask a Question
          </a>
        </div>

      </div>
    </section>
  );
}
