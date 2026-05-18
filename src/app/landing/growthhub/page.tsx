"use client";

import React from "react";
import { TrendingUp, BarChart2, Star, Settings, ShieldCheck, HelpCircle, ArrowUpRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useModal } from "../layout";

export default function GrowthHubPage() {
  const { openModal } = useModal();

  const growthStrategies = [
    {
      metric: "Dynamic Pricing Adjustments",
      desc: "Capitalize on seasonal demand surges. Our tool provides suggestion algorithms that automatically recommend capacity price alterations for Aegean high-seasons (June - September) versus milder shoulder months (April and October).",
      impact: "+24% bookings value"
    },
    {
      metric: "High-Definition Listing Scoring",
      desc: "Upload crystal-clear panoramic drone shots of yacht decks and vivid snapshots of historic ruins. Our listing optimization score prompts you on precisely what content structure and travel amenities customers search for most.",
      impact: "+40% conversion rate"
    },
    {
      metric: "Instant Confirmation & Booking Sliders",
      desc: "Enable instant confirmations and synchronize live capacities directly with external calendars. Travelers prefer immediate checkouts over standard 'request-to-book' systems, boosting direct placement clicks.",
      impact: "+35% customer engagement"
    }
  ];

  const seasonalTips = [
    {
      title: "Peak Summer Surge (Jun-Sep)",
      tips: [
        "Create special Sunset Yachting itineraries with premium local wine inclusions.",
        "Add additional 5:00 PM evening slots to capture the sunset golden hour.",
        "Double your slot capacity on weekends to capture sudden walk-in bookings."
      ]
    },
    {
      title: "Shoulder Season Growth (Apr-May & Oct)",
      tips: [
        "Offer early-bird promotional codes and family booking options.",
        "Transition catamaran routes to historical land-based archaeological walks.",
        "Highlight cozy indoor options for food tours and olive oil tastings."
      ]
    }
  ];

  return (
    <div className="bg-white text-brand-black animate-in fade-in duration-500">
      {/* Hero */}
      <div className="py-20 max-w-5xl mx-auto px-6 sm:px-12 text-center space-y-6">
        <span className="px-4 py-1.5 rounded-full bg-brand-light border border-brand-border text-[10px] font-bold uppercase tracking-wider text-brand-black">
          Operator Growth & Optimizations
        </span>
        <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-brand-black uppercase max-w-3xl mx-auto leading-tight">
          Accelerate your experiential brand with <span className="underline decoration-brand-black underline-offset-8">Growth Hub</span>
        </h1>
        <p className="text-sm sm:text-base text-brand-gray max-w-xl mx-auto font-medium leading-relaxed">
          Gain strategic market insights, dynamic pricing recommendations, and expert content formatting guides from the Tour Geeky operations crew.
        </p>
      </div>

      {/* Strategies - Cardless Listing */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 py-10 border-t border-brand-border/40">
        <div className="grid gap-16">
          {growthStrategies.map((s, idx) => (
            <div 
              key={idx} 
              className="flex flex-col lg:flex-row lg:items-start justify-between gap-10 py-10 border-b border-brand-border/40 last:border-none"
            >
              <div className="lg:w-1/3 space-y-3">
                <div className="flex items-center gap-2.5">
                  <BarChart2 className="h-5 w-5 text-brand-black" />
                  <h3 className="text-lg font-bold text-brand-black uppercase tracking-tight">{s.metric}</h3>
                </div>
                <div className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-bold text-emerald-700">
                  Impact: {s.impact}
                </div>
              </div>

              <div className="lg:w-2/3 text-xs sm:text-sm text-brand-gray font-medium leading-relaxed">
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Insights Calendar Grid */}
      <div className="py-24 bg-brand-light/20 border-t border-brand-border px-6 sm:px-12">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-brand-black uppercase">Seasonal Strategy Manual</h2>
            <p className="text-xs text-brand-gray font-semibold">Maximal sales strategies optimized for Greece tourist seasons.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {seasonalTips.map((st, idx) => (
              <div key={idx} className="space-y-6">
                <div className="flex items-center gap-3 border-b border-brand-border/60 pb-4">
                  <Compass className="h-5 w-5 text-brand-black" />
                  <h3 className="text-base font-bold text-brand-black uppercase tracking-wide">{st.title}</h3>
                </div>
                <ul className="space-y-4">
                  {st.tips.map((tip, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-3.5 text-xs text-brand-gray font-semibold leading-relaxed">
                      <span className="h-5 w-5 rounded-full bg-white border border-brand-border shrink-0 flex items-center justify-center text-[10px] font-bold text-brand-black">
                        {tIdx + 1}
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="max-w-4xl mx-auto px-6 sm:px-12 py-24 text-center space-y-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-black tracking-tight uppercase">Ready to unlock your growth tools?</h2>
        <p className="text-xs sm:text-sm text-brand-gray font-medium max-w-md mx-auto leading-relaxed">
          Log into your supplier dashboard or submit a verified partner profile application to start auditing your listings.
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            onClick={openModal}
            size="lg"
            className="rounded-full px-10 h-12 text-sm font-bold bg-brand-black text-white hover:bg-brand-black/90 shadow-md flex items-center justify-center gap-2"
          >
            Access Growth Tools
          </Button>
        </div>
      </div>
    </div>
  );
}
