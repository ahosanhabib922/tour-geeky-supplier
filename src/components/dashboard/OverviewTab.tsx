import React from "react";
import { CheckCircle2, Calendar, DollarSign, Wallet, TrendingUp, ArrowUpRight } from "lucide-react";
import { Button } from "../ui/Button";
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
  onOpenModal,
  onViewAllBookings,
}: OverviewTabProps) {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">Ahlan, Aegean Sails!</h1>
          <p className="text-zinc-400 text-sm">Here is your operator overview for Santorini sailing tours and premium excursions.</p>
        </div>
        <Button onClick={onOpenModal} className="h-11 px-6">
          Request Listing
        </Button>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Active Tours", val: activeTours, sub: `${pendingTours} pending review`, icon: CheckCircle2, color: "text-emerald-400" },
          { label: "Bookings Handled", val: totalBookings, sub: "Last 30 days", icon: Calendar, color: "text-cyan-400" },
          { label: "Gross Sales", val: `$${grossSales.toFixed(2)}`, sub: "Commission deducted at checkout", icon: DollarSign, color: "text-violet-400" },
          { label: "Net Payouts", val: `$${netEarnings.toFixed(2)}`, sub: "10% platform commission", icon: Wallet, color: "text-purple-400" },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800/40 backdrop-blur-md shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-violet-600/5 to-transparent rounded-bl-full pointer-events-none" />
              <div className="flex justify-between items-start">
                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">{m.label}</p>
                <Icon className={`h-4.5 w-4.5 ${m.color}`} />
              </div>
              <h3 className="text-2xl font-black tracking-tight mt-4">{m.val}</h3>
              <p className="text-[10px] text-zinc-500 font-medium mt-1">{m.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Graph & Activity List */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
        
        {/* Sales Graph */}
        <div className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800/40 backdrop-blur-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-base text-zinc-100 tracking-tight">Earning History</h3>
              <p className="text-[10px] text-zinc-500 font-medium">Monthly payout growth comparison</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold">
              <TrendingUp className="h-3 w-3" /> +14.2%
            </div>
          </div>
          
          <div className="h-56 w-full relative flex items-end">
            <svg className="w-full h-full text-violet-500/20" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d="M0 30 C 20 24, 40 18, 60 10, 80 8, 100 2 L 100 30 L 0 30 Z" fill="url(#grad)" />
              <path d="M0 30 C 20 24, 40 18, 60 10, 80 8, 100 2" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex justify-between items-end text-[8px] text-zinc-600 font-bold px-2 pb-1 pointer-events-none">
              <span>JAN</span>
              <span>FEB</span>
              <span>MAR</span>
              <span>APR</span>
              <span>MAY (LIVE)</span>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800/40 backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-base text-zinc-100 tracking-tight">Recent Travelers</h3>
              <p className="text-[10px] text-zinc-500 font-medium">Quick status on incoming customers</p>
            </div>
            
            <div className="space-y-4">
              {bookings.slice(0, 3).map((bk, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/30 hover:border-zinc-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 uppercase">
                      {bk.traveler.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-none">{bk.traveler}</p>
                      <p className="text-[9px] text-zinc-500 font-semibold mt-1 truncate max-w-[150px]">{bk.tour}</p>
                    </div>
                  </div>
                  <Badge status={bk.status}>
                    {bk.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          <button onClick={onViewAllBookings} className="w-full py-2.5 mt-4 rounded-xl border border-zinc-800/60 hover:bg-zinc-900/40 text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-100 transition-all flex items-center justify-center gap-1.5">
            View Booking Log <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
