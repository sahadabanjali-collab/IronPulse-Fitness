import { useEffect, useState } from "react";
import { Dumbbell } from "lucide-react";

export default function Loader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 1800); // 1.8 seconds initial loading splash
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black z-100 flex flex-col items-center justify-center space-y-4 transition-all duration-500">
      <div className="relative">
        {/* Glowing border rings */}
        <div className="absolute inset-0 bg-red-600/30 blur-[40px] rounded-full scale-150 animate-pulse" />
        <div className="relative p-6 bg-zinc-900 border border-zinc-800 rounded-2xl animate-bounce">
          <Dumbbell className="h-10 w-10 text-red-600 animate-spin" style={{ animationDuration: "3s" }} />
        </div>
      </div>
      <div className="text-center space-y-1.5 z-10">
        <h2 className="font-display font-black text-2xl tracking-widest text-white">
          IRON<span className="text-red-600">PULSE</span>
        </h2>
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold">
          Stronger Every Day. Better for Life.
        </p>
      </div>
      <div className="w-24 h-0.5 bg-zinc-900 rounded-full overflow-hidden relative">
        <div className="absolute h-full w-12 bg-red-600 rounded-full animate-infinite-loading" />
      </div>
    </div>
  );
}
