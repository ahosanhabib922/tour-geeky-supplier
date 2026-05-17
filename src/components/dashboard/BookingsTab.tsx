import React from "react";
import { Badge } from "../ui/Badge";

interface BookingsTabProps {
  bookings: any[];
}

export function BookingsTab({ bookings }: BookingsTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">Activity Bookings</h1>
        <p className="text-zinc-400 text-sm">Review real-time incoming traveler requests and check-in dates.</p>
      </div>

      {/* Bookings Table */}
      <div className="rounded-3xl border border-zinc-800/50 bg-zinc-900/20 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/60 bg-zinc-900/10 text-left">
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Booking ID</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Traveler</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Experience / Tour</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Travel Date</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Net Payout</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((bk, i) => (
                <tr key={i} className="border-b border-zinc-800/30 hover:bg-zinc-900/20 transition-all last:border-0">
                  <td className="py-4 px-6 text-xs font-bold text-violet-400">{bk.id}</td>
                  <td className="py-4 px-6 font-bold text-xs">{bk.traveler}</td>
                  <td className="py-4 px-6 font-semibold text-xs text-zinc-400 max-w-[200px] truncate">{bk.tour}</td>
                  <td className="py-4 px-6 text-[11px] text-zinc-500 font-medium">{bk.date}</td>
                  <td className="py-4 px-6 font-bold text-xs text-white">${bk.payout.toFixed(2)}</td>
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
