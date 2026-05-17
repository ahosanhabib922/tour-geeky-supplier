"use client";

import React, { useState, useEffect } from "react";
import { Clock, Users, Lock, Unlock, ChevronLeft, ChevronRight, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Product, ProductOption } from "@/types/product";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";

export default function SupplierCalendarPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [override, setOverride] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(() => { fetchProducts(); }, []);
  useEffect(() => {
    if (selectedProduct && selectedOption && selectedDate) fetchAvailability();
  }, [selectedProduct, selectedOption, selectedDate]);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
      if (data.length > 0) {
        setSelectedProduct(data[0]);
        if (data[0].options?.length > 0) setSelectedOption(data[0].options[0]);
      }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }

  async function fetchAvailability() {
    try {
      const res = await fetch(`/api/availability?productId=${selectedProduct?.id}&optionId=${selectedOption?.id}&date=${selectedDate}`);
      const data = await res.json();
      setOverride(data.override);
      setInventory(data.inventory);
    } catch (e) { console.error(e); }
  }

  async function handleSave(updates: any) {
    setIsSaving(true);
    try {
      await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct?.id,
          optionId: selectedOption?.id,
          date: selectedDate,
          isBlocked: updates.isBlocked ?? (override?.is_blocked === 1),
          capacityOverride: updates.capacityOverride ?? (override?.capacity_override || selectedOption?.maxGroupSize),
        }),
      });
      fetchAvailability();
    } catch (e) { console.error(e); }
    finally { setIsSaving(false); }
  }

  const isBlocked = override?.is_blocked === 1;
  const currentCapacity = override?.capacity_override || selectedOption?.maxGroupSize || 0;
  const timeSlots = selectedOption?.availability?.timeSlots || [];
  const today = new Date().toISOString().split('T')[0];

  // Build month grid
  const buildMonthGrid = () => {
    const d = new Date(selectedDate);
    const year = d.getFullYear();
    const month = d.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weeks: (number | null)[][] = [];
    let week: (number | null)[] = Array(firstDay).fill(null);
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) { weeks.push(week); week = []; }
    }
    if (week.length > 0) { while (week.length < 7) week.push(null); weeks.push(week); }
    return { weeks, year, month };
  };

  const { weeks, year, month } = buildMonthGrid();
  const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const selectedDay = new Date(selectedDate).getDate();

  const navMonth = (dir: number) => {
    const d = new Date(selectedDate);
    d.setMonth(d.getMonth() + dir);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const pickDay = (day: number) => {
    const d = new Date(year, month, day);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const todayDay = today.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`) ? new Date(today).getDate() : null;

  // Stats
  const totalBooked = timeSlots.reduce((sum: number, slot: any) => {
    const inv = inventory.find((i: any) => i.time_slot === slot.time);
    return sum + (inv ? inv.booked_count : 0);
  }, 0);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 text-brand-black animate-spin" />
        <p className="text-sm text-brand-gray">Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-brand-black">Availability Calendar</h1>
        <p className="text-sm text-brand-gray">Manage time slots, capacity, and block dates for your activities.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
        {/* ===== LEFT SIDEBAR ===== */}
        <div className="space-y-6">
          {/* Mini Calendar */}
          <div className="rounded-[24px] border border-brand-border/40 p-4 bg-white">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navMonth(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-semibold text-brand-black">{monthName}</span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navMonth(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-7 gap-0">
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                <div key={d} className="text-center text-[10px] font-semibold text-brand-gray py-1">{d}</div>
              ))}
              {weeks.flat().map((day, i) => {
                if (day === null) return <div key={`e${i}`} />;
                const isSelected = day === selectedDay;
                const isToday = day === todayDay;
                return (
                  <button
                    key={i}
                    onClick={() => pickDay(day)}
                    className={cn(
                      "h-9 w-full rounded-lg text-sm font-medium transition-all",
                      isSelected
                        ? "bg-brand-black text-white"
                        : isToday
                          ? "bg-brand-light text-brand-black font-bold"
                          : "text-brand-black hover:bg-brand-light/50"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activity Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-brand-gray">Activity</label>
            <Select
              value={selectedProduct?.id || ""}
              onValueChange={(val) => {
                const p = products.find(p => p.id === val);
                if (p) { setSelectedProduct(p); setSelectedOption(p.options?.[0] || null); }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select activity" />
              </SelectTrigger>
              <SelectContent>
                {products.map(p => (
                  <SelectItem key={p.id} value={p.id as string}>{p.title || p.id}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Option Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-brand-gray">Option</label>
            <Select
              value={selectedOption?.id || ""}
              onValueChange={(val) => {
                const opt = selectedProduct?.options?.find(o => o.id === val);
                if (opt) setSelectedOption(opt);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                {selectedProduct?.options?.map(o => (
                  <SelectItem key={o.id} value={o.id as string}>{o.referenceName || o.id}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Capacity */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-brand-gray">Daily Capacity</label>
            <Input
              type="number"
              value={currentCapacity}
              onChange={(e) => handleSave({ capacityOverride: parseInt(e.target.value) || 0 })}
            />
          </div>

          {/* Block/Unblock */}
          {isBlocked ? (
            <Button variant="outline" className="w-full rounded-xl" onClick={() => handleSave({ isBlocked: false })}>
              <Unlock className="mr-2 h-4 w-4" /> Unblock This Day
            </Button>
          ) : (
            <button
              className="w-full px-4 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              onClick={() => handleSave({ isBlocked: true })}
            >
              <Lock className="h-4 w-4" /> Block This Day
            </button>
          )}
        </div>

        {/* ===== RIGHT: TIME SLOTS ===== */}
        <div>
          {/* Day Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-brand-black">
                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </h2>
              <Badge className={cn(
                "gap-1 rounded-lg text-[10px] font-black uppercase px-2.5 py-1 border-none",
                isBlocked ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"
              )}>
                {isBlocked ? <Lock className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                {isBlocked ? "Blocked" : "Open"}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-brand-gray">
              <span><b className="text-brand-black">{timeSlots.length}</b> slots</span>
              <span><b className="text-brand-black">{totalBooked}</b> booked</span>
            </div>
          </div>

          {/* Slots List */}
          {isBlocked ? (
            <div className="rounded-[24px] border-2 border-dashed border-red-200 bg-red-50/50 py-16 flex flex-col items-center justify-center text-center">
              <Lock className="h-8 w-8 text-red-300 mb-3" />
              <p className="text-sm font-medium text-brand-black">This day is blocked</p>
              <p className="text-xs text-brand-gray mt-1">No bookings can be made.</p>
            </div>
          ) : timeSlots.length > 0 ? (
            <div className="space-y-2">
              {timeSlots.map((slot: any) => {
                const inv = inventory.find((i: any) => i.time_slot === slot.time);
                const booked = inv ? inv.booked_count : 0;
                const cap = inv?.total_capacity || slot.capacity || currentCapacity;
                const remaining = cap - booked;
                const pct = cap > 0 ? Math.round((booked / cap) * 100) : 0;
                const soldOut = booked >= cap;

                return (
                  <div key={slot.id} className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border border-brand-border/40 bg-white transition-all",
                    soldOut ? "bg-red-50/50 border-red-200/50" : "hover:border-brand-black/20 hover:shadow-sm"
                  )}>
                    {/* Time */}
                    <div className="flex items-center gap-3 shrink-0 w-[100px]">
                      <Clock className={cn("h-4 w-4", soldOut ? "text-red-400" : "text-brand-gray")} />
                      <span className="text-lg font-bold text-brand-black">{slot.time}</span>
                    </div>

                    {/* Bar */}
                    <div className="flex-1">
                      <div className="h-2.5 rounded-full bg-brand-light overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            pct >= 100 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500"
                          )}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="shrink-0 text-right w-[90px]">
                      {soldOut ? (
                        <Badge className="text-[11px] bg-red-100 text-red-600 border-none">Sold Out</Badge>
                      ) : (
                        <span className="text-sm">
                          <b className="text-brand-black">{remaining}</b>
                          <span className="text-brand-gray"> / {cap}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[24px] border-2 border-dashed border-brand-border/40 py-16 flex flex-col items-center justify-center text-center">
              <Clock className="h-8 w-8 text-brand-gray/30 mb-3" />
              <p className="text-sm font-medium text-brand-black">No time slots</p>
              <p className="text-xs text-brand-gray mt-1">Configure slots in the product editor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
