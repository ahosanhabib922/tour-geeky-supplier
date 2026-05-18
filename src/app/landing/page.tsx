"use client";

import React, { useEffect, useState } from "react";
import { Plane, Star, Shield, TrendingUp, DollarSign, Users, Award, HelpCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useModal } from "./layout";

// Fallback arrays if database has not set them yet
const defaultBenefits = [
  {
    title: "10% Flat Commission",
    desc: "Transparent and fair pricing. No setup fees, no monthly costs, and no hidden charges. You only pay when you make a sale."
  },
  {
    title: "Global Marketplace Reach",
    desc: "Instantly distribute your tours, sunset cruises, wine tastings, and experiences to hundreds of thousands of Greece-bound travelers."
  },
  {
    title: "Secure & Automated Payouts",
    desc: "We process payments securely via Stripe and automatically distribute operator payouts twice a month directly to your bank account."
  },
  {
    title: "Robust Analytics & Tools",
    desc: "Access our state-of-the-art supplier portal. Track bookings, monitor gross earnings, manage availability calendars, and list activities in minutes."
  }
];

const defaultSteps = [
  {
    step: "01",
    title: "Submit Brand Profile",
    desc: "Fill in our quick 1-minute partner application form. Provide your brand name and basic contact details."
  },
  {
    step: "02",
    title: "Get Verified",
    desc: "Our operator onboarding team reviews and verifies your details to ensure the highest catalog standard."
  },
  {
    step: "03",
    title: "List Experiences",
    desc: "Use our premium step-by-step activity listing wizard to upload descriptions, pricing options, itineraries, and images."
  },
  {
    step: "04",
    title: "Receive Bookings",
    desc: "Travelers book your activities. You receive automated notifications, traveler lists, and prompt payouts."
  }
];

const defaultFaqs = [
  {
    q: "What is the cost to list activities on Tour Geeky?",
    a: "Listing your experiences is 100% free! There are no listing fees, registration fees, or hidden subscription costs. We only charge a flat 10% commission on confirmed bookings."
  },
  {
    q: "How and when do I receive payouts?",
    a: "Payouts are automatically calculated and processed securely via Stripe. Operator earnings are sent twice a month directly to your linked bank account."
  },
  {
    q: "What credentials do I need to get approved?",
    a: "We verify that you are a Greece travel agency, local tour provider, cruise operator, or licensed guide. A valid phone number and website/social presence are usually sufficient for instant approval."
  },
  {
    q: "Can I manage cancelations and refunds?",
    a: "Yes! You can choose your cancelation policy (e.g. Standard 24h, Strict, or Non-refundable) during the product creation wizard. The platform automatically handles refund requests based on your chosen rules."
  }
];

const defaultStats = [
  { value: "2.4M+", label: "Monthly Active Travelers", desc: "Global exposure" },
  { value: "150+", label: "Greek Operator Partners", desc: "Trusted Aegean network" },
  { value: "120K+", label: "Confirmed Bookings", desc: "Completed experiences" },
  { value: "10%", label: "Platform Commission", desc: "Flat rate, no hidden fees" }
];

const defaultStories = [
  {
    name: "Captain Dimitris",
    role: "Founder, Aegean Sails Ltd",
    avatar: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&h=100&q=80",
    rating: 5,
    quote: "\"Sailing with Tour Geeky has doubled our sunset cruise bookings in Crete and Athens. Payouts are incredibly fast, and their listing wizard took just minutes to configure. We went live with 4 yachts within the first day.\""
  },
  {
    name: "Eleni Vance",
    role: "Host, Athens Vineyard Estates",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
    rating: 5,
    quote: "\"Their local support crew and Greek translation helper attracted travelers from America and East Asia to our boutique vineyard tours near Mount Hymettus.\""
  }
];

