import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      id="scroll-to-top"
      onClick={scrollToTop}
      className={`fixed bottom-[88px] right-6 z-40 p-3 bg-zinc-900 hover:bg-red-600 border border-zinc-700/80 hover:border-red-500 text-zinc-300 hover:text-white rounded-2xl shadow-xl shadow-black/50 active:scale-95 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="Scroll back to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
