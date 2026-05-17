import React from "react";

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  value?: string;
}

export function Input({ 
  className = "", 
  ...props 
}: InputProps) {
  return (
    <input 
      className={`w-full px-3 h-10 border border-zinc-200 rounded-xl bg-white text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/20 transition-all text-sm font-medium ${className}`} 
      {...props} 
    />
  );
}
