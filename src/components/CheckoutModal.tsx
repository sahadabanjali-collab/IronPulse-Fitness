import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { X, CheckCircle, Wallet, ShieldCheck, Ticket, Calendar } from "lucide-react";
import { MembershipPlan } from "../data";
import { saveMembership } from "../lib/supabase";

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
  const [paymentId, setPaymentId] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [supabaseErrorMessage, setSupabaseErrorMessage] = useState("");

  const performSupabaseSave = async (payId: string) => {
    setSupabaseStatus("saving");
    try {
      await saveMembership({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "",
        plan_name: isTrialOnly ? "3-Day Free Trial" : (selectedPlan?.name || ""),
        price: isTrialOnly ? "₹0.00" : getModalPrice(),
        billing_cycle: isTrialOnly ? "Trial" : (isAnnual ? "Annual" : "Monthly"),
        payment_id: payId,
        is_trial: isTrialOnly || false,
      });
      setSupabaseStatus("saved");
    } catch (err: any) {
      console.error("Supabase Save failed:", err);
      setSupabaseStatus("error");
      setSupabaseErrorMessage(err?.message || "Failed to save details to Supabase. Check your connection or table schema.");
    }
  };

  // Dynamic injection of Razorpay SDK
  useEffect(() => {
    if (typeof (window as any).Razorpay !== "undefined") {
      setRazorpayLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => console.error("Razorpay SDK failed to load.");
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

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
      setPaymentId("");
      setSupabaseStatus("idle");
      setSupabaseErrorMessage("");
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

  const getNumericPrice = () => {
    if (isTrialOnly || !selectedPlan) return 0;
    const priceStr = getModalPrice();
    const cleaned = priceStr.replace("₹", "").replace(/,/g, "");
    return parseInt(cleaned, 10) || 0;
  };

  const handleCheckoutSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (isTrialOnly) {
      setIsSubmitting(true);
      const trialId = "trial_" + Math.random().toString(36).substring(7);
      setPaymentId(trialId);
      performSupabaseSave(trialId).finally(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      });
      return;
    }

    if (!razorpayLoaded) {
      alert("Razorpay payment gateway is still loading. Please check your internet connection.");
      return;
    }

    setIsSubmitting(true);
    const numericAmount = getNumericPrice();
    const amountInPaise = numericAmount * 100;

    if (amountInPaise < 100) {
      alert("Amount must be at least ₹1 (100 paise).");
      setIsSubmitting(false);
      return;
    }

    try {
      // Step 1: Create Order on Backend
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.order_id) {
        throw new Error(orderData.error || "Failed to create Razorpay order.");
      }

      // Step 2: Open Razorpay Standard Checkout Modal
      const options = {
        key: orderData.key_id || (import.meta as any).env.VITE_RAZORPAY_KEY_ID || "rzp_test_TGc3IW2596kQAH",
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "IronPulse Fitness",
        description: `${selectedPlan?.name} Membership`,
        order_id: orderData.order_id,
        image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=200",
        handler: async function (response: any) {
          // Step 3: Send payment verification details to Backend
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              setPaymentId(response.razorpay_payment_id);
              setIsSuccess(true);
              performSupabaseSave(response.razorpay_payment_id);
            } else {
              alert(`Payment verification failed: ${verifyData.error || "Signature mismatch"}`);
            }
          } catch (vErr: any) {
            console.error("Verification error:", vErr);
            alert("Payment signature verification failed. Please contact support.");
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          plan: selectedPlan?.name || "",
          billing: isAnnual ? "Annual" : "Monthly",
        },
        theme: {
          color: "#dc2626", // IronPulse Red
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        alert(`Payment Failed: ${response.error?.description || response.error?.reason || "Transaction declined."}`);
        setIsSubmitting(false);
      });

      rzp.open();
    } catch (err: any) {
      console.error("Order creation or initialization error:", err);
      alert(`Error initializing payment: ${err.message || "Failed to reach order backend."}`);
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
                {paymentId && (
                  <div className="flex justify-between border-t border-zinc-800/60 pt-3">
                    <span className="text-zinc-500">Payment ID</span>
                    <span className="text-emerald-400 font-mono font-bold text-[10px] tracking-wide select-all">
                      {paymentId}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-zinc-800/60 pt-3">
                  <span className="text-zinc-500">Supabase Sync</span>
                  <span>
                    {supabaseStatus === "saving" && (
                      <span className="text-yellow-500 font-medium animate-pulse">Syncing...</span>
                    )}
                    {supabaseStatus === "saved" && (
                      <span className="text-emerald-500 font-bold">✓ Saved</span>
                    )}
                    {supabaseStatus === "error" && (
                      <span className="text-rose-500 font-medium">✗ Failed</span>
                    )}
                  </span>
                </div>
                {supabaseStatus === "error" && (
                  <div className="text-[10px] text-zinc-400 bg-red-950/20 border border-red-900/30 p-2.5 rounded-xl space-y-1 mt-2">
                    <p className="text-red-400 font-semibold">Supabase sync error:</p>
                    <p className="leading-normal">{supabaseErrorMessage}</p>
                    <p className="text-zinc-500 leading-normal pt-1 font-mono text-[9px]">
                      Ensure you ran the table creation SQL script in your Supabase SQL Editor.
                    </p>
                  </div>
                )}
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
                    <Wallet className="h-4 w-4 text-red-500" />
                    <span>2. Razorpay Secure Payment</span>
                  </h5>

                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Gateway Provider</span>
                      <span className="text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-full">
                        Razorpay Verified
                      </span>
                    </div>
                    
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      You will pay securely using Razorpay. Supports <strong className="text-white">UPI, GPay, PhonePe, NetBanking, Credit/Debit Cards, and Wallets</strong>.
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-900">
                      <span className="text-[9px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-medium">UPI / GPay</span>
                      <span className="text-[9px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-medium">NetBanking</span>
                      <span className="text-[9px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-medium">Cards</span>
                      <span className="text-[9px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-medium">Wallets</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Secure Info Footer */}
              <div className="flex items-center gap-2 text-[10px] text-zinc-500 justify-center">
                <ShieldCheck className="h-4 w-4 text-red-500" />
                <span>256-Bit SSL Encrypted Connection. Securely processed by Razorpay.</span>
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
                    {isTrialOnly ? "Claim Free 3-Day Pass" : `Pay with Razorpay`}
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
