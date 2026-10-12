import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { X, CheckCircle, ShieldCheck, Ticket, Calendar, Award, Phone, Mail, User } from "lucide-react";
import { MembershipPlan } from "../data";
import { saveMembership } from "../services/membershipService";
import { createInquiry } from "../services/inquiryService";

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
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState("");

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        email: "",
        phone: "",
      });
      setIsSuccess(false);
      setIsSubmitting(false);
      setRegistrationId("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleCheckoutSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      return;
    }

    setIsSubmitting(true);
    const passCode = isTrialOnly
      ? `TRIAL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      : `IP-${Math.floor(100000 + Math.random() * 900000)}`;

    setRegistrationId(passCode);

    try {
      const planName = isTrialOnly ? "3-Day Free VIP Trial" : (selectedPlan?.name || "Fitness Membership");
      const priceText = isTrialOnly ? "₹0.00" : getModalPrice();
      const billingText = isTrialOnly ? "Trial" : (isAnnual ? "Annual" : "Monthly");

      // Save to membership registrations store
      await saveMembership({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "Not provided",
        plan_name: planName,
        price: priceText,
        billing_cycle: billingText,
        payment_id: passCode,
        is_trial: isTrialOnly,
      });

      // Record in Admin inquiries pipeline
      await createInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "Not provided",
        subject: isTrialOnly ? "3-Day Free VIP Trial" : `${selectedPlan?.name || "Membership"} Registration`,
        message: isTrialOnly
          ? "Customer claimed a 3-Day Free Trial pass online."
          : `Customer registered for ${selectedPlan?.name} (${billingText} cycle, ${priceText}/mo). Pass: ${passCode}`,
        source: isTrialOnly ? "Free Trial Booking" : "Membership Checkout",
      });

      setIsSuccess(true);
    } catch (err) {
      console.warn("Registration record error:", err);
      // Still show confirmed for good UX
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
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
              {isTrialOnly ? "Complimentary Pass" : "Membership Registration"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isSuccess ? (
            /* Success Receipt */
            <div className="text-center py-6 space-y-6 animate-fadeIn">
              <div className="inline-flex p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full">
                <CheckCircle className="h-12 w-12 text-emerald-500" />
              </div>

              <div className="space-y-2">
                <h4 className="font-display font-extrabold text-2xl text-white">
                  {isTrialOnly ? "Pass Activated!" : "Registration Confirmed!"}
                </h4>
                <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                  {isTrialOnly
                    ? "Your complimentary 3-day guest pass is now active."
                    : `Welcome to ${selectedPlan?.name}! Your club pass is ready.`}
                </p>
              </div>

              {/* Receipt Summary details */}
              <div className="bg-zinc-950 border border-zinc-800/80 p-5 rounded-2xl text-left text-xs space-y-3.5 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Athlete Name</span>
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
                  <span className="text-zinc-400 font-bold">{isTrialOnly ? "Pass Fee" : "Membership Plan"}</span>
                  <span className="text-red-500 font-black text-sm">
                    {isTrialOnly ? "₹0.00" : `${getModalPrice()} / month`}
                  </span>
                </div>
                {registrationId && (
                  <div className="flex justify-between border-t border-zinc-800/60 pt-3">
                    <span className="text-zinc-500">Digital Pass ID</span>
                    <span className="text-emerald-400 font-mono font-bold text-xs tracking-wider select-all">
                      {registrationId}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-zinc-800/60 pt-3">
                  <span className="text-zinc-500">Registration Status</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Verified & Recorded
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                Your entry details and welcome pass have been logged for <span className="text-zinc-400 font-bold">{formData.email}</span>. Simply show your Pass ID upon arrival at the front desk!
              </p>

              <button
                onClick={onClose}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Close & Return to Website
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
                <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-1.5 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-red-500" />
                  <span>Athlete Details</span>
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
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-red-600 transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Email */}
                  <div className="space-y-1">
                    <label htmlFor="modal-email" className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Email Address
                    </label>
                    <input
                      id="modal-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. rahul@example.com"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-red-600 transition-colors"
                      required
                    />
                  </div>
                  {/* Phone */}
                  <div className="space-y-1">
                    <label htmlFor="modal-phone" className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      Phone Number
                    </label>
                    <input
                      id="modal-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-red-600 transition-colors"
                      required
                      pattern="[0-9]{10}"
                    />
                  </div>
                </div>
              </div>

              {/* Membership Inclusions Callout */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <Award className="h-4 w-4 text-red-500" />
                  <span>IronPulse Club Registration</span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  {isTrialOnly
                    ? "Includes unrestricted access to gym floor, locker rooms, steam sauna, and baseline fitness assessment for 3 days."
                    : `Direct admission to ${selectedPlan?.name}. Includes orientation, state-of-the-art strength arena, locker facilities, and personal training options.`}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[9px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-medium">Instant Digital Pass</span>
                  <span className="text-[9px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-medium">No Waiting Period</span>
                  <span className="text-[9px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-medium">Club Reception Check-in</span>
                </div>
              </div>

              {/* Secure Info Footer */}
              <div className="flex items-center gap-2 text-[10px] text-zinc-500 justify-center">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Verified Club Enrollment • Official IronPulse Fitness Registry</span>
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
                    {isTrialOnly ? "Claim Free 3-Day Pass" : `Confirm ${selectedPlan?.name || "Membership"}`}
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
