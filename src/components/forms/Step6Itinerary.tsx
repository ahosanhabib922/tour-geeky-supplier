"use client";

import React from "react";
import { useProductForm } from "@/hooks/useProductForm";
import { ItineraryManager } from "./itinerary/ItineraryManager";
import { MapPin } from "lucide-react";

export function Step6Itinerary() {
  const { product, updateProduct } = useProductForm();

  return (
    <div className="w-full max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="space-y-1 px-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
          <MapPin className="w-4 h-4" /> Logistics Workflow
        </label>
        <p className="text-sm text-muted-foreground font-medium italic">Layout the sequence of locations and experiences for your guests.</p>
      </div>
      
      <div className="bg-transparent">
        <ItineraryManager 
          items={product.itinerary || []}
          onChange={(items) => updateProduct({ itinerary: items })}
        />
      </div>
    </div>
  );
}
