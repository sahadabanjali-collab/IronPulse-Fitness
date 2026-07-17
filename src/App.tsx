import { useState } from "react";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ProgramsSection from "./components/ProgramsSection";
import MembershipSection from "./components/MembershipSection";
import TrainersSection from "./components/TrainersSection";
import BMICalculator from "./components/BMICalculator";
import Testimonials from "./components/Testimonials";
import Gallery from "./components/Gallery";
import FAQSection from "./components/FAQSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import CheckoutModal from "./components/CheckoutModal";
import { MEMBERSHIP_PLANS, MembershipPlan } from "./data";

export default function App() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [isTrialOnly, setIsTrialOnly] = useState(false);

  // Prefill state for contact form program interest
  const [selectedProgramInterest, setSelectedProgramInterest] = useState("");

  const handleJoinNowTrigger = () => {
    // Select premium plan by default for generic join click
    const premiumPlan = MEMBERSHIP_PLANS.find((p) => p.id === "premium") || MEMBERSHIP_PLANS[0];
    setSelectedPlan(premiumPlan);
    setIsAnnual(false);
    setIsTrialOnly(false);
    setIsCheckoutOpen(true);
  };

  const handleFreeTrialTrigger = () => {
    setSelectedPlan(null);
    setIsAnnual(false);
    setIsTrialOnly(true);
    setIsCheckoutOpen(true);
  };

  const handlePlanSelectTrigger = (plan: MembershipPlan, annualSelected: boolean) => {
    setSelectedPlan(plan);
    setIsAnnual(annualSelected);
    setIsTrialOnly(false);
    setIsCheckoutOpen(true);
  };

  const handleLearnMoreProgramTrigger = (programTitle: string) => {
    // Prefill program state
    setSelectedProgramInterest(programTitle);
    
    // Smooth scroll down to Contact form
    const contactEl = document.getElementById("contact");
    if (contactEl) {
      window.scrollTo({
        top: contactEl.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans overflow-x-hidden antialiased">
      {/* 1. Full-screen Premium Entrance Loader */}
      <Loader />

      {/* 2. Sticky Glassmorphism Navigation Menu */}
      <Navbar onJoinClick={handleJoinNowTrigger} />

      {/* 3. Hero Layout Stage with Floating Cards */}
      <HeroSection
        onJoinClick={handleJoinNowTrigger}
        onTrialClick={handleFreeTrialTrigger}
      />

      {/* 4. About Story & Accomplishment Counters */}
      <AboutSection />

      {/* 5. Core Fitness Programs & Interest Prefill Action */}
      <ProgramsSection onSelectProgram={handleLearnMoreProgramTrigger} />

      {/* 6. Pricing Cards & Billing Interval Selection */}
      <MembershipSection onPlanSelect={handlePlanSelectTrigger} />

      {/* 7. Interactive Body Metrics Calculator */}
      <BMICalculator />

      {/* 8. Verified Coach Cards */}
      <TrainersSection />

      {/* 9. Success Story Sliders */}
      <Testimonials />

      {/* 10. Filterable High-Contrast Image Grid */}
      <Gallery />

      {/* 11. Collapsible FAQs Group */}
      <FAQSection />

      {/* 12. Validated Contact Form & Active Map */}
      <ContactSection
        selectedProgram={selectedProgramInterest}
        onClearProgram={() => setSelectedProgramInterest("")}
      />

      {/* 13. Deep-Gray Structured Footer & Newsletter Sign-up */}
      <Footer />

      {/* 14. Responsive Scroll Back Button */}
      <ScrollToTop />

      {/* 15. Secured Mock Billing / Registration Dialog */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedPlan={selectedPlan}
        isAnnual={isAnnual}
        isTrialOnly={isTrialOnly}
      />
    </div>
  );
}
