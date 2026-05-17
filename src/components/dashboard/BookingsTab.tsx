import React from "react";
import { Badge } from "../ui/Badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../ui/Table";

interface BookingsTabProps {
  bookings: any[];
}

export function BookingsTab({ bookings }: BookingsTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      
      {/* Bookings Table */}
      <div className="rounded-[24px] border border-brand-border/40 bg-white hover:shadow-xl hover:shadow-brand-black/5 transition-all duration-300 overflow-hidden">
        <Table>
          <TableHeader className="bg-brand-light/50 border-b border-brand-border">
            <TableRow className="hover:bg-transparent">
              <TableHead className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-brand-gray">Booking ID</TableHead>
              <TableHead className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-brand-gray">Traveler</TableHead>
              <TableHead className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-brand-gray">Experience / Tour</TableHead>
              <TableHead className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-brand-gray">Travel Date</TableHead>
              <TableHead className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-brand-gray">Net Payout</TableHead>
              <TableHead className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-brand-gray">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((bk, i) => (
              <TableRow key={i} className="border-b border-brand-border hover:bg-brand-light/20 transition-all last:border-0">
                <TableCell className="py-4 px-6 text-xs font-black text-brand-black">{bk.id}</TableCell>
                <TableCell className="py-4 px-6 font-bold text-xs text-brand-black">{bk.traveler}</TableCell>
                <TableCell className="py-4 px-6 font-medium text-xs text-brand-gray max-w-[220px] truncate">{bk.tour}</TableCell>
                <TableCell className="py-4 px-6 text-[11px] text-brand-gray font-semibold">{bk.date}</TableCell>
                <TableCell className="py-4 px-6 font-bold text-xs text-brand-black">${bk.payout.toFixed(2)}</TableCell>
                <TableCell className="py-4 px-6">
                  <Badge status={bk.status}>
                    {bk.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
