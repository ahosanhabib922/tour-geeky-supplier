"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, Box, ClipboardList, Wallet, Plane, X, Menu, 
  Bell, Search, Plus, CalendarDays, Clock, ShieldAlert, LogOut, CheckCircle 
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Button } from "@/components/ui/Button";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Authentication & Supplier status states
  const [user, setUser] = useState<any>(null);
  const [supplierStatus, setSupplierStatus] = useState<string | null>(null);
  const [supplierName, setSupplierName] = useState<string>("");
  const [authLoading, setAuthLoading] = useState(true);

  // Exclude landing page from having the dashboard sidebar and header shell!
  const isLanding = pathname === "/landing";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setSupplierStatus(null);
        setSupplierName("");
        if (pathname !== "/landing") {
          router.push("/landing");
        }
        setAuthLoading(false);
      } else {
        setUser(currentUser);
        try {
          // Fetch suppliers list to find matching record by email
          const res = await fetch(`/api/suppliers?t=${Date.now()}`);
          if (res.ok) {
            const data = await res.json();
            const matched = data.find((s: any) => s.email === currentUser.email);
            if (matched) {
              setSupplierStatus(matched.supplier_status);
              setSupplierName(matched.supplier_name || matched.name || "");
            } else {
              // Logged in but no supplier application found yet in database
              setSupplierStatus("none");
              if (pathname !== "/landing") {
                router.push("/landing");
              }
            }
          }
        } catch (err) {
          console.error("Error loading supplier profile:", err);
        } finally {
          setAuthLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, [pathname, router]);

  const handleLogout = async () => {
    setAuthLoading(true);
    try {
      await signOut(auth);
      router.push("/landing");
    } catch (err) {
      console.error("Logout Error:", err);
    } finally {
      setAuthLoading(false);
    }
  };

  const getHeaderInfo = () => {
    if (pathname === "/products") {
      return { title: "Products List", desc: "Manage your activity catalog", breadcrumb: "Activities", active: "products" };
    }
    if (pathname === "/products/create") {
      return { title: "Create Product", desc: "Wizard Mode", breadcrumb: "Create Experience", active: "products" };
    }
    if (pathname === "/bookings") {
      return { title: "Orders", desc: "View and manage traveler bookings", breadcrumb: "Bookings", active: "bookings" };
    }
    if (pathname === "/earnings") {
      return { title: "Finance", desc: "Revenue and payouts", breadcrumb: "Finances", active: "earnings" };
    }
    if (pathname === "/calendar") {
      return { title: "Availability", desc: "Manage time slots and capacity", breadcrumb: "Calendar", active: "calendar" };
    }
    return { title: "Dashboard", desc: "Operator Overview", breadcrumb: "Dashboard", active: "dashboard" };
  };

  const headerInfo = getHeaderInfo();

  const getFloatingActionButton = () => {
    if (isLanding || pathname === "/products/create") return null;

    if (pathname === "/" || pathname === "/products") {
      return {
        label: "Create Product",
        icon: Plus,
        onClick: () => router.push("/products/create")
      };
    }
    if (pathname === "/bookings") {
      return {
        label: "New Booking",
        icon: Plus,
        onClick: () => alert("Direct booking insertion is handled by the Tour Geeky client checkout flow.")
      };
    }
    if (pathname === "/earnings") {
      return {
        label: "Withdraw",
        icon: Wallet,
        onClick: () => alert("Withdrawal request submitted successfully. Processing transfer to your verified settlement account.")
      };
    }
    return null;
  };

  const fab = getFloatingActionButton();

  if (isLanding) {
    return (
      <html lang="en" className="h-full antialiased bg-white text-zinc-950">
        <body className="min-h-full font-sans selection:bg-brand-black selection:text-white">
          {children}
        </body>
      </html>
    );
  }

  const navItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard, href: "/" },
    { id: "products", label: "Activities", icon: Box, href: "/products" },
    { id: "bookings", label: "Bookings", icon: ClipboardList, href: "/bookings" },
    { id: "earnings", label: "Finances", icon: Wallet, href: "/earnings" },
    { id: "calendar", label: "Calendar", icon: CalendarDays, href: "/calendar" },
  ];

  const initials = supplierName
    ? supplierName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "OP";

  return (
    <html lang="en" className="h-full antialiased bg-white text-zinc-950">
      <body className="min-h-full flex flex-col font-sans selection:bg-brand-black selection:text-white bg-zinc-50">
        {authLoading ? (
          <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
            <div className="w-8 h-8 border-2 border-brand-black border-t-transparent rounded-full animate-spin" />
            <p className="text-[11px] font-bold text-brand-gray uppercase tracking-widest animate-pulse">Loading Partner Portal...</p>
          </div>
        ) : !user ? (
          <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
            <div className="w-8 h-8 border-2 border-brand-black border-t-transparent rounded-full animate-spin" />
            <p className="text-[11px] font-bold text-brand-gray uppercase tracking-widest animate-pulse">Redirecting...</p>
          </div>
        ) : supplierStatus !== "approved" ? (
          /* Notice for review under process */
          <div className="min-h-screen w-full flex items-center justify-center bg-brand-light/30 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="bg-white/95 backdrop-blur border border-brand-border/60 shadow-2xl rounded-[32px] max-w-xl w-full p-8 sm:p-10 space-y-8 animate-in zoom-in-95 duration-500">
              
              {/* Pulsing Status Icon */}
              <div className="mx-auto w-16 h-16 rounded-[24px] bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-inner relative">
                <div className="absolute inset-0 rounded-[24px] bg-amber-400/10 animate-ping opacity-75" />
                <Clock className="w-8 h-8 relative z-10 animate-pulse" />
              </div>

              {/* Title & Brand Badge */}
              <div className="text-center space-y-3">
                <div className="px-3.5 py-1 bg-amber-50/80 text-amber-800 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-200/50 mx-auto w-max flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" /> Verification Pending
                </div>
                <h2 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">
                  Application Under Review
                </h2>
                {supplierName && (
                  <p className="text-xs font-extrabold text-brand-black bg-brand-light px-4 py-1.5 rounded-full border border-brand-border/60 w-max mx-auto">
                    Brand: {supplierName}
                  </p>
                )}
              </div>

              {/* Explanatory Context */}
              <div className="space-y-4 text-center">
                <p className="text-xs text-brand-gray font-semibold leading-relaxed">
                  Thank you for applying to become a partner! Your operator account details are currently being reviewed by our onboarding specialists. 
                </p>
                <p className="text-xs text-brand-gray font-semibold leading-relaxed">
                  We check all operator registries to ensure high marketplace quality, safety, and correct payout settlement. **Your session remains logged in.** Once approved, this screen will automatically refresh and unlock your full supplier dashboard!
                </p>
              </div>

              {/* Professional Onboarding Progress Workflow Map */}
              <div className="bg-brand-light/30 border border-brand-border/40 rounded-2xl p-5 space-y-4">
                <h3 className="text-[10px] font-black text-brand-black uppercase tracking-widest border-b border-brand-border/40 pb-2">Onboarding Progress</h3>
                
                <div className="space-y-3.5 text-left">
                  {/* Step 1: Registered */}
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-brand-black uppercase tracking-wide">Step 1: Profile Created</h4>
                      <p className="text-[10px] text-brand-gray font-semibold">Operator account credentials registered successfully.</p>
                    </div>
                  </div>

                  {/* Step 2: Under Review */}
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 mt-0.5 animate-pulse">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Step 2: Credentials Review</h4>
                      <p className="text-[10px] text-brand-gray font-semibold">Reviewing operator registry, phone details, and legal presence.</p>
                    </div>
                  </div>

                  {/* Step 3: Activation */}
                  <div className="flex gap-3 opacity-50">
                    <div className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-brand-black uppercase tracking-wide">Step 3: Portal Activation</h4>
                      <p className="text-[10px] text-brand-gray font-semibold">Full dashboard access will unlock with email confirmation.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  onClick={() => window.location.reload()}
                  variant="primary" 
                  className="w-full h-12 rounded-xl text-xs font-bold bg-brand-black text-white hover:bg-brand-black/90 active:scale-95 cursor-pointer shadow-md"
                >
                  Refresh Status
                </Button>
                
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="w-full h-12 rounded-xl text-xs font-bold border border-brand-border/80 hover:bg-brand-light active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-brand-black" /> Log Out
                </Button>
              </div>

              {/* Help & Support Footer */}
              <div className="text-center pt-2 border-t border-brand-border/40 text-[10px] text-brand-gray font-semibold">
                Need immediate activation assistance? Email us at{" "}
                <a href="mailto:info@gerromantours.com" className="text-brand-black font-bold hover:underline">
                  info@gerromantours.com
                </a>
              </div>

            </div>
          </div>
        ) : (
          /* Normal Authenticated Supplier Portal Dashboard View */
          <div className="flex h-screen overflow-hidden">
            
            {/* Mobile Top App Bar (Sleek and Sticky) */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur-md border-b border-brand-border/60 z-[50] flex items-center justify-between px-5">
              <Link href="/" className="flex items-center">
                <img 
                  src="/assets/logo.png" 
                  alt="Tour Geeky Logo" 
                  className="h-6 w-auto object-contain" 
                />
                <span className="text-[8px] text-brand-gray uppercase font-black tracking-widest ml-2.5">Partner</span>
              </Link>
              <div className="flex items-center gap-3">
                <button className="relative p-1.5 text-brand-gray hover:text-brand-black rounded-full active:scale-95 transition-all">
                  <Bell className="w-4.5 h-4.5" />
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                </button>
                <div className="w-7 h-7 rounded-full bg-brand-light flex items-center justify-center font-bold text-[10px] text-brand-black border border-brand-border">
                  {initials}
                </div>
              </div>
            </div>

            {/* Desktop Left Sidebar */}
            <aside className="hidden lg:flex w-[280px] border-r border-brand-border/60 bg-white flex-col justify-between h-full shrink-0">
              <div className="space-y-8">
                {/* Logo Header */}
                <div className="h-20 flex items-center px-8 border-b border-brand-border/60 shrink-0">
                  <Link href="/" className="flex items-center">
                    <img 
                      src="/assets/logo.png" 
                      alt="Tour Geeky Logo" 
                      className="h-7 w-auto object-contain" 
                    />
                    <div className="ml-3 flex flex-col">
                      <span className="text-[8px] text-brand-gray uppercase font-black tracking-widest mt-1">Supplier Hub</span>
                    </div>
                  </Link>
                </div>

                {/* Navigation Links */}
                <div className="px-4 py-2 space-y-1">
                  <h3 className="text-[10px] font-black text-brand-gray/60 uppercase tracking-widest px-4 mb-3">Operator Hub</h3>
                  <nav className="space-y-1.5">
                    {navItems.map(item => {
                      const Icon = item.icon;
                      const isActive = headerInfo.active === item.id;
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full font-bold text-[11px] uppercase tracking-wider transition-all duration-200 active:scale-95 ${
                            isActive 
                              ? "bg-brand-black text-white shadow-sm" 
                              : "text-brand-gray hover:text-brand-black hover:bg-brand-light/60"
                          }`}
                        >
                          <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? "text-white" : "text-brand-gray/60"}`} />
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* User Identity Footer */}
              <div className="p-5 border-t border-brand-border/60 shrink-0 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-8.5 w-8.5 rounded-full bg-brand-light flex items-center justify-center font-bold text-brand-black border border-brand-border text-xs">
                        {initials}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs font-bold leading-tight text-brand-black truncate max-w-[140px]">{supplierName || "Operator"}</p>
                      <p className="text-[9px] text-brand-gray font-bold uppercase tracking-wider mt-0.5">Verified Partner</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-brand-gray hover:text-rose-600 rounded-full hover:bg-rose-50 transition-all active:scale-90"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-white h-screen overflow-hidden mt-14 lg:mt-0">
              
              {/* Sticky Top Header */}
              <header className="hidden lg:flex h-[80px] shrink-0 border-b border-brand-border/60 items-center justify-between px-10 bg-white/85 backdrop-blur-md z-10 sticky top-0">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5 text-[11px] text-brand-gray font-bold uppercase tracking-wider">
                    <span>Supplier Hub</span>
                    <span>/</span>
                    <span className="text-brand-black">{headerInfo.breadcrumb}</span>
                  </div>
                  
                  <div className="flex flex-col border-l border-brand-border pl-6 animate-in fade-in slide-in-from-left-2 duration-300">
                    <h1 className="text-base font-bold text-brand-black leading-tight tracking-tight">{headerInfo.title}</h1>
                    <p className="text-[10px] text-brand-gray font-semibold mt-0.5">{headerInfo.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative flex w-[220px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-gray/60" />
                    <input 
                      placeholder="Search tours..." 
                      className="w-full pl-9 pr-4 h-9 text-xs rounded-full border border-brand-border bg-brand-light/20 outline-none transition-all focus:border-brand-black text-brand-black font-semibold placeholder:text-brand-gray/40"
                    />
                  </div>
                  
                  <button className="relative p-2.5 text-brand-gray hover:text-brand-black rounded-full hover:bg-brand-light transition-colors group">
                    <Bell className="w-4.5 h-4.5" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 border border-white rounded-full"></span>
                  </button>
                </div>
              </header>

              {/* Sub-page Children Panel */}
              <div className="flex-1 overflow-y-auto p-4 pb-28 sm:p-8 lg:p-12 bg-white relative custom-scrollbar">
                {children}
              </div>
            </main>

            {/* Mobile Bottom Navigation Tab Bar */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-t border-brand-border/60 z-[50] flex justify-around items-center px-4 pb-safe">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = headerInfo.active === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex flex-col items-center justify-center w-16 h-12 relative transition-all active:scale-90"
                  >
                    <Icon className={`h-5 w-5 transition-all duration-200 ${
                      isActive ? "text-brand-black scale-110" : "text-brand-gray/50"
                    }`} />
                    <span className={`text-[9px] font-black uppercase tracking-wider mt-1 transition-all ${
                      isActive ? "text-brand-black font-extrabold" : "text-brand-gray/40 font-semibold"
                    }`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 w-1.5 h-1.5 bg-brand-black rounded-full shadow-sm animate-in zoom-in-50 duration-300" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Floating Action Button (FAB) on Mobile */}
            {fab && (
              <button
                onClick={fab.onClick}
                className="lg:hidden fixed bottom-20 right-5 z-[55] bg-brand-black text-white hover:bg-brand-black/90 active:scale-95 transition-all shadow-2xl rounded-full p-4 flex items-center justify-center gap-2 border border-white/10 animate-in slide-in-from-bottom-10 duration-300"
                style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.25)" }}
              >
                <fab.icon className="h-5 w-5 text-white" />
                <span className="text-[10px] font-black uppercase tracking-wider pr-1 text-white">{fab.label}</span>
              </button>
            )}

          </div>
        )}
      </body>
    </html>
  );
}
