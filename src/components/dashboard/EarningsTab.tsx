import React from "react";
import { Building } from "lucide-react";
import { Button } from "../ui/Button";

interface EarningsTabProps {
  grossSales: number;
  commissionPaid: number;
  netEarnings: number;
}

export function EarningsTab({
  grossSales,
  commissionPaid,
  netEarnings,
}: EarningsTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">Finance Overview</h1>
        <p className="text-zinc-400 text-sm">Monitor payouts, platform commissions, and direct bank transfers.</p>
      </div>

      {/* Commission Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800/40 backdrop-blur-md">
          <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Gross Sales Volume</p>
          <h3 className="text-3xl font-black mt-2 text-white">${grossSales.toFixed(2)}</h3>
        </div>
        <div className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800/40 backdrop-blur-md">
          <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Commission Deducted (10%)</p>
          <h3 className="text-3xl font-black mt-2 text-rose-500">${commissionPaid.toFixed(2)}</h3>
        </div>
        <div className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800/40 backdrop-blur-md">
          <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Total Net Disbursed</p>
          <h3 className="text-3xl font-black mt-2 text-emerald-400">${netEarnings.toFixed(2)}</h3>
        </div>
      </div>

      {/* Bank details info card */}
      <div className="p-8 rounded-[32px] border border-zinc-800/50 bg-gradient-to-br from-zinc-900/20 to-zinc-950/20 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-violet-400 uppercase tracking-widest">
            <Building className="h-4 w-4" /> Settlement Account
          </div>
          <h4 className="text-base font-bold text-zinc-100">National Bank of Greece •••• 9921</h4>
          <p className="text-[10px] text-zinc-500 font-semibold leading-relaxed">Direct SEPA transfers processed automatically every Monday at 00:00 UTC.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Button variant="outline" className="h-11 rounded-2xl px-6">
            Update Account
          </Button>
          <Button className="h-11 rounded-2xl px-6">
            Request Payout
          </Button>
        </div>
      </div>
    </div>
  );
}
