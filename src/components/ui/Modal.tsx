import React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-4xl",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-primary/10 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Content */}
      <div className={cn(
        "bg-white w-full rounded-[32px] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300",
        maxWidth
      )}>
        {title && (
          <div className="px-8 py-6 border-b border-brand-bg flex items-center justify-between shrink-0">
            <h2 className="text-[20px] font-bold text-brand-dark tracking-tight">{title}</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-brand-bg rounded-full transition-all text-brand-light hover:text-brand-dark"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        
        <div className="p-8 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
