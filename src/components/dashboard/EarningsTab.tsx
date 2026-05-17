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
      
      {/* Commission Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-white border border-zinc-200/80 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Gross Sales Volume</p>
          <h3 className="text-3xl font-bold mt-2 text-zinc-900">${grossSales.toFixed(2)}</h3>
        </div>
        <div className="p-6 rounded-xl bg-white border border-zinc-200/80 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Commission Deducted (10%)</p>
          <h3 className="text-3xl font-bold mt-2 text-rose-600">${commissionPaid.toFixed(2)}</h3>
        </div>
        <div className="p-6 rounded-xl bg-white border border-zinc-200/80 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Total Net Disbursed</p>
          <h3 className="text-3xl font-bold mt-2 text-emerald-600">${netEarnings.toFixed(2)}</h3>
        </div>
      </div>

      {/* Bank details info card */}
      <div className="p-8 rounded-xl border border-zinc-200/80 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 uppercase tracking-widest">
            <Building className="h-4 w-4 text-zinc-400" /> Settlement Account
          </div>
          <h4 className="text-base font-bold text-zinc-900">National Bank of Greece •••• 9921</h4>
          <p className="text-[10px] text-zinc-500 font-semibold leading-relaxed">Direct SEPA transfers processed automatically every Monday at 00:00 UTC.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Button variant="outline" className="h-10 px-5 text-xs">
            Update Account
          </Button>
          <Button className="h-10 px-5 text-xs">
            Request Payout
          </Button>
        </div>
      </div>
    </div>
  );
}
