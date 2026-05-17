"use client";

import React, { useState } from "react";
import { X, Search, Sparkles, Plus, HelpCircle, ChevronRight, ChevronDown, Info, Check, SearchIcon, Target } from "lucide-react";
import { useProductForm } from "@/hooks/useProductForm";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

const KEYWORD_CATEGORIES = [
  { id: "animals", label: "Animals & wildlife" },
  { id: "art", label: "Art & architecture", count: 1, active: true },
  { id: "entertainment", label: "Entertainment" },
  { id: "festivals", label: "Festivals & holidays" },
  { id: "food", label: "Food & drink" },
  { id: "history", label: "History" },
  { id: "religion", label: "Local culture & religion" },
  { id: "nature", label: "Nature" },
  { id: "science", label: "Science & literature" },
  { id: "sightseeing", label: "Sightseeing" },
  { id: "sport", label: "Sport & wellness" },
  { id: "travel", label: "Travel services" },
  { id: "workshops", label: "Workshops & classes" },
];

const KEYWORDS_POOL = {
  art: [
    "Architecture", "Art nouveau", "Gothic", "Soviet Architecture", "Baroque", 
    "Historic Buildings", "Gaudi", "Skyline", "Art deco", "Moorish Architecture", 
    "Antoni Gaudi", "Bauhaus", "Skyscrapers", "wooden architecture"
  ],
  sightseeing: ["Walking Tour", "City Tour", "Hidden Gems", "Old Town"],
};

const SUGGESTIONS = ["Culture", "City Tour", "Walking Tour", "Old Town", "Hidden Gems", "Jewish Quarter", "Local Guides"];

