import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { saveContactInquiry } from "../lib/supabase";
import { CONTACT_INFO } from "../data";

interface ContactSectionProps {
  selectedProgram: string;
  onClearProgram: () => void;
}

export default function ContactSection({ selectedProgram, onClearProgram }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    program: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [supabaseErrorMessage, setSupabaseErrorMessage] = useState("");

  useEffect(() => {
    if (selectedProgram) {
      setFormData((prev) => ({ ...prev, program: selectedProgram }));
    }
  }, [selectedProgram]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSupabaseStatus("saving");
    setSupabaseErrorMessage("");

    try {
      await saveContactInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        program: formData.program,
        message: formData.message,
      });

      setSupabaseStatus("saved");
      setShowSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        program: "",
        message: "",
      });
      onClearProgram();

      // Clear success notification after 10 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 10000);
    } catch (err: any) {
      console.error("Failed to save to Supabase:", err);
      setSupabaseStatus("error");
      setSupabaseErrorMessage(err?.message || "Failed to sync submission to Supabase.");
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
              
              {showSuccess && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-start gap-3.5 animate-fadeIn">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-sm">Inquiry Sent & Synced to Supabase!</p>
                    <p className="text-xs text-zinc-400">
                      Thank you for choosing IronPulse. Your details have been securely recorded in the Supabase backend. One of our admissions counselors will reach out to you within the next 2 hours.
                    </p>
                  </div>
                </div>
              )}

              {supabaseStatus === "error" && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-rose-400 rounded-2xl flex flex-col gap-2 animate-fadeIn">
                  <div className="flex items-start gap-3">
                    <span className="h-5 w-5 shrink-0 text-rose-500 font-bold text-lg leading-none">✗</span>
                    <div>
                      <p className="font-bold text-sm">Supabase Storage Error</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{supabaseErrorMessage}</p>
                    </div>
                  </div>
                  <div className="text-[11px] text-zinc-500 pl-8 space-y-1">
                    <p>Make sure you have run the table creation script in your Supabase SQL Editor:</p>
                    <pre className="bg-zinc-950 p-2 rounded-lg font-mono text-[9px] text-zinc-400 overflow-x-auto select-all leading-normal whitespace-pre">
{`CREATE TABLE contact_inquiries (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT,
  email TEXT,
  phone TEXT,
  program TEXT,
  message TEXT
);`}
                    </pre>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Kumar"
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-red-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. rahul@example.com"
                      className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-red-600"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-phone" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-red-600"
                      required
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit mobile number"
                    />
                  </div>
                </div>

                {/* Program dropdown */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-program" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Program of Interest
                  </label>
                  <select
                    id="contact-program"
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-zinc-300 text-sm focus:outline-none focus:border-red-600 appearance-none cursor-pointer"
                    required
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
                    Tell Us About Your Goals
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe any weight loss, muscle gain goals, or prior fitness injuries..."
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-red-600 resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold text-sm rounded-xl transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 shadow-lg shadow-red-600/10 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Submit Admissions Inquiry</span>
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
