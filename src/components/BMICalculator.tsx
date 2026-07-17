import { useState, FormEvent } from "react";
import { Calculator, Info, RotateCcw, Sparkles } from "lucide-react";

export default function BMICalculator() {
  const [height, setHeight] = useState<string>("175");
  const [weight, setWeight] = useState<string>("70");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>("");
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");

  const calculateBMI = (e: FormEvent) => {
    e.preventDefault();
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      alert("Please enter valid height and weight values.");
      return;
    }

    let bmiValue = 0;
    if (unitSystem === "metric") {
      // height in cm, weight in kg
      const heightInMeters = h / 100;
      bmiValue = w / (heightInMeters * heightInMeters);
    } else {
      // height in inches, weight in lbs
      bmiValue = (w / (h * h)) * 703;
    }

    const roundedBmi = parseFloat(bmiValue.toFixed(1));
    setBmi(roundedBmi);

    // Determine Category
    if (roundedBmi < 18.5) {
      setBmiCategory("Underweight");
    } else if (roundedBmi >= 18.5 && roundedBmi < 25) {
      setBmiCategory("Normal");
    } else if (roundedBmi >= 25 && roundedBmi < 30) {
      setBmiCategory("Overweight");
    } else {
      setBmiCategory("Obese");
    }
  };

  const handleReset = () => {
    setHeight(unitSystem === "metric" ? "175" : "70");
    setWeight(unitSystem === "metric" ? "70" : "150");
    setBmi(null);
    setBmiCategory("");
  };

  const handleUnitChange = (system: "metric" | "imperial") => {
    setUnitSystem(system);
    if (system === "metric") {
      setHeight("175");
      setWeight("70");
    } else {
      setHeight("68");
      setWeight("150");
    }
    setBmi(null);
    setBmiCategory("");
  };

  // Advice mapping based on BMI category
  const getBmiAdvice = (category: string) => {
    switch (category) {
      case "Underweight":
        return {
          title: "Focus on Hypertrophy & Caloric Surplus",
          text: "We recommend pairing structural progressive resistance training (3-4 times/week) with a nutrient-dense diet rich in healthy fats and high-quality protein.",
          color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        };
      case "Normal":
        return {
          title: "Maintain Lean Muscle & Active Conditioning",
          text: "Excellent! Your BMI is in the optimal range. Keep up physical conditioning by incorporating a balanced mix of heavy strength drills and metabolic cardio workouts.",
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        };
      case "Overweight":
        return {
          title: "Incorporate Strength & Metabolic Resistance",
          text: "We suggest prioritizing full-body resistance training paired with HIIT cardiorespiratory conditioning (such as spinning or box drills) to increase calorie burn.",
          color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
        };
      case "Obese":
        return {
          title: "Consistent Caloric Deficit & Low-Impact Exercises",
          text: "Prioritize structured resistance layouts to safeguard joint integrity, and consult with our nutritionists to configure a sustained caloric deficit plan.",
          color: "text-red-400 bg-red-500/10 border-red-500/20",
        };
      default:
        return null;
    }
  };

  const advice = bmiCategory ? getBmiAdvice(bmiCategory) : null;

  return (
    <section id="bmi" className="py-24 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Main Info Column */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-red-500 border-b-2 border-red-600 pb-1 inline-block">
              Body Metrics
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Calculate Your BMI
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Body Mass Index (BMI) is a standardized measure that uses height and weight to estimate body fat. Use our real-time interactive calculator to understand your range and guide your physical progression.
            </p>

            {/* Scale Ranges Info Box */}
            <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Standard BMI Classifications:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-900 flex flex-col">
                  <span className="text-zinc-500">Underweight</span>
                  <span className="text-amber-500 font-bold">&lt; 18.5</span>
                </div>
                <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-900 flex flex-col">
                  <span className="text-zinc-500">Normal</span>
                  <span className="text-emerald-500 font-bold">18.5 - 24.9</span>
                </div>
                <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-900 flex flex-col">
                  <span className="text-zinc-500">Overweight</span>
                  <span className="text-orange-500 font-bold">25.0 - 29.9</span>
                </div>
                <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-900 flex flex-col">
                  <span className="text-zinc-500">Obese</span>
                  <span className="text-red-500 font-bold">&ge; 30.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Form Column */}
          <div className="lg:col-span-6">
            <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 p-8 rounded-3xl shadow-xl shadow-black/40 space-y-6">
              
              {/* Calculator Header / System Toggle */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-red-500" />
                  <span className="font-display font-bold text-white text-base">BMI Machine</span>
                </div>
                <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800/80">
                  <button
                    onClick={() => handleUnitChange("metric")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                      unitSystem === "metric"
                        ? "bg-red-600 text-white"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Metric
                  </button>
                  <button
                    onClick={() => handleUnitChange("imperial")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                      unitSystem === "imperial"
                        ? "bg-red-600 text-white"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Imperial
                  </button>
                </div>
              </div>

              {/* Calculator Form */}
              <form onSubmit={calculateBMI} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Height Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="bmi-height" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Height ({unitSystem === "metric" ? "cm" : "inches"})
                    </label>
                    <input
                      id="bmi-height"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder={unitSystem === "metric" ? "e.g. 175" : "e.g. 68"}
                      className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-600"
                      required
                      min="1"
                    />
                  </div>

                  {/* Weight Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="bmi-weight" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Weight ({unitSystem === "metric" ? "kg" : "lbs"})
                    </label>
                    <input
                      id="bmi-weight"
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder={unitSystem === "metric" ? "e.g. 70" : "e.g. 150"}
                      className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-600"
                      required
                      min="1"
                    />
                  </div>

                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl transition-colors shadow-md shadow-red-600/10"
                  >
                    Calculate BMI
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-colors"
                    title="Reset Fields"
                  >
                    <RotateCcw className="h-4.5 w-4.5" />
                  </button>
                </div>
              </form>

              {/* Results Display Pane */}
              {bmi !== null && (
                <div className="mt-6 pt-6 border-t border-zinc-800 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-wider">Your Body Mass Index</p>
                      <p className="text-4xl font-display font-black text-white mt-1">
                        {bmi} <span className="text-xs text-zinc-500">kg/m&sup2;</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-zinc-500 uppercase tracking-wider">Category</p>
                      <span
                        className={`inline-block px-3 py-1 mt-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          bmiCategory === "Normal"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : bmiCategory === "Underweight"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : bmiCategory === "Overweight"
                            ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {bmiCategory}
                      </span>
                    </div>
                  </div>

                  {/* Scale Visual representation slider */}
                  <div className="space-y-1">
                    <div className="relative h-2 w-full bg-zinc-950 rounded-full overflow-hidden flex">
                      <div className="h-full w-[18.5%] bg-amber-500/40" />
                      <div className="h-full w-[24.9%] bg-emerald-500/50" />
                      <div className="h-full w-[25%] bg-orange-500/40" />
                      <div className="h-full w-[31.6%] bg-red-500/40" />
                      
                      {/* Indicator marker pin */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg shadow-black"
                        style={{
                          left: `${Math.min(Math.max((bmi / 40) * 100, 4), 96)}%`,
                          transition: "all 0.5s ease-out",
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-zinc-600 font-bold uppercase">
                      <span>15</span>
                      <span>18.5</span>
                      <span>25</span>
                      <span>30</span>
                      <span>40+</span>
                    </div>
                  </div>

                  {/* Dynamic Advice Message */}
                  {advice && (
                    <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1 ${advice.color}`}>
                      <p className="font-bold flex items-center gap-1.5 uppercase tracking-wider">
                        <Sparkles className="h-3.5 w-3.5 shrink-0" />
                        <span>{advice.title}</span>
                      </p>
                      <p className="text-zinc-300 font-normal mt-1">{advice.text}</p>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
