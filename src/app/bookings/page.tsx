"use client";

import React, { useState } from "react";
import { BookingsTab } from "@/components/dashboard/BookingsTab";
import { INITIAL_BOOKINGS } from "@/constants/mockData";

export default function SupplierBookingsPage() {
  const [bookings] = useState(INITIAL_BOOKINGS);

  return (
    <div className="w-full animate-in fade-in duration-500">
      <BookingsTab bookings={bookings} />
    </div>
  );
}
