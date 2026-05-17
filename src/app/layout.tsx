"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Box, ClipboardList, Wallet, Plane, X, Menu, Bell, Search } from "lucide-react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Exclude landing page from having the dashboard sidebar and header shell!
  const isLanding = pathname === "/landing";

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
    return { title: "Dashboard", desc: "Operator Overview", breadcrumb: "Dashboard", active: "dashboard" };
  };

  const headerInfo = getHeaderInfo();

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
  ];

  return (
    <html lang="en" className="h-full antialiased bg-white text-zinc-950">
      <body className="min-h-full flex flex-col font-sans selection:bg-brand-black selection:text-white">
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
                AS
              </div>
            </div>
          </div>

          {/* Desktop Left Sidebar (Only visible on lg:flex) */}
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
                  <div className="ml-3 flex flex-col animate-in fade-in duration-300">
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
                      AS
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs font-bold leading-tight text-brand-black">Aegean Sails Ltd</p>
                    <p className="text-[9px] text-brand-gray font-bold uppercase tracking-wider mt-0.5">Verified Operator</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area (Right Side Layout) */}
          <main className="flex-1 flex flex-col min-w-0 bg-white h-screen overflow-hidden mt-14 lg:mt-0">
            
            {/* Sticky Top Header (Only visible on Desktop lg) */}
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

            {/* Sub-page Children Panel (Mobile optimized padding & bottom tab offset) */}
            <div className="flex-1 overflow-y-auto p-4 pb-28 sm:p-8 lg:p-12 bg-white relative custom-scrollbar">
              {children}
            </div>
          </main>

          {/* Mobile Bottom Navigation Tab Bar (Sticky and iOS Native style) */}
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

        </div>
      </body>
    </html>
  );
}
