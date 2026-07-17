import { useState, FormEvent } from "react";
import { Facebook, Instagram, Twitter, Youtube, Linkedin, Dumbbell, Send, Check } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }, 1000);
  };

  const handleLinkClick = (href: string) => {
    const element = document.getElementById(href.substring(1));
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-black border-t border-zinc-900 text-zinc-400 py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-zinc-900">
          
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2 group self-start"
            >
              <div className="p-2 bg-red-600 rounded-lg group-hover:bg-red-500 transition-colors">
                <Dumbbell className="h-5 w-5 text-white" />
              </div>
              <span className="font-sans font-extrabold text-xl tracking-wider text-white">
                IRON<span className="text-red-600">PULSE</span>
              </span>
            </a>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Premium training environments engineered with state-of-the-art barbell arrays and expert metabolic support, forging ultimate physical breakthroughs.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="p-2.5 bg-zinc-900 hover:bg-red-600 border border-zinc-800 hover:border-red-500 text-zinc-400 hover:text-white rounded-xl transition-all duration-200"
                aria-label="Follow IronPulse on Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2.5 bg-zinc-900 hover:bg-red-600 border border-zinc-800 hover:border-red-500 text-zinc-400 hover:text-white rounded-xl transition-all duration-200"
                aria-label="Follow IronPulse on Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2.5 bg-zinc-900 hover:bg-red-600 border border-zinc-800 hover:border-red-500 text-zinc-400 hover:text-white rounded-xl transition-all duration-200"
                aria-label="Follow IronPulse on Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2.5 bg-zinc-900 hover:bg-red-600 border border-zinc-800 hover:border-red-500 text-zinc-400 hover:text-white rounded-xl transition-all duration-200"
                aria-label="Watch IronPulse videos on YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2.5 bg-zinc-900 hover:bg-red-600 border border-zinc-800 hover:border-red-500 text-zinc-400 hover:text-white rounded-xl transition-all duration-200"
                aria-label="Follow IronPulse on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">Explore</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href="#home"
                    onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="hover:text-red-500 transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    onClick={(e) => { e.preventDefault(); handleLinkClick("#about"); }}
                    className="hover:text-red-500 transition-colors"
                  >
                    About Story
                  </a>
                </li>
                <li>
                  <a
                    href="#programs"
                    onClick={(e) => { e.preventDefault(); handleLinkClick("#programs"); }}
                    className="hover:text-red-500 transition-colors"
                  >
                    Our Programs
                  </a>
                </li>
                <li>
                  <a
                    href="#membership"
                    onClick={(e) => { e.preventDefault(); handleLinkClick("#membership"); }}
                    className="hover:text-red-500 transition-colors"
                  >
                    Membership
                  </a>
                </li>
                <li>
                  <a
                    href="#trainers"
                    onClick={(e) => { e.preventDefault(); handleLinkClick("#trainers"); }}
                    className="hover:text-red-500 transition-colors"
                  >
                    Elite Coaches
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">Features</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href="#bmi"
                    onClick={(e) => { e.preventDefault(); handleLinkClick("#bmi"); }}
                    className="hover:text-red-500 transition-colors"
                  >
                    BMI Calculator
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    onClick={(e) => { e.preventDefault(); handleLinkClick("#testimonials"); }}
                    className="hover:text-red-500 transition-colors"
                  >
                    Success Stories
                  </a>
                </li>
                <li>
                  <a
                    href="#gallery"
                    onClick={(e) => { e.preventDefault(); handleLinkClick("#gallery"); }}
                    className="hover:text-red-500 transition-colors"
                  >
                    Arena Gallery
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    onClick={(e) => { e.preventDefault(); handleLinkClick("#faq"); }}
                    className="hover:text-red-500 transition-colors"
                  >
                    FAQs Guide
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    onClick={(e) => { e.preventDefault(); handleLinkClick("#contact"); }}
                    className="hover:text-red-500 transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">Newsletter</h4>
            <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
              Subscribe to the IronPulse journal for weekly conditioning routines, muscle meals, and early admissions passes.
            </p>
            
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 pr-12"
                required
              />
              <button
                type="submit"
                disabled={loading || subscribed}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-red-600 hover:bg-red-500 disabled:bg-emerald-600 text-white rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Submit newsletter subscription"
              >
                {loading ? (
                  <div className="h-4.5 w-4.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : subscribed ? (
                  <Check className="h-4.5 w-4.5 text-white" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
            {subscribed && (
              <p className="text-[11px] text-emerald-400 font-bold animate-fadeIn">
                ✓ Registered! Check your inbox for the IronPulse starter blueprint.
              </p>
            )}
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600 font-medium">
          <p>&copy; {new Date().getFullYear()} IronPulse Fitness. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Refund Guidelines</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
