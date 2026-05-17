"use client";

import React from "react";
import { useProductForm } from "@/hooks/useProductForm";
import { Plus, Globe2, Check } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

const DEFAULT_LANGUAGES = [
  { id: "English", label: "English", desc: "The activity will be conducted in English" },
  { id: "Spanish", label: "Spanish", desc: "The activity will be conducted in Spanish" },
  { id: "French", label: "French", desc: "The activity will be conducted in French" },
  { id: "German", label: "German", desc: "The activity will be conducted in German" },
];

export function Step1Language() {
  const { product, updateProduct } = useProductForm();
  const [customLanguages, setCustomLanguages] = React.useState<any[]>([]);
  const [newLangName, setNewLangName] = React.useState("");
  const [isAdding, setIsAdding] = React.useState(false);

  // Load custom languages from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("custom_languages");
    if (saved) {
      setCustomLanguages(JSON.parse(saved));
    }
  }, []);

  const allLanguages = [...DEFAULT_LANGUAGES, ...customLanguages];

  const handleAddLanguage = () => {
    if (!newLangName.trim()) return;
    
    const newLang = {
      id: newLangName.trim(),
      label: newLangName.trim(),
      desc: `The activity will be conducted in ${newLangName.trim()}`
    };
    
    const updated = [...customLanguages, newLang];
    setCustomLanguages(updated);
    localStorage.setItem("custom_languages", JSON.stringify(updated));
    updateProduct({ language: newLang.id });
    setNewLangName("");
    setIsAdding(false);
  };

  return (
    <div className="w-full max-w-2xl space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div className="space-y-1.5">
          <SectionHeader title="Primary Language" />
          <p className="text-sm text-muted-foreground font-medium italic leading-relaxed">
            Choose the primary language in which this activity will be delivered to customers.
          </p>
        </div>

        <div className="grid gap-3">
          {allLanguages.map((lang) => {
            const isSelected = product.language === lang.id;
            return (
              <label 
                key={lang.id} 
                className={cn(
                  "flex items-center gap-5 p-4 rounded-2xl cursor-pointer border transition-all duration-300 group",
                  isSelected 
                    ? "bg-primary/5 border-primary shadow-sm" 
                    : "bg-card border-border hover:border-primary/40 hover:bg-muted/30"
                )}
                onClick={() => updateProduct({ language: lang.id })}
              >
                <div 
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                    isSelected ? "border-primary bg-primary" : "border-border bg-background group-hover:border-primary/50"
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="space-y-0.5">
                  <p className={cn("text-[14px] font-bold tracking-tight transition-colors", isSelected ? "text-primary" : "text-foreground")}>
                    {lang.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground/70 font-medium italic">
                    {lang.desc}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        <div className="pt-4 border-t border-border/50">
          {isAdding ? (
            <div className="flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
              <Input 
                placeholder="Type language name..." 
                className="h-10 rounded-xl bg-muted/30 border-border focus:ring-primary/10" 
                value={newLangName}
                onChange={(e) => setNewLangName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddLanguage()}
                autoFocus
              />
              <Button onClick={handleAddLanguage} className="h-10 px-6 rounded-xl text-xs font-bold uppercase tracking-wider">Add</Button>
              <Button variant="ghost" onClick={() => setIsAdding(false)} className="h-10 px-4 rounded-xl text-xs font-bold text-muted-foreground uppercase tracking-wider">Cancel</Button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-3 text-primary font-bold text-[11px] uppercase tracking-wider hover:opacity-80 transition-opacity px-2 py-1"
            >
              <Plus className="w-4 h-4" /> Add custom language
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
