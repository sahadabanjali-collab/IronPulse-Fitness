import { useState, useEffect } from "react";
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
import WhatsAppButton from "./components/WhatsAppButton";
import CheckoutModal from "./components/CheckoutModal";
import AdminPortal from "./components/admin/AdminPortal";
import { MEMBERSHIP_PLANS, MembershipPlan } from "./data";

export default function App() {
  const [currentView, setCurrentView] = useState<"website" | "admin">("website");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [isTrialOnly, setIsTrialOnly] = useState(false);

  // Sync path /admin or hash #admin
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (path.startsWith("/admin") || hash.startsWith("#admin") || hash.startsWith("#/admin")) {
        setCurrentView("admin");
      } else {
        setCurrentView("website");
      }
    };

    handleRouteChange();
    window.addEventListener("hashchange", handleRouteChange);
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("hashchange", handleRouteChange);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  const backToWebsite = () => {
    if (window.location.hash.includes("admin")) {
      window.location.hash = "";
    }
    if (window.location.pathname.startsWith("/admin")) {
      window.history.pushState({}, "", "/");
    }
    setCurrentView("website");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  // Render Admin Portal if in Admin view
  if (currentView === "admin") {
    return <AdminPortal onBackToSite={backToWebsite} />;
  }

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans overflow-x-hidden antialiased">
      {/* 1. Full-screen Premium Entrance Loader */}
      <Loader />

      {/* 2. Sticky Glassmorphism Navigation Menu */}
      <Navbar
        onJoinClick={handleJoinNowTrigger}
      />

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

      {/* 13. Deep-Gray Structured Footer */}
      <Footer />

      {/* 14. Responsive Scroll Back Button */}
      <ScrollToTop />

      {/* 15. Official Floating WhatsApp Direct Connect */}
      <WhatsAppButton />

      {/* 16. Secured Mock Billing / Registration Dialog */}
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
