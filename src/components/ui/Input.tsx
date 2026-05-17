import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, rightElement, className, type = "text", ...props }, ref) => {
    return (
      <div className={cn("space-y-2", !className?.includes("w-") && "w-full")}>
        {label && (
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-bold text-brand-black">{label}</label>
            {rightElement}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            "w-full px-4 rounded-xl border border-brand-border bg-white outline-none transition-all text-brand-black font-medium text-[13px]",
            "focus:ring-2 focus:ring-brand-black/5 focus:border-brand-black",
            "h-11", // Standard premium height
            error && "border-red-500 focus:ring-red-500/10 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-[11px] text-red-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-brand-gray font-medium">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
