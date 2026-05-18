"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Calendar as CalendarIcon, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  History, 
  Sparkles,
  Search
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
import { Product } from "@/types/product";
import { format, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek } from "date-fns";

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

  // Calculate active slots for any given date
  const getSlotsForDate = (date: Date) => {
    const dayOfWeek = date.getDay(); // 0-6
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
    }).filter(slot => 
      slot.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
      slot.optionName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const activeSlots = useMemo(() => {
    return getSlotsForDate(currentDate);
  }, [products, currentDate, searchQuery, selectedProductFilter]);

  const navDate = (dir: number) => {
    if (viewMode === "agenda") setCurrentDate(prev => addDays(prev, dir));
    else if (viewMode === "week") setCurrentDate(prev => addDays(prev, dir * 7));
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
                      ? "bg-white text-primary hover:bg-white" 
                      : "text-muted-foreground hover:bg-transparent hover:text-primary/60"
                  )}
                  onClick={() => setViewMode(mode)}
                >
                  {mode}
                </Button>
              ))}
           </div>
           <Button 
             size="sm" 
             onClick={() => setCurrentDate(new Date())}
             className="h-10 px-8 rounded-full font-bold text-[11px] uppercase tracking-widest gap-3 transition-transform hover:scale-[1.02]"
           >
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
                  <SelectTrigger className="w-full h-10 bg-transparent border-b border-border/50 rounded-none shadow-none text-xs font-bold focus:ring-primary/20">
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
                  <SelectTrigger className="w-full h-10 bg-transparent border-b border-border/50 rounded-none shadow-none text-xs font-bold focus:ring-primary/20">
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
                  <SelectTrigger className="w-full h-10 bg-transparent border-b border-border/50 rounded-none shadow-none text-xs font-bold focus:ring-primary/20">
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

          <div className="py-4 border-t border-border/50 space-y-3">
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
               <div className="flex items-center gap-1">
                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted/40" onClick={() => navDate(-1)}>
                   <ChevronLeft className="h-4 w-4" />
                 </Button>
                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted/40" onClick={() => navDate(1)}>
                   <ChevronRight className="h-4 w-4" />
                 </Button>
               </div>
               <h3 className="text-2xl font-bold tracking-tight text-foreground">
                 {viewMode === "month" 
                   ? format(currentDate, "MMMM yyyy") 
                   : viewMode === "week"
                     ? `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d, yyyy")}`
                     : format(currentDate, "MMMM d, yyyy")}
               </h3>
            </div>
            <div className="relative group">
              <Search className="absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
              <input 
                className="w-full md:w-72 bg-transparent border-b border-border/50 pl-10 pr-4 py-2 text-xs font-bold focus:outline-none focus:border-primary transition-all"
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
                  <div key={slot.id} className="group flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-b border-border/40 last:border-none transition-all duration-300">
                    <div className="flex items-center gap-6">
                      <div className="h-11 w-11 rounded-full bg-muted/30 flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                        <Clock className="h-5 w-5 text-muted-foreground/60 group-hover:text-primary transition-colors" />
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
            <div className="w-full border-t border-border/40 animate-in zoom-in-95 duration-700">
               <div className="grid grid-cols-7 border-b border-border/40 bg-muted/10">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="py-4 text-center text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">{day}</div>
                  ))}
               </div>
               <div className="grid grid-cols-7">
                  {(() => {
                    const start = startOfWeek(startOfMonth(currentDate));
                    const end = endOfWeek(endOfMonth(currentDate));
                    const days = eachDayOfInterval({ start, end });
                    return days.map((day, i) => {
                      const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                      const slots = getSlotsForDate(day);
                      const isSelected = isSameDay(day, currentDate);
                      const isToday = isSameDay(day, new Date());
                      
                      return (
                        <div 
                          key={i} 
                          onClick={() => {
                            setCurrentDate(day);
                            setViewMode("agenda");
                          }}
                          className={cn(
                            "h-28 p-3 border-r border-b border-border/40 last:border-r-0 transition-all group/cell cursor-pointer flex flex-col justify-between",
                            isCurrentMonth ? "bg-transparent hover:bg-primary/5" : "bg-muted/5 opacity-40 hover:opacity-70"
                          )}
                        >
                          <span className={cn(
                            "text-xs font-bold transition-all w-6 h-6 rounded-full flex items-center justify-center",
                            isSelected 
                              ? "bg-primary text-white" 
                              : isToday
                                ? "bg-primary/10 text-primary font-black"
                                : "text-muted-foreground/80 group-hover/cell:text-primary"
                          )}>
                            {day.getDate()}
                          </span>
                          
                          {slots.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block">
                                {slots.length} slots
                              </span>
                              <div className="flex gap-0.5">
                                {slots.slice(0, 3).map((s, idx) => (
                                  <div key={idx} className="h-1 w-2.5 rounded-full bg-emerald-500/50" />
                                ))}
                                {slots.length > 3 && (
                                  <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
               </div>
            </div>
          )}

          {viewMode === "week" && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
              {(() => {
                const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
                return Array.from({ length: 7 }).map((_, i) => {
                  const day = addDays(weekStart, i);
                  const slots = getSlotsForDate(day);
                  const isToday = isSameDay(day, new Date());
                  
                  return (
                    <div key={i} className="space-y-4">
                      <div className="flex items-center gap-6">
                         <Badge 
                           variant="outline" 
                           onClick={() => {
                             setCurrentDate(day);
                             setViewMode("agenda");
                           }}
                           className={cn(
                             "text-[10px] font-bold px-4 h-7 rounded-full uppercase tracking-widest cursor-pointer transition-all",
                             isToday
                               ? "bg-primary text-white border-primary"
                               : "text-muted-foreground border-border/50 hover:border-primary hover:text-primary"
                           )}
                         >
                           {format(day, "EEEE, MMM d")}
                         </Badge>
                         <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40">
                           {slots.length} Slots Scheduled
                         </span>
                         <div className="h-px bg-gradient-to-r from-border/30 to-transparent flex-1" />
                      </div>
                      
                      {slots.length === 0 ? (
                        <div className="pl-6 text-[11px] font-semibold text-muted-foreground/60">No slots scheduled</div>
                      ) : (
                        <div className="grid gap-2 pl-4 border-l-2 border-border/20">
                          {slots.map((slot) => (
                            <div key={slot.id} className="group flex flex-col md:flex-row md:items-center justify-between gap-6 py-4 border-b border-border/30 last:border-none transition-all duration-300">
                              <div className="flex items-center gap-4">
                                <div className="h-9 w-9 rounded-full bg-muted/40 flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                                  <Clock className="h-4 w-4 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                                </div>
                                <div className="space-y-0.5">
                                  <h4 className="text-sm font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">{slot.productTitle}</h4>
                                  <div className="flex items-center gap-3">
                                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                                      {slot.time} ({slot.optionName})
                                    </span>
                                    <Badge variant="secondary" className="h-5 text-[8px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border-none px-2">
                                      {slot.booked} / {slot.capacity} booked
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  setCurrentDate(day);
                                  setViewMode("agenda");
                                }}
                                className="h-8 rounded-full px-6 font-bold text-[9px] uppercase tracking-widest border-border hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                              >
                                View Details
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
