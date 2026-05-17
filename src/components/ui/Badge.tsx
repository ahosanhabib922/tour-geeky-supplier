import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
  status?: string;
}

export function Badge({ className, variant = "default", status, ...props }: BadgeProps) {
  const getStatusClasses = (statusVal?: string) => {
    if (!statusVal) return "";
    const s = statusVal.toLowerCase();
    if (s === "published" || s === "confirmed" || s === "active") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
    }
    if (s === "draft" || s === "pending" || s === "unverified") {
      return "bg-amber-50 text-amber-700 border-amber-200/80 font-bold";
    }
    if (s === "cancelled" || s === "failed" || s === "rejected" || s === "archived") {
      return "bg-rose-50 text-rose-700 border-rose-200/80";
    }
    return "bg-zinc-50 text-zinc-600 border-zinc-200";
  };

  const statusClasses = getStatusClasses(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors",
        status 
          ? statusClasses 
          : "bg-zinc-900 text-white border-transparent",
        className
      )}
      {...props}
    />
  );
}
