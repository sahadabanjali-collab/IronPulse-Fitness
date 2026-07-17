import { useState, useEffect } from "react";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { GALLERY, GalleryItem } from "../data";

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ["All", "Workout Area", "Cardio", "Weightlifting Zone", "Yoga Studio", "Group Classes"];

  const filteredItems = activeFilter === "All"
    ? GALLERY
    : GALLERY.filter((item) => item.category === activeFilter);

  // Close Lightbox on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft" && lightboxIndex !== null) handlePrev();
      if (e.key === "ArrowRight" && lightboxIndex !== null) handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev! - 1));
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev! + 1));
  };

  return (
    <section id="gallery" className="py-24 bg-zinc-950 border-t border-zinc-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-red-500 border-b-2 border-red-600 pb-1 inline-block">
            Our Facility
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            The Training Grounds
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
            Take a visual tour of our premier high-performance floor, premium cardio units, calming yoga sanctuary, and heavy bodybuilding sections.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap justify-center items-center gap-2.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveFilter(cat);
                setLightboxIndex(null); // Reset lightbox on filter change to map correct array indexes
              }}
              className={`px-4.5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all cursor-pointer ${
                activeFilter === cat
                  ? "bg-red-600 text-white shadow-md shadow-red-600/10 font-bold"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item: GalleryItem, idx: number) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(idx)}
              className="group relative aspect-video rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 cursor-pointer shadow-lg"
            >
              {/* Image with zoom scale */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-75"
                loading="lazy"
                referrerPolicy="no-referrer"
              />

              {/* Hover Dark Vignette Glass overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-[10px] bg-red-600 text-white font-bold uppercase tracking-widest px-2.5 py-1 rounded-full self-start mb-2 shadow-sm shadow-red-600/20">
                  {item.category}
                </span>
                <h3 className="font-display text-base font-bold text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-zinc-400 text-xs mt-1 font-medium flex items-center gap-1.5">
                  <ZoomIn className="h-3.5 w-3.5 text-red-500" />
                  <span>Click to view full image</span>
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          {/* Close trigger background */}
          <div className="absolute inset-0 cursor-zoom-out" onClick={() => setLightboxIndex(null)} />

          {/* Controls bar */}
          <div className="absolute top-6 right-6 z-10 flex items-center gap-4">
            <span className="text-zinc-500 text-sm font-semibold font-mono">
              {lightboxIndex + 1} / {filteredItems.length}
            </span>
            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2.5 bg-zinc-900/80 backdrop-blur border border-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-6 z-10 p-3 bg-zinc-900/60 backdrop-blur border border-zinc-800/80 text-zinc-400 hover:text-white rounded-xl transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-6 z-10 p-3 bg-zinc-900/60 backdrop-blur border border-zinc-800/80 text-zinc-400 hover:text-white rounded-xl transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Image Frame */}
          <div className="relative max-w-5xl max-h-[85vh] z-10 flex flex-col items-center">
            <img
              src={filteredItems[lightboxIndex].image}
              alt={filteredItems[lightboxIndex].title}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl border border-zinc-800 shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="text-center mt-4">
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                {filteredItems[lightboxIndex].category}
              </span>
              <h4 className="text-white text-lg font-display font-bold mt-1">
                {filteredItems[lightboxIndex].title}
              </h4>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
