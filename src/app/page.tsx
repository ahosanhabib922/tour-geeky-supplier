"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { INITIAL_PRODUCTS, INITIAL_BOOKINGS } from "@/constants/mockData";

export default function SupplierDashboard() {
  const router = useRouter();
  const [products] = useState(INITIAL_PRODUCTS);
  const [bookings] = useState(INITIAL_BOOKINGS);

  // Calculations
  const activeTours = products.filter(p => p.status === 'published').length;
  const pendingTours = products.filter(p => p.status === 'pending').length;
  const totalBookings = bookings.length;
  const grossSales = products.reduce((sum, p) => sum + p.revenue, 0);
  const netEarnings = grossSales * 0.90; // 10% commission

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
