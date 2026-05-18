"use client";

import React, { useEffect, useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, DollarSign, Box, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useModal } from "../layout";

export default function FAQPage() {
  const { openModal } = useModal();
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [cms, setCms] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings/supplier-landing")
      .then((res) => res.json())
      .then((data) => setCms(data))
      .catch((err) => console.error("Error loading CMS settings:", err));
  }, []);

  const toggleFAQ = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  const categories = [
    {
      title: "Commissions & Payouts",
      icon: DollarSign,
      items: [
        {
          q: "Is there an onboarding or listing fee?",
          a: "No! Listing your experiences on Tour Geeky is completely free. We do not charge registration fees, catalog placement charges, or monthly software fees. You only pay when you make a verified sale."
        },
        {
          q: "What is the flat commission structure?",
          a: "We maintain a flat 10% commission on all completed bookings. The remaining 90% is yours. Stripe processing fees are included in this flat 10%, meaning there are absolutely no separate payment processing deductibles."
        },
        {
          q: "When and how do I receive payouts?",
          a: "All payouts are handled securely via Stripe direct bank transfers. We automatically initiate operator settlements twice a month: on the 15th (for bookings completed between 1st-14th) and on the last day of the month (for bookings completed between 15th-29th)."
        }
      ]
    },
    {
      title: "Listing Experiences & Options",
      icon: Box,
      items: [
        {
          q: "How many activities can I list?",
          a: "You can list unlimited activities! We encourage our partners to showcase all available options—from luxury sunset cruises to guided day treks and food tastings."
        },
        {
          q: "What credentials do I need for account approval?",
          a: "We verify that you are a Greece-registered tourism organization, yacht operator, licensed guide, or local activity host. You will need to provide a valid contact number and a web/social presence during registration."
        },
        {
          q: "How do option pricing tiers work?",
          a: "Our listing wizard lets you create multiple pricing options (e.g. Standard Ticket, VIP Upgrade, Private Charter) under a single activity. You can also specify different prices for adults and children."
        }
      ]
    },
    {
      title: "Bookings & Cancelations",
      icon: ClipboardList,
      items: [
        {
          q: "How am I notified of traveler bookings?",
          a: "The instant a customer completes their checkout, you receive an automated email notification and SMS alert containing the traveler's name, headcount, slot time, and specific custom requirements."
        },
        {
          q: "What cancelation policies can I select?",
          a: "During activity creation, you can select from three standard refund rules: (1) Standard: Free cancellation up to 24 hours prior. (2) Strict: Free cancellation up to 7 days prior. (3) Non-refundable: All ticket sales are final."
        },
        {
          q: "How are bad-weather cancellations handled?",
          a: "For maritime and outdoor activities, if bad weather prevents safe execution, you can log into the portal and click 'Cancel Slot'. Our platform automatically notifies all travelers and issues 100% refunds."
        }
      ]
    }
  ];

  const fq = cms?.pages?.faq || {};

  return (
    <div className="bg-white text-brand-black animate-in fade-in duration-500">
      {/* Hero Header */}
      {(fq.hero_show !== false) && (
        <div className="py-20 max-w-5xl mx-auto px-6 sm:px-12 text-center space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-brand-light border border-brand-border text-[10px] font-bold uppercase tracking-wider text-brand-black">
            {fq.hero_badge || "Partner Support & Help Manual"}
          </span>
          <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-brand-black max-w-3xl mx-auto leading-tight">
            {fq.hero_title || "Operator Frequently Asked Questions"}
          </h1>
          <p className="text-sm sm:text-base text-brand-gray max-w-xl mx-auto font-medium leading-relaxed">
            {fq.hero_description || "Quickly find answers regarding secure payouts, commission rates, guest cancellations, bad-weather contingencies, and listing setup wizards."}
          </p>
        </div>
      )}

      {/* Accordion Categories - Cardless & Separators */}
      <div className="max-w-4xl mx-auto px-6 sm:px-12 pb-24">
        {categories.map((cat, catIdx) => {
          const Icon = cat.icon;
          return (
            <div key={catIdx} className="mb-16 last:mb-0">
              {/* Category Title Header */}
              <div className="flex items-center gap-3 border-b border-brand-border pb-4 mb-6">
                <Icon className="h-5 w-5 text-brand-black shrink-0" />
                <h2 className="text-base font-bold text-brand-black tracking-wider">{cat.title}</h2>
              </div>

              {/* Accordion List */}
              <div className="divide-y divide-brand-border/40 text-left">
                {cat.items.map((item, itemIdx) => {
                  const id = `${catIdx}-${itemIdx}`;
                  const isOpen = openIndex === id;
                  return (
                    <div key={itemIdx} className="py-5 first:pt-0 last:pb-0">
                      <button 
                        onClick={() => toggleFAQ(id)}
                        className="w-full flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-brand-black hover:text-brand-gray transition-colors text-left"
                      >
                        <span className="flex items-center gap-2">
                          <HelpCircle className="h-4.5 w-4.5 text-brand-gray/60 shrink-0" />
                          {item.q}
                        </span>
                        {isOpen ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
                      </button>

                      {isOpen && (
                        <div className="mt-3.5 pl-6 text-xs sm:text-sm text-brand-gray font-semibold leading-relaxed animate-in fade-in slide-in-from-top-1 duration-300">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action CTA */}
      <div className="max-w-4xl mx-auto px-6 sm:px-12 py-20 text-center space-y-8 border-t border-brand-border/40">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-black tracking-tight">Still Have Questions?</h2>
        <p className="text-xs sm:text-sm text-brand-gray font-medium max-w-md mx-auto leading-relaxed">
          Our partner success team is based in Athens and available via email or phone. We will help you optimize your experience listings.
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            onClick={openModal}
            size="lg"
            className="rounded-full px-10 h-12 text-sm font-bold bg-brand-black text-white hover:bg-brand-black/90 shadow-md flex items-center justify-center gap-2"
          >
            Ask Our Support Team
          </Button>
        </div>
      </div>
    </div>
  );
}
