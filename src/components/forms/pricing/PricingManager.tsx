"use client";

import React, { useState } from "react";
import { Users, DollarSign, PlusCircle, Trash2, Check, ChevronRight, Info, Building2, Globe } from "lucide-react";
import { useProductForm } from "@/hooks/useProductForm";
import { ProductOption, PricingSetup, AgeGroup } from "@/types/product";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface PricingWizardProps {
  option: ProductOption;
  onUpdate: (updates: Partial<ProductOption>) => void;
}

const AGE_GROUPS_CATALOG = [
  { label: "Adult", minAge: 18, maxAge: 99 },
  { label: "Senior", minAge: 65, maxAge: 99 },
  { label: "Youth", minAge: 13, maxAge: 17 },
  { label: "Child", minAge: 3, maxAge: 12 },
  { label: "Infant", minAge: 0, maxAge: 2 },
];

export function PricingManager({ option, onUpdate }: PricingWizardProps) {
  const { product } = useProductForm();
  const currencySymbol = product.currency === "EUR" ? "€" : product.currency === "USD" ? "$" : product.currency === "GBP" ? "£" : "";

  const pricingSetups = (option.pricing && option.pricing.length > 0 
    ? option.pricing 
    : [{
        id: "standard-pricing",
        name: "Standard Pricing",
        type: "per_person",
        minParticipants: 1,
        maxParticipants: option.maxGroupSize || 20,
        currency: product.currency || "USD",
        ageGroups: [{ id: "Adult", label: "Adult", minAge: 18, maxAge: 99, price: 0, netPrice: 0 }],
      }]) as PricingSetup[];

  const [activeSetupId, setActiveSetupId] = useState(pricingSetups[0].id);
  const activeSetup = pricingSetups.find(s => s.id === activeSetupId) || pricingSetups[0];

  const updateSetups = (newSetups: PricingSetup[]) => {
    onUpdate({ pricing: newSetups });
  };

  const updateActiveSetup = (updates: Partial<PricingSetup>) => {
    const newSetups = pricingSetups.map(s => s.id === activeSetupId ? { ...s, ...updates } : s);
    updateSetups(newSetups);
  };

  const addNewSetup = () => {
    const id = "setup-" + Math.random().toString(36).substr(2, 4);
    const newSetup: PricingSetup = {
      id,
      name: "New Pricing Setup",
      type: "per_person",
      minParticipants: 1,
      maxParticipants: option.maxGroupSize,
      currency: product.currency,
      ageGroups: [{ id: "Adult", label: "Adult", minAge: 18, maxAge: 99, price: 0, netPrice: 0 }],
    };
    updateSetups([...pricingSetups, newSetup]);
    setActiveSetupId(id);
  };

  const deleteSetup = (id: string) => {
    if (pricingSetups.length <= 1) return;
    const newSetups = pricingSetups.filter(s => s.id !== id);
    updateSetups(newSetups);
    setActiveSetupId(newSetups[0].id);
  };

  const selectedAgeGroups = activeSetup.ageGroups.map(g => g.label);

  const toggleAgeGroup = (label: string) => {
    let newAgeGroups;
    if (selectedAgeGroups.includes(label)) {
      if (selectedAgeGroups.length > 1) {
        newAgeGroups = activeSetup.ageGroups.filter(g => g.label !== label);
      } else {
        return;
      }
    } else {
      const groupInfo = AGE_GROUPS_CATALOG.find(g => g.label === label);
      if (groupInfo) {
        newAgeGroups = [...activeSetup.ageGroups, { id: label, ...groupInfo, price: 0, netPrice: 0 }];
      } else {
        return;
      }
    }
    updateActiveSetup({ ageGroups: newAgeGroups });
  };

  const updatePrice = (label: string, price: number) => {
    const newAgeGroups = activeSetup.ageGroups.map(g => {
      if (g.label !== label) return g;
      return { ...g, price, netPrice: price * 0.85 };
    });
    updateActiveSetup({ ageGroups: newAgeGroups });
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-10 pb-10">
      {/* Setups Tabs */}
      <div className="flex items-center justify-between border-b border-brand-bg pb-4">
         <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {pricingSetups.map(s => (
              <div key={s.id} className="relative group">
                <button 
                  onClick={() => setActiveSetupId(s.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[12px] font-bold whitespace-nowrap transition-all",
                    activeSetupId === s.id ? "bg-brand-primary text-white" : "bg-brand-bg text-brand-light hover:text-brand-dark"
                  )}
                >
                  {s.name}
                </button>
                {pricingSetups.length > 1 && (
                  <button 
                    onClick={() => deleteSetup(s.id)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-2 h-2" />
                  </button>
                )}
              </div>
            ))}
         </div>
         <Button variant="ghost" size="sm" onClick={addNewSetup} className="text-brand-primary font-bold text-[11px] gap-1.5 shrink-0">
            <PlusCircle className="w-3.5 h-3.5" /> Add Setup
         </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Setup Name</label>
          <Input 
            value={activeSetup.name} 
            onChange={(e) => updateActiveSetup({ name: e.target.value })} 
            className="max-w-md"
          />
        </div>
      </div>

      <div className="space-y-8 pt-6">
        <h3 className="text-[14px] font-bold text-brand-dark uppercase tracking-widest opacity-50">1. Select pricing model</h3>
        <div className="flex gap-4">
          {[
            { id: "per_person", label: "Per Person", icon: Users, desc: "Charge based on age groups" },
            { id: "group", label: "Group / Flat Rate", icon: Building2, desc: "Fixed price for the whole group" }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => updateActiveSetup({ type: t.id as any })}
              className={cn(
                "flex-1 flex items-start gap-4 p-5 rounded-[24px] border-2 transition-all text-left",
                activeSetup.type === t.id ? "border-brand-primary bg-brand-primary/5" : "border-brand-bg bg-white hover:border-brand-primary/20"
              )}
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", activeSetup.type === t.id ? "bg-brand-primary text-white" : "bg-brand-bg text-brand-light")}>
                <t.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className={cn("text-[14px] font-bold", activeSetup.type === t.id ? "text-brand-primary" : "text-brand-dark")}>{t.label}</p>
                <p className="text-[11px] text-brand-light font-medium leading-tight">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeSetup.type === "per_person" ? (
        <>
          {/* Age Groups */}
          <div className="space-y-8 pt-10 border-t border-brand-bg animate-in fade-in duration-500">
            <h3 className="text-[14px] font-bold text-brand-dark uppercase tracking-widest opacity-50">2. Select age groups</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {AGE_GROUPS_CATALOG.map((group) => {
                const isSelected = selectedAgeGroups.includes(group.label);
                return (
                  <div 
                    key={group.label} 
                    className={cn(
                      "flex items-center gap-3 p-3 px-4 cursor-pointer rounded-xl border-2 transition-all",
                      isSelected ? "border-brand-primary bg-brand-primary/5" : "border-brand-bg bg-white hover:border-brand-primary/20"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleAgeGroup(group.label);
                    }}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-all",
                      isSelected ? "bg-brand-primary border-brand-primary" : "border-brand-border"
                    )}>
                      {isSelected && <Check className="w-2.5 text-white" strokeWidth={5} />}
                    </div>
                    <div className="space-y-0.5">
                      <p className={cn("text-[12px] font-bold", isSelected ? "text-brand-primary" : "text-brand-dark")}>{group.label}</p>
                      <p className="text-[10px] text-brand-light font-medium">{group.minAge}-{group.maxAge}y</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price Definition */}
          <div className="space-y-8 pt-10 border-t border-brand-bg animate-in slide-in-from-top-4 duration-500">
            <div className="space-y-1">
              <h3 className="text-[14px] font-bold text-brand-dark uppercase tracking-widest opacity-50">3. Price Definition</h3>
              <p className="text-[11px] text-brand-light font-medium italic">Set prices for {activeSetup.name}.</p>
            </div>

            <div className="space-y-3">
              {activeSetup.ageGroups.map(group => (
                <div key={group.id} className="grid grid-cols-[1fr_140px] gap-8 items-center p-4 bg-brand-bg/10 rounded-xl hover:bg-brand-bg/20 transition-all">
                  <div className="space-y-0.5">
                    <p className="text-[13px] font-bold text-brand-dark">{group.label}</p>
                    <p className="text-[10px] text-brand-light font-medium">{group.minAge}-{group.maxAge} years</p>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light text-[12px] font-bold">{currencySymbol}</span>
                    <input 
                      type="number" 
                      className="w-full h-10 pl-7 pr-3 rounded-lg border border-brand-border bg-white text-right font-bold text-[14px] outline-none focus:border-brand-primary"
                      value={group.price}
                      onChange={(e) => updatePrice(group.label, parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-8 pt-10 border-t border-brand-bg animate-in fade-in duration-500">
          <div className="space-y-1">
            <h3 className="text-[14px] font-bold text-brand-dark uppercase tracking-widest opacity-50">2. Group Price Definition</h3>
            <p className="text-[11px] text-brand-light font-medium italic">Set a flat price for the entire group (up to {activeSetup.maxParticipants} people).</p>
          </div>
          <div className="max-w-md p-8 bg-brand-bg/20 rounded-[32px] border border-brand-border/40 space-y-6">
            <div className="space-y-2">
              <label className="text-[12px] font-black text-brand-dark uppercase tracking-widest">Total Price for Group</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[18px] font-bold text-brand-light">{currencySymbol}</span>
                <input 
                  type="number" 
                  className="w-full h-16 pl-10 pr-6 rounded-2xl bg-white border-2 border-brand-border/40 font-black text-[28px] text-brand-dark outline-none focus:border-brand-primary transition-all"
                  placeholder="0.00"
                  value={activeSetup.groupPrice || 0}
                  onChange={(e) => updateActiveSetup({ groupPrice: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
               <Info className="w-4 h-4 text-brand-primary" />
               <p className="text-[11px] text-brand-light font-medium">This price applies regardless of the number of participants, up to your max capacity.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