export default function SupplierLandingPage() {
  const { openModal } = useModal();
  const [cms, setCms] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings/supplier-landing")
      .then((res) => res.json())
      .then((data) => setCms(data))
      .catch((err) => console.error("Error loading CMS settings:", err));
  }, []);

  const over = cms?.pages?.overview || {};

  // Resolve dynamic arrays from CMS settings database
  const benefitsList = over.benefits && Array.isArray(over.benefits) ? over.benefits : defaultBenefits;
  const statsList = over.stats && Array.isArray(over.stats) ? over.stats : defaultStats;
  const stepsList = over.steps && Array.isArray(over.steps) ? over.steps : defaultSteps;
  const storiesList = over.stories && Array.isArray(over.stories) ? over.stories : defaultStories;
  const faqsList = over.faqs && Array.isArray(over.faqs) ? over.faqs : defaultFaqs;

  // Icon mapping helper
  const getIconForIndex = (idx: number) => {
    switch (idx) {
      case 0: return DollarSign;
      case 1: return TrendingUp;
      case 2: return Shield;
      default: return Users;
    }
  };

  return (
    <div className="bg-white text-brand-black">
      {/* Hero Section */}
      {(over.hero_show !== false) && (
        <header className="py-20 lg:py-28 px-6 sm:px-12 max-w-6xl mx-auto text-center space-y-8 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-light border border-brand-border text-[11px] font-bold uppercase tracking-wider text-brand-black">
            <Award className="w-3.5 h-3.5 text-brand-black" /> {over.hero_badge || "Operator Onboarding Hub"}
          </div>
          
          <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-medium tracking-tight text-brand-black max-w-4xl mx-auto leading-[1.05] tracking-[-0.02em] whitespace-pre-line">
            {over.hero_title || "Grow Your Activity Business with\nTour Geeky Partner"}
          </h1>
          
          <p className="text-[15px] sm:text-[17px] text-brand-gray max-w-2xl mx-auto font-medium leading-relaxed">
            {over.hero_description || "List your sunset cruises, yachting excursions, historical walking tours, and vineyard wine tastings. Reach active global Greece travelers and manage bookings effortlessly."}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={openModal}
              size="lg"
              className="w-full sm:w-auto rounded-full px-10 h-12 text-sm font-bold bg-brand-black text-white hover:bg-brand-black/90 shadow-md flex items-center justify-center gap-2"
            >
              {over.hero_ctaText || "Apply Now"} <ArrowRight className="w-4 h-4" />
            </Button>
            <Button 
              onClick={openModal}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto rounded-full px-8 h-12 text-sm font-bold border border-brand-border hover:bg-brand-light flex items-center justify-center gap-2"
            >
              Demo Dashboard
            </Button>
          </div>

          <div className="pt-2 flex justify-center items-center gap-6 text-[10px] text-brand-gray font-bold uppercase tracking-widest">
            <span>No Onboarding Fee</span>
            <span>•</span>
            <span>Stripe Integration</span>
            <span>•</span>
            <span>Greece & Europe Focus</span>
          </div>

          <div className="pt-10 w-full">
            <div className="aspect-video w-full rounded-[32px] overflow-hidden relative border border-brand-border/40 shadow-xl shadow-brand-black/[0.03]">
              <img 
                src={over.hero_image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80"} 
                alt="Yacht sunset sailing" 
                className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/40 via-transparent to-transparent flex items-end p-8 sm:p-12 text-left">
                <div className="space-y-2">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-brand-black text-[10px] font-bold uppercase tracking-widest rounded-full">Aegean Excursion Showcase</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight max-w-lg">Captivate Greece travelers with high-resolution listing pages and secure checkouts.</h3>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Benefits Section */}
      {(over.benefits_show !== false) && (
        <section id="benefits" className="py-24 bg-brand-light/20 border-y border-brand-border px-6 sm:px-12">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-black">{over.benefits_title || "Why Partner with Us?"}</h2>
              <p className="text-sm text-brand-gray font-medium">{over.benefits_subtitle || "Everything you need to list, manage, and scale Greece experiential business."}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefitsList.map((b: any, idx: number) => {
                const Icon = getIconForIndex(idx);
                return (
                  <div key={idx} className="bg-white border border-brand-border/40 p-8 rounded-[28px] space-y-5 hover:shadow-xl hover:shadow-brand-black/5 hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center border bg-brand-light text-brand-black border-brand-border">
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-brand-black">{b.title}</h3>
                      <p className="text-sm text-brand-gray font-medium leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Impact Stats Grid Section */}
      {(over.stats_show !== false) && (
        <section id="stats" className="py-24 max-w-6xl mx-auto px-6 sm:px-12 space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-black">{over.stats_title || "Our Greece Marketplace Impact"}</h2>
            <p className="text-sm text-brand-gray font-medium">{over.stats_subtitle || "Greece's premier channel for premium experiential excursions."}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsList.map((s: any, idx: number) => (
              <div key={idx} className="p-6 rounded-[24px] bg-white border border-brand-border/40 hover:shadow-xl hover:shadow-brand-black/5 transition-all duration-300 space-y-3">
                <h3 className="text-4xl font-bold text-brand-black tracking-tight">{s.value}</h3>
                <p className="text-xs font-bold text-brand-black tracking-wide leading-none">{s.label}</p>
                <p className="text-[10px] text-brand-gray/60 font-semibold">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interactive Onboarding Timeline Workflow */}
      {(over.workflow_show !== false) && (
        <section id="workflow" className="py-24 bg-brand-light/20 border-y border-brand-border px-6 sm:px-12">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-black">{over.workflow_title || "How It Works"}</h2>
              <p className="text-sm text-brand-gray font-medium">{over.workflow_subtitle || "Simple 4-step workflow from partner registration to payout."}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stepsList.map((s: any, idx: number) => (
                <div key={idx} className="space-y-4 relative group">
                  <div className="text-5xl font-extrabold text-brand-black/10 group-hover:text-brand-black transition-colors duration-300">
                    {s.step || `0${idx + 1}`}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-brand-black">{s.title}</h3>
                    <p className="text-xs text-brand-gray font-semibold leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Live Greece Operator Success Stories */}
      {(over.stories_show !== false) && (
        <section id="stories" className="py-24 max-w-6xl mx-auto px-6 sm:px-12 space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-black">{over.stories_title || "Greek Operator Stories"}</h2>
            <p className="text-sm text-brand-gray font-medium">{over.stories_subtitle || "Hear from verified travel operators running experiences on Tour Geeky Greece."}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {storiesList.map((st: any, idx: number) => (
              <div key={idx} className="p-8 sm:p-10 rounded-[32px] border border-brand-border/40 bg-white hover:shadow-xl hover:shadow-brand-black/5 transition-all duration-300 flex flex-col justify-between gap-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: st.rating || 5 }).map((_, s) => <Star key={s} className="w-4.5 h-4.5 text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <p className="text-sm sm:text-base text-brand-black font-medium italic leading-relaxed">
                    {st.quote}
                  </p>
                </div>
                <div className="flex items-center gap-4 border-t border-brand-border pt-6">
                  <img 
                    src={st.avatar || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&h=100&q=80"} 
                    alt={st.name} 
                    className="w-12 h-12 rounded-full object-cover border border-brand-border"
                  />
                  <div>
                    <p className="text-xs font-bold text-brand-black leading-none">{st.name}</p>
                    <p className="text-[9px] text-brand-gray font-bold uppercase tracking-wider mt-1">{st.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQs Section */}
      {(over.faq_show !== false) && (
        <section id="faqs" className="py-24 bg-brand-light/20 border-t border-brand-border px-6 sm:px-12">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-black">{over.faq_title || "Frequently Asked Questions"}</h2>
              <p className="text-sm text-brand-gray font-medium">{over.faq_subtitle || "Have questions about payouts, listings, or commissions?"}</p>
            </div>

            <div className="space-y-4">
              {faqsList.map((f: any, idx: number) => (
                <div key={idx} className="bg-white border border-brand-border/40 p-6 rounded-[20px] space-y-2.5 hover:shadow-xl hover:shadow-brand-black/5 transition-all">
                  <h3 className="text-sm font-bold text-brand-black flex items-center gap-2">
                    <HelpCircle className="w-4.5 h-4.5 text-brand-gray/60 shrink-0" /> {f.q}
                  </h3>
                  <p className="text-xs text-brand-gray font-semibold leading-relaxed pl-6">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
