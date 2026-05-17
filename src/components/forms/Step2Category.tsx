"use client";

import React from "react";
import { useProductForm } from "@/hooks/useProductForm";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";

import { CATEGORY_CONFIGS, CategoryId } from "@/constants/categoryConfig";
import { Globe, Ticket, Car, Key, Ship, Layers, CreditCard, Bus, Check } from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Globe,
  Ticket,
  Car,
  Key,
  Ship,
  Layers,
  CreditCard,
  Bus
};

const CATEGORIES = Object.values(CATEGORY_CONFIGS);

export function Step2Category() {
  const { product, updateProduct } = useProductForm();

  return (
    <div className="w-full max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Classification</label>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Select Product Category</h2>
        <p className="text-sm text-muted-foreground font-medium italic max-w-xl">
          Choose the classification that best aligns with your activity. This determines the subsequent workflow steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CATEGORIES.map((cat) => {
            const isSelected = product.category === cat.id;
            const Icon = ICON_MAP[cat.icon] || Layers;
            return (
              <label 
                key={cat.id} 
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl cursor-pointer border transition-all duration-300 group relative",
                  isSelected 
                    ? "border-primary bg-primary/[0.02]" 
                    : "border-border/40 hover:border-primary/30"
                )}
                onClick={() => updateProduct({ category: cat.id })}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all border",
                  isSelected 
                    ? "bg-primary text-white border-primary shadow-sm" 
                    : "bg-muted/30 text-muted-foreground/80 border-border/50 group-hover:text-primary group-hover:border-primary/20"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 pr-8">
                  <p className={cn("text-sm font-semibold tracking-tight transition-colors", isSelected ? "text-primary" : "text-foreground")}>
                    {cat.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground/80 font-medium leading-tight line-clamp-1">
                    {cat.description}
                  </p>
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                   <div className={cn(
                     "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                     isSelected ? "border-primary bg-primary scale-110" : "border-border/40 group-hover:border-primary/20"
                   )}>
                     {isSelected && <Check className="w-3 h-3 text-white" />}
                   </div>
                </div>
              </label>
            );
        })}
      </div>

      <div className="flex items-start gap-3 p-5 rounded-2xl bg-amber-500/[0.03] border border-amber-500/10">
        <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
           <Check className="w-3 h-3 text-amber-600" />
        </div>
        <p className="text-[12px] text-amber-700/80 font-medium leading-relaxed">
          <span className="font-bold text-amber-800">Important:</span> This selection is final once the draft is initialized. It determines available features and logistics fields.
        </p>
      </div>
    </div>
  );
}
