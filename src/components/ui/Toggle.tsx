import React from "react";
import { cn } from "@/lib/utils";

interface ToggleProps {
  label?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  helperText?: string;
}

export function Toggle({
  label,
  enabled,
  onChange,
  helperText
}: ToggleProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-bold text-brand-dark">{label}</label>
        <button 
          onClick={() => onChange(!enabled)}
          className={cn(
            "w-11 h-6 rounded-full transition-all relative border-2", 
            enabled ? "bg-brand-primary border-brand-primary" : "bg-brand-bg border-brand-border/30 hover:border-brand-border"
          )}
        >
          <div className={cn(
            "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm", 
            enabled ? "left-[22px]" : "left-0.5"
          )} />
        </button>
      </div>
      {helperText && (
        <p className="text-[11px] text-brand-light leading-relaxed">{helperText}</p>
      )}
    </div>
  );
}
