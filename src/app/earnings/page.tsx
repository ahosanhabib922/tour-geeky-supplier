"use client";

import React, { useState } from "react";
import { EarningsTab } from "@/components/dashboard/EarningsTab";
import { INITIAL_PRODUCTS } from "@/constants/mockData";

export default function SupplierEarningsPage() {
  const [products] = useState(INITIAL_PRODUCTS);

  // Calculations
  const grossSales = products.reduce((sum, p) => sum + p.revenue, 0);
  const commissionPaid = grossSales * 0.10;
  const netEarnings = grossSales - commissionPaid;

  return (
    <div className="w-full animate-in fade-in duration-500">
      <EarningsTab 
        grossSales={grossSales}
        commissionPaid={commissionPaid}
        netEarnings={netEarnings}
      />
    </div>
  );
}
