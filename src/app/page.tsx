"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { api } from "@/lib/api";
import { INITIAL_PRODUCTS, INITIAL_BOOKINGS } from "@/constants/mockData";

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

        if (liveProducts && liveProducts.length > 0) {
          setProducts(liveProducts);
        } else {
          setProducts(INITIAL_PRODUCTS);
        }

        if (liveBookings && liveBookings.length > 0) {
          setBookings(liveBookings);
        } else {
          setBookings(INITIAL_BOOKINGS);
        }
      } catch (error) {
        console.error("Failed to load live dashboard data, falling back to mock:", error);
        setProducts(INITIAL_PRODUCTS);
        setBookings(INITIAL_BOOKINGS);
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
  const grossSales = products.reduce((sum, p) => sum + (p.revenue || 0), 0);
  const netEarnings = grossSales * 0.90; // 10% commission

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
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
