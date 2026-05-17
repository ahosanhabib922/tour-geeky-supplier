"use client";

import React from "react";
import { useProductForm } from "@/hooks/useProductForm";
import { CheckCircle2, Info, MapPin, Clock, Users, Shield, DollarSign, Plus, Sparkles, Image as ImageIcon, ListChecks, CalendarRange, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

import { CATEGORY_CONFIGS, CategoryId } from "@/constants/categoryConfig";

export function SummaryDashboard() {
  const { product } = useProductForm();
  const categoryId = (product.category as CategoryId) || "others";
  const config = CATEGORY_CONFIGS[categoryId] || CATEGORY_CONFIGS.others;
  const labels = config.labels || {};
  const allowedSteps = config.allowedSteps;

  const Section = ({ label, icon: Icon, children, stepIndex }: { label: string; icon: any; children: React.ReactNode; stepIndex?: number }) => {
    if (stepIndex !== undefined && !allowedSteps.includes(stepIndex)) return null;
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-8 py-8 border-b border-border/20 first:pt-0 last:border-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary/70">
            <Icon className="w-3.5 h-3.5" /> {label}
          </div>
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in duration-700 pb-32">
      {/* Header Summary */}
      <div className="mb-12 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">{product.title || "Untitled Product"}</h1>
            <Badge variant={product.status === "published" ? "default" : "secondary"} className="h-5 px-2 text-[8px] font-bold uppercase tracking-wider rounded-md">
              {product.status || "Draft"}
            </Badge>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
             <span className="flex items-center gap-1.5"><Info className="w-3 h-3 opacity-40" /> ID: {Math.floor(Math.random() * 1000000)}</span>
             <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3 opacity-40" /> {product.language || "English"}</span>
          </div>
        </div>
      </div>

      {/* Cardless Main Content Grid */}
      <div className="space-y-0">
        <Section label="Geographic" icon={MapPin} stepIndex={2}>
          <div className="py-2">
            <p className="text-base font-semibold text-primary tracking-tight">
              {product.location || "Location not specified"}
            </p>
          </div>
        </Section>

        <Section label="Narrative" icon={Sparkles} stepIndex={3}>
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider">Listing Summary</label>
              <p className="text-sm font-semibold leading-relaxed">{product.shortDescription || "No summary provided."}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider">Detailed Story</label>
              <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium">{product.longDescription || "No detailed description provided."}</p>
            </div>
          </div>
          {(product.keywords && product.keywords.length > 0) && (
            <div className="flex flex-wrap gap-1.5 pt-4">
              {product.keywords.map((k, i) => (
                <span key={i} className="text-[10px] font-bold text-primary/60">
                  #{k.replace(/\s+/g, '')}
                </span>
              ))}
            </div>
          )}
        </Section>

        {(product.images && product.images.length > 0) && (
          <Section label="Media" icon={ImageIcon} stepIndex={2}>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
               {product.images.map((img, i) => (
                 <div key={i} className="aspect-square rounded-lg overflow-hidden border border-border/20 group transition-all duration-300">
                    <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 </div>
               ))}
            </div>
          </Section>
        )}

        {(product.highlights && product.highlights.length > 0) && (
          <Section label="Highlights" icon={ListChecks} stepIndex={2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {product.highlights.map((h, i) => (
                <div key={i} className="text-sm font-semibold flex items-center gap-3 py-1">
                  <div className="w-1 h-1 rounded-full bg-primary/40" /> {h.replace("• ", "")}
                </div>
              ))}
            </div>
          </Section>
        )}

        {(product.itinerary && product.itinerary.length > 0) && (
          <Section label="Experience" icon={CalendarRange} stepIndex={6}>
            <div className="space-y-8 relative pl-6 pt-2">
              <div className="absolute left-[2.5px] top-4 bottom-4 w-[1.5px] bg-border/20 rounded-full" />
              {product.itinerary.map((item, i) => (
                <div key={i} className="relative group">
                  <div className={cn(
                    "absolute -left-[27px] top-1 w-4 h-4 rounded-full border-2 bg-background z-10 flex items-center justify-center transition-all duration-300",
                    item.type === "start" ? "border-primary" : 
                    item.type === "end" ? "border-foreground bg-foreground" : 
                    "border-border group-hover:border-primary/30"
                  )}>
                    {item.type === "start" && <div className="w-1 h-1 rounded-full bg-primary" />}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold tracking-tight">{item.title}</h4>
                    {item.locationName && (
                      <div className="text-[10px] font-bold text-primary/40 uppercase flex items-center gap-1.5">
                        <MapPin className="w-2.5 h-2.5" /> {item.locationName}
                      </div>
                    )}
                    {item.description && (
                      <p className="text-[12px] text-muted-foreground/80 font-medium leading-relaxed max-w-xl">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section label="Logistics" icon={Shield} stepIndex={4}>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider">Inclusions</p>
                 <div className="space-y-1.5">
                    {product.inclusions?.map((item, i) => (
                      <div key={i} className="text-[12px] font-semibold flex items-start gap-2.5 text-foreground/70">
                         <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-500/60" /> {item.replace("• ", "")}
                      </div>
                    )) || <p className="text-xs text-muted-foreground italic">None</p>}
                 </div>
              </div>
              <div className="space-y-4">
                 <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider">Exclusions</p>
                 <div className="space-y-1.5">
                    {product.exclusions?.map((item, i) => (
                      <div key={i} className="text-[12px] font-medium flex items-start gap-2.5 text-muted-foreground/60">
                         <div className="w-3.5 h-3.5 rounded-full border border-border/40 flex items-center justify-center shrink-0 mt-0.5"><div className="w-1.5 h-[1px] bg-muted-foreground/40" /></div> {item.replace("• ", "")}
                      </div>
                    )) || <p className="text-xs text-muted-foreground italic">None</p>}
                 </div>
              </div>
           </div>
        </Section>

        <Section label="Variants" icon={Layers} stepIndex={6}>
           <div className="space-y-3">
              {product.options.map((opt, i) => (
                <div key={i} className="p-6 rounded-2xl border border-border/20 bg-transparent space-y-6">
                  <div className="flex items-center justify-between border-b border-border/10 pb-4">
                     <h4 className="text-base font-bold tracking-tight text-primary">{opt.referenceName}</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="space-y-1">
                        <p className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-wider">Entry Price</p>
                        <p className="text-base font-bold text-foreground">{product.currency} {opt.pricing?.[0]?.ageGroups?.[0]?.price || 0}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-wider">Duration</p>
                        <p className="text-xs font-semibold flex items-center gap-1.5"><Clock className="w-3 h-3 text-primary/40" /> {opt.type === "duration" ? `${opt.duration} ${opt.durationUnit}` : `${opt.validityAmount} ${opt.validityUnit}`}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-wider">Group Limit</p>
                        <p className="text-xs font-semibold flex items-center gap-1.5"><Users className="w-3 h-3 text-primary/40" /> {opt.maxGroupSize} Guests</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-wider">Logistics</p>
                        <p className="text-xs font-semibold truncate">{opt.logistics.howToGetThere === "meeting" ? "Meeting Point" : "Pickup Service"}</p>
                      </div>
                  </div>
                </div>
              ))}
              {product.options.length === 0 && <div className="text-center py-8 text-[10px] font-bold text-muted-foreground/20 uppercase tracking-widest">No variants configured</div>}
           </div>
        </Section>
      </div>
    </div>
  );
}
