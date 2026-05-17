"use client";

import React, { useState, useEffect } from "react";
import { Plane, Star, Shield, TrendingUp, DollarSign, Users, Award, HelpCircle, Check, ArrowRight, X, Phone, Building, FileText, Smartphone, User, Mail, Globe, MapPin, Anchor, ArrowUpRight, Compass, ShieldCheck, Heart, ShoppingBag, Menu, Camera, Send, MessageCircle, Lock, AlertCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

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

  // Firebase Auth states
  const [user, setUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Monitor Auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setFormData(prev => ({
          ...prev,
          name: prev.name || currentUser.displayName || "",
          email: prev.email || currentUser.email || ""
        }));
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setAuthError("");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Google Signin Error:", err);
      setAuthError(err.message || "Failed to sign in with Google.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      if (authMode === 'register') {
        await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      } else {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      }
    } catch (err: any) {
      console.error("Email Auth Error:", err);
      setAuthError(err.message || "Authentication failed. Check your credentials.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAuthEmail("");
      setAuthPassword("");
      setAuthError("");
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

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
        body: JSON.stringify({
          ...formData,
          id: user?.uid // Pass the firebase uid to pair with D1 database
        })
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

  const stats = [
    { value: "2.4M+", label: "Monthly Active Travelers", desc: "Global exposure" },
    { value: "150+", label: "Greek Operator Partners", desc: "Trusted Aegean network" },
    { value: "120K+", label: "Confirmed Bookings", desc: "Completed experiences" },
    { value: "10%", label: "Platform Commission", desc: "Flat rate, no hidden fees" }
  ];

  return (
    <div className="min-h-screen bg-white text-brand-black font-sans selection:bg-brand-black selection:text-white">
      
      {/* Top Navbar - 100% Client Logo & Styling */}
      <nav className="w-full h-[80px] flex items-center sticky top-0 bg-white/80 backdrop-blur-md z-[60] border-b border-brand-border/50 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          {/* Client Logo */}
          <a href="/" className="flex items-center">
            <img 
              src="/assets/logo.png" 
              alt="Tour Geeky Logo" 
              className="h-8 md:h-9 w-auto object-contain" 
            />
          </a>

          {/* Desktop Links - Match Client Navbar Pills */}
          <div className="hidden lg:flex items-center gap-1 text-[14px] font-medium text-brand-black">
            <a href="#benefits" className="px-4 py-2 rounded-full hover:bg-brand-light transition-colors">
              Benefits
            </a>
            <a href="#stats" className="px-4 py-2 rounded-full hover:bg-brand-light transition-colors">
              Impact
            </a>
            <a href="#workflow" className="px-4 py-2 rounded-full hover:bg-brand-light transition-colors">
              Workflow
            </a>
            <a href="#stories" className="px-4 py-2 rounded-full hover:bg-brand-light transition-colors">
              Success Stories
            </a>
            <a href="#faqs" className="px-4 py-2 rounded-full hover:bg-brand-light transition-colors">
              FAQs
            </a>
          </div>

          {/* Actions - Match Client Actions */}
          <div className="hidden md:flex items-center gap-6">
            <button className="flex items-center gap-2 text-[14px] font-medium hover:text-brand-gray transition-colors">
              <Globe className="w-4 h-4" />
              English
            </button>

            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setIsModalOpen(true)}
                variant="primary" 
                size="sm" 
                className="rounded-full px-8 h-11 font-bold text-[14px]"
              >
                Apply as Partner
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-20 lg:py-28 px-6 sm:px-12 max-w-6xl mx-auto text-center space-y-8 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-light border border-brand-border text-[11px] font-bold uppercase tracking-wider text-brand-black">
          <Award className="w-3.5 h-3.5 text-brand-black" /> Operator Onboarding Hub
        </div>
        
        <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-medium tracking-tight text-brand-black max-w-4xl mx-auto leading-[1.05] tracking-[-0.02em] whitespace-pre-line">
          Grow Your Activity Business with {"\n"}<span className="underline decoration-brand-black underline-offset-8">Tour Geeky Partner</span>
        </h1>
        
        <p className="text-[15px] sm:text-[17px] text-brand-gray max-w-2xl mx-auto font-medium leading-relaxed">
          List your sunset cruises, yachting excursions, historical walking tours, and vineyard wine tastings. Reach active global travelers and manage bookings effortlessly.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={() => setIsModalOpen(true)}
            size="lg"
            className="w-full sm:w-auto rounded-full px-10 h-12 text-sm font-bold bg-brand-black text-white hover:bg-brand-black/90 shadow-md flex items-center justify-center gap-2"
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

        <div className="pt-2 flex justify-center items-center gap-6 text-[10px] text-brand-gray font-bold uppercase tracking-widest">
          <span>No Onboarding Fee</span>
          <span>•</span>
          <span>Stripe Integration</span>
          <span>•</span>
          <span>Greece & Europe Focus</span>
        </div>

        {/* Breathtaking Collateral Yacht Image Grid */}
        <div className="pt-10 w-full">
          <div className="aspect-video w-full rounded-[32px] overflow-hidden relative border border-brand-border/40 shadow-xl shadow-brand-black/[0.03]">
            <img 
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80" 
              alt="Yacht sunset sailing" 
              className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/40 via-transparent to-transparent flex items-end p-8 sm:p-12 text-left">
              <div className="space-y-2">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-brand-black text-[10px] font-black uppercase tracking-widest rounded-full">Aegean Excursion Showcase</span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight max-w-lg">Captivate travelers with high-resolution listing pages and secure checkouts.</h3>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-brand-light/20 border-y border-brand-border px-6 sm:px-12">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-black uppercase">Why Partner with Us?</h2>
            <p className="text-sm text-brand-gray font-medium">Everything you need to list, manage, and scale your experiences catalog.</p>
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

      {/* Impact Stats Grid Section */}
      <section id="stats" className="py-24 max-w-6xl mx-auto px-6 sm:px-12 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-black uppercase">Our Marketplace Impact</h2>
          <p className="text-sm text-brand-gray font-medium">Greece's premier channel for premium experiential excursions.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, idx) => (
            <div key={idx} className="p-6 rounded-[24px] bg-white border border-brand-border/40 hover:shadow-xl hover:shadow-brand-black/5 transition-all duration-300 space-y-3">
              <h3 className="text-4xl font-black text-brand-black tracking-tight">{s.value}</h3>
              <p className="text-xs font-bold text-brand-black tracking-wide leading-none">{s.label}</p>
              <p className="text-[10px] text-brand-gray/60 font-semibold">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Onboarding Timeline Workflow */}
      <section id="workflow" className="py-24 bg-brand-light/20 border-y border-brand-border px-6 sm:px-12">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-black uppercase">How It Works</h2>
            <p className="text-sm text-brand-gray font-medium">Simple 4-step workflow from partner registration to payout.</p>
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
        </div>
      </section>

      {/* Live Operator Success Stories (Testimonials) */}
      <section id="stories" className="py-24 max-w-6xl mx-auto px-6 sm:px-12 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-black uppercase">Success Stories</h2>
          <p className="text-sm text-brand-gray font-medium">Hear from verified travel operators running experiences on Tour Geeky.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
          {/* Crete Cruise Success Story */}
          <div className="p-8 sm:p-10 rounded-[32px] border border-brand-border/40 bg-white hover:shadow-xl hover:shadow-brand-black/5 transition-all duration-300 flex flex-col justify-between gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4.5 h-4.5 text-yellow-400 fill-yellow-400" />)}
              </div>
              <p className="text-base sm:text-lg text-brand-black font-medium italic leading-relaxed">
                "Sailing with Tour Geeky has doubled our sunset cruise bookings in Crete and Athens. Payouts are incredibly fast, and their listing wizard took just minutes to configure. We went live with 4 yachts within the first day."
              </p>
            </div>
            <div className="flex items-center gap-4 border-t border-brand-border pt-6">
              <img 
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&h=100&q=80" 
                alt="Captain Dimitris" 
                className="w-12 h-12 rounded-full object-cover border border-brand-border"
              />
              <div>
                <p className="text-xs font-bold text-brand-black leading-none">Captain Dimitris</p>
                <p className="text-[9px] text-brand-gray font-bold uppercase tracking-wider mt-1">Founder, Aegean Sails Ltd</p>
              </div>
            </div>
          </div>

          {/* Athens Walking Tour Success Story */}
          <div className="p-8 sm:p-10 rounded-[32px] border border-brand-border/40 bg-white hover:shadow-xl hover:shadow-brand-black/5 transition-all duration-300 flex flex-col justify-between gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4.5 h-4.5 text-yellow-400 fill-yellow-400" />)}
              </div>
              <p className="text-sm text-brand-black font-semibold italic leading-relaxed">
                "Their local support crew and multi-language translation platform helped us attract travelers from America and East Asia to our boutique vineyard tours near Mount Hymettus."
              </p>
            </div>
            <div className="flex items-center gap-4 border-t border-brand-border pt-6">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80" 
                alt="Eleni Vance" 
                className="w-12 h-12 rounded-full object-cover border border-brand-border"
              />
              <div>
                <p className="text-xs font-bold text-brand-black leading-none">Eleni Vance</p>
                <p className="text-[9px] text-brand-gray font-bold uppercase tracking-wider mt-1">Host, Athens Vineyard Estates</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="py-24 bg-brand-light/20 border-t border-brand-border px-6 sm:px-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-black uppercase">Frequently Asked Questions</h2>
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

      {/* Footer - 100% Match Client Footer */}
      <footer className="w-full pt-16 pb-8 px-4 sm:px-6 lg:px-8 bg-brand-light mt-12 border-t border-brand-border/50">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            {/* Brand Col */}
            <div className="lg:col-span-2">
              <a href="/" className="mb-4 block">
                <img 
                  src="/assets/logo.png" 
                  alt="Tour Geeky Logo" 
                  className="h-7 md:h-8 w-auto object-contain" 
                />
              </a>
              <p className="text-[14px] text-brand-gray leading-[1.6] max-w-[300px] mb-8">
                Radiant revelries and sparkling summer parties made easy. Your ultimate celebration and tour partner.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-black hover:bg-brand-border transition-colors border border-brand-border">
                  <Camera className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-black hover:bg-brand-border transition-colors border border-brand-border">
                  <Send className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-black hover:bg-brand-border transition-colors border border-brand-border">
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Links Col 1 */}
            <div>
              <h4 className="font-medium text-[15px] text-brand-black mb-5">Company</h4>
              <ul className="space-y-3.5 text-[14px] text-brand-gray">
                <li><a href="/about" className="hover:text-brand-black transition-colors">About Us</a></li>
                <li><a href="/blog" className="hover:text-brand-black transition-colors">Blog</a></li>
                <li><a href="/contact" className="hover:text-brand-black transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Links Col 2 */}
            <div>
              <h4 className="font-medium text-[15px] text-brand-black mb-5">Legal</h4>
              <ul className="space-y-3.5 text-[14px] text-brand-gray">
                <li><a href="/terms" className="hover:text-brand-black transition-colors">Terms of Service</a></li>
                <li><a href="/privacy" className="hover:text-brand-black transition-colors">Privacy Policy</a></li>
                <li><a href="/refund" className="hover:text-brand-black transition-colors">Refund Policy</a></li>
              </ul>
            </div>

            {/* Contact Col */}
            <div>
              <h4 className="font-medium text-[15px] text-brand-black mb-5">Contact</h4>
              <ul className="space-y-3.5 text-[14px] text-brand-gray">
                <li><a href="mailto:info@gerromantours.com" className="hover:text-brand-black transition-colors">info@gerromantours.com</a></li>
                <li className="pt-2">
                  <span className="block font-bold text-brand-dark mb-1">English Support</span>
                  <a href="tel:+393420342257" className="hover:text-brand-black transition-colors">+39 342 034 2257</a>
                </li>
                <li className="pt-2">
                  <span className="block font-bold text-brand-dark mb-1">Italian Support</span>
                  <a href="tel:+393248042892" className="hover:text-brand-black transition-colors">+39 324 804 2892</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-brand-border flex flex-col md:flex-row items-center justify-between gap-6 text-[13px] text-brand-gray">
            <div className="space-y-2 text-center md:text-left">
              <p>© {new Date().getFullYear()} Get Your Roman Tours S.R.L.S. All rights reserved.</p>
              <p className="opacity-60">Address: via Tre Novembre 40, Mentana, Roma 00013</p>
              <p className="font-bold text-brand-dark">P.IVA: IT18457421008</p>
            </div>
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-1.5 hover:text-brand-black transition-colors">
                <Globe className="w-4 h-4" /> English (US)
              </button>
              <button className="flex items-center gap-1.5 hover:text-brand-black transition-colors">
                <span className="font-medium text-brand-black">USD</span> ($)
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Application Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-brand-black/25 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] border border-brand-border w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button 
              className="absolute top-6 right-6 p-2 text-brand-gray hover:text-brand-black rounded-full hover:bg-brand-light transition-colors active:scale-95"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>

            {successMsg ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-emerald-600 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <Check className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="font-bold text-sm text-center max-w-xs">{successMsg}</p>
              </div>
            ) : !user ? (
              /* --- Phase 1: Authentication --- */
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold tracking-tight text-brand-black">Partner Sign In</h2>
                  <p className="text-xs text-brand-gray leading-relaxed font-semibold">
                    Sign in or register your partner account first using Google or your email.
                  </p>
                </div>

                {authError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2.5 text-rose-600 text-xs font-semibold animate-in shake duration-500">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="truncate">{authError}</span>
                  </div>
                )}

                <Button 
                  onClick={handleGoogleLogin}
                  variant="secondary" 
                  className="w-full h-12 rounded-xl border-brand-border/40 text-xs font-bold flex items-center justify-center gap-2 hover:bg-brand-light transition-all cursor-pointer"
                  disabled={authLoading}
                >
                  <Globe className="w-4 h-4 text-brand-black" />
                  Continue with Google
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-brand-border/40"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-extrabold text-brand-gray/50">
                    <span className="bg-white px-3 tracking-widest">or email & pass</span>
                  </div>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-black uppercase tracking-wider ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray/40 group-focus-within:text-brand-black transition-colors" />
                      <input 
                        type="email" 
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="partner@example.com"
                        className="w-full h-11 bg-brand-light/20 border border-brand-border rounded-xl pl-10 pr-4 text-xs font-semibold focus:bg-white focus:border-brand-black outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-black uppercase tracking-wider ml-1">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray/40 group-focus-within:text-brand-black transition-colors" />
                      <input 
                        type="password" 
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-11 bg-brand-light/20 border border-brand-border rounded-xl pl-10 pr-4 text-xs font-semibold focus:bg-white focus:border-brand-black outline-none transition-all"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full h-12 rounded-xl text-xs font-bold gap-2 mt-2 bg-brand-black text-white hover:bg-brand-black/90 cursor-pointer"
                    disabled={authLoading}
                  >
                    {authLoading ? "Authenticating..." : authMode === 'register' ? "Sign Up as Partner" : "Sign In & Continue"}
                  </Button>
                </form>

                <div className="text-center pt-2">
                  <button 
                    onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                    className="text-xs text-brand-gray font-bold hover:text-brand-black transition-colors cursor-pointer"
                  >
                    {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                  </button>
                </div>
              </div>
            ) : (
              /* --- Phase 2: Application Form --- */
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold tracking-tight text-brand-black">Apply as Operator</h2>
                    <p className="text-xs text-brand-gray font-semibold leading-none">Step 2: Partner Profile Details</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-[10px] font-bold text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign out
                  </button>
                </div>

                <div className="p-3 bg-brand-light/40 border border-brand-border/40 rounded-xl text-[11px] text-brand-gray font-semibold flex items-center justify-between">
                  <span>Signed in as: <strong className="text-brand-black">{user.email}</strong></span>
                </div>

                <form onSubmit={handleApply} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-brand-black uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-4 h-4 text-brand-gray" /> Full Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe" 
                      required
                      className="w-full h-11 px-4 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-black/5 focus:border-brand-black text-xs font-semibold bg-brand-light/20 text-brand-black transition-all"
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
                      disabled
                      className="w-full h-11 px-4 rounded-xl border border-brand-border bg-brand-light/40 text-brand-gray/80 text-xs font-semibold cursor-not-allowed"
                      value={formData.email}
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
                      className="w-full rounded-xl h-11 font-bold text-xs bg-brand-black text-white hover:bg-brand-black/90 active:scale-95 cursor-pointer"
                      disabled={submitting}
                    >
                      {submitting ? "Submitting Application..." : "Submit Application"}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
