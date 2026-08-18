import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { sendContactToN8n } from "../config/n8n";
import { saveContactInquiry } from "../lib/supabase";
import { CONTACT_INFO } from "../data";

interface ContactSectionProps {
  selectedProgram: string;
  onClearProgram: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function ContactSection({ selectedProgram, onClearProgram }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    program: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (selectedProgram) {
      setFormData((prev) => ({ ...prev, program: selectedProgram }));
    }
  }, [selectedProgram]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Full name is required.";
        if (value.trim().length < 2) return "Name must be at least 2 characters long.";
        return "";
      case "email":
        if (!value.trim()) return "Email address is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return "Please enter a valid email address (e.g. name@example.com).";
        }
        return "";
      case "phone":
        if (!value.trim()) return "Phone number is required.";
        const digitsOnly = value.replace(/\D/g, "");
        if (digitsOnly.length < 10) {
          return "Please enter a valid 10-digit phone number.";
        }
        return "";
      case "message":
        if (!value.trim()) return "Message cannot be empty.";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (submitStatus === "error") {
      setSubmitStatus("idle");
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const nameErr = validateField("name", formData.name);
    if (nameErr) newErrors.name = nameErr;

    const emailErr = validateField("email", formData.email);
    if (emailErr) newErrors.email = emailErr;

    const phoneErr = validateField("phone", formData.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const msgErr = validateField("message", formData.message);
    if (msgErr) newErrors.message = msgErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    const now = new Date();
    const formattedDate = now.toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "medium",
    });

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      subject: formData.program || "General Fitness Enquiry",
      message: formData.message.trim(),
      source: "IronPulse Fitness Website",
      submittedAt: formattedDate,
    };

    try {
      // 1. Post to n8n Webhook
      await sendContactToN8n(payload);

      // 2. Optionally record in Supabase database asynchronously (non-blocking)
      try {
        await saveContactInquiry({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          program: payload.subject,
          message: payload.message,
        });
      } catch (dbErr) {
        console.warn("Supabase record background notice:", dbErr);
      }

      // Success handling: Clear the form and show success notification
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        program: "",
        message: "",
      });
      setErrors({});
      onClearProgram();

      // Auto-hide success message after 12 seconds
      setTimeout(() => {
        setSubmitStatus((current) => (current === "success" ? "idle" : current));
      }, 12000);
    } catch (err: any) {
      console.error("Failed to submit to n8n webhook:", err);
      setSubmitStatus("error");
      setErrorMessage("Unable to submit your enquiry right now. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <section 
      id="contact" 
      className="py-24 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(9, 9, 11, 0.3), rgba(239, 68, 68, 0.15), rgba(9, 9, 11, 0.45)), url("https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`
      }}
    >
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-red-500 border-b-2 border-red-600 pb-1 inline-block">
            Get in Touch
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Start Your Transformation
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Ready to break barriers? Drop us a message, schedule a tour, or ask about our seasonal promotions.
          </p>
        </div>

        {/* Info & Form Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Info Card Column */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 p-8 rounded-3xl space-y-8 shadow-xl shadow-black/30">
              <h3 className="font-display text-xl font-bold text-white tracking-tight">Contact Information</h3>
              
              <div className="space-y-6">
                {/* Phone & WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-600/10 border border-red-500/20 text-red-500 rounded-2xl">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Call / WhatsApp Admissions</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <a href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`} className="text-sm sm:text-base text-zinc-200 hover:text-white font-semibold transition-colors block">
                        {CONTACT_INFO.phone}
                      </a>
                      <a
                        href={`https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(CONTACT_INFO.whatsappMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-bold rounded-lg transition-colors"
                      >
                        <svg className="w-3.5 h-3.5 fill-[#25D366]" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                        </svg>
                        <span>Chat</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-600/10 border border-red-500/20 text-red-500 rounded-2xl">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">General Enquiries</p>
                    <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm sm:text-base text-zinc-200 hover:text-white font-semibold transition-colors mt-0.5 block">
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-600/10 border border-red-500/20 text-red-500 rounded-2xl">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Our Location</p>
                    <p className="text-sm text-zinc-300 font-medium leading-relaxed mt-0.5">
                      {CONTACT_INFO.address}
                    </p>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-600/10 border border-red-500/20 text-red-500 rounded-2xl">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Business Hours</p>
                    <div className="text-xs sm:text-sm text-zinc-300 font-medium space-y-0.5">
                      <p className="flex justify-between gap-6">
                        <span className="text-zinc-500">Mon - Sat:</span>
                        <span className="text-zinc-200">{CONTACT_INFO.hours.weekdays}</span>
                      </p>
                      <p className="flex justify-between gap-6">
                        <span className="text-zinc-500">Sunday:</span>
                        <span className="text-zinc-200">{CONTACT_INFO.hours.sunday}</span>
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Embedded Google Maps Container */}
            <div className="rounded-3xl overflow-hidden border border-zinc-800 shadow-xl bg-zinc-900 h-64 relative">
              {/* Premium Dark Styler Map Iframe */}
              <iframe
                title="IronPulse Gym Google Maps Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.750516709664!2d77.633852!3d12.9237243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1460d3d5f1db%3A0x6b801a6b0c2a5e88!2sHSR%20Layout%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 grayscale invert filter brightness-90 contrast-125"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer"
              ></iframe>
              <div className="absolute top-4 left-4 bg-zinc-950/90 backdrop-blur-md border border-zinc-800 px-3 py-1.5 rounded-full text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
                <span>IronPulse HQ Arena</span>
              </div>
            </div>

          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 p-8 sm:p-10 rounded-3xl shadow-xl space-y-6">
              <h3 className="font-display text-xl font-bold text-white tracking-tight">Admissions Request Form</h3>
              
              {/* Success Notification matching dark/red premium theme */}
              {submitStatus === "success" && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-start gap-3.5 animate-fadeIn">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-sm">Enquiry Received!</p>
                    <p className="text-xs text-zinc-300">
                      Thank you for contacting IronPulse Fitness! Your enquiry has been received. Our team will contact you shortly.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Notification */}
              {submitStatus === "error" && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 text-rose-400 rounded-2xl flex items-start gap-3.5 animate-fadeIn">
                  <AlertCircle className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-sm">Submission Error</p>
                    <p className="text-xs text-zinc-300">
                      {errorMessage || "Unable to submit your enquiry right now. Please try again or contact us directly."}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Kumar"
                    disabled={isSubmitting}
                    className={`w-full bg-zinc-950/80 border rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none transition-colors ${
                      errors.name ? "border-red-500 focus:border-red-400" : "border-zinc-800 focus:border-red-600"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-medium">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. rahul@example.com"
                      disabled={isSubmitting}
                      className={`w-full bg-zinc-950/80 border rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none transition-colors ${
                        errors.email ? "border-red-500 focus:border-red-400" : "border-zinc-800 focus:border-red-600"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-medium">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-phone" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      disabled={isSubmitting}
                      className={`w-full bg-zinc-950/80 border rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none transition-colors ${
                        errors.phone ? "border-red-500 focus:border-red-400" : "border-zinc-800 focus:border-red-600"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-medium">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Program dropdown (Subject) */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-program" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Subject / Interested Service
                  </label>
                  <select
                    id="contact-program"
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-zinc-300 text-sm focus:outline-none focus:border-red-600 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select your goal program</option>
                    <option value="Strength Training">Strength Training</option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Bodybuilding">Bodybuilding</option>
                    <option value="Functional Fitness">Functional Fitness</option>
                    <option value="Cross Training">Cross Training</option>
                    <option value="Personal Training">Personal Training</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your fitness goals, preferred training schedule, or any inquiries..."
                    disabled={isSubmitting}
                    className={`w-full bg-zinc-950/80 border rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none transition-colors resize-none ${
                      errors.message ? "border-red-500 focus:border-red-400" : "border-zinc-800 focus:border-red-600"
                    }`}
                  ></textarea>
                  {errors.message && (
                    <p className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-medium">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 shadow-lg shadow-red-600/10 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
