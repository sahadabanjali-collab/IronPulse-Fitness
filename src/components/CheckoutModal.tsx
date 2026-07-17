import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { X, CheckCircle, CreditCard, ShieldCheck, Ticket, Calendar } from "lucide-react";
import { MembershipPlan } from "../data";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: MembershipPlan | null;
  isAnnual: boolean;
  isTrialOnly?: boolean;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  selectedPlan,
  isAnnual,
  isTrialOnly = false,
}: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        cardNumber: "",
        cardExpiry: "",
        cardCvc: "",
      });
      setIsSuccess(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate Payment Gateway or Registration process
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  // Compute actual price
  const getModalPrice = () => {
    if (isTrialOnly) return "₹0";
    if (!selectedPlan) return "";

    const cleaned = selectedPlan.price.replace("₹", "").replace(",", "");
    const numeric = parseInt(cleaned, 10);

    if (isAnnual) {
      const discountedMonthly = Math.floor(numeric * 0.8);
      return `₹${discountedMonthly.toLocaleString()}`;
    }
    return selectedPlan.price;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark backdrop overlay with blur */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl shadow-black z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-red-500" />
            <h3 className="font-display font-bold text-lg text-white">
              {isTrialOnly ? "Complimentary Pass" : "Secure Checkout"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isSuccess ? (
            /* Success Receipt */
            <div className="text-center py-8 space-y-6 animate-fadeIn">
              <div className="inline-flex p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full">
                <CheckCircle className="h-12 w-12 text-emerald-500" />
              </div>

              <div className="space-y-2">
                <h4 className="font-display font-extrabold text-2xl text-white">Order Confirmed!</h4>
                <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                  {isTrialOnly
                    ? "Your complimentary 3-day guest pass is now active."
                    : `Welcome to the ${selectedPlan?.name}! Your premium membership is verified.`}
                </p>
              </div>

              {/* Receipt Summary details */}
              <div className="bg-zinc-950 border border-zinc-800/80 p-5 rounded-2xl text-left text-xs space-y-3.5 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Applicant Name</span>
                  <span className="text-white font-bold">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Service Category</span>
                  <span className="text-white font-bold">
                    {isTrialOnly ? "3-Day Free Trial" : selectedPlan?.name}
                  </span>
                </div>
                {!isTrialOnly && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Billing Schedule</span>
                    <span className="text-white font-bold">{isAnnual ? "Annual (Save 20%)" : "Monthly"}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-zinc-800/60 pt-3">
                  <span className="text-zinc-400 font-bold">Total Paid</span>
                  <span className="text-red-500 font-black text-sm">
                    {isTrialOnly ? "₹0.00" : `${getModalPrice()} / month`}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                We have transmitted your digital entry barcode and receipt details directly to <span className="text-zinc-400 font-bold">{formData.email}</span>. Bring it with you on your first visit!
              </p>

              <button
                onClick={onClose}
                className="w-full py-3 bg-white text-zinc-950 font-bold text-sm rounded-xl hover:bg-zinc-100 transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleCheckoutSubmit} className="space-y-5">
              
              {/* Selected Plan Summary Banner */}
              <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
                    Selected Package
                  </p>
                  <h4 className="text-white font-bold text-sm mt-0.5">
                    {isTrialOnly ? "Complimentary VIP Trial Pass" : `${selectedPlan?.name}`}
                  </h4>
                  <p className="text-zinc-500 text-[11px] mt-0.5 flex items-center gap-1">
                    {isTrialOnly ? (
                      <>
                        <Ticket className="h-3 w-3 text-zinc-500" />
                        <span>Valid for 3 consecutive days</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="h-3 w-3 text-zinc-500" />
                        <span>Billed {isAnnual ? "annually" : "monthly"}</span>
                      </>
                    )}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Price</p>
                  <span className="text-red-500 font-black text-base">
                    {isTrialOnly ? "₹0" : `${getModalPrice()}`}
                  </span>
                  {!isTrialOnly && <span className="text-[10px] text-zinc-500 block">/ mo</span>}
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-1.5">
                  1. Athlete Details
                </h5>
                
                {/* Full name */}
                <div className="space-y-1">
                  <label htmlFor="modal-name" className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                    Full Name
                  </label>
                  <input
                    id="modal-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Kumar"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-red-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Email */}
                  <div className="space-y-1">
                    <label htmlFor="modal-email" className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                      Email Address
                    </label>
                    <input
                      id="modal-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. rahul@example.com"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-red-600"
                      required
                    />
                  </div>
                  {/* Phone */}
                  <div className="space-y-1">
                    <label htmlFor="modal-phone" className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                      Phone Number
                    </label>
                    <input
                      id="modal-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-red-600"
                      required
                      pattern="[0-9]{10}"
                    />
                  </div>
                </div>
              </div>

              {/* Payment details only if not trial */}
              {!isTrialOnly && (
                <div className="space-y-4 pt-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-1.5 flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-red-500" />
                    <span>2. Card Details (Mock Billing)</span>
                  </h5>

                  {/* Card Number */}
                  <div className="space-y-1">
                    <label htmlFor="modal-card" className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                      Card Number
                    </label>
                    <input
                      id="modal-card"
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="4111 2222 3333 4444"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-red-600"
                      required
                      pattern="[0-9 ]{16,19}"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Expiry */}
                    <div className="space-y-1">
                      <label htmlFor="modal-expiry" className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                        Expiry Date
                      </label>
                      <input
                        id="modal-expiry"
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-red-600"
                        required
                        maxLength={5}
                      />
                    </div>
                    {/* CVC */}
                    <div className="space-y-1">
                      <label htmlFor="modal-cvc" className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                        CVC Security
                      </label>
                      <input
                        id="modal-cvc"
                        type="password"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleChange}
                        placeholder="•••"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-red-600"
                        required
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Secure Info Footer */}
              <div className="flex items-center gap-2 text-[10px] text-zinc-500 justify-center">
                <ShieldCheck className="h-4 w-4 text-red-500" />
                <span>256-Bit SSL Encrypted Connection. Cancel or freeze anytime with 1 click.</span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/10 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>
                    {isTrialOnly ? "Claim Free 3-Day Pass" : `Confirm Membership Order`}
                  </span>
                )}
              </button>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}
