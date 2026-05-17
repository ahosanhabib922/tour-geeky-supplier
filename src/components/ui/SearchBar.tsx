import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export function SearchBar({ containerClassName, className, ...props }: SearchBarProps) {
  return (
    <div className={cn(
      "flex items-center bg-brand-bg rounded-[10px] px-3 py-2 border border-transparent transition-all focus-within:border-brand-border focus-within:bg-white",
      containerClassName
    )}>
      <Search className="w-4 h-4 text-brand-light" />
      <input 
        type="text" 
        className={cn(
          "bg-transparent border-none outline-none text-[14px] ml-2 w-full placeholder:text-brand-light text-brand-dark",
          className
        )}
        {...props}
      />
    </div>
  );
}
