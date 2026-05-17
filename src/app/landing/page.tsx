"use client";

import React, { useState } from "react";
import { Plane, Star, Shield, TrendingUp, DollarSign, Users, Award, HelpCircle, Check, ArrowRight, X, Phone, Building, FileText, Smartphone, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SupplierLandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    supplier_name: "",
    company_name: "",
    phone: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplier_name || !formData.phone || !formData.email || !formData.name) {
      alert("Please fill in all required fields (Name, Email, Brand Name, and Phone)");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/suppliers', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSuccessMsg("Your application was submitted successfully! Admin will review and verify your account within 24 hours.");
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccessMsg("");
          setFormData({ name: "", email: "", supplier_name: "", company_name: "", phone: "" });
        }, 3500);
      } else {
        alert("Failed to submit application. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting supplier application:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: DollarSign,
      title: "10% Flat Commission",
      desc: "Transparent and fair pricing. No setup fees, no monthly costs, and no hidden charges. You only pay when you make a sale.",
      color: "bg-brand-light text-brand-black border-brand-border"
    },
    {
      icon: TrendingUp,
      title: "Global Marketplace Reach",
      desc: "Instantly distribute your tours, sunset cruises, wine tastings, and experiences to hundreds of thousands of travelers searching on Tour Geeky.",
      color: "bg-brand-light text-brand-black border-brand-border"
    },
    {
      icon: Shield,
      title: "Secure & Automated Payouts",
      desc: "We process payments securely via Stripe and automatically distribute operator payouts twice a month directly to your bank account.",
      color: "bg-brand-light text-brand-black border-brand-border"
    },
    {
      icon: Users,
      title: "Robust Analytics & Tools",
      desc: "Access our state-of-the-art supplier portal. Track bookings, monitor gross earnings, manage availability calendars, and list activities in minutes.",
      color: "bg-brand-light text-brand-black border-brand-border"
    }
  ];

  const steps = [
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

  const faqs = [
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
      a: "We verify that you are a registered travel agency, local tour provider, cruise operator, or licensed guide. A valid phone number and website/social presence are usually sufficient for instant approval."
    },
    {
      q: "Can I manage cancelations and refunds?",
      a: "Yes! You can choose your cancelation policy (e.g. Standard 24h, Strict, or Non-refundable) during the product creation wizard. The platform automatically handles refund requests based on your chosen rules."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-brand-black font-sans selection:bg-brand-black selection:text-white">
      
      {/* Top Navbar */}
      <nav className="h-20 border-b border-brand-border px-6 sm:px-12 flex items-center justify-between sticky top-0 bg-white/85 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <div className="w-8.5 h-8.5 bg-brand-black rounded-xl flex items-center justify-center">
            <Plane className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-brand-black leading-none">Tour Geeky</span>
            <span className="text-[9px] text-brand-gray uppercase font-bold tracking-wider mt-1.5 leading-none">Partner Network</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a href="/" className="text-xs font-bold text-brand-gray hover:text-brand-black transition-colors uppercase tracking-wider hidden sm:block">
            Explore Demo Dashboard
          </a>
          <Button 
            onClick={() => setIsModalOpen(true)}
            size="sm" 
            className="rounded-full px-6 h-11 text-xs font-bold bg-brand-black text-white hover:bg-brand-black/90 transition-all shadow-sm"
          >
            Apply as Partner
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-20 sm:py-28 px-6 sm:px-12 max-w-6xl mx-auto text-center space-y-8 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-light border border-brand-border text-[11px] font-bold uppercase tracking-wider text-brand-black">
          <Award className="w-3.5 h-3.5 text-brand-black" /> Operator Onboarding Hub
        </div>
        
        <h1 className="text-[clamp(2.2rem,5vw,4.2rem)] font-medium tracking-tight text-brand-black max-w-4xl mx-auto leading-[1.05] tracking-[-0.02em]">
          Grow Your Activity Business with <span className="underline decoration-brand-black underline-offset-8">Tour Geeky</span>
        </h1>
        
        <p className="text-[15px] sm:text-[17px] text-brand-gray max-w-2xl mx-auto font-medium leading-relaxed">
          List your cruises, sunset tours, historical excursions, and food tastings. Reach global travelers and manage logistics with our state-of-the-art operator dashboard.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={() => setIsModalOpen(true)}
            size="lg"
            className="w-full sm:w-auto rounded-full px-8 h-12 text-sm font-bold bg-brand-black text-white hover:bg-brand-black/90 shadow-md flex items-center justify-center gap-2"
          >
            Apply Now <ArrowRight className="w-4 h-4" />
          </Button>
          <a href="/" className="w-full sm:w-auto">
            <Button 
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto rounded-full px-8 h-12 text-sm font-bold border border-brand-border hover:bg-brand-light flex items-center justify-center gap-2"
            >
              Demo Dashboard
            </Button>
          </a>
        </div>
      </header>

      {/* Benefits Section */}
      <section className="py-20 bg-brand-light/20 border-y border-brand-border px-6 sm:px-12">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-black">Why Partner with Us?</h2>
            <p className="text-sm text-brand-gray font-medium">Everything you need to scale your tours and experiences catalog.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div key={idx} className="bg-white border border-brand-border/40 p-8 rounded-[28px] space-y-5 hover:shadow-xl hover:shadow-brand-black/5 hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${b.color}`}>
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

      {/* How it Works Section */}
      <section className="py-20 px-6 sm:px-12 max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-black">How It Works</h2>
          <p className="text-sm text-brand-gray font-medium">Simple 4-step workflow from registration to payout.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, idx) => (
            <div key={idx} className="space-y-4 relative group">
              <div className="text-5xl font-extrabold text-brand-black/10 group-hover:text-brand-black transition-colors duration-300">
                {s.step}
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-brand-black">{s.title}</h3>
                <p className="text-xs text-brand-gray font-semibold leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 bg-brand-light/20 border-t border-brand-border px-6 sm:px-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-black">Frequently Asked Questions</h2>
            <p className="text-sm text-brand-gray font-medium">Have questions about payouts, listings, or commissions?</p>
          </div>

          <div className="space-y-4">
            {faqs.map((f, idx) => (
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

      {/* CTA Footer */}
      <footer className="py-16 sm:py-24 px-6 sm:px-12 max-w-6xl mx-auto text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-black">Ready to Partner with Us?</h2>
        <p className="text-sm text-brand-gray font-medium max-w-md mx-auto">Apply today and unlock global distribution for your activity brand catalog.</p>
        <div className="pt-4">
          <Button 
            onClick={() => setIsModalOpen(true)}
            size="lg"
            className="rounded-full px-10 h-12 text-sm font-bold bg-brand-black text-white hover:bg-brand-black/90 shadow-md"
          >
            Apply Now
          </Button>
        </div>
      </footer>

      {/* Application Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-brand-black/20 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] border border-brand-border w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button 
              className="absolute top-6 right-6 p-2 text-brand-gray hover:text-brand-black rounded-full hover:bg-brand-light transition-colors active:scale-95"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold tracking-tight text-brand-black mb-2">Apply as Operator</h2>
            <p className="text-xs text-brand-gray mb-6 leading-relaxed font-semibold">
              Fill in your operator profile details. Our partner onboarding specialists will verify your catalog credentials within 24 hours.
            </p>

            {successMsg ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-emerald-600 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <Check className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="font-bold text-sm text-center max-w-xs">{successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-brand-black uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4 text-brand-gray" /> Full Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. John Doe" 
                    required
                    className="w-full h-11 px-4 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-black/5 focus:border-brand-black text-xs font-semibold bg-white text-brand-black transition-all"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-brand-black uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-brand-gray" /> Email Address
                  </label>
                  <input 
                    type="email" 
                    placeholder="e.g. partner@example.com" 
                    required
                    className="w-full h-11 px-4 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-black/5 focus:border-brand-black text-xs font-semibold bg-white text-brand-black transition-all"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-brand-black uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-brand-gray" /> Brand / Operator Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Aegean Cruising Group" 
                    required
                    className="w-full h-11 px-4 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-black/5 focus:border-brand-black text-xs font-semibold bg-white text-brand-black transition-all"
                    value={formData.supplier_name}
                    onChange={e => setFormData(prev => ({ ...prev, supplier_name: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-brand-black uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-brand-gray" /> Company Registered Name (Optional)
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Aegean Sails Maritime LLC" 
                    className="w-full h-11 px-4 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-black/5 focus:border-brand-black text-xs font-semibold bg-white text-brand-black transition-all"
                    value={formData.company_name}
                    onChange={e => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-brand-black uppercase tracking-wider flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-brand-gray" /> Operator Phone Number
                  </label>
                  <input 
                    type="tel" 
                    placeholder="e.g. +30 691234567" 
                    required
                    className="w-full h-11 px-4 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-black/5 focus:border-brand-black text-xs font-semibold bg-white text-brand-black transition-all"
                    value={formData.phone}
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit"
                    variant="primary"
                    className="w-full rounded-xl h-11 font-bold text-xs bg-brand-black text-white hover:bg-brand-black/90 active:scale-95"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting Application..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
