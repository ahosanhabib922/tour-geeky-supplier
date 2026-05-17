"use client";

import React, { useState } from "react";
import { LayoutDashboard, Box, ClipboardList, Wallet, Plane, Moon, X, Menu } from "lucide-react";

// Components
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { ProductsTab } from "@/components/dashboard/ProductsTab";
import { BookingsTab } from "@/components/dashboard/BookingsTab";
import { EarningsTab } from "@/components/dashboard/EarningsTab";
import { RequestListingModal } from "@/components/modals/RequestListingModal";

// Mock Initial Data
const INITIAL_PRODUCTS = [
  { id: "prod_1", title: "Santorini Luxury Sunset Catamaran Cruise", category: "water-sports", price: 120.00, bookings: 34, revenue: 4080.00, status: "published" },
  { id: "prod_2", title: "Private VIP Tour of Akrotiri Archaeological Site", category: "history", price: 85.00, bookings: 12, revenue: 1020.00, status: "published" },
  { id: "prod_3", title: "Volcanic Wine Tasting & Cave Cellar Tour", category: "food-drink", price: 95.00, bookings: 0, revenue: 0.00, status: "pending" },
];

const INITIAL_BOOKINGS = [
  { id: "BK-9021", traveler: "Sophia Martinez", tour: "Santorini Luxury Sunset Catamaran Cruise", date: "May 18, 2026", price: 120.00, commission: 12.00, payout: 108.00, status: "confirmed" },
  { id: "BK-8842", traveler: "Liam Johnson", tour: "Private VIP Tour of Akrotiri Archaeological Site", date: "May 19, 2026", price: 85.00, commission: 8.50, payout: 76.50, status: "confirmed" },
  { id: "BK-8711", traveler: "Emma Watson", tour: "Santorini Luxury Sunset Catamaran Cruise", date: "May 20, 2026", price: 240.00, commission: 24.00, payout: 216.00, status: "pending" },
];

export default function SupplierDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "bookings" | "earnings">("dashboard");
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCreateProduct = (formData: any) => {
    const newProd = {
      id: "prod_" + Math.random().toString(36).substring(2, 9),
      title: formData.title,
      category: formData.category,
      price: parseFloat(formData.price),
      bookings: 0,
      revenue: 0,
      status: "pending"
    };
    setProducts([newProd, ...products]);
    setIsModalOpen(false);
  };

  // Calculations
  const activeTours = products.filter(p => p.status === 'published').length;
  const pendingTours = products.filter(p => p.status === 'pending').length;
  const totalBookings = bookings.length;
  const grossSales = products.reduce((sum, p) => sum + p.revenue, 0);
  const commissionPaid = grossSales * 0.10;
  const netEarnings = grossSales - commissionPaid;

  return (
    <div className="flex h-screen bg-zinc-50/50 text-zinc-950 font-sans overflow-hidden">
      
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-zinc-200 z-30 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
            <Plane className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight">Tour Geeky</span>
        </div>
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
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <div className="ml-3 flex flex-col">
              <span className="font-bold text-base tracking-tight leading-none text-zinc-900">Tour Geeky</span>
              <span className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider mt-1.5">Supplier Hub</span>
            </div>
            <button className="ml-auto lg:hidden p-2 text-zinc-400 hover:bg-zinc-50 rounded-lg" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-4 py-2 space-y-1">
            <h3 className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider px-4 mb-3">Operator Hub</h3>
            <nav className="space-y-1">
              {[
                { id: "dashboard", label: "Overview", icon: LayoutDashboard },
                { id: "products", label: "My Activities", icon: Box },
                { id: "bookings", label: "Tour Bookings", icon: ClipboardList },
                { id: "earnings", label: "Finances & Payouts", icon: Wallet },
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                      isActive 
                        ? "bg-zinc-100 text-zinc-900" 
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50/60"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-zinc-900" : "text-zinc-400"}`} />
                    {item.label}
                  </button>
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

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto z-20 p-6 sm:p-10 lg:p-14 mt-16 lg:mt-0 relative">
        {activeTab === "dashboard" && (
          <OverviewTab 
            activeTours={activeTours}
            pendingTours={pendingTours}
            totalBookings={totalBookings}
            grossSales={grossSales}
            netEarnings={netEarnings}
            bookings={bookings}
            onOpenModal={() => setIsModalOpen(true)}
            onViewAllBookings={() => setActiveTab("bookings")}
          />
        )}

        {activeTab === "products" && (
          <ProductsTab 
            products={products}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onOpenModal={() => setIsModalOpen(true)}
            onDeleteProduct={(id) => {
              if (window.confirm("Delete this product?")) {
                setProducts(prev => prev.filter(p => p.id !== id));
              }
            }}
          />
        )}

        {activeTab === "bookings" && (
          <BookingsTab bookings={bookings} />
        )}

        {activeTab === "earnings" && (
          <EarningsTab 
            grossSales={grossSales}
            commissionPaid={commissionPaid}
            netEarnings={netEarnings}
          />
        )}
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/10 z-30 lg:hidden backdrop-blur-sm transition-all duration-300" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Product Request Modal */}
      <RequestListingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProduct}
      />
    </div>
  );
}
