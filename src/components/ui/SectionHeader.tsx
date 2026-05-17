import React from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <div className="h-4 w-1 bg-brand-primary rounded-full" />
          <h4 className="text-[14px] font-bold text-brand-dark uppercase tracking-wider">{title}</h4>
        </div>
        {description && (
          <p className="text-[13px] text-brand-light font-medium ml-4">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

