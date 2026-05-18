"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { Globe, Award, Camera, Send, MessageCircle, X, Check, AlertCircle, Mail, Lock, User, Smartphone, Building, FileText, ArrowRight, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ModalContext = createContext<{ openModal: () => void }>({
  openModal: () => {},
});

export const useModal = () => useContext(ModalContext);

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
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
          id: user?.uid
        })
      });

      if (res.ok) {
        setSuccessMsg("Your application was submitted successfully! Admin will review and verify your account within 24 hours.");
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccessMsg("");
          setFormData({ name: "", email: "", supplier_name: "", company_name: "", phone: "" });
          router.push("/");
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

  const [navItems, setNavItems] = useState([
    { label: "Overview", href: "/landing" },
    { label: "Benefits", href: "/landing/benefits" },
    { label: "Growth Hub", href: "/landing/growthhub" },
    { label: "FAQs", href: "/landing/faq" },
    { label: "Help Center", href: "/landing/helpcenter" }
  ]);

  useEffect(() => {
    fetch("/api/settings/supplier-landing")
      .then(res => res.json())
      .then(data => {
        if (data.navItems && Array.isArray(data.navItems)) {
          setNavItems(data.navItems);
        }
      })
      .catch(e => console.error("Error fetching supplier CMS nav items:", e));
  }, []);

  return (
    <ModalContext.Provider value={{ openModal: () => setIsModalOpen(true) }}>
      <div className="min-h-screen bg-white text-brand-black font-sans selection:bg-brand-black selection:text-white">
      {/* Top Navbar */}
      <nav className="w-full h-[80px] flex items-center sticky top-0 bg-white/80 backdrop-blur-md z-[60] border-b border-brand-border/50 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/landing" className="flex items-center">
            <img 
              src="/assets/logo.png" 
              alt="Tour Geeky Logo" 
              className="h-8 md:h-9 w-auto object-contain" 
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 text-[13px] font-bold text-brand-black/70">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-full hover:bg-brand-light hover:text-brand-black transition-all",
                  pathname === item.href ? "bg-brand-light text-brand-black font-extrabold" : ""
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-6">
            <button className="flex items-center gap-2 text-[12px] font-bold hover:text-brand-gray transition-colors">
              <Globe className="w-4 h-4" />
              English
            </button>

            <Button 
              onClick={() => setIsModalOpen(true)}
              variant="primary" 
              size="sm" 
              className="rounded-full px-8 h-11 font-bold text-[12px]"
            >
              Apply as Partner
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-80px)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full pt-16 pb-8 px-4 sm:px-6 lg:px-8 bg-brand-light border-t border-brand-border/50">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            <div className="lg:col-span-2">
              <Link href="/landing" className="mb-4 block">
                <img 
                  src="/assets/logo.png" 
                  alt="Tour Geeky Logo" 
                  className="h-7 md:h-8 w-auto object-contain" 
                />
              </Link>
              <p className="text-[14px] text-brand-gray leading-[1.6] max-w-[300px] mb-8">
                Radiant revelries and Aegean summer parties made easy. Your ultimate celebration and tour partner.
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

            <div>
              <h4 className="font-bold text-[12px] text-brand-black mb-5">Company</h4>
              <ul className="space-y-3.5 text-[14px] text-brand-gray">
                <li><a href="#" className="hover:text-brand-black transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-brand-black transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-brand-black transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[12px] text-brand-black mb-5">Legal</h4>
              <ul className="space-y-3.5 text-[14px] text-brand-gray">
                <li><a href="#" className="hover:text-brand-black transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-brand-black transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-brand-black transition-colors">Refund Policy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[12px] text-brand-black mb-5">Contact</h4>
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
              className="absolute top-6 right-6 p-2 text-brand-gray hover:text-brand-black rounded-full hover:bg-brand-light transition-colors active:scale-95 cursor-pointer"
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
    </ModalContext.Provider>
  );
}
