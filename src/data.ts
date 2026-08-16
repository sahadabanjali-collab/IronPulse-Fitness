export interface Program {
  id: string;
  title: string;
  description: string;
  iconName: string; // Used to dynamically map Lucide icons
  image: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular: boolean;
  ctaText: string;
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  experience: string;
  image: string;
  socials: {
    instagram: string;
    twitter: string;
    facebook: string;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  rating: number;
  comment: string;
}

export interface GalleryItem {
  id: string;
  category: string;
  title: string;
  image: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const PROGRAMS: Program[] = [
  {
    id: "strength",
    title: "Strength Training",
    description: "Build raw strength, increase bone density, and sculpt your physique with our compound barbell and free-weight movements led by experts.",
    iconName: "Dumbbell",
    image: "https://plus.unsplash.com/premium_photo-1663050901483-ee8703cc8372?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "weight-loss",
    title: "Weight Loss",
    description: "High-intensity cardio paired with metabolic conditioning designed to torch calories, kickstart fat loss, and boost cardiorespiratory health.",
    iconName: "Flame",
    image: "https://images.unsplash.com/photo-1470167290877-7d5d3446de4c?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "bodybuilding",
    title: "Bodybuilding",
    description: "Hypertrophy-focused training templates and progressive overload structures crafted to maximize muscle growth and aesthetic proportions.",
    iconName: "Activity",
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "functional",
    title: "Functional Fitness",
    description: "Enhance your everyday movement capabilities, stability, balance, and core strength using kettlebells, medicine balls, and TRX systems.",
    iconName: "Zap",
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "cross-training",
    title: "Cross Training",
    description: "A hybrid physical training regimen blending Olympic weightlifting, gymnastics, and cardiovascular endurance for complete athletic conditioning.",
    iconName: "Shield",
    image: "https://images.unsplash.com/photo-1758875570256-6510adffb1de?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "personal-training",
    title: "Personal Training",
    description: "1-on-1 coaching with customized workout routines, dedicated form analysis, and tailored nutritional blueprints optimized for your body.",
    iconName: "Users",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=60"
  }
];

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "basic",
    name: "Basic Plan",
    price: "₹999",
    period: "month",
    features: [
      "Access to Gym Floor & Cardio Zone",
      "Standard Locker Room Access",
      "1 Complementary Fitness Assessment",
      "Free High-Speed Wi-Fi",
      "Water station access"
    ],
    popular: false,
    ctaText: "Get Started"
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: "₹1,999",
    period: "month",
    features: [
      "Everything in Basic Plan Included",
      "Unlimited Access to All Group Classes",
      "Custom IronPulse Nutrition Guide",
      "2 Personal Trainer Sessions / Month",
      "Steam Room & Sauna Access",
      "Exclusive IronPulse T-Shirt"
    ],
    popular: true,
    ctaText: "Join Premium"
  },
  {
    id: "elite",
    name: "Elite Plan",
    price: "₹3,499",
    period: "month",
    features: [
      "Everything in Premium Plan Included",
      "Dedicated Personal Trainer (2 Sessions / Week)",
      "Weekly Body Composition Analysis",
      "Personalized Weekly Diet Consultation",
      "VIP Locker Room & Towel Service",
      "Priority Customer Support 24/7",
      "Bring 1 Free Guest per Visit"
    ],
    popular: false,
    ctaText: "Go Elite"
  }
];

