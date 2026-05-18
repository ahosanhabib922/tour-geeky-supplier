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
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      
      {/* Commission Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-[24px] bg-white border border-brand-border/40 hover:shadow-xl hover:shadow-brand-black/5 transition-all duration-300">
          <p className="text-[10px] uppercase font-bold tracking-widest text-brand-gray">Gross Sales Volume</p>
          <h3 className="text-3xl font-bold mt-2 text-brand-black">${grossSales.toFixed(2)}</h3>
        </div>
        <div className="p-6 rounded-[24px] bg-white border border-brand-border/40 hover:shadow-xl hover:shadow-brand-black/5 transition-all duration-300">
          <p className="text-[10px] uppercase font-bold tracking-widest text-brand-gray">Commission Paid (10%)</p>
          <h3 className="text-3xl font-bold mt-2 text-red-500">${commissionPaid.toFixed(2)}</h3>
        </div>
        <div className="p-6 rounded-[24px] bg-white border border-brand-border/40 hover:shadow-xl hover:shadow-brand-black/5 transition-all duration-300">
          <p className="text-[10px] uppercase font-bold tracking-widest text-brand-gray">Total Net Disbursed</p>
          <h3 className="text-3xl font-bold mt-2 text-emerald-600">${netEarnings.toFixed(2)}</h3>
        </div>
      </div>

      {/* Bank details info card */}
      <div className="p-8 rounded-[24px] border border-brand-border/40 bg-white hover:shadow-xl hover:shadow-brand-black/5 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold text-brand-gray uppercase tracking-widest">
            <Building className="h-4.5 w-4.5 text-brand-gray/60" /> Settlement Account
          </div>
          <h4 className="text-base font-bold text-brand-black">National Bank of Greece •••• 9921</h4>
          <p className="text-[10px] text-brand-gray font-semibold leading-relaxed">Direct SEPA transfers processed automatically every Monday at 00:00 UTC.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Button variant="outline" size="sm" className="px-5 h-11 text-xs">
            Update Account
          </Button>
          <Button variant="primary" size="sm" className="px-5 h-11 text-xs">
            Request Payout
          </Button>
        </div>
      </div>
    </div>
  );
}
