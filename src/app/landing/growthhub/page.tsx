"use client";

import React, { useEffect, useState } from "react";
import { BarChart2, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useModal } from "../layout";
import { cn } from "@/lib/utils";

const defaultGrowthStrategies = [
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

const defaultSeasonalTips = [
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

// ========================================================
// DYNAMIC RESPONSIVE STYLES INJECTOR FOR NEXT.JS CLIENT
// ========================================================
const RenderCustomStyle = ({ id, styles }: { id: string; styles: any }) => {
  if (!styles) return null;
  const shadowValue = 
    styles.shadow === 'soft' ? '0 2px 8px rgba(0,0,0,0.05)' : 
    styles.shadow === 'premium' ? '0 8px 30px rgba(0,0,0,0.08)' : 
    styles.shadow === 'strong' ? '0 20px 50px rgba(0,0,0,0.15)' : 'none';

  const css = `
    .style-${id} {
      color: ${styles.color || 'inherit'} !important;
      background-color: ${styles.bgColor || 'transparent'} !important;
      font-size: ${styles.fontSizeDesktop || 16}px !important;
      padding-top: ${styles.paddingTop !== undefined ? styles.paddingTop + 'px' : 'inherit'} !important;
      padding-bottom: ${styles.paddingBottom !== undefined ? styles.paddingBottom + 'px' : 'inherit'} !important;
      padding-left: ${styles.paddingLeft !== undefined ? styles.paddingLeft + 'px' : 'inherit'} !important;
      padding-right: ${styles.paddingRight !== undefined ? styles.paddingRight + 'px' : 'inherit'} !important;
      margin-top: ${styles.marginTop !== undefined ? styles.marginTop + 'px' : 'inherit'} !important;
      margin-bottom: ${styles.marginBottom !== undefined ? styles.marginBottom + 'px' : 'inherit'} !important;
      box-shadow: ${shadowValue} !important;
    }
    @media (max-width: 640px) {
      .style-${id} {
        font-size: ${(styles.fontSizeMobile !== undefined ? styles.fontSizeMobile : styles.fontSizeDesktop) || 14}px !important;
      }
    }
  `;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
};

export default function GrowthHubPage() {
  const { openModal } = useModal();
  const [cms, setCms] = useState<any>(null);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsPreview(window.location.search.includes("preview=true"));
    }
  }, []);

  useEffect(() => {
    fetch("/api/settings/supplier-landing")
      .then((res) => res.json())
      .then((data) => setCms(data))
      .catch((err) => console.error("Error loading CMS settings:", err));

    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "UPDATE_CMS_PREVIEW") {
        setCms(event.data.data);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleElementClick = (elementId: string) => {
    if (isPreview && window.parent) {
      window.parent.postMessage({ type: "ELEMENT_CLICKED", id: elementId }, "*");
    }
  };

  const gro = cms?.pages?.growthhub || {};

  const strategiesList = gro.growthStrategies && Array.isArray(gro.growthStrategies) ? gro.growthStrategies : defaultGrowthStrategies;
  const tipsList = gro.seasonalTips && Array.isArray(gro.seasonalTips) ? gro.seasonalTips : defaultSeasonalTips;

  return (
    <div className="bg-white text-brand-black animate-in fade-in duration-500">
      <RenderCustomStyle id="hero_badge" styles={gro.hero_badge_styles} />
      <RenderCustomStyle id="hero_title" styles={gro.hero_title_styles} />
      <RenderCustomStyle id="hero_description" styles={gro.hero_description_styles} />
      <RenderCustomStyle id="tips_title" styles={gro.tips_title_styles} />
      <RenderCustomStyle id="tips_subtitle" styles={gro.tips_subtitle_styles} />

      {strategiesList.map((_: any, idx: number) => (
        <RenderCustomStyle key={`g-${idx}`} id={`strategy_card_${idx}`} styles={gro[`strategy_card_${idx}_styles`]} />
      ))}

      {/* Hero */}
      {(gro.hero_show !== false) && (
        <div className="py-20 max-w-5xl mx-auto px-6 sm:px-12 text-center space-y-6">
          <span 
            className={cn(
              "inline-flex px-4 py-1.5 rounded-full bg-brand-light border border-brand-border text-[10px] font-bold uppercase tracking-wider text-brand-black style-hero_badge",
              isPreview && "cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-dashed transition-all"
            )}
            onClick={() => handleElementClick("hero_badge")}
          >
            {gro.hero_badge || "Operator Growth & Optimizations"}
          </span>
          <h1 
            className={cn(
              "text-4xl sm:text-5xl font-medium tracking-tight text-brand-black max-w-3xl mx-auto leading-tight style-hero_title",
              isPreview && "cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-dashed transition-all"
            )}
            onClick={() => handleElementClick("hero_title")}
          >
            {gro.hero_title || "Accelerate Your Experiential Brand with Growth Hub"}
          </h1>
          <p 
            className={cn(
              "text-sm sm:text-base text-brand-gray max-w-xl mx-auto font-medium leading-relaxed style-hero_description",
              isPreview && "cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-dashed transition-all"
            )}
            onClick={() => handleElementClick("hero_description")}
          >
            {gro.hero_description || "Gain strategic market insights, dynamic pricing recommendations, and expert content formatting guides from the Tour Geeky operations crew."}
          </p>
        </div>
      )}

      {/* Strategies - Cardless Listing */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 py-10 border-t border-brand-border/40">
        <div className="grid gap-16">
          {strategiesList.map((s: any, idx: number) => (
            <div 
              key={idx} 
              className={cn(
                "flex flex-col lg:flex-row lg:items-start justify-between gap-10 py-10 border-b border-brand-border/40 last:border-none transition-all duration-300 style-strategy_card_" + idx,
                isPreview && "cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-dashed"
              )}
              onClick={() => handleElementClick(`strategy_card_${idx}`)}
            >
              <div className="lg:w-1/3 space-y-3">
                <div className="flex items-center gap-2.5">
                  <BarChart2 className="h-5 w-5 text-brand-black" />
                  <h3 className="text-lg font-bold text-brand-black tracking-tight">{s.metric}</h3>
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
      {(gro.tips_show !== false) && (
        <div className="py-24 bg-brand-light/20 border-t border-brand-border px-6 sm:px-12">
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="text-center space-y-3">
              <h2 
                className={cn(
                  "text-2xl font-bold tracking-tight text-brand-black style-tips_title",
                  isPreview && "cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-dashed transition-all"
                )}
                onClick={() => handleElementClick("tips_title")}
              >
                {gro.tips_title || "Seasonal Strategy Manual"}
              </h2>
              <p 
                className={cn(
                  "text-xs text-brand-gray font-semibold style-tips_subtitle",
                  isPreview && "cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-dashed transition-all"
                )}
                onClick={() => handleElementClick("tips_subtitle")}
              >
                {gro.tips_subtitle || "Maximal sales strategies optimized for Greece tourist seasons."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {tipsList.map((st: any, idx: number) => (
                <div key={idx} className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-brand-border/60 pb-4">
                    <Compass className="h-5 w-5 text-brand-black" />
                    <h3 className="text-base font-bold text-brand-black tracking-wide">{st.title}</h3>
                  </div>
                  <ul className="space-y-4">
                    {(st.tips || []).map((tip: string, tIdx: number) => (
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
      )}

      {/* Action CTA */}
      <div className="max-w-4xl mx-auto px-6 sm:px-12 py-24 text-center space-y-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-black tracking-tight">Ready to Unlock Your Growth Tools?</h2>
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
