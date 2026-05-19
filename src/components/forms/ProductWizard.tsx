"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, ChevronLeft, Save, Layout, Info, Loader2, Sparkles, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Step1Language } from "@/components/forms/Step1LanguageCategory";
import { Step2Category } from "@/components/forms/Step2Category";
import { Step2MainInfo } from "@/components/forms/Step2MainInfo";
import { Step3Keywords } from "@/components/forms/Step3Keywords";
import { Step4Inclusions } from "@/components/forms/Step4Inclusions";
import { Step5ExtraInfo } from "@/components/forms/Step5ExtraInfo";
import { Step6Options } from "@/components/forms/Step6Options";
import { Step6Itinerary } from "@/components/forms/Step6Itinerary";
import { Step8Liability as Step9Liability } from "@/components/forms/Step8Liability";
import { SummaryDashboard } from "@/components/forms/SummaryDashboard";
import { useProductForm } from "@/hooks/useProductForm";
import { Badge } from "@/components/ui/Badge";

import { CATEGORY_CONFIGS, CategoryId } from "@/constants/categoryConfig";

const ALL_STEPS = [
  { id: 1, title: "Language Selection", desc: "Basic setup" },
  { id: 2, title: "Product Category", desc: "Category selection" },
  { id: 3, title: "Main Information", desc: "Title & Images" },
  { id: 4, title: "SEO Keywords", desc: "Search visibility" },
  { id: 5, title: "Inclusions", desc: "What's included" },
  { id: 6, title: "Extra Info", desc: "Safety & Fitness" },
  { id: 7, title: "Tour Itinerary", desc: "Route & Stops" },
  { id: 8, title: "Product Options", desc: "Variants & Pricing" },
  { id: 9, title: "Confirm Agreement", desc: "Terms & Refund" },
  { id: 10, title: "Review & Finish", desc: "Product Overview" },
];

export function ProductWizard({ isEdit = false, onSuccess }: { isEdit?: boolean; onSuccess?: () => void }) {
  const router = useRouter();
  const { product, isSubmitting, submitProduct } = useProductForm();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const categoryId = (product.category as CategoryId) || "others";
  const config = CATEGORY_CONFIGS[categoryId] || CATEGORY_CONFIGS.others;
  
  const STEPS = ALL_STEPS.filter((_, idx) => config.allowedSteps.includes(idx));

  React.useEffect(() => {
    const event = new CustomEvent("wizard-step-change", {
      detail: { 
        title: STEPS[currentStepIndex].title, 
        desc: STEPS[currentStepIndex].desc 
      }
    });
    window.dispatchEvent(event);
  }, [currentStepIndex, STEPS]);

  const renderStep = () => {
    const actualStep = ALL_STEPS.indexOf(STEPS[currentStepIndex]);
    
    switch (actualStep) {
      case 0: return <Step1Language />;
      case 1: return <Step2Category />;
      case 2: return <Step2MainInfo />;
      case 3: return <Step3Keywords />;
      case 4: return <Step4Inclusions />;
      case 5: return <Step5ExtraInfo />;
      case 6: return <Step6Itinerary />;
      case 7: return <Step6Options />;
      case 8: return <Step9Liability />;
      case 9: return <SummaryDashboard />;
      default: return null;
    }
  };

  const totalSteps = STEPS.length;

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    let result;
    if (product.status !== "pending") {
      result = await submitProduct({ ...product, status: "pending" });
    } else {
      result = await submitProduct();
    }
    
    if (result) {
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/products");
      }
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-500 pb-36">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 items-start">
        {/* Progress Sidebar */}
        <aside className="lg:sticky lg:top-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-gray/60 px-4">
              <LayoutGrid className="w-3.5 h-3.5" /> Progress Tracker
            </div>
            
            <div className="flex flex-col gap-1.5">
              {STEPS.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isActive = idx === currentStepIndex;

                return (
                  <button
                    key={step.id}
                    onClick={() => idx < currentStepIndex && setCurrentStepIndex(idx)}
                    disabled={!isCompleted && !isActive}
                    className={cn(
                      "group w-full flex items-center gap-4 px-4 py-2.5 rounded-full transition-all text-left relative active:scale-95",
                      isActive 
                        ? "bg-brand-light text-brand-black shadow-sm" 
                        : isCompleted 
                          ? "text-brand-black hover:bg-brand-light/40" 
                          : "text-brand-gray/60",
                    )}
                  >
                    <div className={cn(
                      "w-6.5 h-6.5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all duration-300 border border-brand-border",
                      isCompleted ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : 
                      isActive ? "bg-brand-black text-white border-transparent" : "bg-transparent text-brand-gray/50"
                    )}>
                      {isCompleted ? <Check className="w-3 h-3" /> : idx + 1}
                    </div>
                    <div className="space-y-0.5 overflow-hidden">
                      <p className={cn(
                        "text-[12px] font-bold tracking-tight truncate transition-colors leading-none",
                        isActive ? "text-brand-black" : "text-brand-black/80 group-disabled:text-brand-gray/40"
                      )}>
                        {step.title}
                      </p>
                      <p className={cn(
                        "text-[8.5px] font-bold uppercase tracking-widest truncate leading-none mt-0.5",
                        isActive ? "text-brand-gray" : "text-brand-gray/60 group-disabled:text-brand-gray/30"
                      )}>{step.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Minimal Content Area */}
        <main className="animate-in slide-in-from-right-2 duration-500 bg-white">
           {renderStep()}
        </main>
      </div>

      {/* Floating Minimal Footer */}
      <footer className="fixed bottom-6 left-1/2 lg:left-[calc(50%+140px)] -translate-x-1/2 w-[calc(100%-3rem)] max-w-4xl z-[100]">
        <div className="bg-white/85 backdrop-blur-md border border-brand-border rounded-full p-3.5 flex items-center justify-between shadow-2xl shadow-brand-black/5">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleBack} 
            disabled={currentStepIndex === 0}
            className="rounded-full px-6 h-11 gap-2 font-bold text-[11px] uppercase tracking-wider disabled:opacity-20"
          >
            <ChevronLeft className="w-4 w-4" /> Back
          </Button>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-full px-6 h-11 font-bold text-[11px] uppercase tracking-wider border-brand-border text-brand-black hover:bg-brand-light"
            >
              Save Draft
            </Button>
            
            {currentStepIndex === totalSteps - 1 ? (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                size="sm"
                className="rounded-full px-8 h-11 bg-brand-black text-white hover:bg-brand-black/90 font-bold text-[11px] uppercase tracking-wider active:scale-95 transition-all shadow-sm"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>{(product.status === "pending" || product.status === "published") ? "Update Experience" : "Submit for Approval"}</>
                )}
              </Button>
            ) : (
              <Button 
                onClick={handleNext} 
                size="sm"
                className="rounded-full px-8 h-11 bg-brand-black text-white hover:bg-brand-black/90 font-bold text-[11px] uppercase tracking-wider gap-2 active:scale-95 transition-all shadow-sm"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
