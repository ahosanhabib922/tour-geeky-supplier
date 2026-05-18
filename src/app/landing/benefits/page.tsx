"use client";

import React, { useEffect, useState } from "react";
import { DollarSign, Globe, Shield, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useModal } from "../layout";

const defaultCoreBenefits = [
  {
    title: "10% Flat Fee Commission Structure",
    headline: "Keep 90% of your ticket sales.",
    desc: "Unlike other large international OTAs that demand up to 25% or 30% commission, Tour Geeky maintains a flat, transparent 10% fee. No annual memberships, no listing costs, and no hidden contract surprises."
  },
  {
    title: "Aegean & Grecian Targeted Marketing",
    headline: "Expose your tours to active buyers.",
    desc: "Our localized search engines actively direct high-value travelers from the US, UK, and East Asia searching specifically for premium sailing excursions in Mykonos, Santorini historical walking tours, and vineyard crawls in Crete."
  },
  {
    title: "Direct Stripe Settlement Infrastructure",
    headline: "Automated payouts twice a month.",
    desc: "Your funds are stored in escrow safely and transferred automatically directly to your local bank account via secure Stripe operator payouts twice a month, completely eliminating invoice waiting periods."
  },
  {
    title: "Dedicated Greek Operator Support Crew",
    headline: "Your personal growth managers.",
    desc: "We don't believe in generic robot helplines. Every operator receives access to local, dedicated partners in Athens, Paros, and Chania to help construct optimal prices, high-quality images, and rich description copies."
  }
];

const defaultComparisonTable = [
  { channel: "Tour Geeky Partner", commission: "10% Flat Rate", cost: "€0 Free", settlement: "Twice Monthly (Stripe)" },
  { channel: "Global OTAs (Viator / GetYourGuide)", commission: "22% - 28%", cost: "€25 Listing Charge", settlement: "Monthly Invoice" },
  { channel: "Local Greek Agencies (Athens Walk-ins)", commission: "15% - 20%", cost: "Requires Retainer", settlement: "30-day Post Excursion" }
];

export default function BenefitsPage() {
  const { openModal } = useModal();
  const [cms, setCms] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings/supplier-landing")
      .then((res) => res.json())
      .then((data) => setCms(data))
      .catch((err) => console.error("Error loading CMS settings:", err));
  }, []);

  const ben = cms?.pages?.benefits || {};

  const benefitsList = ben.coreBenefits && Array.isArray(ben.coreBenefits) ? ben.coreBenefits : defaultCoreBenefits;
  const comparisonList = ben.comparisonTable && Array.isArray(ben.comparisonTable) ? ben.comparisonTable : defaultComparisonTable;

  const getIconForIndex = (idx: number) => {
    switch (idx) {
      case 0: return DollarSign;
      case 1: return Globe;
      case 2: return Shield;
      default: return Users;
    }
  };

  return (
    <div className="bg-white text-brand-black animate-in fade-in duration-500">
      {/* Hero Header */}
      {(ben.hero_show !== false) && (
        <div className="py-20 max-w-5xl mx-auto px-6 sm:px-12 text-center space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-brand-light border border-brand-border text-[10px] font-bold uppercase tracking-wider text-brand-black">
            {ben.hero_badge || "Partner Privileges & Growth"}
          </span>
          <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-brand-black max-w-3xl mx-auto leading-tight">
            {ben.hero_title || "Keep More of What You Earn with Tour Geeky"}
          </h1>
          <p className="text-sm sm:text-base text-brand-gray max-w-xl mx-auto font-medium leading-relaxed">
            {ben.hero_description || "Discover why Greek yacht captains, independent travel curators, and boutique activity planners choose our transparent 10% flat commission model."}
          </p>
        </div>
      )}

      {/* Cardless Grid Details */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 py-10 border-t border-brand-border/40">
        <div className="grid gap-16">
          {benefitsList.map((b: any, idx: number) => {
            const Icon = getIconForIndex(idx);
            return (
              <div 
                key={idx} 
                className="flex flex-col lg:flex-row lg:items-start justify-between gap-10 py-10 border-b border-brand-border/40 last:border-none transition-all duration-300"
              >
                <div className="flex items-center gap-6 lg:w-1/3">
                  <div className="h-14 w-14 rounded-full bg-brand-light flex items-center justify-center shrink-0 border border-brand-border/60">
                    <Icon className="h-6 w-6 text-brand-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-brand-black tracking-tight leading-snug">{b.title}</h3>
                    <span className="text-xs text-primary font-bold tracking-wide mt-1 block uppercase">{b.headline}</span>
                  </div>
                </div>
                
                <div className="lg:w-2/3 space-y-4">
                  <p className="text-xs sm:text-sm text-brand-gray font-medium leading-relaxed">
                    {b.desc}
                  </p>
                  <div className="h-px bg-gradient-to-r from-brand-border/20 to-transparent w-full" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparative Analysis Table (Clean & Cardless) */}
      {(ben.table_show !== false) && (
        <div className="py-24 bg-brand-light/20 border-t border-brand-border px-6 sm:px-12">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold tracking-tight text-brand-black">{ben.table_title || "Comparing Industry Commissions"}</h2>
              <p className="text-xs text-brand-gray font-semibold">{ben.table_subtitle || "How Tour Geeky stacks up against global third-party channels."}</p>
            </div>

            <div className="overflow-hidden border-t border-brand-border/60">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-border/50 text-[10px] font-bold text-brand-black/40 uppercase tracking-widest">
                    <th className="py-4">Distribution Channel</th>
                    <th className="py-4">Commission Fee</th>
                    <th className="py-4">Onboarding Costs</th>
                    <th className="py-4 text-right">Escrow Settlement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/40 text-xs font-semibold text-brand-black">
                  {comparisonList.map((row: any, idx: number) => {
                    const isTg = row.channel.toLowerCase().includes("tour geeky");
                    return (
                      <tr key={idx} className={isTg ? "" : "opacity-60"}>
                        <td className="py-5 font-bold">{row.channel}</td>
                        <td className={`py-5 font-bold ${isTg ? "text-emerald-600" : "text-red-500"}`}>{row.commission}</td>
                        <td className="py-5">{row.cost}</td>
                        <td className="py-5 text-right">{row.settlement}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CTA Footer banner */}
      <div className="max-w-4xl mx-auto px-6 sm:px-12 py-24 text-center space-y-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-black tracking-tight">Ready to Elevate Your Margins?</h2>
        <p className="text-xs sm:text-sm text-brand-gray font-medium max-w-md mx-auto leading-relaxed">
          Application takes 1 minute and reviews are conducted within 24 hours. Connect your bank, list experiences, and welcome Greece travelers.
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            onClick={openModal}
            size="lg"
            className="rounded-full px-10 h-12 text-sm font-bold bg-brand-black text-white hover:bg-brand-black/90 shadow-md flex items-center justify-center gap-2"
          >
            Apply Now <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
