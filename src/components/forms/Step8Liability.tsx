"use client";

import React from "react";
import { RefreshCcw, Check } from "lucide-react";
import { useProductForm } from "@/hooks/useProductForm";
import { cn } from "@/lib/utils";

export function Step8Liability() {
  const { product, updateProduct } = useProductForm();

  const policies = [
    { id: "standard", label: "Standard (24h)", desc: "Full refund if canceled 24 hours prior." },
    { id: "strict", label: "Strict (48h)", desc: "Full refund if canceled 48 hours prior." },
    { id: "non-refundable", label: "Non-refundable", desc: "No refund available once confirmed." },
  ];

  return (
    <div className="w-full max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      
      {/* Refund Policy */}
      <div className="space-y-6">
        <div className="space-y-1 px-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
            <RefreshCcw className="w-4 h-4" /> Policy Framework
          </label>
          <p className="text-sm text-muted-foreground font-medium italic">Define the cancellation and refund rules.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {policies.map((policy) => {
            const isSelected = product.cancellationPolicy === policy.id;
            return (
              <button
                key={policy.id}
                onClick={() => updateProduct({ cancellationPolicy: policy.id as any })}
                className={cn(
                  "relative flex flex-col items-start text-left p-5 rounded-2xl transition-all border group",
                  isSelected 
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/10" 
                    : "bg-transparent border-border/40 text-muted-foreground hover:border-primary/20"
                )}
              >
                <div className="space-y-1.5">
                  <p className="text-xs font-bold uppercase tracking-tight">
                    {policy.label}
                  </p>
                  <p className={cn("text-[10px] font-medium leading-relaxed", isSelected ? "text-white/80" : "text-muted-foreground/80")}>{policy.desc}</p>
                </div>
                {isSelected && (
                  <div className="absolute top-4 right-4 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
