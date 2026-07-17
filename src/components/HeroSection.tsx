import { ArrowRight, Flame, Trophy, Zap } from "lucide-react";

interface HeroSectionProps {
  onJoinClick: () => void;
  onTrialClick: () => void;
}

export default function HeroSection({ onJoinClick, onTrialClick }: HeroSectionProps) {
  const handleLearnMore = () => {
    const el = document.getElementById("about");
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden pt-20"
    >
      {/* Background Image Overlay with dramatic dark vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1623874106686-5be2b325c8f1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="IronPulse gym training background"
          className="w-full h-full object-cover object-center opacity-40 scale-105 filter brightness-[0.35]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-zinc-950/90" />
      </div>

      {/* Hero Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Copy Column */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Top Brand Pill */}
            <div className="inline-flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 px-3.5 py-1.5 rounded-full text-xs text-red-500 font-bold uppercase tracking-widest mx-auto lg:mx-0 shadow-lg shadow-black/30">
              <Zap className="h-3.5 w-3.5 text-red-600 animate-pulse" />
              <span>IronPulse Fitness Arena</span>
            </div>

            {/* Headline and Tagline */}
            <div className="space-y-4">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
                Transform Your Body. <br />
                <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                  Transform Your Life.
                </span>
              </h1>
              <p className="text-zinc-400 text-lg sm:text-xl font-medium max-w-xl mx-auto lg:mx-0">
                &ldquo;Stronger Every Day. Better for Life.&rdquo; Break barriers, hit your peak potential, and forge the ultimate version of yourself.
              </p>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={onJoinClick}
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white font-bold text-base rounded-xl hover:bg-red-500 active:scale-95 transition-all duration-200 shadow-lg shadow-red-600/30"
              >
                <span>Join Now</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onTrialClick}
                className="px-8 py-4 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-white font-bold text-base rounded-xl active:scale-95 transition-all duration-200 backdrop-blur-md"
              >
                Start Free Trial
              </button>
            </div>

            {/* Benefits Row */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-950/50 max-w-md mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-red-500/10 rounded">
                  <Flame className="h-4 w-4 text-red-500" />
                </div>
                <span className="text-xs font-semibold text-zinc-300">Premium Gear</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 bg-red-500/10 rounded">
                  <Trophy className="h-4 w-4 text-red-500" />
                </div>
                <span className="text-xs font-semibold text-zinc-300">Expert Coaches</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 bg-red-500/10 rounded">
                  <Zap className="h-4 w-4 text-red-500" />
                </div>
                <span className="text-xs font-semibold text-zinc-300">Group Classes</span>
              </div>
            </div>
          </div>

          {/* Interactive Floating Card Column */}
          <div className="lg:col-span-5 hidden lg:block relative">
            {/* Visual Frame Overlay */}
            <div className="absolute inset-0 bg-red-600/10 blur-[80px] rounded-full z-0 pointer-events-none" />

            <div className="relative z-10 bg-zinc-900/80 backdrop-blur-lg border border-zinc-800 p-8 rounded-3xl shadow-2xl shadow-black/80 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-wider text-red-500">
                  Arena Live Pass
                </span>
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-white">
                  Complimentary 3-Day VIP Trial
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Experience full access to standard equipment floor, locker rooms, high-energy cardio zone, and custom body composition metrics.
                </p>
              </div>

              {/* Dynamic countdown element / benefit bullets */}
              <div className="bg-black/40 border border-zinc-800/80 p-4 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Locker access</span>
                  <span className="text-emerald-500 font-bold">Included</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Group spinning class</span>
                  <span className="text-emerald-500 font-bold">Included</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Custom Nutrition Advice</span>
                  <span className="text-red-500 font-medium">Premium Only</span>
                </div>
              </div>

              <button
                onClick={onTrialClick}
                className="w-full py-3 bg-white text-zinc-950 hover:bg-zinc-100 font-bold text-sm rounded-xl transition-colors active:scale-98"
              >
                Claim Your Free Trial Pass
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Down arrow link indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <button
          onClick={handleLearnMore}
          className="p-2 rounded-full border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700 transition-colors bg-black/30 backdrop-blur"
          aria-label="Scroll to About Section"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            ></path>
          </svg>
        </button>
      </div>
    </section>
  );
}
