import React from "react";
import { Badge } from "../ui/Badge";

interface BookingsTabProps {
  bookings: any[];
}

export function BookingsTab({ bookings }: BookingsTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Bookings Table */}
      <div className="rounded-xl border border-zinc-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-zinc-200/80 bg-zinc-50/50 text-left">
                <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Booking ID</th>
                <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Traveler</th>
                <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Experience / Tour</th>
                <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Travel Date</th>
                <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Net Payout</th>
                <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((bk, i) => (
                <tr key={i} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-all last:border-0">
                  <td className="py-3 px-6 text-xs font-bold text-blue-600">{bk.id}</td>
                  <td className="py-3 px-6 font-bold text-xs text-zinc-900">{bk.traveler}</td>
                  <td className="py-3 px-6 font-semibold text-xs text-zinc-500 max-w-[220px] truncate">{bk.tour}</td>
                  <td className="py-3 px-6 text-[11px] text-zinc-500 font-medium">{bk.date}</td>
                  <td className="py-3 px-6 font-bold text-xs text-zinc-900">${bk.payout.toFixed(2)}</td>
                  <td className="py-3 px-6">
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
