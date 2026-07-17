import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { TESTIMONIALS, Testimonial } from "../data";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  // Auto-play timer for carousel
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const activeTestimonial: Testimonial = TESTIMONIALS[currentIndex];

  return (
    <section id="testimonials" className="py-24 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-red-500 border-b-2 border-red-600 pb-1 inline-block">
            Success Stories
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Loved by Athletes
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Read first-hand accounts of physical transformations and strength journeys achieved here at IronPulse.
          </p>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 p-8 sm:p-12 md:p-16 rounded-3xl shadow-xl shadow-black/30 space-y-8">
          
          {/* Quote Icon Background */}
          <div className="absolute top-8 right-8 text-zinc-800/40 pointer-events-none">
            <Quote className="h-16 w-16 stroke-1 rotate-180" />
          </div>

          {/* Comment & Rating */}
          <div className="space-y-6">
            
            {/* Stars */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`h-5 w-5 ${
                    idx < activeTestimonial.rating
                      ? "fill-red-500 text-red-500"
                      : "text-zinc-700"
                  }`}
                />
              ))}
            </div>

            {/* Main Quote text */}
            <p className="text-zinc-200 text-lg sm:text-xl md:text-2xl font-medium leading-relaxed italic">
              &ldquo;{activeTestimonial.comment}&rdquo;
            </p>
          </div>

          {/* Profile row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-zinc-800/80">
            <div className="flex items-center gap-4 text-left">
              <img
                src={activeTestimonial.image}
                alt={activeTestimonial.name}
                className="w-14 h-14 rounded-full object-cover border border-zinc-800 shadow-md"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-display text-base font-bold text-white tracking-tight">
                  {activeTestimonial.name}
                </h4>
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                  {activeTestimonial.role}
                </p>
              </div>
            </div>

            {/* Slider Navigation Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={prevSlide}
                className="p-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800/80 text-zinc-400 hover:text-white rounded-xl transition-colors focus:outline-none"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800/80 text-zinc-400 hover:text-white rounded-xl transition-colors focus:outline-none"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

        </div>

        {/* Bullet Slide Indicators */}
        <div className="flex justify-center items-center gap-2.5 mt-8">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 transition-all rounded-full ${
                currentIndex === idx ? "w-8 bg-red-600" : "w-2 bg-zinc-800 hover:bg-zinc-700"
              }`}
              aria-label={`Go to testimonial slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
