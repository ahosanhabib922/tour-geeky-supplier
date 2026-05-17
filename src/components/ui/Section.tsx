import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  border?: boolean;
}

export function Section({ title, description, action, children, className, border = true }: SectionProps) {
  return (
    <section className={cn("space-y-8", className)}>
      {(title || description || action) && (
        <div className={cn(
          "flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6",
          border && "border-b border-brand-border"
        )}>
          <div className="space-y-1">
            {title && (
              <h3 className="text-[18px] font-semibold text-brand-dark tracking-tight uppercase">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-[13px] text-brand-gray font-medium leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {action && (
            <div className="shrink-0">
              {action}
            </div>
          )}
        </div>
      )}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
        {children}
      </div>
    </section>
  );
}
