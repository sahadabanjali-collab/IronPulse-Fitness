import { useState, useEffect } from "react";
import { Menu, X, Dumbbell } from "lucide-react";

interface NavbarProps {
  onJoinClick: () => void;
}

export default function Navbar({ onJoinClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Programs", href: "#programs" },
    { label: "Membership", href: "#membership" },
    { label: "Trainers", href: "#trainers" },
    { label: "BMI", href: "#bmi" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Gallery", href: "#gallery" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Background effect
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Active section highlight
      const sections = navItems.map((item) => {
        const el = document.getElementById(item.href.substring(1));
        return {
          id: item.href.substring(1),
          offset: el ? el.offsetTop - 100 : 0,
          height: el ? el.offsetHeight : 0,
        };
      });

      const scrollPosition = window.scrollY + 120;
      const currentSection = sections.find(
        (section) =>
          scrollPosition >= section.offset &&
          scrollPosition < section.offset + section.height
      );

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.getElementById(href.substring(1));
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      id="main-nav"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/85 backdrop-blur-md border-b border-zinc-800/60 py-4 shadow-lg shadow-black/20"
          : "bg-gradient-to-b from-black/80 to-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2 group"
          >
            <div className="p-2 bg-red-600 rounded-lg group-hover:bg-red-500 transition-colors">
              <Dumbbell className="h-5 w-5 text-white animate-pulse" />
            </div>
            <span className="font-sans font-extrabold text-xl tracking-wider text-white">
              IRON<span className="text-red-600">PULSE</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeSection === item.href.substring(1)
                      ? "text-red-500 bg-red-500/5 font-semibold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <button
              onClick={onJoinClick}
              className="px-5 py-2.5 bg-red-600 text-white font-semibold text-sm rounded-lg hover:bg-red-500 active:scale-95 transition-all duration-200 shadow-md shadow-red-600/20"
            >
              Join Now
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-400 hover:text-white p-2 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`lg:hidden fixed inset-x-0 top-[72px] bg-zinc-950/95 backdrop-blur-lg border-b border-zinc-800 transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-screen py-6 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
              className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                activeSection === item.href.substring(1)
                  ? "text-red-500 bg-red-500/10 font-bold"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              {item.label}
            </a>
          ))}
          <div className="pt-4 px-4">
            <button
              onClick={() => {
                setIsOpen(false);
                onJoinClick();
              }}
              className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 active:scale-95 transition-all duration-200"
            >
              Join Now
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
