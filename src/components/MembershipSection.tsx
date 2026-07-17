import { useState } from "react";
import { Check, Info, ShieldAlert } from "lucide-react";
import { MEMBERSHIP_PLANS, MembershipPlan } from "../data";

interface MembershipSectionProps {
  onPlanSelect: (plan: MembershipPlan, isAnnual: boolean) => void;
}

export default function MembershipSection({ onPlanSelect }: MembershipSectionProps) {
  const [isAnnual, setIsAnnual] = useState(false);

  // Parse numeric string price (e.g. ₹999 or ₹1,999) and compute discount
  const getDisplayPrice = (planPriceStr: string) => {
    // Remove Currency sign and comma to compute
    const cleaned = planPriceStr.replace("₹", "").replace(",", "");
    const numeric = parseInt(cleaned, 10);
    
    if (isAnnual) {
      // Apply a 20% discount and multiply by 12 for annual billing, or show per month equivalent
      const discountedMonthly = Math.floor(numeric * 0.8);
      return `₹${discountedMonthly.toLocaleString()}`;
    }
    return planPriceStr;
  };

  return (
    <section 
      id="membership" 
      className="py-24 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(9, 9, 11, 0.95), rgba(15, 12, 12, 0.82), rgba(9, 9, 11, 0.97)), url("https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1169&auto=format&fit=crop")`
      }}
    >
      {/* Background radial accent */}
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-500 border-b-2 border-rose-600 pb-1 inline-block">
            Membership Plans
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Choose Your Level of Strength
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base max-w-2xl mx-auto">
            Transparent pricing models tailored around your training frequency and coaching preferences. Cancel or freeze anytime.
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex justify-center items-center gap-4 mb-16">
          <span className={`text-sm font-medium transition-colors ${!isAnnual ? "text-white" : "text-zinc-400"}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative h-6 w-11 rounded-full bg-zinc-950 border border-zinc-800 p-0.5 transition-colors focus:outline-none"
            aria-label="Toggle annual billing"
          >
            <div
              className={`h-4.5 w-4.5 rounded-full bg-red-600 shadow transition-all duration-300 ${
                isAnnual ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-medium transition-colors ${isAnnual ? "text-white" : "text-zinc-400"}`}>
              Annual Billing
            </span>
            <span className="inline-flex text-[10px] bg-rose-600/10 border border-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {MEMBERSHIP_PLANS.map((plan: MembershipPlan) => {
            const displayPrice = getDisplayPrice(plan.price);
            
            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 sm:p-10 transition-all duration-300 flex flex-col justify-between ${
                  plan.popular
                    ? "bg-zinc-950/90 backdrop-blur-md border-2 border-red-600 shadow-2xl shadow-red-600/10 lg:scale-105 z-10"
                    : "bg-zinc-950/70 backdrop-blur-md border border-zinc-800/80 hover:border-rose-500/30"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] uppercase tracking-widest font-extrabold px-4 py-1.5 rounded-full shadow-md shadow-red-600/25">
                    Most Popular
                  </span>
                )}

                <div>
                  {/* Plan Name */}
                  <h3 className="font-display text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-zinc-400 text-xs mb-6">
                    {plan.id === "basic" && "Ideal for self-guided routines"}
                    {plan.id === "premium" && "Perfect blend of guidance & community"}
                    {plan.id === "elite" && "Comprehensive personal coaching"}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline mb-8">
                    <span className="text-4xl sm:text-5xl font-display font-extrabold text-white">
                      {displayPrice}
                    </span>
                    <span className="text-zinc-400 text-sm ml-2">
                      / {isAnnual ? "month (billed annually)" : plan.period}
                    </span>
                  </div>

                  {/* Benefits Divider */}
                  <div className="border-t border-zinc-800/80 pt-6 mb-8">
                    <p className="text-rose-400 text-xs uppercase tracking-wider font-bold mb-4">
                      What&apos;s Included:
                    </p>
                    <ul className="space-y-3.5">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="p-0.5 bg-rose-500/10 rounded-full mt-0.5">
                            <Check className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                          </div>
                          <span className="text-zinc-300 text-sm leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Call to Action button */}
                <button
                  onClick={() => onPlanSelect(plan, isAnnual)}
                  className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-200 active:scale-98 ${
                    plan.popular
                      ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20"
                      : "bg-zinc-900/90 hover:bg-zinc-800/90 text-white border border-zinc-800"
                  }`}
                >
                  {plan.ctaText}
                </button>
              </div>
            );
          })}
        </div>

        {/* Support disclaimer notice */}
        <div className="mt-12 p-4 bg-zinc-950/80 border border-zinc-800/50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto backdrop-blur-sm">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="p-2 bg-zinc-900/80 rounded-lg shrink-0 text-zinc-400">
              <Info className="h-5 w-5 text-rose-500" />
            </div>
            <p className="text-xs text-zinc-300">
              Need corporate rates, student discounts, or custom family pricing modules? Reach out directly via our contact channels.
            </p>
          </div>
          <a
            href="#contact"
            className="text-xs font-bold text-rose-400 hover:text-rose-300 underline shrink-0 transition-colors"
          >
            Contact Admissions
          </a>
        </div>

      </div>
    </section>
  );
}
