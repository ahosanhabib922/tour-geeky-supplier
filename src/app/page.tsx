"use client";

import React, { useState } from "react";
import { LayoutDashboard, Box, ClipboardList, Wallet, Globe } from "lucide-react";

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
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none" />

      {/* Sidebar Layout */}
      <aside className="w-80 border-r border-zinc-800/40 bg-zinc-950/70 backdrop-blur-md flex flex-col justify-between p-6 z-20">
        <div className="space-y-10">
          <div className="flex items-center gap-3.5 px-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-600/20">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent leading-none">Tour Geeky</h2>
              <span className="text-[10px] uppercase font-bold tracking-widest text-violet-400 mt-1 block">Supplier Hub</span>
            </div>
          </div>

          <nav className="space-y-1.5">
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
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                    isActive 
                      ? "bg-gradient-to-r from-violet-600/10 to-transparent text-violet-400 border-l-2 border-violet-500" 
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/40"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? "text-violet-400" : "text-zinc-500"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 rounded-3xl bg-zinc-900/30 border border-zinc-800/40 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-zinc-800 flex items-center justify-center font-bold text-violet-400 border border-zinc-700/50 uppercase">
              AS
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-100 leading-tight">Aegean Sails Ltd</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Verified Operator</p>
            </div>
          </div>
          <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-400">
            <span className="font-semibold">Commission Rate:</span>
            <span className="font-bold text-violet-400">10.0%</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto z-20 p-10 lg:p-14 relative">
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

      {/* Product Request Modal */}
      <RequestListingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProduct}
      />
    </div>
  );
}
