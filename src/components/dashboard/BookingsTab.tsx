import React from "react";
import { Badge } from "../ui/Badge";

interface BookingsTabProps {
  bookings: any[];
}

export function BookingsTab({ bookings }: BookingsTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      
      {/* Bookings Table */}
      <div className="rounded-[24px] border border-brand-border/40 bg-white hover:shadow-xl hover:shadow-brand-black/5 transition-all duration-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-brand-border bg-brand-light/50 text-left">
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-brand-gray">Booking ID</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-brand-gray">Traveler</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-brand-gray">Experience / Tour</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-brand-gray">Travel Date</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-brand-gray">Net Payout</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-brand-gray">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((bk, i) => (
                <tr key={i} className="border-b border-brand-border hover:bg-brand-light/20 transition-all last:border-0">
                  <td className="py-4 px-6 text-xs font-black text-brand-black">{bk.id}</td>
                  <td className="py-4 px-6 font-bold text-xs text-brand-black">{bk.traveler}</td>
                  <td className="py-4 px-6 font-medium text-xs text-brand-gray max-w-[220px] truncate">{bk.tour}</td>
                  <td className="py-4 px-6 text-[11px] text-brand-gray font-semibold">{bk.date}</td>
                  <td className="py-4 px-6 font-bold text-xs text-brand-black">${bk.payout.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <Badge status={bk.status}>
                      {bk.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
