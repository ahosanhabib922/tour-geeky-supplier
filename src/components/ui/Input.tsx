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
      className={`w-full px-4 h-11 border border-zinc-800/80 rounded-xl bg-zinc-950 text-zinc-100 placeholder-zinc-700 outline-none focus:border-violet-500/50 transition-all text-sm font-semibold ${className}`} 
      {...props} 
    />
  );
}
