"use client";

import React, { useState, useEffect } from "react";
import { BookingsTab } from "@/components/dashboard/BookingsTab";
import { api } from "@/lib/api";
import { INITIAL_BOOKINGS } from "@/constants/mockData";

export default function SupplierBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await api.getBookings();
        if (data && data.length > 0) {
          setBookings(data);
        } else {
          setBookings(INITIAL_BOOKINGS);
        }
      } catch (error) {
        console.error("Failed to load live bookings from DB, falling back to mock:", error);
        setBookings(INITIAL_BOOKINGS);
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-500">
      <BookingsTab bookings={bookings} />
    </div>
  );
}
