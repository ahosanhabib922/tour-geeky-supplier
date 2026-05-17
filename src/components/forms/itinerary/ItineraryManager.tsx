"use client";

import React, { useState } from "react";
import { Plus, Trash2, MapPin, GripVertical, Clock, Info, Check } from "lucide-react";
import { ItineraryItem } from "@/types/product";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LocationSearch } from "@/components/ui/LocationSearch";
import { cn } from "@/lib/utils";

interface ItineraryManagerProps {
  items: ItineraryItem[];
  onChange: (items: ItineraryItem[]) => void;
}

export function ItineraryManager({ items, onChange }: ItineraryManagerProps) {
  const addItem = () => {
    const newItem: ItineraryItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: "",
      description: "",
      locationName: "",
      type: items.length === 0 ? "start" : "stop",
    };
    onChange([...items, newItem]);
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<ItineraryItem>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="space-y-0.5">
          <h3 className="text-lg font-bold tracking-tight">Sequence of Events</h3>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">{items.length} Stop Points Defined</p>
        </div>
        <button 
          onClick={addItem}
          className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest hover:opacity-70 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" /> Add Stop
        </button>
      </div>

      <div className="space-y-3 relative">
        {items.length > 1 && (
          <div className="absolute left-[20px] top-10 bottom-10 w-0.5 bg-border/40 -z-10" />
        )}
        
        {items.map((item, index) => (
          <div key={item.id} className="relative group border border-border/40 rounded-2xl p-4 transition-all hover:border-primary/20 bg-transparent">
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-2 pt-1">
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 z-10 bg-background transition-all",
                  item.type === "start" ? "border-primary" : 
                  item.type === "end" ? "border-primary bg-primary" : 
                  "border-muted-foreground/30"
                )}>
                  {item.type === "end" ? (
                    <div className="w-1 h-1 rounded-full bg-white" />
                  ) : (
                    <div className={cn("w-1 h-1 rounded-full", item.type === "start" ? "bg-primary" : "bg-muted-foreground/30")} />
                  )}
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest px-1">Stop Title</label>
                    <Input 
                      placeholder="Title or Attraction..."
                      value={item.title}
                      onChange={(e) => updateItem(item.id, { title: e.target.value })}
                      className="h-9 text-xs font-semibold rounded-lg border-border/40 bg-transparent focus:border-primary/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest px-1">Location Reference</label>
                    <LocationSearch 
                      placeholder="Search for a place..."
                      value={item.locationName}
                      onChange={(val, coords) => updateItem(item.id, { 
                        locationName: val,
                        ...(coords && { coordinates: coords })
                      })}
                      className="h-9 text-xs font-medium rounded-lg border-border/40 bg-transparent focus:border-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest px-1">Narrative (Optional)</label>
                  <textarea 
                    placeholder="Describe the experience at this stop..."
                    value={item.description}
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    className="w-full h-[88px] p-3 rounded-lg border border-border/40 bg-transparent outline-none text-xs font-medium focus:border-primary/20 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-between items-end pl-3 border-l border-border/20">
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-1 text-muted-foreground/40 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="space-y-1">
                   <select 
                     value={item.type}
                     onChange={(e) => updateItem(item.id, { type: e.target.value as any })}
                     className="bg-muted/30 border-none text-[8px] font-bold uppercase tracking-widest rounded-md px-1.5 py-1 outline-none cursor-pointer"
                   >
                     <option value="start">Start</option>
                     <option value="stop">Stop</option>
                     <option value="end">End</option>
                   </select>
                </div>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-12 rounded-2xl border-2 border-dashed border-border/40">
             <p className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest">No journey points defined</p>
             <Button 
               size="sm"
               onClick={addItem}
               className="mt-4 rounded-full h-8 px-6 text-[10px] font-bold uppercase tracking-widest"
             >
               Add First Stop
             </Button>
          </div>
        )}
      </div>
    </div>
  );
}
