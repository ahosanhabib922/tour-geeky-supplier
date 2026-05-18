import React from "react";
import { CheckCircle2, Calendar, DollarSign, Wallet, TrendingUp, ArrowUpRight } from "lucide-react";
import { Badge } from "../ui/Badge";

interface OverviewTabProps {
  activeTours: number;
  pendingTours: number;
  totalBookings: number;
  grossSales: number;
  netEarnings: number;
  bookings: any[];
  onOpenModal: () => void;
  onViewAllBookings: () => void;
}

export function OverviewTab({
  activeTours,
  pendingTours,
  totalBookings,
  grossSales,
  netEarnings,
  bookings,
  onViewAllBookings,
}: OverviewTabProps) {
  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-6xl mx-auto">
      
      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Tours", val: activeTours, sub: `${pendingTours} pending review`, icon: CheckCircle2 },
          { label: "Bookings Handled", val: totalBookings, sub: "Last 30 days", icon: Calendar },
          { label: "Gross Sales", val: `$${grossSales.toFixed(2)}`, sub: "Deducted at checkout", icon: DollarSign },
          { label: "Net Payouts", val: `$${netEarnings.toFixed(2)}`, sub: "10% platform commission", icon: Wallet },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="bg-white border border-brand-border/40 p-5 rounded-[24px] space-y-4 hover:shadow-xl hover:shadow-brand-black/5 transition-all duration-300 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-black">
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="space-y-1 mt-2">
                <p className="text-[10px] font-bold text-brand-gray uppercase tracking-wider">{m.label}</p>
                <h3 className="text-2xl font-bold text-brand-black tracking-tight">{m.val}</h3>
                <p className="text-[10px] text-brand-gray/60 font-semibold leading-tight">{m.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Section: Earning Graph & Travel Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        
        {/* Sales Graph */}
        <div className="p-6 rounded-[24px] bg-white border border-brand-border/40 hover:shadow-xl hover:shadow-brand-black/5 transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-sm text-brand-black tracking-tight uppercase">Earning History</h3>
              <p className="text-[10px] text-brand-gray font-semibold">Monthly payout growth comparison</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-light border border-brand-border text-brand-black rounded-full text-[10px] font-bold uppercase tracking-wider">
              <TrendingUp className="h-3.5 w-3.5" /> +14.2%
            </div>
          </div>
          
          <div className="h-56 w-full relative flex items-end">
            <svg className="w-full h-full text-brand-black/[0.03]" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d="M0 30 C 20 24, 40 18, 60 10, 80 8, 100 2 L 100 30 L 0 30 Z" fill="url(#grad)" />
              <path d="M0 30 C 20 24, 40 18, 60 10, 80 8, 100 2" fill="none" stroke="#111111" strokeWidth="0.5" />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#111111" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#111111" stopOpacity="0.0" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex justify-between items-end text-[9px] text-brand-gray/60 font-bold px-2 pb-1 pointer-events-none tracking-wider">
              <span>JAN</span>
              <span>FEB</span>
              <span>MAR</span>
              <span>APR</span>
              <span>MAY (LIVE)</span>
            </div>
          </div>
        </div>

        {/* Recent Travelers */}
        <div className="p-6 rounded-[24px] bg-white border border-brand-border/40 hover:shadow-xl hover:shadow-brand-black/5 transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-sm text-brand-black tracking-tight uppercase">Recent Travelers</h3>
              <p className="text-[10px] text-brand-gray font-semibold">Quick status on incoming customers</p>
            </div>
            
            <div className="space-y-3.5">
              {bookings.slice(0, 3).map((bk, i) => {
                const name = bk.customer_name || bk.traveler || "Unknown";
                const tour = bk.product_title || bk.tour || "Activity";
                const initials = name.substring(0, 2).toUpperCase();
                return (
                <div key={i} className="flex justify-between items-center p-3.5 rounded-[20px] bg-brand-light/30 border border-brand-border hover:bg-brand-light/60 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-8.5 w-8.5 rounded-full bg-brand-light border border-brand-border flex items-center justify-center text-[10px] font-bold text-brand-black uppercase">
                      {initials}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-black leading-none">{name}</p>
                      <p className="text-[9px] text-brand-gray font-bold uppercase tracking-wider mt-1 truncate max-w-[130px]">{tour}</p>
                    </div>
                  </div>
                  <Badge status={bk.status || "pending"}>
                    {bk.status || "pending"}
                  </Badge>
                </div>
                );
              })}
            </div>
          </div>
          
          <button 
            onClick={onViewAllBookings} 
            className="w-full py-2.5 mt-4 rounded-full border border-brand-border hover:bg-brand-light text-[10px] font-bold uppercase tracking-wider text-brand-black transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            View Booking Log <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
