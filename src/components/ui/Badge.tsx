import React from "react";

interface BadgeProps extends React.ComponentPropsWithoutRef<"span"> {
  status?: "published" | "pending" | "confirmed" | "draft";
}

export function Badge({ 
  children, 
  className = "", 
  status, 
  ...props 
}: BadgeProps) {
  const getStyles = () => {
    switch (status) {
      case "published":
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "draft":
      default:
        return "bg-zinc-50 text-zinc-600 border-zinc-200";
    }
  };

  return (
    <span 
      className={`inline-flex items-center justify-center rounded-full text-[10px] font-semibold px-2.5 py-0.5 border ${getStyles()} ${className}`} 
      {...props}
    >
      {children}
    </span>
  );
}
