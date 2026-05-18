"use client";

import React from "react";
import { ImagePlus, MapPin, X, Info, Sparkles, Languages, Coins, Plus } from "lucide-react";
import { useProductForm } from "@/hooks/useProductForm";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { ImageUploadModal } from "./ImageUploadModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function Step2MainInfo() {
  const { product, updateProduct } = useProductForm();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleImageUpdate = (images: string[], coverImage?: string) => {
    updateProduct({ images, coverImage });
  };

  const handleHighlightInput = (value: string) => {
    const lines = value.split("\n");
    const formattedLines = lines.map(line => {
      if (line.trim() && !line.startsWith("• ")) {
        return "• " + line.trim();
      }
      return line;
    });
    updateProduct({ highlights: formattedLines });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;
      const newValue = value.substring(0, start) + "\n• " + value.substring(end);
      const lines = newValue.split("\n");
      updateProduct({ highlights: lines });
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 3;
      }, 0);
    }
  };

  const [suggestions, setSuggestions] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const searchTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const handleLocationChange = (val: string) => {
    updateProduct({ location: val });
    
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    
    if (val.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

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

  const selectLocation = (loc: any) => {
    updateProduct({ location: loc.display_name });
    setShowDropdown(false);
    setSuggestions([]);
  };

  return (
    <div className="w-full max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <ImageUploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        images={product.images || []}
        coverImage={product.coverImage}
        onUpdate={handleImageUpdate}
      />

      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_160px] gap-6">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">
             Activity Title
          </label>
          <Input 
            value={product.title}
            onChange={(e) => updateProduct({ title: e.target.value })}
            placeholder="e.g., Sunset Sailing Tour in Santorini"
            className="h-11 text-base font-semibold rounded-xl bg-transparent border-border/40 focus:border-primary/50 transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">
            Currency
          </label>
          <select 
            value={product.currency}
            onChange={(e) => updateProduct({ currency: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-border/40 bg-transparent outline-none font-semibold text-sm focus:border-primary/50 transition-all appearance-none cursor-pointer"
          >
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
            <option value="GBP">GBP (£)</option>
            <option value="AED">AED (د.إ)</option>
          </select>
        </div>
      </div>

      {/* Photos Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Media Assets
          </label>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-[9px] font-bold uppercase tracking-wider text-primary hover:opacity-70 transition-opacity"
          >
            Edit Gallery
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="aspect-square rounded-xl bg-muted/20 border border-dashed border-border/40 flex flex-col items-center justify-center gap-1.5 hover:bg-primary/[0.02] hover:border-primary/20 transition-all group"
          >
            <Plus className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary transition-colors" />
            <span className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-wider group-hover:text-primary">Add</span>
          </button>
          
          {product.images?.map((img, i) => {
            const isCover = product.coverImage === img;
            return (
              <div key={i} className={cn(
                "aspect-square rounded-xl bg-muted relative overflow-hidden group border transition-all duration-300",
                isCover ? "border-primary shadow-sm" : "border-border/20 hover:border-primary/20"
              )}>
                <img src={img} alt={`Product ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {isCover && (
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-primary text-white text-[7px] font-bold uppercase tracking-wider rounded shadow-sm">
                    Cover
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Descriptions */}
      <div className="space-y-8 pt-4">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">Short Description</label>
            <textarea
              rows={2}
              value={product.shortDescription}
              onChange={(e) => updateProduct({ shortDescription: e.target.value })}
              placeholder="Concise summary for listings..."
              className="w-full p-4 rounded-xl border border-border/40 bg-transparent focus:border-primary/30 outline-none resize-none transition-all text-sm font-medium leading-relaxed"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">Experience Narrative</label>
            <textarea
              rows={5}
              value={product.longDescription}
              onChange={(e) => updateProduct({ longDescription: e.target.value })}
              placeholder="Tell the detailed story of this experience..."
              className="w-full p-4 rounded-xl border border-border/40 bg-transparent focus:border-primary/30 outline-none resize-none transition-all text-sm font-medium leading-relaxed"
            />
          </div>
        </div>

        <div className="space-y-2 pt-6 border-t border-border/20">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">Key Highlights</label>
          <textarea
            rows={4}
            value={product.highlights?.join("\n") || ""}
            onChange={(e) => handleHighlightInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="• Feature one&#10;• Feature two"
            className="w-full p-4 rounded-xl border border-border/40 bg-transparent focus:border-primary/30 outline-none resize-none transition-all text-sm font-semibold leading-relaxed"
          />
        </div>
      </div>

      {/* Location Section */}
      <div className="space-y-3 pt-6 border-t border-border/20">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">Geographic Focus</label>
        <div className="relative group">
          <Input 
            placeholder="City, landmark or region..."
            className="pl-10 h-11 rounded-xl bg-transparent border-border/40 text-sm font-semibold"
            value={product.location}
            onChange={(e) => handleLocationChange(e.target.value)}
          />
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 group-focus-within:text-primary transition-colors" />
          
          {isSearching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-primary/10 border-t-primary rounded-full animate-spin" />
            </div>
          )}

          {showDropdown && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-background rounded-xl shadow-xl border border-border/40 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
              {suggestions.map((loc, idx) => (
                <div 
                  key={idx}
                  onClick={() => selectLocation(loc)}
                  className="flex items-start gap-3 p-3 hover:bg-muted/30 cursor-pointer transition-colors border-b border-border/10 last:border-0"
                >
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-0">
                    <p className="text-[12px] font-semibold text-foreground leading-tight">{loc.display_name.split(',')[0]}</p>
                    <p className="text-[10px] text-muted-foreground font-medium line-clamp-1">{loc.display_name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
