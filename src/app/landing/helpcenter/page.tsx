"use client";

import React from "react";
import { Mail, Phone, Clock, FileText, Settings, Compass, Link2, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useModal } from "../layout";

export default function HelpCenterPage() {
  const { openModal } = useModal();

  const supportContacts = [
    {
      title: "Athens Operations Center",
      desc: "Direct telephone assistance for Greek operators and sunset cruises hosts.",
      detail: "+30 210 345 6789",
      hours: "Mon - Sun, 8:00 AM - 10:00 PM (EET)",
      icon: Phone
    },
    {
      title: "General Partner Support",
      desc: "For contract adjustments, bank updates, and direct api inquiries.",
      detail: "partners@tourgeeky.com",
      hours: "Response within 2 hours guaranteed",
      icon: Mail
    }
  ];

  const helperGuides = [
    {
      title: "Step 1: Partner Authentication & Review",
      desc: "Create an email or Google partner account and submit your basic phone and brand details. Once verified, your dashboard unlocks.",
      icon: Settings
    },
    {
      title: "Step 2: Connect Stripe Payments",
      desc: "Head to your 'Finances' dashboard, click 'Connect Bank Account' to link your direct routing details safely using the secure Stripe onboarding API.",
      icon: Link2
    },
    {
      title: "Step 3: Build Your Experience Listing",
      desc: "Utilize our wizard tool under 'Activities' to construct descriptions, panoramic yacht images, seasonal price tiers, and weekly calendar rules.",
      icon: Compass
    }
  ];

  return (
    <div className="bg-white text-brand-black animate-in fade-in duration-500">
      {/* Hero Header */}
      <div className="py-20 max-w-5xl mx-auto px-6 sm:px-12 text-center space-y-6">
        <span className="px-4 py-1.5 rounded-full bg-brand-light border border-brand-border text-[10px] font-bold uppercase tracking-wider text-brand-black">
          Operational Assistance Hub
        </span>
        <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-brand-black uppercase max-w-3xl mx-auto leading-tight">
          How Can We Support Your Operations?
        </h1>
        <p className="text-sm sm:text-base text-brand-gray max-w-xl mx-auto font-medium leading-relaxed">
          Reach our operator support center directly or browse detailed step-by-step walkthroughs to configure prices, sync schedules, and authorize Stripe bank accounts.
        </p>
      </div>

      {/* Support Contacts - Clean Grids */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 py-10 border-t border-brand-border/40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {supportContacts.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div 
                key={idx} 
                className="py-8 border-b md:border-b-0 md:border-r border-brand-border/40 last:border-none md:last:border-r-0 pr-0 md:pr-12 last:pr-0 space-y-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-light border border-brand-border/60 flex items-center justify-center shrink-0">
                    <Icon className="h-4.5 w-4.5 text-brand-black" />
                  </div>
                  <h3 className="text-base font-bold text-brand-black uppercase tracking-wide">{c.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-brand-gray font-semibold leading-relaxed">
                  {c.desc}
                </p>
                <div className="pt-2">
                  <span className="text-sm sm:text-base font-bold text-brand-black block">{c.detail}</span>
                  <span className="text-[10px] text-brand-gray/60 font-bold uppercase tracking-wide mt-1 block flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {c.hours}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Structured Step-by-Step Walkthrough Guide */}
      <div className="py-24 bg-brand-light/20 border-t border-brand-border px-6 sm:px-12">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-brand-black uppercase">Onboarding Setup Handbook</h2>
            <p className="text-xs text-brand-gray font-semibold">Everything you need to configure in under 10 minutes.</p>
          </div>

          <div className="grid gap-12">
            {helperGuides.map((g, idx) => {
              const Icon = g.icon;
              return (
                <div 
                  key={idx} 
                  className="flex flex-col sm:flex-row items-start gap-6 py-6 border-b border-brand-border/40 last:border-none"
                >
                  <div className="h-12 w-12 rounded-xl bg-white border border-brand-border flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-brand-black" />
                  </div>
                  <div className="space-y-2 text-left">
                    <h3 className="text-base font-bold text-brand-black uppercase tracking-wide leading-snug">{g.title}</h3>
                    <p className="text-xs sm:text-sm text-brand-gray font-semibold leading-relaxed">
                      {g.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Footer banner */}
      <div className="max-w-4xl mx-auto px-6 sm:px-12 py-24 text-center space-y-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-black tracking-tight uppercase">Need hand-held listing guidance?</h2>
        <p className="text-xs sm:text-sm text-brand-gray font-medium max-w-md mx-auto leading-relaxed">
          Submit your partner application first. Once verified, our operator relations manager will reach out via WhatsApp to assist in uploading assets.
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            onClick={openModal}
            size="lg"
            className="rounded-full px-10 h-12 text-sm font-bold bg-brand-black text-white hover:bg-brand-black/90 shadow-md flex items-center justify-center gap-2"
          >
            Apply & Connect Support
          </Button>
        </div>
      </div>
    </div>
  );
}
