import React from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Input } from "../ui/Input";

interface ProductsTabProps {
  products: any[];
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onOpenModal: () => void;
}

export function ProductsTab({
  products,
  searchQuery,
  onSearchQueryChange,
  onOpenModal,
}: ProductsTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">My Activity Listings</h1>
          <p className="text-zinc-400 text-sm">Add and review your catalog. All new listings require platform verification before going public.</p>
        </div>
        <Button onClick={onOpenModal} className="h-11 px-6">
          Request Listing
        </Button>
      </div>

      <div className="flex justify-between items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-500" />
          <Input 
            placeholder="Search your listings..." 
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="pl-11"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products
          .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((p, i) => (
            <div key={i} className="rounded-3xl border border-zinc-800/50 bg-zinc-900/20 backdrop-blur-md overflow-hidden flex flex-col justify-between group hover:border-zinc-800 transition-colors">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-violet-400 bg-violet-600/5 border border-violet-500/10 px-2 py-0.5 rounded">{p.category}</span>
                  <Badge status={p.status}>
                    {p.status}
                  </Badge>
                </div>

                <h3 className="font-bold text-sm leading-snug text-zinc-100 tracking-tight line-clamp-2 group-hover:text-white transition-colors">{p.title}</h3>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">Sunset sailing experience with customized packages and inclusive food & drinks.</p>
              </div>

              <div className="p-6 pt-0 border-t border-zinc-800/30 mt-4 flex items-center justify-between text-xs font-bold text-zinc-400">
                <div>
                  <span className="text-[9px] uppercase text-zinc-600 block">Pricing</span>
                  <span className="text-zinc-100 text-sm font-black">${p.price.toFixed(2)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase text-zinc-600 block">Total Sales</span>
                  <span className="text-zinc-100 text-sm font-black">${p.revenue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
