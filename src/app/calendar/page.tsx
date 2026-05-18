"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Product } from "@/types/product";
import { format, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Clock, 
  Layout,
  Search,
  LayoutGrid,
  Activity,
  History,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export default function AvailabilityPage() {
  const [viewMode, setViewMode] = useState<"agenda" | "week" | "month">("agenda");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductFilter, setSelectedProductFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setIsLoading(false);
      });
  }, []);

  const activeSlots = useMemo(() => {
    const dayOfWeek = currentDate.getDay(); // 0-6
    return products.flatMap(product => {
      if (product.status === "archived") return [];
      if (selectedProductFilter !== "all" && product.id !== selectedProductFilter) return [];
      return (product.options || []).flatMap(option => {
        const avail = option.availability;
        if (!avail) return [];
        if (avail.daysOfWeek && avail.daysOfWeek.length > 0 && !avail.daysOfWeek.includes(dayOfWeek)) {
          return [];
        }
        return (avail.timeSlots || []).map(slot => ({
          id: `${product.id}-${option.id}-${slot.id}`,
          productTitle: product.title,
          optionName: option.referenceName,
          time: slot.time,
          capacity: slot.capacity,
          booked: 0, // Mocked for global view
          productId: product.id,
          optionId: option.id
        }));
      });
    }).filter(slot => slot.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) || slot.optionName.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, currentDate, searchQuery, selectedProductFilter]);

  const navDate = (dir: number) => {
    if (viewMode === "agenda") setCurrentDate(prev => addDays(prev, dir));
    else if (viewMode === "month") setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + dir, 1));
  };


  return (
    <div className="w-full animate-in fade-in duration-500 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Global Availability</h1>
          <p className="text-sm text-muted-foreground font-medium">Coordinate and manage service capacity across your entire catalog.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex bg-muted/40 rounded-full p-1 border border-border/50 backdrop-blur-sm">
              {(["agenda", "week", "month"] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-8 capitalize text-[10px] font-bold px-5 rounded-full transition-all duration-300 tracking-widest",
                    viewMode === mode 
                      ? "bg-white text-primary shadow-xl shadow-black/5 hover:bg-white" 
                      : "text-muted-foreground hover:bg-transparent hover:text-primary/60"
                  )}
                  onClick={() => setViewMode(mode)}
                >
                  {mode}
                </Button>
              ))}
           </div>
           <Button size="sm" onClick={() => setCurrentDate(new Date())} className="h-10 px-8 rounded-full font-bold text-[11px] uppercase tracking-widest gap-3 shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]">
             <CalendarIcon className="w-3.5 h-3.5" /> Jump to Today
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">
        {/* Sidebar Filters */}
        <aside className="lg:sticky lg:top-8 space-y-10">
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary px-2">
              <Filter className="h-3.5 w-3.5" /> Discovery Filters
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 px-1">Primary Activity</label>
                <Select value={selectedProductFilter} onValueChange={(val) => setSelectedProductFilter(val || "all")}>
                  <SelectTrigger className="h-11 rounded-2xl bg-card border-border/50 text-xs font-bold shadow-sm focus:ring-primary/20">
                    <SelectValue placeholder="Select activity" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border/50 shadow-2xl">
                    <SelectItem value="all" className="text-xs font-medium">All Experiences</SelectItem>
                    {products.map(p => (
                      <SelectItem key={p.id} value={p.id || ""} className="text-xs font-medium">{p.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 px-1">Package Variant</label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-11 rounded-2xl bg-card border-border/50 text-xs font-bold shadow-sm focus:ring-primary/20">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border/50 shadow-2xl">
                    <SelectItem value="all" className="text-xs font-medium">All Variants</SelectItem>
                    <SelectItem value="skip" className="text-xs font-medium">Skip-the-line Admission</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 px-1">Window Slot</label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-11 rounded-2xl bg-card border-border/50 text-xs font-bold shadow-sm focus:ring-primary/20">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border/50 shadow-2xl">
                    <SelectItem value="all" className="text-xs font-medium">Complete Schedule</SelectItem>
                    <SelectItem value="morning" className="text-xs font-medium">Morning (08:00 - 12:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-[32px] bg-primary/5 border border-primary/10 space-y-4 shadow-inner">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Intelligent Sync</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
              We are currently displaying <span className="text-foreground font-bold">high-demand slots</span>. Real-time API synchronization is active.
            </p>
          </div>
        </aside>

        {/* Main Calendar / Agenda Area */}
        <div className="space-y-12">
          {/* Calendar Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-full border border-border/50">
                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white hover:shadow-sm" onClick={() => navDate(-1)}>
                   <ChevronLeft className="h-4 w-4" />
                 </Button>
                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white hover:shadow-sm" onClick={() => navDate(1)}>
                   <ChevronRight className="h-4 w-4" />
                 </Button>
               </div>
               <h3 className="text-2xl font-bold tracking-tight text-foreground">
                 {viewMode === "month" ? format(currentDate, "MMMM yyyy") : format(currentDate, "MMM d, yyyy")}
               </h3>
            </div>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
              <input 
                className="w-full md:w-72 bg-card border border-border/50 rounded-2xl pl-12 pr-4 py-3 text-xs font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all"
                placeholder="Search specific slots..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* View Modes */}
          {viewMode === "agenda" && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-6">
                 <Badge variant="outline" className="text-[11px] font-bold text-primary border-primary/20 bg-primary/5 px-4 h-7 rounded-full uppercase tracking-widest">
                   {format(currentDate, "EEEE, MMMM d")}
                 </Badge>
                 <div className="h-px bg-gradient-to-r from-border/50 to-transparent flex-1" />
              </div>
              <div className="grid gap-4">
                {isLoading ? (
                  <div className="p-8 text-center text-sm font-medium text-muted-foreground">Loading slots...</div>
                ) : activeSlots.length === 0 ? (
                  <div className="p-8 text-center text-sm font-medium text-muted-foreground border border-dashed border-border/50 rounded-3xl">No slots scheduled for this date.</div>
                ) : activeSlots.map((slot) => (
                  <div key={slot.id} className="group flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-[32px] border border-border/50 bg-card/30 transition-all duration-500 hover:border-primary/30 hover:bg-card shadow-sm hover:shadow-xl hover:shadow-black/5">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center shrink-0 border border-border/50 group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                        <Clock className="h-6 w-6 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">{slot.productTitle}</h4>
                        <div className="flex flex-wrap items-center gap-4">
                          <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2">
                             <History className="w-3 h-3" /> {slot.time} Slot ({slot.optionName})
                          </span>
                          <Badge variant="secondary" className="h-6 text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-600 border-none px-3">
                            {slot.booked} / {slot.capacity} booked
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-10 rounded-full px-8 font-bold text-[10px] uppercase tracking-widest border-border group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm">Manage Slot</Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === "month" && (
            <div className="rounded-[40px] border border-border/50 overflow-hidden bg-card/30 animate-in zoom-in-95 duration-700 shadow-2xl shadow-black/5">
               <div className="grid grid-cols-7 border-b border-border/50 bg-muted/20">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                    <div key={day} className="py-4 text-center text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">{day}</div>
                  ))}
               </div>
               <div className="grid grid-cols-7">
                  {Array.from({length: 35}).map((_, i) => {
                    const day = i - 2;
                    const isCurrentMonth = day > 0 && day <= 31;
                    return (
                      <div key={i} className={cn(
                        "h-36 p-4 border-r border-b border-border/50 last:border-r-0 transition-all group/cell",
                        isCurrentMonth ? "bg-transparent hover:bg-primary/5" : "bg-muted/5"
                      )}>
                        {isCurrentMonth && (
                          <div className="h-full flex flex-col justify-between">
                            <span className={cn(
                              "text-xs font-bold transition-all",
                              day === 25 
                                ? "bg-primary text-white w-7 h-7 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 scale-110" 
                                : "text-muted-foreground/80 group-hover/cell:text-primary"
                            )}>
                              {day}
                            </span>
                            {day >= 24 && day <= 29 && (
                              <div className="space-y-2 pb-2">
                                <div className="h-1.5 bg-emerald-500/30 rounded-full w-full shadow-sm" title="High availability" />
                                <div className="h-1.5 bg-amber-500/30 rounded-full w-2/3 shadow-sm" title="Medium availability" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
               </div>
            </div>
          )}

          {viewMode === "week" && (
            <div className="rounded-[48px] border-2 border-dashed border-border/60 p-24 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-700 bg-muted/10">
               <div className="h-20 w-20 rounded-[32px] bg-primary/5 flex items-center justify-center mb-8 border border-primary/10 shadow-inner">
                  <LayoutGrid className="h-10 w-10 text-primary opacity-60" />
               </div>
               <h3 className="text-2xl font-bold tracking-tight text-foreground">Advanced Analytics View</h3>
               <p className="text-sm text-muted-foreground font-medium max-w-sm mt-4 leading-relaxed">
                  The weekly grid provides cross-inventory analytics. This feature is currently in production and will be available in the next release.
               </p>
               <div className="mt-10 flex gap-3">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-bold uppercase px-3 h-6">Priority Access</Badge>
                  <Badge variant="outline" className="text-[10px] font-bold uppercase px-3 h-6 border-border text-muted-foreground">V2.4.0</Badge>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
