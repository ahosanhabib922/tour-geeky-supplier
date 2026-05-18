"use client";

import React, { useEffect, useState } from "react";
import { Mail, Phone, Clock, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

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

export default function HelpCenterPage() {
  const [cms, setCms] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings/supplier-landing")
      .then((res) => res.json())
      .then((data) => setCms(data))
      .catch((err) => console.error("Error loading CMS settings:", err));
  }, []);

  const hc = cms?.pages?.helpcenter || {};

  const onboardingSteps = hc.onboardingSteps && Array.isArray(hc.onboardingSteps) ? hc.onboardingSteps : defaultOnboardingSteps;
  const supportChannels = hc.supportChannels && Array.isArray(hc.supportChannels) ? hc.supportChannels : defaultSupportChannels;

  const getIconForIndex = (idx: number) => {
    if (idx === 0) return Mail;
    return Phone;
  };

  return (
    <div className="bg-white text-brand-black animate-in fade-in duration-500">
      {/* Hero Header */}
      {(hc.hero_show !== false) && (
        <div className="py-20 max-w-5xl mx-auto px-6 sm:px-12 text-center space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-brand-light border border-brand-border text-[10px] font-bold uppercase tracking-wider text-brand-black">
            {hc.hero_badge || "Operational Assistance Hub"}
          </span>
          <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-brand-black max-w-3xl mx-auto leading-tight">
            {hc.hero_title || "How Can We Support Your Operations?"}
          </h1>
          <p className="text-sm sm:text-base text-brand-gray max-w-xl mx-auto font-medium leading-relaxed">
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
              <h2 className="text-2xl font-bold tracking-tight text-brand-black">{hc.guides_title || "Onboarding Setup Handbook"}</h2>
              <p className="text-xs text-brand-gray font-semibold">{hc.guides_subtitle || "Everything you need to configure in under 10 minutes."}</p>
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
