"use client";

import React from "react";
import { Clock, MapPin, Trash2, Edit3, Users, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductOption } from "@/types/product";
import { Button } from "@/components/ui/Button";

interface OptionListProps {
  options: ProductOption[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
}

export function OptionList({ options, selectedId, onSelect, onRemove, onEdit }: OptionListProps) {
  if (options.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="rounded-3xl border border-border/40 overflow-hidden bg-transparent">
        {options.map((option, index) => {
          const isSelected = selectedId === option.id;
          return (
            <div 
              key={option.id} 
              onClick={() => onSelect?.(option.id)}
              className={cn(
                "flex items-center justify-between p-6 group transition-all cursor-pointer relative",
                isSelected ? "bg-primary/[0.02]" : "hover:bg-muted/30",
                index !== options.length - 1 && "border-b border-border/30"
              )}
            >
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                  isSelected ? "bg-primary text-white shadow-md shadow-primary/10" : "bg-muted/40 text-muted-foreground/80 group-hover:text-primary"
                )}>
                  {isSelected ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
                </div>

                <div className="space-y-1">
                  <p className={cn("font-bold text-base tracking-tight transition-colors", isSelected ? "text-primary" : "text-foreground")}>
                    {option.referenceName}
                  </p>
                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 opacity-60" /> {option.durationValue || "VALIDITY"}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-border" />
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 opacity-60" /> {option.maxGroupSize} MAX
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(option.id); }} 
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 hover:text-primary px-3 py-2 transition-all"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onRemove(option.id); }} 
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 hover:text-rose-500 px-3 py-2 transition-all"
                  >
                    Delete
                  </button>
                </div>
                <ChevronRight className={cn("w-4 h-4 transition-all duration-300", isSelected ? "text-primary translate-x-1" : "text-muted-foreground/60")} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
