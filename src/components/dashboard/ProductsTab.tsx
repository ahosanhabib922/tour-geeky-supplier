import React, { useState } from "react";
import { Search, Plus, Star, Globe, PackageOpen, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Input } from "../ui/Input";

interface ProductsTabProps {
  products: any[];
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onOpenModal: () => void;
  onDeleteProduct?: (id: string) => void;
}

export function ProductsTab({
  products,
  searchQuery,
  onSearchQueryChange,
  onOpenModal,
  onDeleteProduct,
}: ProductsTabProps) {
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredProducts = products.filter(p => {
    if (p.status === "archived") return false;
    
    const matchesStatus = 
      filterStatus === "all" || 
      p.status === filterStatus ||
      (filterStatus === "draft" && p.status === "pending");

    const matchesSearch = 
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusLabel = (status: string) => {
    if (status === "pending") return "Pending Approval";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5">
          {["all", "published", "draft"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize tracking-wide transition-all duration-200 ${
                filterStatus === status 
                  ? "bg-zinc-100 text-zinc-900 border border-zinc-200"
                  : "text-zinc-500 hover:text-zinc-950 border border-transparent"
              }`}
            >
              {status === "draft" ? "Draft / Pending" : status}
            </button>
          ))}
        </div>

        {/* Search & Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input 
              placeholder="Search catalog..." 
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={onOpenModal} className="h-10 px-5 shrink-0 flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create Product
          </Button>
        </div>
      </div>

      {/* Admin-Style Products Table */}
      <div className="rounded-xl border border-zinc-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-zinc-200/80 bg-zinc-50/50 text-left">
                <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-zinc-400 w-[450px]">Product</th>
                <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Reference</th>
                <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Category</th>
                <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Status</th>
                <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-zinc-400">
                      <PackageOpen className="h-9 w-9 opacity-40" />
                      <p className="text-xs font-bold uppercase tracking-wider">No products found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-all last:border-0">
                    {/* Cover image & Title */}
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-12 rounded-lg bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200">
                          <img 
                            src={`https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=200&h=150&auto=format&fit=crop`} 
                            alt={product.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-xs text-zinc-900 hover:text-zinc-950 transition-colors">{product.title}</span>
                          <div className="flex items-center gap-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className="h-3 w-3 text-amber-500 fill-amber-500" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Reference ID */}
                    <td className="py-3 px-6 font-mono text-[10px] text-zinc-400">
                      {product.id}
                    </td>

                    {/* Category Label */}
                    <td className="py-3 px-6 text-xs text-zinc-600 capitalize font-semibold">
                      {product.category.replace("-", " ")}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-6">
                      <Badge status={product.status}>
                        {getStatusLabel(product.status)}
                      </Badge>
                    </td>

                    {/* Dropdown Options */}
                    <td className="py-3 px-6 text-right relative">
                      <div className="flex items-center justify-end gap-1.5">
                        {onDeleteProduct && (
                          <button 
                            onClick={() => onDeleteProduct(product.id)}
                            className="p-2 hover:bg-rose-50 rounded-lg text-zinc-400 hover:text-rose-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                        <button 
                          className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-800 transition-colors"
                          title="View Details"
                        >
                          <Globe className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
