import React from "react";

interface BadgeProps extends React.ComponentPropsWithoutRef<"span"> {
  status?: "published" | "pending" | "confirmed";
}

export function Badge({ 
  children, 
  className = "", 
  status, 
  ...props 
}: BadgeProps) {
  const getStyles = () => {
    if (status === "published" || status === "confirmed") {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }
    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  };

  return (
    <span 
      className={`rounded-lg text-[8px] uppercase font-black px-2 py-0.5 border ${getStyles()} ${className}`} 
      {...props}
    >
      {children}
    </span>
  );
}
