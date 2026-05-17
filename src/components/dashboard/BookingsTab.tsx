import React from "react";
import { Badge } from "../ui/Badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../ui/Table";

interface BookingsTabProps {
  bookings: any[];
}

export function BookingsTab({ bookings }: BookingsTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      
      {/* Mobile Card List (Visible only on mobile/tablet) */}
      <div className="block lg:hidden space-y-4">
        {bookings.map((bk, i) => (
          <div key={i} className="bg-white rounded-2xl border border-brand-border/40 p-5 space-y-4 hover:shadow-md transition-shadow">
            {/* Header: ID & Status */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">{bk.id}</span>
              <Badge status={bk.status}>
                {bk.status}
              </Badge>
            </div>
            
            {/* Tour Title */}
            <div>
              <h4 className="font-bold text-sm text-brand-black line-clamp-2 leading-snug">{bk.tour}</h4>
            </div>
            
            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-3 border-t border-brand-border/30 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Traveler</span>
                <span className="font-semibold text-brand-black">{bk.traveler}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Travel Date</span>
                <span className="font-semibold text-brand-black">{bk.date}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Net Payout</span>
                <span className="text-sm font-black text-brand-black">${bk.payout.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Clean Table (Visible only on desktop) */}
      <div className="hidden lg:block w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Booking ID</TableHead>
              <TableHead>Traveler</TableHead>
              <TableHead>Experience / Tour</TableHead>
              <TableHead>Travel Date</TableHead>
              <TableHead>Net Payout</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((bk, i) => (
              <TableRow key={i}>
                <TableCell className="font-mono text-xs text-muted-foreground">{bk.id}</TableCell>
                <TableCell className="font-medium">{bk.traveler}</TableCell>
                <TableCell className="text-muted-foreground max-w-[220px] truncate">{bk.tour}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{bk.date}</TableCell>
                <TableCell className="font-medium">${bk.payout.toFixed(2)}</TableCell>
                <TableCell>
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
