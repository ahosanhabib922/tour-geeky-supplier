import React from "react";

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "outline";
}

export function Button({ 
  children, 
  className = "", 
  variant = "primary", 
  ...props 
}: ButtonProps) {
  return (
    <button 
      className={`h-11 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-300 active:scale-[0.98] ${
        variant === "primary"
          ? "bg-gradient-to-tr from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-600/10 hover:shadow-violet-600/20"
          : "border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/40"
      } ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}
