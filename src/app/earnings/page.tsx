"use client";

import React, { useState, useEffect } from "react";
import { Building, Loader2, TrendingUp, DollarSign, Percent, Download, FileText, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export default function SupplierEarningsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const res = await fetch("/api/finance");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch earnings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) =>
    `$${(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 text-brand-black animate-spin" />
        <p className="text-sm text-brand-gray">Loading earnings data...</p>
      </div>
    );
  }

  const transactions = data?.transactions || [];

  return (
    <div className="w-full animate-in fade-in duration-500 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-black">Earnings</h1>
          <p className="text-sm text-brand-gray">Track your revenue, commissions, and net payouts.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 w-fit">
          <Download className="h-4 w-4" /> Export Statement
        </Button>
      </div>

      {/* Commission Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-[24px] bg-white border border-brand-border/40 hover:shadow-xl hover:shadow-brand-black/5 transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-xl bg-brand-light">
              <DollarSign className="h-4 w-4 text-brand-black" />
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-brand-gray">Gross Sales Volume</p>
          </div>
          <h3 className="text-3xl font-black mt-2 text-brand-black">{formatCurrency(data?.grossSales)}</h3>
          <p className="text-xs text-brand-gray mt-1">{data?.totalBookings || 0} total bookings</p>
        </div>
        <div className="p-6 rounded-[24px] bg-white border border-brand-border/40 hover:shadow-xl hover:shadow-brand-black/5 transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-xl bg-red-50">
              <Percent className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-brand-gray">Commission ({data?.commissionRate || 10}%)</p>
          </div>
          <h3 className="text-3xl font-black mt-2 text-red-500">{formatCurrency(data?.commissionPaid)}</h3>
          <p className="text-xs text-brand-gray mt-1">Platform service fee</p>
        </div>
        <div className="p-6 rounded-[24px] bg-white border border-brand-border/40 hover:shadow-xl hover:shadow-brand-black/5 transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-xl bg-emerald-50">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-brand-gray">Net Disbursed</p>
          </div>
          <h3 className="text-3xl font-black mt-2 text-emerald-600">{formatCurrency(data?.netEarnings)}</h3>
          <p className="text-xs text-brand-gray mt-1">Your take-home earnings</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-brand-black">Recent Transactions</h2>

        {/* Mobile Cards */}
        <div className="block lg:hidden space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-brand-border/40">
              <ShoppingBag className="h-8 w-8 opacity-20 mx-auto mb-2 text-brand-gray" />
              <p className="text-xs text-brand-gray">No transactions yet.</p>
            </div>
          ) : (
            transactions.map((tx: any) => {
              const commission = tx.total_price * ((data?.commissionRate || 10) / 100);
              const payout = tx.total_price - commission;
              return (
                <div key={tx.id} className="bg-white rounded-2xl border border-brand-border/40 p-5 space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black tracking-tight">{tx.id}</span>
                    <Badge className={cn(
                      "rounded-lg text-[9px] uppercase font-black px-2 py-0.5 border-none",
                      tx.payment_status === "paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                    )}>
                      {tx.payment_status}
                    </Badge>
                  </div>
                  <p className="text-sm font-bold truncate text-brand-black">{tx.product_title || "Activity Booking"}</p>
                  <p className="text-xs text-brand-gray">{tx.customer_name} · {new Date(tx.created_at).toLocaleDateString()}</p>
                  <div className="grid grid-cols-3 gap-3 py-2.5 px-3.5 bg-brand-light/30 rounded-xl text-xs">
                    <div>
                      <span className="text-brand-gray block text-[9px] uppercase font-bold tracking-wider">Gross</span>
                      <span className="font-black text-brand-black">{formatCurrency(tx.total_price)}</span>
                    </div>
                    <div>
                      <span className="text-brand-gray block text-[9px] uppercase font-bold tracking-wider">Fee</span>
                      <span className="font-bold text-red-500">-{formatCurrency(commission)}</span>
                    </div>
                    <div>
                      <span className="text-brand-gray block text-[9px] uppercase font-bold tracking-wider">Payout</span>
                      <span className="font-black text-emerald-600">{formatCurrency(payout)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block border border-brand-border/40 rounded-2xl bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border/30 bg-brand-light/20">
                <th className="text-left py-3 px-5 text-[10px] font-black uppercase tracking-widest text-brand-gray">Date</th>
                <th className="text-left py-3 px-5 text-[10px] font-black uppercase tracking-widest text-brand-gray">Transaction</th>
                <th className="text-left py-3 px-5 text-[10px] font-black uppercase tracking-widest text-brand-gray">Activity</th>
                <th className="text-left py-3 px-5 text-[10px] font-black uppercase tracking-widest text-brand-gray">Gross</th>
                <th className="text-left py-3 px-5 text-[10px] font-black uppercase tracking-widest text-brand-gray">Commission</th>
                <th className="text-left py-3 px-5 text-[10px] font-black uppercase tracking-widest text-brand-gray">Net Payout</th>
                <th className="text-center py-3 px-5 text-[10px] font-black uppercase tracking-widest text-brand-gray">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-brand-gray text-sm">No transactions yet.</td></tr>
              ) : (
                transactions.map((tx: any) => {
                  const commission = tx.total_price * ((data?.commissionRate || 10) / 100);
                  const payout = tx.total_price - commission;
                  return (
                    <tr key={tx.id} className="border-b border-brand-border/20 last:border-0 hover:bg-brand-light/10 transition-colors">
                      <td className="py-4 px-5 text-brand-gray">{new Date(tx.created_at).toLocaleDateString()}</td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-brand-gray/50" />
                          <span className="font-mono text-xs font-bold">{tx.id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-medium max-w-[200px] truncate">{tx.product_title || "—"}</td>
                      <td className="py-4 px-5 font-bold text-brand-black">{formatCurrency(tx.total_price)}</td>
                      <td className="py-4 px-5 font-semibold text-red-500">-{formatCurrency(commission)}</td>
                      <td className="py-4 px-5 font-black text-emerald-600">{formatCurrency(payout)}</td>
                      <td className="py-4 px-5 text-center">
                        <Badge className={cn(
                          "rounded-lg text-[9px] uppercase font-black px-2 py-0.5 border-none",
                          tx.payment_status === "paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                        )}>
                          {tx.payment_status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bank details info card */}
      <div className="p-8 rounded-[24px] border border-brand-border/40 bg-white hover:shadow-xl hover:shadow-brand-black/5 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold text-brand-gray uppercase tracking-widest">
            <Building className="h-4.5 w-4.5 text-brand-gray/60" /> Settlement Account
          </div>
          <h4 className="text-base font-bold text-brand-black">Configure your bank account for payouts</h4>
          <p className="text-[10px] text-brand-gray font-semibold leading-relaxed">Direct transfers processed automatically every settlement cycle.</p>
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