export const TRAINERS: Trainer[] = [
  {
    id: "john-steel",
    name: "John Steel",
    role: "Head Coach & Co-Founder",
    experience: "12+ Years",
    image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=600",
    socials: {
      instagram: "#",
      twitter: "#",
      facebook: "#"
    }
  },
  {
    id: "sarah-active",
    name: "Sarah Active",
    role: "Strength & Conditioning Specialist",
    experience: "8+ Years",
    image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=600",
    socials: {
      instagram: "#",
      twitter: "#",
      facebook: "#"
    }
  },
  {
    id: "michael-peak",
    name: "Michael Peak",
    role: "Powerlifting Coach & Nutritionist",
    experience: "10+ Years",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=600",
    socials: {
      instagram: "#",
      twitter: "#",
      facebook: "#"
    }
  },
  {
    id: "jessica-flex",
    name: "Jessica Flex",
    role: "Yoga & Mobility Specialist",
    experience: "6+ Years",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=600",
    socials: {
      instagram: "#",
      twitter: "#",
      facebook: "#"
    }
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Vikram Malhotra",
    role: "Member for 1.5 Years",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    rating: 5,
    comment: "IronPulse completely changed my outlook on fitness. The coaches are highly professional, the equipment is top-tier, and the community environment is incredibly motivating. I've gained 8kg of lean muscle!"
  },
  {
    id: "t2",
    name: "Priya Sharma",
    role: "Member for 8 Months",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300",
    rating: 5,
    comment: "I joined the Premium plan for group classes and they are fantastic. High energy, friendly people, and intense workouts. I've lost 12kg so far and feel stronger and healthier than ever!"
  },
  {
    id: "t3",
    name: "Rohan Das",
    role: "Member for 2 Years",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    rating: 5,
    comment: "The Elite Plan is worth every rupee. Having Michael as my dedicated trainer completely refined my powerlifting form. The personalized diets are easy to follow and the results speak for themselves."
  },
  {
    id: "t4",
    name: "Ananya Iyer",
    role: "Member for 1 Year",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    rating: 4,
    comment: "Excellent gym! Extremely clean facility, premium lockers, and a stellar cardio range. The peak hours can get busy, but the energy in the gym makes up for it. Strongly recommend!"
  }
];

export const GALLERY: GalleryItem[] = [
  {
    id: "g1",
    category: "Workout Area",
    title: "Premium Dumbbells & Benches",
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "g2",
    category: "Cardio",
    title: "Modern Treadmills & Rowers",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "g3",
    category: "Weightlifting Zone",
    title: "Power Racks & Platform Areas",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "g4",
    category: "Yoga Studio",
    title: "Tranquil Space for Flex & Mobility",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "g5",
    category: "Group Classes",
    title: "Spinning & Aerobics Core Team",
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "g6",
    category: "Cross Training",
    title: "Battle Ropes Conditioning",
    image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&q=80&w=800"
  }
];

export const FAQS: FAQItem[] = [
  {
    id: "f1",
    question: "What are the gym operating hours?",
    answer: "We are open from 5:00 AM to 11:00 PM from Monday to Saturday, and 6:00 AM to 8:00 PM on Sundays."
  },
  {
    id: "f2",
    question: "Is there a trial period available before signing up?",
    answer: "Yes! We offer a 3-day complimentary pass for first-time visitors to try out our equipment, locker facilities, and experience the IronPulse atmosphere."
  },
  {
    id: "f3",
    question: "Can I freeze or suspend my membership?",
    answer: "Absolutely. Premium and Elite memberships can be frozen for up to 30 days per year at no additional cost in case of travel, medical conditions, or personal reasons."
  },
  {
    id: "f4",
    question: "Do you provide parking and locker amenities?",
    answer: "Yes, we have free secure parking for both cars and two-wheelers. Clean lockers, private changing booths, and premium shower units with complementary body wash are also available."
  },
  {
    id: "f5",
    question: "Are trainers certified, and is personal training included?",
    answer: "All our 25+ coaches hold national or international certifications (such as ACSM, NASM, ACE, or gold-standard fitness degrees). The Premium plan includes 2 trainer sessions per month, while the Elite plan provides dedicated 1-on-1 personal training twice a week."
  }
];

export const CONTACT_INFO = {
  phone: "+91 98765 43210",
  whatsappNumber: "919876543210", // Clean digits for WhatsApp link
  whatsappMessage: "Hi IronPulse Fitness! I would like to enquire about gym memberships and training programs.",
  email: "info@ironpulse.com",
  address: "12, Outer Ring Rd, Sector 4, HSR Layout, Bengaluru, Karnataka 560102",
  hours: {
    weekdays: "5:00 AM - 11:00 PM",
    sunday: "6:00 AM - 8:00 PM",
  }
};
