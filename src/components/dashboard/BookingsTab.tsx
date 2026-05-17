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
      <div className="w-full overflow-auto">
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
