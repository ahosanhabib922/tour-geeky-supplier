"use client";

import React, { useState } from "react";
import { Clock, MapPin, Users, CheckCircle2, ChevronRight, Info, Zap, Plus, Trash2 as TrashIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import { ProductOption } from "@/types/product";
import { PricingManager } from "../pricing/PricingManager";
import { AvailabilityManager } from "../availability/AvailabilityManager";
import { useProductForm } from "@/hooks/useProductForm";
import { CATEGORY_CONFIGS, CategoryId } from "@/constants/categoryConfig";

interface OptionWizardProps {
  initialData?: ProductOption;
  onComplete: (option: ProductOption) => void;
  onCancel: () => void;
}

export function OptionWizard({ initialData, onComplete, onCancel }: OptionWizardProps) {
  const { product } = useProductForm();
  const categoryId = (product.category as CategoryId) || "others";
  const config = CATEGORY_CONFIGS[categoryId] || CATEGORY_CONFIGS.others;
  const labels = config.labels || {};

  const [subStep, setSubStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ProductOption>>(initialData || {
    referenceName: "",
    referenceCode: "",
    maxGroupSize: 10,
    isPrivate: false,
    isWheelchairAccessible: false,
    type: "duration",
    durationUnit: "hours",
    duration: 1,
    validityUnit: "days",
    validityAmount: 1,
    bookingType: "instant",
    skipTheLine: false,
    skipTheLineDescription: "",
    hasGuideMaterials: false,
    hasAudioGuides: false,
    hasBooklets: false,
    cutOffTime: "15",
    pricing: [],
    availability: {
      type: "weekly",
      daysOfWeek: [1, 2, 3, 4, 5],
      timeSlots: [{ id: "1", time: "09:00", capacity: 10 }],
    },
    logistics: {
      howToGetThere: "meeting",
      meetingPoint: { address: "", description: "", arrivalOffset: "15" },
      pickup: { areas: "any", description: "", notifyWhen: "start", pickupOffset: "30", type: "anywhere", timeNotification: "at_start", timeOffset: "0-15" },
      dropoff: "same",
      transportation: []
    }
  });

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeSearchField, setActiveSearchField] = useState<string | null>(null);
  const searchTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const handleLocationSearch = (val: string, field: string) => {
    if (field === "meeting") {
      updateLogistics({ meetingPoint: { ...formData.logistics?.meetingPoint, address: val } });
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    
    if (val.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setActiveSearchField(field);
    searchTimeout.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=6&addressdetails=1`);
        const data = await response.json();
        setSuggestions(data);
        setShowDropdown(true);
      } catch (error) {
        console.error("Location search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);
  };

  const updateLogistics = (updates: any) => {
    setFormData({
      ...formData,
      logistics: { ...formData.logistics, ...updates } as any
    });
  };

  const selectLocation = (loc: any, field: string) => {
    if (field === "meeting") {
      updateLogistics({ meetingPoint: { ...formData.logistics?.meetingPoint, address: loc.display_name } });
    }
    setShowDropdown(false);
    setSuggestions([]);
  };

  const handleComplete = () => {
    if (!formData.referenceName) return;

    let durationValue = "";
    if (formData.type === "duration") {
      durationValue = `${formData.duration} ${formData.durationUnit?.charAt(0).toUpperCase()}${formData.durationUnit?.slice(1)}`;
    } else if (formData.type === "validity") {
      durationValue = `${formData.validityAmount} ${formData.validityUnit?.charAt(0).toUpperCase()}${formData.validityUnit?.slice(1)}`;
    }

    onComplete({
      ...formData,
      durationValue,
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
    } as ProductOption);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 bg-background p-8 rounded-3xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/20 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <h3 className="text-base font-semibold tracking-tight">Configuration Step {subStep}/4</h3>
             <div className="flex gap-1">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className={cn("h-1 rounded-full transition-all duration-300", i <= subStep ? "bg-primary w-6" : "bg-muted/30 w-1.5")} />
               ))}
             </div>
          </div>
          <p className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider">
            {subStep === 1 ? "Setup & Constraints" : subStep === 2 ? "Logistics & Points" : subStep === 3 ? "Availability" : "Pricing Architecture"}
          </p>
        </div>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground font-bold text-[10px] uppercase tracking-wider transition-colors">Cancel</button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 max-h-[60vh] custom-scrollbar">
        <div className="space-y-10 pb-8">
          
          {/* STEP 1 */}
          {subStep === 1 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-2 duration-300">
               <div className="space-y-6">
                  <div className="space-y-1 px-1 border-l-2 border-primary/20 pl-4">
                    <h4 className="text-sm font-bold uppercase tracking-tight">Basic Identification</h4>
                    <p className="text-[11px] text-muted-foreground font-medium italic">Name this specific variant for internal and external reference.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">Option Name</label>
                      <Input 
                        value={formData.referenceName}
                        onChange={(e) => setFormData({ ...formData, referenceName: e.target.value })}
                        placeholder="e.g., Afternoon Tour in French"
                        className="h-10 text-sm font-semibold rounded-xl bg-transparent"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">Ref Code (Optional)</label>
                      <Input 
                        value={formData.referenceCode}
                        onChange={(e) => setFormData({ ...formData, referenceCode: e.target.value })}
                        placeholder="e.g., AF-FR-01"
                        className="h-10 text-sm font-semibold rounded-xl bg-transparent"
                      />
                    </div>
                  </div>
                  <div className="w-40 space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">Max Guests</label>
                    <Select 
                      value={formData.maxGroupSize?.toString() || ""}
                      onValueChange={(val) => setFormData({ ...formData, maxGroupSize: parseInt(val as string) })}
                    >
                      <SelectTrigger className="h-10 text-sm font-semibold rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 5, 10, 15, 20, 50, 100].map(n => (
                          <SelectItem key={n} value={n.toString()}>{n} Pax</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
               </div>

               <div className="space-y-6 pt-6 border-t border-border/20">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold tracking-tight">Access & Type</h4>
                      <p className="text-[11px] text-muted-foreground font-medium italic leading-relaxed">Define the nature of participation.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 rounded-xl border border-border/40 flex items-center justify-between">
                        <div className="space-y-0.5">
                           <p className="text-xs font-bold">Private Activity</p>
                           <p className="text-[10px] text-muted-foreground/80 leading-tight">Exclusive for one group</p>
                        </div>
                        <Toggle enabled={!!formData.isPrivate} onChange={(val) => setFormData({ ...formData, isPrivate: val })} />
                     </div>
                     <div className="p-4 rounded-xl border border-border/40 flex items-center justify-between">
                        <div className="space-y-0.5">
                           <p className="text-xs font-bold">Wheelchair Accessible</p>
                           <p className="text-[10px] text-muted-foreground/80 leading-tight">Facilities for disabled</p>
                        </div>
                        <Toggle enabled={!!formData.isWheelchairAccessible} onChange={(val) => setFormData({ ...formData, isWheelchairAccessible: val })} />
                     </div>
                  </div>
               </div>

               <div className="space-y-6 pt-6 border-t border-border/20">
                  <div className="space-y-1 border-l-2 border-primary/20 pl-4">
                    <h4 className="text-sm font-bold uppercase tracking-tight">Duration & Validity</h4>
                    <p className="text-[11px] text-muted-foreground font-medium italic leading-relaxed">How long does the service last or remain valid?</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { id: "duration", label: "Fixed Duration", sub: "Specific time period" },
                      { id: "validity", label: "Validity Window", sub: "Ticket remains active" }
                    ].map(type => (
                      <button 
                        key={type.id}
                        onClick={() => setFormData({ ...formData, type: type.id as any })}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                          formData.type === type.id ? "border-primary bg-primary/[0.02]" : "border-border/40 hover:border-primary/20"
                        )}
                      >
                         <div className="space-y-0.5">
                            <p className={cn("text-xs font-bold", formData.type === type.id ? "text-primary" : "text-foreground")}>{type.label}</p>
                            <p className="text-[10px] text-muted-foreground/80">{type.sub}</p>
                         </div>
                         <div className={cn(
                           "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                           formData.type === type.id ? "border-primary bg-primary" : "border-border/40"
                         )}>
                           {formData.type === type.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                         </div>
                      </button>
                    ))}
                  </div>

                  {formData.type === "duration" && (
                    <div className="flex gap-2 animate-in slide-in-from-top-1">
                       <Input type="number" className="w-20 h-10 rounded-xl" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })} />
                       <Select 
                         value={formData.durationUnit || ""}
                         onValueChange={(val) => setFormData({ ...formData, durationUnit: val as any })}
                       >
                         <SelectTrigger className="w-32 h-10 rounded-xl">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="minutes">Minutes</SelectItem>
                           <SelectItem value="hours">Hours</SelectItem>
                           <SelectItem value="days">Days</SelectItem>
                         </SelectContent>
                       </Select>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* STEP 2 */}
          {subStep === 2 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-2 duration-300">
               <div className="space-y-6">
                  <div className="space-y-1 border-l-2 border-primary/20 pl-4">
                    <h4 className="text-sm font-bold uppercase tracking-tight">{labels.logistics || "Arrival Workflow"}</h4>
                    <p className="text-[11px] text-muted-foreground font-medium italic">Define how customers reach the activity.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { id: "meeting", label: "Meeting Point", sub: "Customers go to a set location" },
                      { id: "pickup", label: "Pickup Service", sub: "You collect them from areas" }
                    ].map((mode) => (
                      <button 
                        key={mode.id} 
                        onClick={() => updateLogistics({ howToGetThere: mode.id })}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                          formData.logistics?.howToGetThere === mode.id ? "border-primary bg-primary/[0.02]" : "border-border/40 hover:border-primary/20"
                        )}
                      >
                         <div className="space-y-0.5">
                            <p className={cn("text-xs font-bold", formData.logistics?.howToGetThere === mode.id ? "text-primary" : "text-foreground")}>{mode.label}</p>
                            <p className="text-[10px] text-muted-foreground/80 line-clamp-1">{mode.sub}</p>
                         </div>
                         <div className={cn(
                           "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                           formData.logistics?.howToGetThere === mode.id ? "border-primary bg-primary" : "border-border/40"
                         )}>
                           {formData.logistics?.howToGetThere === mode.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                         </div>
                      </button>
                    ))}
                  </div>

                  {formData.logistics?.howToGetThere === "meeting" && (
                    <div className="space-y-6 pt-4 animate-in slide-in-from-top-2">
                       <div className="space-y-1.5 relative">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">Search Address</label>
                          <Input 
                            placeholder="Full location address..." 
                            value={formData.logistics?.meetingPoint?.address} 
                            onChange={(e) => handleLocationSearch(e.target.value, "meeting")} 
                            className="h-10 pl-10 rounded-xl"
                          />
                          <MapPin className="absolute left-3.5 top-[34px] w-4 h-4 text-muted-foreground/30" />
                          
                          {showDropdown && activeSearchField === "meeting" && suggestions.length > 0 && (
                            <div className="absolute top-[100%] left-0 right-0 mt-2 bg-background rounded-xl shadow-xl border border-border/40 z-50 overflow-hidden">
                              {suggestions.map((loc, idx) => (
                                <div 
                                  key={idx}
                                  onClick={() => selectLocation(loc, "meeting")}
                                  className="flex items-start gap-3 p-3 hover:bg-muted/30 cursor-pointer transition-colors border-b border-border/10 last:border-0"
                                >
                                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                                  <div className="space-y-0">
                                    <p className="text-[12px] font-bold text-foreground leading-tight">{loc.display_name.split(',')[0]}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium line-clamp-1">{loc.display_name}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">Arrival Offset</label>
                          <Select 
                            value={formData.logistics?.meetingPoint?.arrivalOffset || ""}
                            onValueChange={(val) => updateLogistics({ meetingPoint: { ...formData.logistics?.meetingPoint, arrivalOffset: val as string } })} 
                          >
                            <SelectTrigger className="h-10 rounded-xl">
                              <SelectValue placeholder="Arrival time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">At start</SelectItem>
                              <SelectItem value="15">15 min before</SelectItem>
                              <SelectItem value="30">30 min before</SelectItem>
                            </SelectContent>
                          </Select>
                       </div>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* STEP 3 & 4 */}
          {subStep === 3 && (
            <div className="animate-in fade-in duration-300">
               <AvailabilityManager 
                option={formData as ProductOption} 
                onUpdate={(updates) => setFormData({ ...formData, ...updates })} 
               />
            </div>
          )}

          {subStep === 4 && (
            <div className="animate-in fade-in duration-300">
               <PricingManager 
                option={formData as ProductOption} 
                onUpdate={(updates) => setFormData({ ...formData, ...updates })} 
               />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between pt-6 border-t border-border/20 mt-auto">
        <Button variant="ghost" onClick={() => subStep === 1 ? onCancel() : setSubStep(s => s - 1)} className="rounded-full px-8 h-10 font-bold text-[11px] uppercase tracking-widest">
          {subStep === 1 ? "Discard" : "Previous"}
        </Button>
        <Button 
          disabled={subStep === 1 && !formData.referenceName} 
          onClick={() => subStep === 4 ? handleComplete() : setSubStep(s => s + 1)} 
          className="rounded-full px-10 h-10 bg-primary text-white font-bold text-[11px] uppercase tracking-widest"
        >
          {subStep === 4 ? "Initialize Option" : "Next Segment"}
        </Button>
      </div>
    </div>
  );
}
