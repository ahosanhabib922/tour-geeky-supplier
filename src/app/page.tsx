"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { api } from "@/lib/api";

export default function SupplierDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [liveProducts, liveBookings] = await Promise.all([
          api.getProducts(),
          api.getBookings(),
        ]);

        if (liveProducts) {
          setProducts(liveProducts);
        }
        if (liveBookings) {
          setBookings(liveBookings);
        }
      } catch (error) {
        console.error("Failed to load live dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  // Calculations
  const activeTours = products.filter(p => p.status === 'published').length;
  const pendingTours = products.filter(p => p.status === 'pending').length;
  const totalBookings = bookings.length;
  const grossSales = bookings.reduce((sum, b) => sum + (b.total_price || b.price || 0), 0);
  const netEarnings = grossSales * 0.90; // 10% commission

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-brand-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-500">
      <OverviewTab 
        activeTours={activeTours}
        pendingTours={pendingTours}
        totalBookings={totalBookings}
        grossSales={grossSales}
        netEarnings={netEarnings}
        bookings={bookings}
        onOpenModal={() => router.push("/products/create")}
        onViewAllBookings={() => router.push("/bookings")}
      />
    </div>
  );
}
