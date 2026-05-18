"use client";

import React, { useEffect, useState } from "react";
import { Mail, Phone, Clock, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const defaultOnboardingSteps = [
  {
    title: "1. Brand Authentication",
    desc: "Authenticate using a verified Google Account or direct Email registration inside the Application modal window."
  },
  {
    title: "2. Supplier Profile Setup",
    desc: "Provide your operating brand name, registered corporate name, contact phone number, and brief description."
  },
  {
    title: "3. Direct Stripe Integration",
    desc: "Link your company IBAN or bank details via our secure automated Stripe onboarding wizard in the settings tab."
  },
  {
    title: "4. Create Activity Listing",
    desc: "Specify your excursions, ticket option variables (VIP/Standard), calendar schedules, and high-definition photos."
  }
];

const defaultSupportChannels = [
  {
    title: "Email Assistance Team",
    value: "info@gerromantours.com",
    hours: "Mon - Sun: 9:00 AM - 8:00 PM (EET)"
  },
  {
    title: "English Support Line",
    value: "+39 342 034 2257",
    hours: "Urgent boat capacity calls"
  },
  {
    title: "Italian Support Line",
    value: "+39 324 804 2892",
    hours: "Urgent boat capacity calls"
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

export default function HelpCenterPage() {
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

  const hc = cms?.pages?.helpcenter || {};

  const onboardingSteps = hc.onboardingSteps && Array.isArray(hc.onboardingSteps) ? hc.onboardingSteps : defaultOnboardingSteps;
  const supportChannels = hc.supportChannels && Array.isArray(hc.supportChannels) ? hc.supportChannels : defaultSupportChannels;

  const getIconForIndex = (idx: number) => {
    if (idx === 0) return Mail;
    return Phone;
  };

  return (
    <div className="bg-white text-brand-black animate-in fade-in duration-500">
      <RenderCustomStyle id="hero_badge" styles={hc.hero_badge_styles} />
      <RenderCustomStyle id="hero_title" styles={hc.hero_title_styles} />
      <RenderCustomStyle id="hero_description" styles={hc.hero_description_styles} />
      <RenderCustomStyle id="guides_title" styles={hc.guides_title_styles} />
      <RenderCustomStyle id="guides_subtitle" styles={hc.guides_subtitle_styles} />

      {/* Hero Header */}
      {(hc.hero_show !== false) && (
        <div className="py-20 max-w-5xl mx-auto px-6 sm:px-12 text-center space-y-6">
          <span 
            className={cn(
              "inline-flex px-4 py-1.5 rounded-full bg-brand-light border border-brand-border text-[10px] font-bold uppercase tracking-wider text-brand-black style-hero_badge",
              isPreview && "cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-dashed transition-all"
            )}
            onClick={() => handleElementClick("hero_badge")}
          >
            {hc.hero_badge || "Operational Assistance Hub"}
          </span>
          <h1 
            className={cn(
              "text-4xl sm:text-5xl font-medium tracking-tight text-brand-black max-w-3xl mx-auto leading-tight style-hero_title",
              isPreview && "cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-dashed transition-all"
            )}
            onClick={() => handleElementClick("hero_title")}
          >
            {hc.hero_title || "How Can We Support Your Operations?"}
          </h1>
          <p 
            className={cn(
              "text-sm sm:text-base text-brand-gray max-w-xl mx-auto font-medium leading-relaxed style-hero_description",
              isPreview && "cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-dashed transition-all"
            )}
            onClick={() => handleElementClick("hero_description")}
          >
            {hc.hero_description || "Reach our operator support center directly or browse detailed step-by-step walkthroughs to configure prices, sync schedules, and authorize Stripe bank accounts."}
          </p>
        </div>
      )}

      {/* Support Channels - Lightweight cardless layout */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 py-10 border-t border-brand-border/40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {supportChannels.map((ch: any, idx: number) => {
            const Icon = getIconForIndex(idx);
            return (
              <div 
                key={idx} 
                className="py-6 space-y-4 hover:shadow-xl hover:shadow-brand-black/5 hover:-translate-y-0.5 transition-all duration-300 rounded-[20px] p-6 border border-brand-border/30"
              >
                <div className="h-10 w-10 rounded-full bg-brand-light flex items-center justify-center shrink-0 border border-brand-border/50">
                  <Icon className="h-5 w-5 text-brand-black" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-brand-black">{ch.title}</h3>
                  <a href={ch.title.toLowerCase().includes("email") ? `mailto:${ch.value}` : `tel:${ch.value.replace(/\s+/g, '')}`} className="text-xs font-bold text-brand-black underline block">
                    {ch.value}
                  </a>
                  <p className="text-[10px] text-brand-gray/70 font-semibold">{ch.hours}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Setup Guide Step-by-Step - Cardless Segment */}
      {(hc.guides_show !== false) && (
        <div className="py-24 bg-brand-light/20 border-t border-brand-border px-6 sm:px-12">
          <div className="max-w-4xl mx-auto space-y-16">
            <div className="text-center space-y-3">
              <h2 
                className={cn(
                  "text-2xl font-bold tracking-tight text-brand-black style-guides_title",
                  isPreview && "cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-dashed transition-all"
                )}
                onClick={() => handleElementClick("guides_title")}
              >
                {hc.guides_title || "Onboarding Setup Handbook"}
              </h2>
              <p 
                className={cn(
                  "text-xs text-brand-gray font-semibold style-guides_subtitle",
                  isPreview && "cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-dashed transition-all"
                )}
                onClick={() => handleElementClick("guides_subtitle")}
              >
                {hc.guides_subtitle || "Everything you need to configure in under 10 minutes."}
              </p>
            </div>

            <div className="grid gap-12">
              {onboardingSteps.map((step: any, idx: number) => (
                <div key={idx} className="flex gap-6 items-start">
                  <div className="h-8 w-8 rounded-full bg-white border border-brand-border flex items-center justify-center text-xs font-bold text-brand-black shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-brand-black">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-brand-gray font-medium leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
