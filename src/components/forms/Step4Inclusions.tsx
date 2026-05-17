"use client";

import React from "react";
import { Coffee, Car, Users, CheckCircle2, XCircle, Utensils, Bus, UserCircle2, Check } from "lucide-react";
import { useProductForm } from "@/hooks/useProductForm";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

import { CATEGORY_CONFIGS, CategoryId } from "@/constants/categoryConfig";

export function Step4Inclusions() {
  const { product, updateProduct } = useProductForm();
  const categoryId = (product.category as CategoryId) || "others";
  const config = CATEGORY_CONFIGS[categoryId] || CATEGORY_CONFIGS.others;

  const guideOptions = [
    { id: "live", label: "Live Guide", desc: "Professional lead." },
    { id: "audio", label: "Audio Guide", desc: "Recorded info." },
    { id: "driver", label: "Driver-Guide", desc: "Combined role." },
    { id: "escort", label: "Tour Escort", desc: "Logistics only." },
    { id: "none", label: "No Guide", desc: "Self-guided." },
  ];

  const handleBulletInput = (value: string, field: 'inclusions' | 'exclusions') => {
    const lines = value.split("\n");
    const formattedLines = lines.map(line => {
      if (line.trim() && !line.startsWith("• ")) {
        return "• " + line.trim();
      }
      return line;
    });
    updateProduct({ [field]: formattedLines });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, field: 'inclusions' | 'exclusions') => {
    if (e.key === "Enter") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;
      const newValue = value.substring(0, start) + "\n• " + value.substring(end);
      const lines = newValue.split("\n");
      updateProduct({ [field]: lines });
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 3;
      }, 0);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      
      {/* Inclusions & Exclusions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> What's Included
          </label>
          <textarea
            rows={5}
            value={product.inclusions?.join("\n") || ""}
            onChange={(e) => handleBulletInput(e.target.value, 'inclusions')}
            onKeyDown={(e) => handleKeyDown(e, 'inclusions')}
            className="w-full p-4 rounded-xl border border-border/40 bg-transparent focus:border-primary/30 outline-none resize-none transition-all text-sm font-semibold leading-relaxed"
            placeholder="e.g., • Bottled water"
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1 flex items-center gap-2">
            <XCircle className="w-3.5 h-3.5 text-rose-400" /> What's Not Included
          </label>
          <textarea
            rows={5}
            value={product.exclusions?.join("\n") || ""}
            onChange={(e) => handleBulletInput(e.target.value, 'exclusions')}
            onKeyDown={(e) => handleKeyDown(e, 'exclusions')}
            className="w-full p-4 rounded-xl border border-border/40 bg-transparent focus:border-primary/30 outline-none resize-none transition-all text-sm font-medium leading-relaxed"
            placeholder="e.g., • Gratuities"
          />
        </div>
      </div>

      {/* Guide Type Selection */}
      {(categoryId !== "attraction" && categoryId !== "rental") && (
        <div className="space-y-6 pt-6 border-t border-border/20">
          <div className="space-y-1 px-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
              <UserCircle2 className="w-4 h-4" /> 
              {categoryId === "transfer" ? "Driving Assistance" : "Guiding Services"}
            </label>
            <p className="text-xs text-muted-foreground font-medium italic">Define the level of support during the activity.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {guideOptions.map((opt) => {
              const isSelected = product.guideType === opt.id;
              return (
                <button 
                  key={opt.id} 
                  onClick={() => updateProduct({ guideType: opt.id })}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all text-center group",
                    isSelected 
                      ? "border-primary bg-primary/[0.02]" 
                      : "border-border/40 hover:border-primary/20"
                  )}
                >
                  <p className={cn("text-xs font-bold tracking-tight", isSelected ? "text-primary" : "text-foreground")}>{opt.label}</p>
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                    isSelected ? "border-primary bg-primary" : "border-border/40 group-hover:border-primary/20"
                  )}>
                    {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Toggles / Binary Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6 border-t border-border/20">
        <div className="space-y-4">
          <div className="space-y-1 px-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
              <Utensils className="w-4 h-4" /> Food & Drinks
            </label>
          </div>
          <div className="flex gap-2">
            {[false, true].map((val) => {
              const isSelected = product.hasFood === val;
              return (
                <button
                  key={val.toString()}
                  onClick={() => updateProduct({ hasFood: val })}
                  className={cn(
                    "flex-1 h-10 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all border",
                    isSelected 
                      ? "bg-primary border-primary text-white" 
                      : "border-border/40 text-muted-foreground hover:border-primary/20"
                  )}
                >
                  {val ? "Included" : "Excluded"}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1 px-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
              <Bus className="w-4 h-4" /> Transportation
            </label>
          </div>
          <div className="flex gap-2">
            {[false, true].map((val) => {
              const isSelected = product.hasTransportation === val;
              return (
                <button
                  key={val.toString()}
                  onClick={() => updateProduct({ hasTransportation: val })}
                  className={cn(
                    "flex-1 h-10 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all border",
                    isSelected 
                      ? "bg-primary border-primary text-white" 
                      : "border-border/40 text-muted-foreground hover:border-primary/20"
                  )}
                >
                  {val ? "Included" : "Excluded"}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