export function Step3Keywords() {
  const { product, updateProduct } = useProductForm();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [categories, setCategories] = useState(KEYWORD_CATEGORIES);
  const [pool, setPool] = useState<Record<string, string[]>>(KEYWORDS_POOL);
  const [activeCategory, setActiveCategory] = useState("art");
  const [searchQuery, setSearchQuery] = useState("");
  const [newCatName, setNewCatName] = useState("");

  const toggleKeyword = (kw: string) => {
    const current = product.keywords || [];
    const updated = current.includes(kw)
      ? current.filter(k => k !== kw)
      : current.length < 15 ? [...current, kw] : current;
    updateProduct({ keywords: updated });
  };

  return (
    <div className="w-full max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      
      {/* SEO Section */}
      <div className="space-y-6">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Search Engine Optimization</label>
          <h2 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" /> Meta Optimization
          </h2>
          <p className="text-sm text-muted-foreground font-medium italic">Define how your activity appears in search results.</p>
        </div>

        <div className="grid gap-6">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Meta Title</label>
              <span className={cn("text-[9px] font-semibold", (product.metaTitle?.length || 0) > 60 ? "text-destructive" : "text-emerald-600")}>
                {product.metaTitle?.length || 0} / 60
              </span>
            </div>
            <Input 
              value={product.metaTitle || ""}
              onChange={(e) => updateProduct({ metaTitle: e.target.value })}
              placeholder="Recommended: 50-60 characters..."
              className="h-11 rounded-xl bg-transparent border-border/40 focus:border-primary/40 text-sm font-medium transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Meta Description</label>
              <span className={cn("text-[9px] font-semibold", (product.metaDescription?.length || 0) > 160 ? "text-destructive" : "text-emerald-600")}>
                {product.metaDescription?.length || 0} / 160
              </span>
            </div>
            <textarea
              rows={3}
              value={product.metaDescription || ""}
              onChange={(e) => updateProduct({ metaDescription: e.target.value })}
              placeholder="Recommended: 150-160 characters..."
              className="w-full p-3.5 rounded-xl border border-border/40 bg-transparent focus:border-primary/40 outline-none resize-none transition-all text-sm font-medium leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Keywords Section */}
      <div className="space-y-6 pt-6 border-t border-border/20">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Discoverability Tags</label>
            <Badge variant="secondary" className="text-[8px] font-bold uppercase tracking-wider bg-primary/5 text-primary border-none">
              {(product.keywords || []).length} / 15 tags
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            Strategic keywords help improve internal categorization and discovery.
          </p>
        </div>

        <div className="space-y-4">
           <div className="relative min-h-[48px] p-2.5 rounded-xl border border-border/40 bg-transparent flex flex-wrap gap-2 items-center transition-all focus-within:border-primary/20">
              {(product.keywords || []).map(kw => (
                <div key={kw} className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/5 rounded-full text-xs font-semibold text-primary border border-primary/10">
                  {kw}
                  <X className="w-3 h-3 cursor-pointer opacity-50 hover:opacity-100" onClick={() => toggleKeyword(kw)} />
                </div>
              ))}
              <div className="flex items-center flex-1 min-w-[120px]">
                <SearchIcon className="w-3.5 h-3.5 text-muted-foreground/40 mr-2" />
                <input 
                  className="w-full h-8 bg-transparent outline-none text-sm font-medium placeholder:text-muted-foreground/40"
                  placeholder="Add custom tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      toggleKeyword(searchQuery.trim());
                      setSearchQuery("");
                    }
                  }}
                />
              </div>
           </div>
           
           <div className="flex justify-start">
              <button 
                onClick={() => setShowAdvanced(true)}
                className="text-[9px] font-bold uppercase tracking-wider text-primary hover:opacity-70 flex items-center gap-2 transition-opacity"
              >
                <Sparkles className="w-3 h-3" /> Explorer Tag Library
              </button>
           </div>
        </div>

        {/* Quick Suggestions */}
        <div className="space-y-3 p-5 rounded-2xl bg-muted/10 border border-border/20">
           <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-wider text-center">Frequently Used</p>
           <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map(s => {
                const isSelected = (product.keywords || []).includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleKeyword(s)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-semibold transition-all border",
                      isSelected
                        ? "bg-primary border-primary text-white"
                        : "bg-transparent border-border/40 text-muted-foreground hover:border-primary/20 hover:text-primary"
                    )}
                  >
                    {s}
                  </button>
                );
              })}
           </div>
        </div>
      </div>

      {/* Minimal Advanced Explorer Modal */}
      {showAdvanced && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-20 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-xl" onClick={() => setShowAdvanced(false)} />
          
          <div className="relative w-full max-w-4xl bg-background rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-400 border border-border/40">
             <div className="px-8 py-6 border-b border-border/20 flex justify-between items-center">
                <div className="space-y-0.5">
                   <h2 className="text-lg font-bold tracking-tight">Tag Library</h2>
                   <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Activity Context Explorer</p>
                </div>
                <button onClick={() => setShowAdvanced(false)} className="rounded-full h-8 w-8 hover:bg-muted flex items-center justify-center transition-colors">
                   <X className="w-4 h-4 text-muted-foreground" />
                </button>
             </div>

             <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] h-full">
                   {/* Sidebar */}
                   <div className="border-r border-border/20 bg-muted/[0.02] overflow-y-auto py-4 flex flex-col gap-0.5">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          className={cn(
                            "w-full px-8 py-3 flex items-center justify-between text-left transition-all border-l-2",
                            activeCategory === cat.id 
                              ? "text-primary border-primary font-bold bg-primary/[0.02]" 
                              : "text-muted-foreground border-transparent hover:bg-muted/30 font-semibold"
                          )}
                        >
                          <span className="text-[12px] tracking-tight">{cat.label}</span>
                        </button>
                      ))}
                   </div>

                   {/* Content Area */}
                   <div className="p-10 overflow-y-auto bg-transparent">
                      <div className="space-y-10">
                         <div className="flex items-center justify-between gap-4">
                            <h3 className="text-[10px] font-bold text-primary uppercase tracking-wider">{categories.find(c => c.id === activeCategory)?.label}</h3>
                            <div className="h-px bg-border/20 flex-1" />
                            <div className="flex items-center gap-2">
                              <input 
                                type="text"
                                placeholder="Add new keyword..."
                                className="bg-transparent border-b border-border/40 text-xs py-1 outline-none focus:border-primary/40 transition-all w-32 placeholder:text-[10px]"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                    const val = e.currentTarget.value.trim();
                                    setPool(prev => ({
                                      ...prev,
                                      [activeCategory]: [...(prev[activeCategory] || []), val]
                                    }));
                                    toggleKeyword(val);
                                    e.currentTarget.value = "";
                                  }
                                }}
                              />
                              <Plus className="w-3 h-3 text-muted-foreground/40" />
                            </div>
                         </div>
                         
                         <div className="flex flex-wrap gap-2.5">
                            {(pool[activeCategory] || []).map(kw => {
                              const isSelected = (product.keywords || []).includes(kw);
                              return (
                                <button
                                  key={kw}
                                  onClick={() => toggleKeyword(kw)}
                                  className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-semibold transition-all border",
                                    isSelected
                                      ? "bg-primary border-primary text-white"
                                      : "bg-transparent border-border/40 text-foreground hover:border-primary/30"
                                  )}
                                >
                                  {kw}
                                </button>
                              );
                            })}
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="px-8 py-6 border-t border-border/20 bg-muted/[0.02] flex justify-between items-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                   Selected: <span className="text-primary">{(product.keywords || []).length} / 15</span>
                </div>
                <Button size="sm" onClick={() => setShowAdvanced(false)} className="rounded-full px-8 h-9 font-bold text-xs uppercase tracking-wider">
                   Done
                </Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
