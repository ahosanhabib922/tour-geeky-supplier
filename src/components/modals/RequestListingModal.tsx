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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-white border border-zinc-200 shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header banner */}
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <div>
            <h3 className="font-bold text-sm text-zinc-900 leading-tight">Request Activity Listing</h3>
            <span className="text-[10px] uppercase font-bold text-zinc-400 mt-1 block">New catalog registration</span>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-lg transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-1">Activity Title</label>
            <Input 
              placeholder="e.g., Luxury Sunset Catamaran Cruise" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-1">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white outline-none font-semibold text-xs text-zinc-700 focus:border-zinc-400 appearance-none cursor-pointer"
              >
                <option value="water-sports">Water Sports</option>
                <option value="history">Historical Tour</option>
                <option value="food-drink">Food & Drink</option>
                <option value="day-trips">Day Trips</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-1">Price per person ($)</label>
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
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-1">Short Description</label>
            <textarea 
              rows={2}
              placeholder="Summarize the experience..." 
              value={formData.shortDescription}
              onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
              className="w-full p-3 rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/20 resize-none transition-all text-xs font-semibold leading-relaxed"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <Button type="submit" className="flex-1">
              Submit for Approval
            </Button>
            <Button type="button" onClick={onClose} variant="outline" className="px-5">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
