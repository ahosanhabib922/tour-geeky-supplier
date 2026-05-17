"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Box, ClipboardList, Wallet, Plane, Moon, X, Menu, Bell, Search } from "lucide-react";
import "./globals.css";
import { Input } from "@/components/ui/Input";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  return (
    <html lang="en" className="h-full antialiased bg-white text-zinc-950">
      <body className="min-h-full flex flex-col font-sans">
        <div className="flex h-screen overflow-hidden">
          
          {/* Mobile Top Header */}
          <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-zinc-200 z-30 flex items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                <Plane className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base tracking-tight">Tour Geeky</span>
            </Link>
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar Layout */}
          <aside className={`w-[280px] border-r border-zinc-200/80 bg-white flex flex-col justify-between h-full fixed lg:relative z-40 transform transition-all duration-300 ease-in-out shrink-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}>
            <div className="space-y-8">
              {/* Logo Header */}
              <div className="h-20 flex items-center px-8 border-b border-zinc-200/80 shrink-0">
                <Link href="/" className="flex items-center">
                  <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                    <Plane className="w-4 h-4 text-white" />
                  </div>
                  <div className="ml-3 flex flex-col animate-in fade-in duration-300">
                    <span className="font-bold text-base tracking-tight leading-none text-zinc-900">Tour Geeky</span>
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider mt-1.5">Supplier Hub</span>
                  </div>
                </Link>
                <button className="ml-auto lg:hidden p-2 text-zinc-400 hover:bg-zinc-50 rounded-lg" onClick={() => setIsSidebarOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="px-4 py-2 space-y-1">
                <h3 className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider px-4 mb-3">Operator Hub</h3>
                <nav className="space-y-1">
                  {[
                    { id: "dashboard", label: "Overview", icon: LayoutDashboard, href: "/" },
                    { id: "products", label: "My Activities", icon: Box, href: "/products" },
                    { id: "bookings", label: "Tour Bookings", icon: ClipboardList, href: "/bookings" },
                    { id: "earnings", label: "Finances & Payouts", icon: Wallet, href: "/earnings" },
                  ].map(item => {
                    const Icon = item.icon;
                    const isActive = headerInfo.active === item.id;
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                          isActive 
                            ? "bg-zinc-100 text-zinc-900" 
                            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50/60"
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? "text-zinc-900" : "text-zinc-400"}`} />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* User Identity Footer */}
            <div className="p-4 border-t border-zinc-200/80 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-700 border border-zinc-200 text-xs">
                      AS
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs font-semibold leading-tight text-zinc-800">Aegean Sails Ltd</p>
                    <p className="text-[10px] text-zinc-400">Verified Operator</p>
                  </div>
                </div>
                <button className="text-zinc-400 hover:text-zinc-800 p-2 rounded-lg hover:bg-zinc-50 transition-all">
                  <Moon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area (Right Side Layout) */}
          <main className="flex-1 flex flex-col min-w-0 bg-white h-screen overflow-hidden mt-16 lg:mt-0">
            
            {/* Sticky Top Header */}
            <header className="h-[72px] shrink-0 border-b border-zinc-200/80 flex items-center justify-between px-6 lg:px-10 bg-white/80 backdrop-blur-md z-10 sticky top-0">
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 font-semibold tracking-wide">
                  <span>Supplier Hub</span>
                  <span>/</span>
                  <span className="text-zinc-600">{headerInfo.breadcrumb}</span>
                </div>
                
                <div className="flex flex-col border-l border-zinc-200 pl-6 animate-in fade-in slide-in-from-left-2 duration-300">
                  <h1 className="text-[15px] font-bold text-zinc-900 leading-tight">{headerInfo.title}</h1>
                  <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">{headerInfo.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative hidden md:flex w-[200px]">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                  <Input 
                    placeholder="Search" 
                    className="pl-8 h-8 text-xs rounded-lg"
                  />
                </div>
                
                <button className="relative p-2 text-zinc-500 hover:text-zinc-800 rounded-full hover:bg-zinc-50 transition-colors">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 border border-white rounded-full"></span>
                </button>
              </div>
            </header>

            {/* Sub-page Children Panel */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 lg:p-14 bg-zinc-50/20 relative">
              {children}
            </div>
          </main>

          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/10 z-30 lg:hidden backdrop-blur-sm transition-all duration-300" 
              onClick={() => setIsSidebarOpen(false)} 
            />
          )}
        </div>
      </body>
    </html>
  );
}
