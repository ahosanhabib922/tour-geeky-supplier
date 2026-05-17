import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16", className)}>
      <div className="space-y-1.5">
        <h1 className="text-[28px] font-bold text-brand-dark tracking-tight leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-[14px] text-brand-gray font-medium max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex items-center gap-3 shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
