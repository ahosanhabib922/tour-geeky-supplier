import React from "react";
import { Badge } from "../ui/Badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../ui/Table";
import { ShoppingBag, User, Calendar } from "lucide-react";

interface BookingsTabProps {
  bookings: any[];
}

export function BookingsTab({ bookings }: BookingsTabProps) {
  // Helper to safely get traveler name from either DB or mock data format
  const getName = (bk: any) => bk.customer_name || bk.traveler || "Unknown";
  const getTour = (bk: any) => bk.product_title || bk.tour || "Activity Booking";
  const getDate = (bk: any) => {
    const raw = bk.travel_date || bk.date || bk.created_at;
    if (!raw) return "—";
    try { return new Date(raw).toLocaleDateString(); } catch { return raw; }
  };
  const getPayout = (bk: any) => {
    if (typeof bk.supplier_payout === "number") return bk.supplier_payout;
    if (typeof bk.payout === "number") return bk.payout;
    const total = bk.total_price || bk.price || 0;
    return total * 0.9; // Default 10% commission
  };
  const getStatus = (bk: any) => bk.status || "pending";

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      
      {/* Mobile Card List (Visible only on mobile/tablet) */}
      <div className="block lg:hidden space-y-4">
        {bookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-brand-border/40">
            <ShoppingBag className="h-8 w-8 opacity-20 mx-auto mb-2 text-brand-gray" />
            <p className="text-xs text-brand-gray">No bookings yet.</p>
          </div>
        ) : (
          bookings.map((bk, i) => (
            <div key={bk.id || i} className="bg-white rounded-2xl border border-brand-border/40 p-5 space-y-4 hover:shadow-md transition-shadow">
              {/* Header: ID & Status */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">{bk.id}</span>
                <Badge status={getStatus(bk)}>
                  {getStatus(bk)}
                </Badge>
              </div>
              
              {/* Tour Title */}
              <div>
                <h4 className="font-bold text-sm text-brand-black line-clamp-2 leading-snug">{getTour(bk)}</h4>
              </div>
              
              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-3 border-t border-brand-border/30 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Traveler</span>
                  <span className="font-semibold text-brand-black">{getName(bk)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Travel Date</span>
                  <span className="font-semibold text-brand-black">{getDate(bk)}</span>
                </div>
                {bk.option_name && (
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Option</span>
                    <span className="font-semibold text-brand-black">{bk.option_name}</span>
                  </div>
                )}
                <div className={bk.option_name ? "" : "col-span-2"}>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Net Payout</span>
                  <span className="text-sm font-black text-brand-black">${getPayout(bk).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Clean Table (Visible only on desktop) */}
      <div className="hidden lg:block w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Booking ID</TableHead>
              <TableHead>Traveler</TableHead>
              <TableHead>Experience / Tour</TableHead>
              <TableHead>Option</TableHead>
              <TableHead>Travel Date</TableHead>
              <TableHead>Net Payout</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-sm text-brand-gray">No bookings yet.</TableCell>
              </TableRow>
            ) : (
              bookings.map((bk, i) => (
                <TableRow key={bk.id || i}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{bk.id}</TableCell>
                  <TableCell className="font-medium">{getName(bk)}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[220px] truncate">{getTour(bk)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{bk.option_name || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{getDate(bk)}</TableCell>
                  <TableCell className="font-medium">${getPayout(bk).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge status={getStatus(bk)}>
                      {getStatus(bk)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
