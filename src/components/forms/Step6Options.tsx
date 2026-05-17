"use client";

import React, { useState } from "react";
import { PlusCircle, Layers, Sparkles, Plus, PackageOpen } from "lucide-react";
import { useProductForm } from "@/hooks/useProductForm";
import { OptionList } from "./options/OptionList";
import { OptionWizard } from "./options/OptionWizard";
import { ProductOption } from "@/types/product";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

export function Step6Options() {
  const { product, addOption, removeOption, updateOption } = useProductForm();
  const [showWizard, setShowWizard] = useState(false);
  const [editingOption, setEditingOption] = useState<ProductOption | null>(null);

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    product.options.length > 0 ? product.options[0].id : null
  );

  const handleAddOption = (option: ProductOption) => {
    addOption(option);
    setSelectedOptionId(option.id);
    setShowWizard(false);
  };

  const handleUpdateOption = (option: ProductOption) => {
    updateOption(option.id, option);
    setEditingOption(null);
  };

  return (
    <div className="w-full max-w-4xl space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Option Creation Modal */}
      <Modal 
        isOpen={showWizard || !!editingOption} 
        onClose={() => {
          setShowWizard(false);
          setEditingOption(null);
        }}
        maxWidth="max-w-[800px]"
      >
        <OptionWizard 
          initialData={editingOption || undefined}
          onComplete={editingOption ? handleUpdateOption : handleAddOption} 
          onCancel={() => {
            setShowWizard(false);
            setEditingOption(null);
          }} 
        />
      </Modal>

      {product.options.length > 0 && (
        <div className="flex items-center justify-between px-1">
          <div className="space-y-0.5">
            <h3 className="text-lg font-bold tracking-tight">Package Options</h3>
            <p className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider">{product.options.length} {product.options.length === 1 ? 'Variant' : 'Variants'} Initialized</p>
          </div>
          <button 
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-wider hover:opacity-70 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Variant
          </button>
        </div>
      )}

      <div className="animate-in slide-in-from-bottom-2 duration-500">
        <OptionList 
          options={product.options} 
          selectedId={selectedOptionId}
          onSelect={setSelectedOptionId}
          onRemove={(id) => {
            removeOption(id);
            if (selectedOptionId === id) {
              setSelectedOptionId(product.options.find(o => o.id !== id)?.id || null);
            }
          }} 
          onEdit={(id) => { 
            const opt = product.options.find(o => o.id === id);
            if (opt) setEditingOption(opt);
          }} 
        />
      </div>

      {product.options.length === 0 && (
        <div className="w-full py-20 px-8 rounded-[32px] border-2 border-dashed border-border/40 flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-500">
          <div className="w-16 h-16 rounded-2xl bg-primary/[0.03] flex items-center justify-center text-primary border border-primary/10">
             <Layers className="w-8 h-8 opacity-40" />
          </div>
          
          <div className="max-w-md space-y-2">
            <h3 className="text-xl font-bold tracking-tight">Configure Service Variants</h3>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Define the specific durations, group sizes, and pricing models that make up your booking options.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full max-w-md">
            {[
              "Durations",
              "Group Limits",
              "Pricing Models",
              "Inclusions"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl border border-border/40 text-[11px] font-bold text-muted-foreground/80">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" /> {item}
              </div>
            ))}
          </div>

          <Button 
            onClick={() => setShowWizard(true)}
            className="h-11 px-10 rounded-full font-bold text-[10px] uppercase tracking-wider bg-primary text-white shadow-lg shadow-primary/10"
          >
            Add First Option
          </Button>
        </div>
      )}
    </div>
  );
}
