import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";

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

  useEffect(() => {
    if (selectedProgram) {
      setFormData((prev) => ({ ...prev, program: selectedProgram }));
    }
  }, [selectedProgram]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        program: "",
        message: "",
      });
      onClearProgram();

      // Clear success notification after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }, 1500);
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
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-600/10 border border-red-500/20 text-red-500 rounded-2xl">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Call Admissions</p>
                    <a href="tel:+919876543210" className="text-sm sm:text-base text-zinc-200 hover:text-white font-semibold transition-colors mt-0.5 block">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-600/10 border border-red-500/20 text-red-500 rounded-2xl">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">General Enquiries</p>
                    <a href="mailto:info@ironpulse.com" className="text-sm sm:text-base text-zinc-200 hover:text-white font-semibold transition-colors mt-0.5 block">
                      info@ironpulse.com
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
                      12, Outer Ring Rd, Sector 4, HSR Layout, Bengaluru, Karnataka 560102
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
                        <span className="text-zinc-200">5:00 AM - 11:00 PM</span>
                      </p>
                      <p className="flex justify-between gap-6">
                        <span className="text-zinc-500">Sunday:</span>
                        <span className="text-zinc-200">6:00 AM - 8:00 PM</span>
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
                  <div>
                    <p className="font-bold text-sm">Application Sent Successfully!</p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Thank you for choosing IronPulse. One of our admissions counselors will reach out to you via call or email within the next 2 hours.
                    </p>
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
