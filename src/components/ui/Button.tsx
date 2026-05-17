import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'default' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'default' | 'xs' | 'icon' | 'icon-sm' | 'icon-xs' | 'icon-lg';
  children?: React.ReactNode;
}

export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) => {
  // Normalize variants for client style bindings
  const activeVariant = variant === 'default' ? 'primary' : variant;
  const activeSize = size === 'default' ? 'md' : size;

  const variants = {
    primary: 'bg-brand-black text-white hover:bg-brand-black/90 border border-transparent shadow-sm',
    secondary: 'bg-brand-light text-brand-black hover:bg-brand-border border border-transparent',
    outline: 'bg-transparent border border-brand-border text-brand-black hover:bg-brand-light',
    ghost: 'bg-transparent text-brand-black hover:bg-brand-light border border-transparent',
    destructive: 'bg-red-50 text-red-600 hover:bg-red-100/80 border border-transparent',
    link: 'bg-transparent text-brand-black hover:underline border border-transparent underline-offset-4',
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-[11px]',
    sm: 'px-4 py-2 text-[13px]',
    md: 'px-6 py-2.5 text-[14px]',
    lg: 'px-8 py-3.5 text-[16px]',
    icon: 'p-2',
    'icon-sm': 'p-1.5',
    'icon-xs': 'p-1',
    'icon-lg': 'p-3',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[activeVariant as keyof typeof variants] || variants.primary,
        sizes[activeSize as keyof typeof sizes] || sizes.md,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const buttonVariants = (options?: { variant?: string; size?: string }) => {
  return "";
};
