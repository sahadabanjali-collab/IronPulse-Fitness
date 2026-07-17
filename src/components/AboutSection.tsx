import { useEffect, useState, useRef } from "react";
import { Award, ShieldCheck, Users } from "lucide-react";

interface CounterProps {
  end: number;
  suffix: string;
}

function Counter({ end, suffix }: CounterProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isStarted) return;

    let start = 0;
    const duration = 2000; // ms
    const incrementTime = Math.max(Math.floor(duration / end), 20);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration / incrementTime));
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isStarted, end]);

  return (
    <div ref={elementRef} className="text-3xl sm:text-4xl font-display font-extrabold text-white">
      {count.toLocaleString()}
      <span className="text-red-600 font-sans ml-1">{suffix}</span>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section 
      id="about" 
      className="relative py-24 bg-zinc-950 border-t border-zinc-900 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(9, 9, 11, 0.88), rgba(9, 9, 11, 0.55), rgba(9, 9, 11, 0.88)), url("https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`
      }}
    >
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 md:p-16 space-y-8">
          
          <div className="text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-red-500 border-b-2 border-red-600 pb-1 inline-block">
              Our Story
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Welcome to <span className="text-red-600">IronPulse Fitness</span>
            </h2>
          </div>

          <p 
            className="text-white text-justify text-lg sm:text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto font-medium"
            style={{ textShadow: '0 0 15px rgba(239, 68, 68, 0.4), 0 0 2px rgba(255, 255, 255, 0.9)' }}
          >
            Founded in 2016, IronPulse Fitness has grown from a local strength studio to the region&apos;s ultimate premium training temple. We reject the generic, fluorescent-lit gym mold and instead deliver a fully equipped athletic environment engineered for raw results, clean execution, and high-energy community support.
          </p>

          {/* Mission & Vision split card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-zinc-800/80">
            <div className="space-y-3 text-center sm:text-left">
              <h4 className="text-white font-display font-bold text-lg flex items-center justify-center sm:justify-start gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
                Our Mission
              </h4>
              <p 
                className="text-sm sm:text-base text-zinc-100 leading-relaxed text-justify font-bold bg-[#272020]/60 p-4 rounded-xl border border-red-900/30 shadow-lg"
                style={{ textShadow: '0 0 10px rgba(239, 68, 68, 0.3), 0 0 1px rgba(255, 255, 255, 0.7)' }}
              >
                To provide absolute elite-level equipment, progressive programming, and expert coaching guidance to help everyday athletes smash their raw strength and conditioning goals.
              </p>
            </div>
            <div className="space-y-3 text-center sm:text-left">
              <h4 className="text-white font-display font-bold text-lg flex items-center justify-center sm:justify-start gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
                Our Vision
              </h4>
              <p 
                className="text-sm sm:text-base text-zinc-100 leading-relaxed text-justify font-bold bg-[#272020]/60 p-4 rounded-xl border border-red-900/30 shadow-lg"
                style={{ textShadow: '0 0 10px rgba(239, 68, 68, 0.3), 0 0 1px rgba(255, 255, 255, 0.7)' }}
              >
                To establish a robust lifestyle movement centered around grit, active longevity, science-backed athletic training, and unbreakable mental resilience.
              </p>
            </div>
          </div>

          {/* Statistics Row with animated counters */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-zinc-800/80 text-center">
            <div className="space-y-1">
              <Counter end={5000} suffix="+" />
              <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">Active Members</p>
            </div>
            <div className="space-y-1">
              <Counter end={25} suffix="+" />
              <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">Expert Trainers</p>
            </div>
            <div className="space-y-1">
              <Counter end={10} suffix="+" />
              <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">Years of Excellence</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
