import { Facebook, Instagram, Twitter, Trophy, Star } from "lucide-react";
import { TRAINERS, Trainer } from "../data";

export default function TrainersSection() {
  return (
    <section id="trainers" className="py-24 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-red-500 border-b-2 border-red-600 pb-1 inline-block">
            Our Elite Coaches
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Meet Your Champions
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
            Our trainers aren&apos;t just guides; they are professional athletes, strength record holders, and certified metabolic experts committed to your form and progress.
          </p>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRAINERS.map((trainer: Trainer) => (
            <div
              key={trainer.id}
              className="group relative rounded-3xl overflow-hidden bg-zinc-900/50 border border-zinc-800 hover:border-red-600/40 transition-all duration-300"
            >
              {/* Photo Area with zoom scale */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-95 contrast-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Experience Badge on corner */}
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-zinc-800 px-3 py-1 rounded-full text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Trophy className="h-3 w-3 text-red-500" />
                  <span>{trainer.experience} Exp</span>
                </div>
              </div>

              {/* Coach details content container */}
              <div className="p-6 relative bg-zinc-900/90 border-t border-zinc-800/80">
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold text-white tracking-tight">
                    {trainer.name}
                  </h3>
                  <p className="text-red-500 text-xs font-semibold uppercase tracking-wider">
                    {trainer.role}
                  </p>
                </div>

                {/* Animated Socials Drawer & Credentials details inside hover */}
                <div className="mt-4 pt-4 border-t border-zinc-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                    <Star className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                    <span>Gold Standard Coach</span>
                  </div>

                  {/* Social Icons Container */}
                  <div className="flex items-center gap-2.5">
                    <a
                      href={trainer.socials.instagram}
                      className="text-zinc-400 hover:text-white transition-colors"
                      aria-label={`${trainer.name} Instagram Profile`}
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                    <a
                      href={trainer.socials.twitter}
                      className="text-zinc-400 hover:text-white transition-colors"
                      aria-label={`${trainer.name} Twitter Profile`}
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                    <a
                      href={trainer.socials.facebook}
                      className="text-zinc-400 hover:text-white transition-colors"
                      aria-label={`${trainer.name} Facebook Profile`}
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
