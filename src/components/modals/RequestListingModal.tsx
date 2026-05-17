import React, { useState } from "react";
import { X, Check, ChevronLeft, ChevronRight, Sparkles, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface RequestListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function RequestListingModal({
  isOpen,
  onClose,
  onSubmit,
}: RequestListingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    category: "water-sports",
    price: "",
    language: "English",
    shortDescription: "",
    longDescription: "",
    keywords: [] as string[],
    inclusions: [] as string[],
    exclusions: [] as string[],
    fitnessLevel: "easy",
    safetyDetails: "",
    cancellationPolicy: "standard",
    options: [] as { name: string; price: number; duration: string }[],
  });

  // State inputs for lists
  const [keywordInput, setKeywordInput] = useState("");
  const [inclusionInput, setInclusionInput] = useState("");
  const [exclusionInput, setExclusionInput] = useState("");
  
  // Option inputs
  const [optionName, setOptionName] = useState("");
  const [optionPrice, setOptionPrice] = useState("");
  const [optionDuration, setOptionDuration] = useState("");

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) return;
    onSubmit(formData);
    // Reset state
    setFormData({
      title: "",
      category: "water-sports",
      price: "",
      language: "English",
      shortDescription: "",
      longDescription: "",
      keywords: [],
      inclusions: [],
      exclusions: [],
      fitnessLevel: "easy",
      safetyDetails: "",
      cancellationPolicy: "standard",
      options: [],
    });
    setCurrentStep(1);
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData({ ...formData, keywords: [...formData.keywords, keywordInput.trim()] });
      setKeywordInput("");
    }
  };

  const addInclusion = () => {
    if (inclusionInput.trim()) {
      setFormData({ ...formData, inclusions: [...formData.inclusions, inclusionInput.trim()] });
      setInclusionInput("");
    }
  };

  const addExclusion = () => {
    if (exclusionInput.trim()) {
      setFormData({ ...formData, exclusions: [...formData.exclusions, exclusionInput.trim()] });
      setExclusionInput("");
    }
  };

  const addOption = () => {
    if (optionName && optionPrice && optionDuration) {
      setFormData({
        ...formData,
        options: [
          ...formData.options,
          { name: optionName, price: parseFloat(optionPrice), duration: optionDuration },
        ],
      });
      setOptionName("");
      setOptionPrice("");
      setOptionDuration("");
    }
  };

  const removeOption = (idx: number) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== idx),
    });
  };

  const STEPS = [
    { num: 1, title: "Basic Setup", desc: "Language & Category" },
    { num: 2, title: "Main Info", desc: "Title, Price & Cover" },
    { num: 3, title: "Keywords & Inclusions", desc: "Search & Features" },
    { num: 4, title: "Safety & Info", desc: "Restrictions & Fitness" },
    { num: 5, title: "Pricing Options", desc: "Tours variants" },
    { num: 6, title: "Verify & Launch", desc: "Final agreement" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/30 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-5xl h-[90vh] bg-white border border-zinc-200 shadow-2xl rounded-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header Title */}
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50 shrink-0">
          <div>
            <h3 className="font-bold text-sm text-zinc-900 leading-tight">Create New Activity Listing</h3>
            <span className="text-[10px] uppercase font-bold text-zinc-400 mt-1 block">Step {currentStep} of 6 — Product Creation Wizard</span>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-lg transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Wizard Main Shell (Sidebar Nav + Form contents) */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left progress sidebar */}
          <aside className="w-72 border-r border-zinc-100 bg-zinc-50/30 p-6 hidden md:flex flex-col gap-1.5 shrink-0 overflow-y-auto">
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2 mb-4">Wizard Progress</h3>
            {STEPS.map((s) => {
              const isCompleted = s.num < currentStep;
              const isActive = s.num === currentStep;
              return (
                <div
                  key={s.num}
                  className={`flex items-center gap-3.5 p-3 rounded-xl transition-all ${
                    isActive ? "bg-zinc-100 text-zinc-900" : "text-zinc-400"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    isCompleted ? "bg-emerald-500/10 text-emerald-600 border border-emerald-200" :
                    isActive ? "bg-zinc-900 text-white shadow-sm" : "bg-zinc-100 text-zinc-400"
                  }`}>
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.num}
                  </div>
                  <div className="space-y-0.5 overflow-hidden">
                    <p className={`text-xs font-bold tracking-tight truncate ${isActive ? "text-zinc-900" : "text-zinc-500"}`}>{s.title}</p>
                    <p className="text-[9px] uppercase tracking-wider text-zinc-400 truncate">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </aside>

          {/* Right form input area */}
          <div className="flex-1 p-8 overflow-y-auto bg-white">
            
            {/* Step 1: Basic Setup */}
            {currentStep === 1 && (
              <div className="space-y-6 max-w-xl animate-in fade-in duration-300">
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-zinc-900">Language & Category Selection</h4>
                  <p className="text-xs text-zinc-400">Configure base language and main experience tag.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Activity Language</label>
                    <select 
                      value={formData.language}
                      onChange={(e) => setFormData({...formData, language: e.target.value})}
                      className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white outline-none font-semibold text-xs text-zinc-700 focus:border-zinc-400"
                    >
                      <option value="English">English</option>
                      <option value="German">German</option>
                      <option value="French">French</option>
                      <option value="Greek">Greek</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Main Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white outline-none font-semibold text-xs text-zinc-700 focus:border-zinc-400"
                    >
                      <option value="water-sports">Water Sports</option>
                      <option value="history">Historical Tour</option>
                      <option value="food-drink">Food & Drink</option>
                      <option value="day-trips">Day Trips</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Main Info */}
            {currentStep === 2 && (
              <div className="space-y-6 max-w-xl animate-in fade-in duration-300">
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-zinc-900">Experience Primary Information</h4>
                  <p className="text-xs text-zinc-400">Define how the customer discovers your product.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Activity Title</label>
                    <Input 
                      placeholder="e.g., Luxury Sunset Catamaran Cruise in Santorini" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Starting Price per person ($)</label>
                    <Input 
                      type="number"
                      placeholder="120.00" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Short Summary</label>
                    <Input 
                      placeholder="Sunset sailing experience with customized food & drinks." 
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Long Description</label>
                    <textarea 
                      rows={4}
                      placeholder="Write an attractive overview of the tour itinerary..." 
                      value={formData.longDescription}
                      onChange={(e) => setFormData({...formData, longDescription: e.target.value})}
                      className="w-full p-3 rounded-xl border border-zinc-200 bg-white text-zinc-900 outline-none focus:border-zinc-400 text-xs font-semibold leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Keywords & Inclusions */}
            {currentStep === 3 && (
              <div className="space-y-6 max-w-xl animate-in fade-in duration-300">
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-zinc-900">SEO Keywords & Inclusions</h4>
                  <p className="text-xs text-zinc-400">Enter search tags and specific tour inclusions.</p>
                </div>
                
                <div className="space-y-4">
                  {/* Keywords */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">SEO Keywords</label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="e.g., sunset, sailing, luxury" 
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                      />
                      <Button type="button" onClick={addKeyword} variant="outline" className="h-10">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {formData.keywords.map((kw, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-zinc-100 border border-zinc-200 text-zinc-600 rounded text-[10px] font-bold uppercase">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Inclusions */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">What's Included</label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="e.g., Free Drinks & Beverages" 
                        value={inclusionInput}
                        onChange={(e) => setInclusionInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInclusion())}
                      />
                      <Button type="button" onClick={addInclusion} variant="outline" className="h-10">Add</Button>
                    </div>
                    <ul className="list-disc pl-5 text-xs text-zinc-600 font-semibold space-y-1 mt-2">
                      {formData.inclusions.map((inc, idx) => (
                        <li key={idx}>{inc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Safety & Info */}
            {currentStep === 4 && (
              <div className="space-y-6 max-w-xl animate-in fade-in duration-300">
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-zinc-900">Safety & Restrictions</h4>
                  <p className="text-xs text-zinc-400">Set tour difficulty and health constraints.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Fitness Level Required</label>
                    <select 
                      value={formData.fitnessLevel}
                      onChange={(e) => setFormData({...formData, fitnessLevel: e.target.value})}
                      className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white outline-none font-semibold text-xs text-zinc-700 focus:border-zinc-400"
                    >
                      <option value="easy">Easy (Suitable for all ages)</option>
                      <option value="medium">Medium (Moderate physical effort)</option>
                      <option value="hard">Hard (Demanding trekking / efforts)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Safety Guidelines & Restrictions</label>
                    <textarea 
                      rows={3}
                      placeholder="e.g., Not suitable for pregnant women or individuals with severe back issues..." 
                      value={formData.safetyDetails}
                      onChange={(e) => setFormData({...formData, safetyDetails: e.target.value})}
                      className="w-full p-3 rounded-xl border border-zinc-200 bg-white text-zinc-900 outline-none focus:border-zinc-400 text-xs font-semibold leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Pricing Options */}
            {currentStep === 5 && (
              <div className="space-y-6 max-w-2xl animate-in fade-in duration-300">
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-zinc-900">Tour Variants & Pricing Options</h4>
                  <p className="text-xs text-zinc-400">Create multiple ticket tiers or options (e.g. VIP Option, Morning Shift).</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_auto] gap-3 items-end p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-zinc-400">Option Name</label>
                    <Input placeholder="e.g. Premium Morning Tour" value={optionName} onChange={(e) => setOptionName(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-zinc-400">Price ($)</label>
                    <Input type="number" placeholder="150" value={optionPrice} onChange={(e) => setOptionPrice(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-zinc-400">Duration</label>
                    <Input placeholder="e.g. 5 hours" value={optionDuration} onChange={(e) => setOptionDuration(e.target.value)} />
                  </div>
                  <Button type="button" onClick={addOption} className="h-10 px-4 shrink-0">Add</Button>
                </div>

                {/* Added options table */}
                {formData.options.length > 0 && (
                  <div className="rounded-xl border border-zinc-200 overflow-hidden mt-4">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold">
                          <th className="py-2.5 px-4">Option Tier</th>
                          <th className="py-2.5 px-4">Price</th>
                          <th className="py-2.5 px-4">Duration</th>
                          <th className="py-2.5 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.options.map((opt, idx) => (
                          <tr key={idx} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                            <td className="py-2.5 px-4 font-bold text-zinc-800">{opt.name}</td>
                            <td className="py-2.5 px-4 font-bold text-zinc-900">${opt.price.toFixed(2)}</td>
                            <td className="py-2.5 px-4 font-semibold text-zinc-500">{opt.duration}</td>
                            <td className="py-2.5 px-4 text-right">
                              <button onClick={() => removeOption(idx)} className="p-1 hover:bg-rose-50 rounded text-rose-500">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Verify & Launch */}
            {currentStep === 6 && (
              <div className="space-y-6 max-w-xl animate-in fade-in duration-300">
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-zinc-900">Verify Cancellation & Operator Terms</h4>
                  <p className="text-xs text-zinc-400">Confirm cancel windows and platform service rules.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Cancellation Policy</label>
                    <select 
                      value={formData.cancellationPolicy}
                      onChange={(e) => setFormData({...formData, cancellationPolicy: e.target.value})}
                      className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white outline-none font-semibold text-xs text-zinc-700 focus:border-zinc-400"
                    >
                      <option value="standard">Standard cancellation policy (24h refund)</option>
                      <option value="strict">Strict cancellation policy (48h refund)</option>
                      <option value="non-refundable">Non-refundable experience (No cancellations)</option>
                    </select>
                  </div>

                  <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/50 flex gap-3 text-xs text-amber-800 font-semibold leading-relaxed">
                    <input type="checkbox" required className="mt-1 shrink-0 scale-105" />
                    <span>I declare that Aegean Sails Ltd holds valid certificates for maritime operations and all options, pricing structures, and highlights match platform safety guidelines.</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Wizard Footer Nav */}
        <div className="p-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/30 shrink-0">
          <Button 
            type="button"
            onClick={handleBack} 
            disabled={currentStep === 1}
            variant="outline"
            className="px-5 text-xs font-bold gap-1.5 disabled:opacity-20"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>

          <div className="flex gap-2">
            {currentStep < 6 ? (
              <Button type="button" onClick={handleNext} className="px-6 flex items-center gap-1.5">
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} className="px-10 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5">
                Launch Experience <Sparkles className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
