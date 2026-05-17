import React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label className="text-[13px] font-bold text-brand-black block">{label}</label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full px-4 py-3 rounded-xl border border-brand-border bg-white outline-none transition-all text-brand-black font-medium text-[13px] min-h-[100px] leading-relaxed",
            "focus:ring-2 focus:ring-brand-black/5 focus:border-brand-black",
            error && "border-red-500 focus:ring-red-500/10 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
