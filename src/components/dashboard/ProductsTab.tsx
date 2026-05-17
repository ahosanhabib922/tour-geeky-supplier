import React, { useState } from "react";
import { Search, Plus, Star, Globe, PackageOpen, MoreHorizontal, Trash2 } from "lucide-react";
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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const filteredProducts = products.filter(p => {
    if (p.status === "archived") return false;
    
    // Map 'pending' mock status to matches for 'draft' filtering or separate check
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
      
      {/* Title & Request Action */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">My Activity Listings</h1>
          <p className="text-zinc-400 text-sm">Add and review your catalog. All new listings require platform verification before going public.</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex items-center gap-2">
          {["all", "published", "draft"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                filterStatus === status 
                  ? "bg-violet-600/20 text-violet-400 border border-violet-500/30"
                  : "text-zinc-500 hover:text-zinc-300 border border-transparent"
              }`}
            >
              {status === "draft" ? "Draft / Pending" : status}
            </button>
          ))}
        </div>

        {/* Search & Action Buttons */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder="Search catalog..." 
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="pl-11"
            />
          </div>
          <Button onClick={onOpenModal} className="h-11 px-6 shrink-0 flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create Product
          </Button>
        </div>
      </div>

      {/* Admin-Style Products Table */}
      <div className="rounded-3xl border border-zinc-800/50 bg-zinc-900/20 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/60 bg-zinc-900/10 text-left">
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-zinc-500 w-[450px]">Product</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Reference</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Category</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-zinc-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-zinc-600">
                      <PackageOpen className="h-9 w-9 opacity-30" />
                      <p className="text-xs font-bold uppercase tracking-wider">No products found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-zinc-800/30 hover:bg-zinc-900/20 transition-all last:border-0">
                    {/* Cover image & Title */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-12 rounded-xl bg-zinc-800 overflow-hidden shrink-0 border border-zinc-800/60">
                          <img 
                            src={`https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=200&h=150&auto=format&fit=crop`} 
                            alt={product.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-xs text-zinc-100 hover:text-white transition-colors">{product.title}</span>
                          <div className="flex items-center gap-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className="h-3 w-3 text-amber-500 fill-amber-500" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Reference ID */}
                    <td className="py-4 px-6 font-mono text-[10px] text-zinc-500">
                      {product.id}
                    </td>

                    {/* Category Label */}
                    <td className="py-4 px-6 text-xs text-zinc-400 capitalize font-semibold">
                      {product.category.replace("-", " ")}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <Badge status={product.status}>
                        {getStatusLabel(product.status)}
                      </Badge>
                    </td>

                    {/* Dropdown Options */}
                    <td className="py-4 px-6 text-right relative">
                      <div className="flex items-center justify-end gap-2">
                        {onDeleteProduct && (
                          <button 
                            onClick={() => onDeleteProduct(product.id)}
                            className="p-2 hover:bg-rose-500/10 rounded-xl text-zinc-500 hover:text-rose-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                        <button 
                          className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors"
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
