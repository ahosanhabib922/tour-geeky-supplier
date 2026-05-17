import React from "react";

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg";
}

export function Button({ 
  children, 
  className = "", 
  variant = "primary", 
  size = "default",
  ...props 
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "outline":
        return "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 shadow-sm";
      case "ghost":
        return "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900";
      case "destructive":
        return "bg-rose-600 text-white hover:bg-rose-700 shadow-sm shadow-rose-600/10";
      case "primary":
      default:
        return "bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "h-9 px-3 rounded-lg text-xs font-semibold";
      case "lg":
        return "h-12 px-6 rounded-xl text-sm font-semibold";
      case "default":
      default:
        return "h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider";
    }
  };

  return (
    <button 
      className={`inline-flex items-center justify-center font-sans transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${getVariantStyles()} ${getSizeStyles()} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}
