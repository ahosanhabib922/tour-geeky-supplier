"use client";

import React, { useState } from "react";
import { Calendar, Clock, PlusCircle, Trash2, Check, Info, Zap } from "lucide-react";
import { ProductOption, Availability, TimeSlot } from "@/types/product";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface AvailabilityManagerProps {
  option: ProductOption;
  onUpdate: (updates: Partial<ProductOption>) => void;
}

const DAYS = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
];

export function AvailabilityManager({ option, onUpdate }: AvailabilityManagerProps) {
  const availability: Availability = option.availability || {
    type: "weekly",
    scheduleType: "slots",
    daysOfWeek: [1, 2, 3, 4, 5],
    timeSlots: [{ id: "1", time: "09:00", capacity: option.maxGroupSize }],
  };

  const scheduleType = availability.scheduleType || "slots";

  const updateAvailability = (updates: Partial<Availability>) => {
    onUpdate({ availability: { ...availability, ...updates } });
  };

  const toggleDay = (day: number) => {
    const days = availability.daysOfWeek.includes(day)
      ? availability.daysOfWeek.filter(d => d !== day)
      : [...availability.daysOfWeek, day];
    updateAvailability({ daysOfWeek: days.sort() });
  };

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: Math.random().toString(36).substr(2, 4),
      time: "10:00",
      capacity: option.maxGroupSize,
    };
    updateAvailability({ timeSlots: [...availability.timeSlots, newSlot] });
  };

  const updateSlot = (id: string, updates: Partial<TimeSlot>) => {
    const slots = availability.timeSlots.map(s => s.id === id ? { ...s, ...updates } : s);
    updateAvailability({ timeSlots: slots });
  };

  const removeSlot = (id: string) => {
    if (availability.timeSlots.length <= 1) return;
    updateAvailability({ timeSlots: availability.timeSlots.filter(s => s.id !== id) });
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Schedule Type Selection */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-[14px] font-bold text-brand-dark flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-primary" /> Schedule Model
          </h3>
          <p className="text-[11px] text-brand-light font-medium italic">Choose how customers book their visit.</p>
        </div>
        <div className="flex gap-4 p-1 bg-brand-bg/20 rounded-2xl w-fit">
          <button 
            onClick={() => updateAvailability({ scheduleType: "slots" })}
            className={cn(
              "px-6 py-3 rounded-xl text-[12px] font-bold transition-all",
              scheduleType === "slots" ? "bg-white text-brand-primary shadow-md" : "text-brand-light hover:text-brand-dark"
            )}
          >
            Fixed Starting Times
          </button>
          <button 
            onClick={() => updateAvailability({ scheduleType: "window" })}
            className={cn(
              "px-6 py-3 rounded-xl text-[12px] font-bold transition-all",
              scheduleType === "window" ? "bg-white text-brand-primary shadow-md" : "text-brand-light hover:text-brand-dark"
            )}
          >
            Opening Hours Window
          </button>
        </div>
      </div>

      {/* Operating Days */}
      <div className="space-y-6 pt-6 border-t border-brand-bg">
        <div className="space-y-1">
          <h3 className="text-[14px] font-bold text-brand-dark flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-primary" /> Operating Days
          </h3>
          <p className="text-[11px] text-brand-light font-medium italic">Select which days of the week this option is available.</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {DAYS.map(day => {
            const isSelected = availability.daysOfWeek.includes(day.value);
            return (
              <button
                key={day.value}
                onClick={() => toggleDay(day.value)}
                className={cn(
                  "w-12 h-12 rounded-xl text-[12px] font-bold transition-all border-2",
                  isSelected 
                    ? "bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                    : "bg-white border-brand-bg text-brand-light hover:border-brand-primary/20"
                )}
              >
                {day.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots vs Opening Hours */}
      <div className="space-y-6 pt-6 border-t border-brand-bg">
        {scheduleType === "slots" ? (
          <>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-[14px] font-bold text-brand-dark flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-primary" /> Starting Times / Slots
                </h3>
                <p className="text-[11px] text-brand-light font-medium italic">Set the starting times and participant capacity for each slot.</p>
              </div>
              <Button variant="ghost" size="sm" onClick={addTimeSlot} className="text-brand-primary font-bold text-[11px] gap-1.5">
                <PlusCircle className="w-3.5 h-3.5" /> Add Slot
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availability.timeSlots.map((slot, index) => (
                <div key={slot.id} className="relative group p-4 bg-brand-bg/10 rounded-2xl border border-transparent hover:border-brand-primary/20 transition-all flex items-center gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-brand-primary border border-brand-bg">
                        <span className="text-[10px] font-bold uppercase">Start</span>
                      </div>
                      <input 
                        type="time" 
                        value={slot.time}
                        onChange={(e) => updateSlot(slot.id, { time: e.target.value })}
                        className="bg-transparent font-bold text-[15px] outline-none text-brand-dark"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-brand-primary border border-brand-bg">
                        <span className="text-[10px] font-bold uppercase">Max</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          value={slot.capacity}
                          onChange={(e) => updateSlot(slot.id, { capacity: parseInt(e.target.value) || 0 })}
                          className="w-16 bg-transparent font-bold text-[15px] outline-none text-brand-dark"
                        />
                        <span className="text-[11px] text-brand-light font-medium">Participants</span>
                      </div>
                    </div>
                  </div>

                  {availability.timeSlots.length > 1 && (
                    <button 
                      onClick={() => removeSlot(slot.id)}
                      className="p-2 text-brand-light hover:text-red-500 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-[14px] font-bold text-brand-dark flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-primary" /> Opening Hours Range
              </h3>
              <p className="text-[11px] text-brand-light font-medium italic">Define the time window when customers can visit.</p>
            </div>
            <div className="grid grid-cols-2 gap-8 max-w-md">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-light uppercase tracking-widest">Opening Time</label>
                <input 
                  type="time" 
                  value={availability.openingHours?.start || "09:00"}
                  onChange={(e) => updateAvailability({ openingHours: { ...availability.openingHours, start: e.target.value } as any })}
                  className="w-full h-12 px-4 rounded-xl bg-brand-bg/30 border border-brand-bg font-bold text-brand-dark outline-none focus:border-brand-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-light uppercase tracking-widest">Closing Time</label>
                <input 
                  type="time" 
                  value={availability.openingHours?.end || "18:00"}
                  onChange={(e) => updateAvailability({ openingHours: { ...availability.openingHours, end: e.target.value } as any })}
                  className="w-full h-12 px-4 rounded-xl bg-brand-bg/30 border border-brand-bg font-bold text-brand-dark outline-none focus:border-brand-primary transition-all"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Seasonal / Specific Dates Note */}
      <div className="p-4 rounded-2xl bg-brand-bg/30 border border-brand-border/20 flex gap-4">
         <Info className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
         <p className="text-[12px] text-brand-gray font-medium leading-relaxed">
           <strong>Advanced Settings:</strong> For seasonal closures or specific date overrides, you can manage them in the global "Availability Calendar" after creating the product.
         </p>
      </div>
    </div>
  );
}
