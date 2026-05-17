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
      color: "bg-emerald-50 text-emerald-600 border-emerald-100"
    },
    {
      icon: TrendingUp,
      title: "Global Marketplace Reach",
      desc: "Instantly distribute your tours, sunset cruises, wine tastings, and experiences to hundreds of thousands of travelers searching on Tour Geeky.",
      color: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
      icon: Shield,
      title: "Secure & Automated Payouts",
      desc: "We process payments securely via Stripe and automatically distribute operator payouts in EUR or USD twice a month directly to your bank account.",
      color: "bg-purple-50 text-purple-600 border-purple-100"
    },
    {
      icon: Users,
      title: "Robust Analytics & Tools",
      desc: "Access our state-of-the-art supplier portal. Track bookings, monitor gross earnings, manage availability calendars, and list activities in minutes.",
      color: "bg-amber-50 text-amber-600 border-amber-100"
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
      a: "Payouts are automatically calculated and processed securely via Stripe. Operator earnings are sent twice a month (on the 1st and 15th) directly to your linked bank account."
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
    <div className="min-h-screen bg-white text-zinc-950 font-sans selection:bg-zinc-900 selection:text-white">
      
      {/* Top Navbar */}
      <nav className="h-20 border-b border-zinc-100 px-6 sm:px-12 flex items-center justify-between sticky top-0 bg-white/85 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-zinc-900 rounded-xl flex items-center justify-center">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-zinc-900">Tour Geeky</span>
            <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider leading-none">Partner Network</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a href="/" className="text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors uppercase tracking-wider hidden sm:block">
            Explore Demo Dashboard
          </a>
          <Button 
            onClick={() => setIsModalOpen(true)}
            size="sm" 
            className="rounded-full px-6 h-10 text-xs font-bold bg-zinc-900 text-white hover:bg-zinc-800 transition-all shadow-md"
          >
            Apply as Partner
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-20 sm:py-28 px-6 sm:px-12 max-w-6xl mx-auto text-center space-y-8 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-50 border border-zinc-100 text-[11px] font-bold uppercase tracking-wider text-zinc-600">
          <Award className="w-3.5 h-3.5 text-zinc-900" /> Operator Onboarding Hub
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-900 max-w-4xl mx-auto leading-[1.05]">
          Grow Your Activity Business with <span className="underline decoration-zinc-900 underline-offset-8">Tour Geeky</span>
        </h1>
        
        <p className="text-base sm:text-lg text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed">
          List your cruises, sunset tours, historical excursions, and food tastings. Reach global travelers and manage logistics with our state-of-the-art operator dashboard.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto rounded-full px-8 h-12 text-sm font-bold bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg flex items-center justify-center gap-2"
          >
            Apply Now <ArrowRight className="w-4 h-4" />
          </Button>
          <a href="/" className="w-full sm:w-auto">
            <Button 
              variant="secondary"
              className="w-full sm:w-auto rounded-full px-8 h-12 text-sm font-bold border border-zinc-200 hover:bg-zinc-50 flex items-center justify-center gap-2"
            >
              Demo Dashboard
            </Button>
          </a>
        </div>
      </header>

      {/* Benefits Section */}
      <section className="py-20 bg-zinc-50/50 border-y border-zinc-100 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">Why Partner with Us?</h2>
            <p className="text-sm text-zinc-400 font-medium">Everything you need to scale your tours and experiences catalog.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div key={idx} className="bg-white border border-zinc-100 p-8 rounded-[32px] space-y-5 hover:shadow-xl hover:shadow-zinc-900/[0.02] hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${b.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-zinc-900">{b.title}</h3>
                    <p className="text-sm text-zinc-400 font-medium leading-relaxed">{b.desc}</p>
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
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">How It Works</h2>
          <p className="text-sm text-zinc-400 font-medium">Simple 4-step workflow from registration to payout.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, idx) => (
            <div key={idx} className="space-y-4 relative group">
              <div className="text-4xl font-extrabold text-zinc-900/10 group-hover:text-zinc-950 transition-colors duration-300">
                {s.step}
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-zinc-900">{s.title}</h3>
                <p className="text-xs text-zinc-400 font-medium leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 bg-zinc-50/50 border-t border-zinc-100 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">Frequently Asked Questions</h2>
            <p className="text-sm text-zinc-400 font-medium">Have questions about payouts, listings, or commissions?</p>
          </div>

          <div className="space-y-4">
            {faqs.map((f, idx) => (
              <div key={idx} className="bg-white border border-zinc-100 p-6 rounded-2xl space-y-2.5">
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-zinc-400 shrink-0" /> {f.q}
                </h3>
                <p className="text-xs text-zinc-400 font-medium leading-relaxed pl-6">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-16 sm:py-24 px-6 sm:px-12 max-w-6xl mx-auto text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">Ready to Partner with Us?</h2>
        <p className="text-sm text-zinc-400 font-medium max-w-md mx-auto">Apply today and unlock global distribution for your activity brand catalog.</p>
        <div className="pt-4">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="rounded-full px-10 h-12 text-sm font-bold bg-zinc-900 text-white hover:bg-zinc-800 shadow-md"
          >
            Apply Now
          </Button>
        </div>
      </footer>

      {/* Application Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] border border-zinc-200 w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button 
              className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-zinc-800 rounded-full hover:bg-zinc-50 transition-colors"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-2">Apply as Operator</h2>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
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
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Full Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. John Doe" 
                    required
                    className="w-full h-10 px-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 text-xs font-semibold transition-all"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email Address
                  </label>
                  <input 
                    type="email" 
                    placeholder="e.g. partner@example.com" 
                    required
                    className="w-full h-10 px-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 text-xs font-semibold transition-all"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Brand / Operator Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Aegean Cruising Group" 
                    required
                    className="w-full h-10 px-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 text-xs font-semibold transition-all"
                    value={formData.supplier_name}
                    onChange={e => setFormData(prev => ({ ...prev, supplier_name: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" /> Company Registered Name (Optional)
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Aegean Sails Maritime LLC" 
                    className="w-full h-10 px-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 text-xs font-semibold transition-all"
                    value={formData.company_name}
                    onChange={e => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5" /> Operator Phone Number
                  </label>
                  <input 
                    type="tel" 
                    placeholder="e.g. +30 691234567" 
                    required
                    className="w-full h-10 px-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 text-xs font-semibold transition-all"
                    value={formData.phone}
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit"
                    className="w-full rounded-xl h-11 font-bold bg-zinc-900 text-white hover:bg-zinc-800"
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
