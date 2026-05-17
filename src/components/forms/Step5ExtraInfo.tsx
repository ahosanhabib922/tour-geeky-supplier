"use client";

import React from "react";
import { 
  ShieldAlert, Activity, AlertCircle, Baby, Heart, PersonStanding, 
  Accessibility, Check, Info, Ban, Backpack, XCircle 
} from "lucide-react";
import { useProductForm } from "@/hooks/useProductForm";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function Step5ExtraInfo() {
  const { product, updateProduct } = useProductForm();

  const healthTags = [
    { id: "pregnant", label: "Not for Pregnant", icon: Baby },
    { id: "heart", label: "Heart Conditions", icon: Heart },
    { id: "back", label: "Back Problems", icon: PersonStanding },
    { id: "mobility", label: "Mobility Issues", icon: Accessibility },
  ];

  const fitnessLevels = [
    { id: "easy", label: "Easy", desc: "Minimal effort", color: "bg-emerald-500" },
    { id: "moderate", label: "Moderate", desc: "Light walking", color: "bg-amber-500" },
    { id: "strenuous", label: "Strenuous", desc: "High intensity", color: "bg-orange-500" },
    { id: "extreme", label: "Extreme", desc: "Expert level", color: "bg-red-500" },
  ];

  const toggleHealthRestriction = (label: string) => {
    const current = product.healthRestrictions || [];
    const updated = current.includes(label)
      ? current.filter(r => r !== label)
      : [...current, label];
    updateProduct({ healthRestrictions: updated });
  };

  const handleBulletInput = (value: string, field: 'notSuitableFor' | 'notAllowed' | 'whatToBring') => {
    const lines = value.split("\n");
    const formattedLines = lines.map(line => {
      if (line.trim() && !line.startsWith("• ")) {
        return "• " + line.trim();
      }
      return line;
    });
    updateProduct({ [field]: formattedLines });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, field: 'notSuitableFor' | 'notAllowed' | 'whatToBring') => {
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
      
      {/* Health Restrictions */}
      <div className="space-y-6">
        <div className="space-y-1 px-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> Health & Safety
          </label>
          <p className="text-sm text-muted-foreground font-medium italic">Tag medical warnings that participants should consider.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {healthTags.map((tag) => {
            const Icon = tag.icon;
            const isSelected = product.healthRestrictions?.includes(tag.label);
            
            return (
              <button
                key={tag.id}
                onClick={() => toggleHealthRestriction(tag.label)}
                className={cn(
                  "flex flex-col items-center justify-center p-5 rounded-2xl transition-all border text-center gap-3 group relative",
                  isSelected 
                    ? "border-primary bg-primary/[0.02]" 
                    : "border-border/40 hover:border-primary/20"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                  isSelected ? "bg-primary text-white" : "bg-muted/30 text-muted-foreground group-hover:text-primary"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={cn("text-[11px] font-bold transition-colors", isSelected ? "text-primary" : "text-foreground")}>{tag.label}</span>
                <div className="absolute right-3 top-3">
                   <div className={cn(
                     "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                     isSelected ? "border-primary bg-primary" : "border-border/20 group-hover:border-primary/20"
                   )}>
                     {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                   </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="space-y-1.5 pt-2 px-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Safety Narrative</label>
          <textarea
            rows={2}
            value={product.safetyDetails}
            onChange={(e) => updateProduct({ safetyDetails: e.target.value })}
            className="w-full p-4 rounded-xl border border-border/40 bg-transparent focus:border-primary/30 outline-none resize-none transition-all text-sm font-medium leading-relaxed"
            placeholder="Additional medical requirements or safety notes..."
          />
        </div>
      </div>

      {/* Fitness Intensity */}
      <div className="space-y-6 pt-6 border-t border-border/20">
        <div className="space-y-1 px-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Physical Demand
          </label>
          <p className="text-sm text-muted-foreground font-medium italic">Select the expected intensity level.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {fitnessLevels.map((level) => {
            const isActive = product.fitnessLevel === level.id;
            return (
              <button
                key={level.id}
                onClick={() => updateProduct({ fitnessLevel: level.id as any })}
                className={cn(
                  "p-4 rounded-xl transition-all border flex flex-col items-center text-center gap-2.5 group",
                  isActive 
                    ? "border-primary bg-primary/[0.02]" 
                    : "border-border/40 hover:border-primary/20"
                )}
              >
                <div className={cn(
                  "h-1 rounded-full transition-all duration-500 w-8", 
                  isActive ? level.color : "bg-muted group-hover:bg-primary/20"
                )} />
                <div>
                  <p className={cn("text-xs font-bold tracking-tight transition-colors", isActive ? "text-primary" : "text-foreground")}>
                    {level.label}
                  </p>
                  <p className="text-[9px] text-muted-foreground/80 font-medium uppercase tracking-wider">{level.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional Restrictions & Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border/20">
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1 flex items-center gap-2">
            <XCircle className="w-3.5 h-3.5 text-rose-500" /> Not suitable for
          </label>
          <textarea
            rows={5}
            value={product.notSuitableFor?.join("\n") || ""}
            onChange={(e) => handleBulletInput(e.target.value, 'notSuitableFor')}
            onKeyDown={(e) => handleKeyDown(e, 'notSuitableFor')}
            className="w-full p-4 rounded-xl border border-border/40 bg-transparent focus:border-primary/30 outline-none resize-none transition-all text-sm font-semibold leading-relaxed"
            placeholder="e.g., • People with heart problems"
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1 flex items-center gap-2">
            <Ban className="w-3.5 h-3.5 text-rose-500" /> Not allowed
          </label>
          <textarea
            rows={5}
            value={product.notAllowed?.join("\n") || ""}
            onChange={(e) => handleBulletInput(e.target.value, 'notAllowed')}
            onKeyDown={(e) => handleKeyDown(e, 'notAllowed')}
            className="w-full p-4 rounded-xl border border-border/40 bg-transparent focus:border-primary/30 outline-none resize-none transition-all text-sm font-semibold leading-relaxed"
            placeholder="e.g., • Pets • Smoking"
          />
        </div>
      </div>

      <div className="space-y-3 pt-6 border-t border-border/20">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1 flex items-center gap-2">
          <Backpack className="w-4 h-4 text-primary" /> What to bring
        </label>
        <textarea
          rows={3}
          value={product.whatToBring?.join("\n") || ""}
          onChange={(e) => handleBulletInput(e.target.value, 'whatToBring')}
          onKeyDown={(e) => handleKeyDown(e, 'whatToBring')}
          className="w-full p-4 rounded-xl border border-border/40 bg-transparent focus:border-primary/30 outline-none resize-none transition-all text-sm font-semibold leading-relaxed"
          placeholder="e.g., • Comfortable shoes • Water"
        />
      </div>

      {/* Subtle Alert */}
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-amber-500/[0.02] border border-amber-500/10">
        <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
           <AlertCircle className="text-amber-600 w-3 h-3" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-amber-800 uppercase tracking-tight">Legal Notice</h4>
          <p className="text-[11px] text-amber-800/60 leading-relaxed font-medium">
            Accurate health information is required for safety. Misleading details may affect insurance coverage and liability protections.
          </p>
        </div>
      </div>
    </div>
  );
}
