"use client";

import React from 'react';
import { Star, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Product } from '../types/product';
import { cn } from '../lib/utils';

interface ActivityCardProps {
  product: Product;
  href?: string;
  className?: string;
  showLocation?: boolean;
  onActionClick?: () => void;
  // Allows injecting custom button or footer
  renderFooter?: (price: number) => React.ReactNode;
}

export const ActivityCard = ({
  product,
  href,
  className,
  showLocation = true,
  renderFooter,
}: ActivityCardProps) => {
  // Logic unified across apps
  const firstOption = product.options?.[0];
  const firstPricing = firstOption?.pricing?.[0];
  const price = firstPricing?.type === 'group' 
    ? (firstPricing.groupPrice || 0) 
    : (firstPricing?.ageGroups?.[0]?.price || 0);
  
  const rating = 4.9; // In production, this would come from the DB
  const reviews = 128;
  const duration = firstOption?.durationValue || "Flexible";

  const CardWrapper = href ? 'a' : 'div';

  return (
    <div className={cn(
      "group bg-white rounded-[24px] overflow-hidden border border-brand-border/40 hover:shadow-2xl transition-all duration-500 flex flex-col h-full",
      className
    )}>
      {/* Image Area */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={product.coverImage || product.images?.[0] || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80"} 
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-brand-dark text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
            {product.category}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
           <div className="flex items-center gap-2 text-white/90">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-[12px] font-bold">{rating}</span>
              <span className="text-[11px] font-medium opacity-60">({reviews} reviews)</span>
           </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1 space-y-4">
        <div className="space-y-1">
          {showLocation && (
            <div className="flex items-center gap-1.5 text-brand-gray/60">
               <MapPin className="w-3.5 h-3.5" />
               <span className="text-[11px] font-bold uppercase tracking-wider">{product.location || "Multiple Locations"}</span>
            </div>
          )}
          <h3 className="text-[18px] font-bold text-brand-dark leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">
            {product.title}
          </h3>
        </div>

        <p className="text-[13px] text-brand-gray font-medium line-clamp-2 leading-relaxed">
          {product.shortDescription}
        </p>

        {renderFooter ? (
          renderFooter(price)
        ) : (
          <div className="mt-auto pt-6 border-t border-brand-bg flex items-center justify-between">
             <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-brand-gray/60 uppercase tracking-widest">Starting from</p>
                <p className="text-[18px] font-black text-brand-dark">
                  {product.currency} {price}
                </p>
             </div>
             {href ? (
               <a href={href} className="w-10 h-10 rounded-full bg-brand-primary/5 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                  <ArrowRight className="w-5 h-5" />
               </a>
             ) : (
               <div className="w-10 h-10 rounded-full bg-brand-primary/5 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                  <ArrowRight className="w-5 h-5" />
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};
