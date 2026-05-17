import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface RequestListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; category: string; price: string; shortDescription: string; longDescription: string }) => void;
}

export function RequestListingModal({
  isOpen,
  onClose,
  onSubmit,
}: RequestListingModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    category: "water-sports",
    price: "",
    shortDescription: "",
    longDescription: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) return;
    onSubmit(formData);
    setFormData({
      title: "",
      category: "water-sports",
      price: "",
      shortDescription: "",
      longDescription: "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800/60 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-zinc-800/60 flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-lg text-white leading-tight">Request Activity Listing</h3>
            <span className="text-[10px] uppercase font-bold text-violet-400 mt-1 block">New catalog registration</span>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:bg-zinc-800 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-1">Activity Title</label>
            <Input 
              placeholder="e.g., Luxury Sunset Catamaran Cruise" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-1">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full h-11 px-4 rounded-xl border border-zinc-800/80 bg-zinc-950 outline-none font-semibold text-xs text-zinc-300 appearance-none cursor-pointer"
              >
                <option value="water-sports">Water Sports</option>
                <option value="history">Historical Tour</option>
                <option value="food-drink">Food & Drink</option>
                <option value="day-trips">Day Trips</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-1">Price per person ($)</label>
              <Input 
                type="number"
                min="1"
                placeholder="99.00" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-1">Short Description</label>
            <textarea 
              rows={2}
              placeholder="Summarize the experience..." 
              value={formData.shortDescription}
              onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
              className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 text-zinc-100 placeholder-zinc-700 outline-none resize-none transition-all text-xs font-semibold leading-relaxed"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Submit for Approval
            </Button>
            <Button type="button" onClick={onClose} variant="outline" className="px-6">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
