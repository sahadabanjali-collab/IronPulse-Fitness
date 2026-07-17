import * as Icons from "lucide-react";
import { PROGRAMS, Program } from "../data";

// Helper to map string to Lucide icon component safely
function renderProgramIcon(iconName: string) {
  switch (iconName) {
    case "Dumbbell":
      return <Icons.Dumbbell className="h-6 w-6 text-red-500 group-hover:text-white transition-colors" />;
    case "Flame":
      return <Icons.Flame className="h-6 w-6 text-red-500 group-hover:text-white transition-colors" />;
    case "Activity":
      return <Icons.Activity className="h-6 w-6 text-red-500 group-hover:text-white transition-colors" />;
    case "Zap":
      return <Icons.Zap className="h-6 w-6 text-red-500 group-hover:text-white transition-colors" />;
    case "Shield":
      return <Icons.Shield className="h-6 w-6 text-red-500 group-hover:text-white transition-colors" />;
    case "Users":
      return <Icons.Users className="h-6 w-6 text-red-500 group-hover:text-white transition-colors" />;
    default:
      return <Icons.Info className="h-6 w-6 text-red-500 group-hover:text-white transition-colors" />;
  }
}

interface ProgramsSectionProps {
  onSelectProgram: (programName: string) => void;
}

export default function ProgramsSection({ onSelectProgram }: ProgramsSectionProps) {
  return (
    <section id="programs" className="py-24 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
      {/* Visual background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header section */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-red-500 border-b-2 border-red-600 pb-1 inline-block">
            Our Programs
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Designed for Elite Results
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Choose a training path meticulously engineered around modern biomechanics and athletic progression. No filler, only absolute progress.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROGRAMS.map((program: Program) => (
            <div
              key={program.id}
              className="group relative bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-red-600/50 rounded-3xl transition-all duration-350 hover:shadow-[0_15px_30px_rgba(239,68,68,0.08)] flex flex-col justify-between overflow-hidden"
            >
              {/* Card Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/10 to-transparent" />
                
                {/* Floating Icon */}
                <div className="absolute bottom-4 left-4 inline-flex p-3 bg-zinc-950/90 backdrop-blur-sm border border-zinc-800 rounded-xl group-hover:bg-red-600 group-hover:border-red-500 transition-all duration-300">
                  {renderProgramIcon(program.iconName)}
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between">
                {/* Title & description */}
                <div className="space-y-3">
                  <h3 className="font-display text-xl font-bold text-white group-hover:text-red-500 transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {program.description}
                  </p>
                </div>

                {/* Call to action */}
                <div className="pt-6 mt-6 border-t border-zinc-800/50">
                  <button
                    onClick={() => onSelectProgram(program.title)}
                    className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-red-500 transition-colors group/btn"
                  >
                    <span>Learn More</span>
                    <Icons.ChevronRight className="h-4 w-4 text-red-500 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
