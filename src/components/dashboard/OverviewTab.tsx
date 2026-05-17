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
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Tours", val: activeTours, sub: `${pendingTours} pending review`, icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50" },
          { label: "Bookings Handled", val: totalBookings, sub: "Last 30 days", icon: Calendar, color: "text-blue-500 bg-blue-50" },
          { label: "Gross Sales", val: `$${grossSales.toFixed(2)}`, sub: "Commission deducted at checkout", icon: DollarSign, color: "text-indigo-500 bg-indigo-50" },
          { label: "Net Payouts", val: `$${netEarnings.toFixed(2)}`, sub: "10% platform commission", icon: Wallet, color: "text-violet-500 bg-violet-50" },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="p-6 rounded-xl bg-white border border-zinc-200/80 shadow-sm relative overflow-hidden group hover:border-zinc-300 transition-all duration-200">
              <div className="flex justify-between items-start">
                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">{m.label}</p>
                <div className={`p-2 rounded-lg ${m.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <h3 className="text-2xl font-bold tracking-tight mt-4 text-zinc-900">{m.val}</h3>
              <p className="text-[10px] text-zinc-500 font-semibold mt-1">{m.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Middle Section: Earning Graph & Travel Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        
        {/* Sales Graph */}
        <div className="p-6 rounded-xl bg-white border border-zinc-200/80 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-sm text-zinc-800 tracking-tight">Earning History</h3>
              <p className="text-[10px] text-zinc-400 font-semibold">Monthly payout growth comparison</p>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full text-[10px] font-bold">
              <TrendingUp className="h-3 w-3" /> +14.2%
            </div>
          </div>
          
          <div className="h-56 w-full relative flex items-end">
            <svg className="w-full h-full text-blue-500/10" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d="M0 30 C 20 24, 40 18, 60 10, 80 8, 100 2 L 100 30 L 0 30 Z" fill="url(#grad)" />
              <path d="M0 30 C 20 24, 40 18, 60 10, 80 8, 100 2" fill="none" stroke="#2563eb" strokeWidth="0.5" />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex justify-between items-end text-[9px] text-zinc-400 font-bold px-2 pb-1 pointer-events-none">
              <span>JAN</span>
              <span>FEB</span>
              <span>MAR</span>
              <span>APR</span>
              <span>MAY (LIVE)</span>
            </div>
          </div>
        </div>

        {/* Recent Travelers */}
        <div className="p-6 rounded-xl bg-white border border-zinc-200/80 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-sm text-zinc-800 tracking-tight">Recent Travelers</h3>
              <p className="text-[10px] text-zinc-400 font-semibold">Quick status on incoming customers</p>
            </div>
            
            <div className="space-y-3.5">
              {bookings.slice(0, 3).map((bk, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 border border-zinc-100 hover:border-zinc-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600 uppercase">
                      {bk.traveler.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-800 leading-none">{bk.traveler}</p>
                      <p className="text-[9px] text-zinc-500 font-semibold mt-1 truncate max-w-[140px]">{bk.tour}</p>
                    </div>
                  </div>
                  <Badge status={bk.status}>
                    {bk.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={onViewAllBookings} 
            className="w-full py-2 mt-4 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-800 transition-all flex items-center justify-center gap-1.5"
          >
            View Booking Log <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
