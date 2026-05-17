import React, { useState } from "react";
import { Search, Plus, Star, Globe, PackageOpen, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Input } from "../ui/Input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../ui/Table";

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
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      
      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex items-center gap-2">
          {["all", "published", "draft"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 border ${
                filterStatus === status 
                  ? "bg-brand-black text-white border-transparent shadow-sm"
                  : "text-brand-gray border-brand-border bg-transparent hover:bg-brand-light hover:text-brand-black"
              }`}
            >
              {status === "draft" ? "Draft / Pending" : status}
            </button>
          ))}
        </div>

        {/* Search & Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-gray/60" />
            <input 
              placeholder="Search catalog..." 
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="w-full pl-9 pr-4 h-11 text-xs rounded-full border border-brand-border bg-brand-light/20 outline-none transition-all focus:border-brand-black text-brand-black font-semibold placeholder:text-brand-gray/40"
            />
          </div>
          <Button onClick={onOpenModal} className="hidden lg:inline-flex h-11 px-5 shrink-0 flex items-center gap-2 font-bold text-[13px]">
            <Plus className="h-4.5 w-4.5" /> Create Product
          </Button>
        </div>
      </div>

      {/* Admin-Style Products Table */}
      <div className="rounded-[24px] border border-brand-border/40 bg-white hover:shadow-xl hover:shadow-brand-black/5 transition-all duration-300 overflow-hidden">
        <Table>
          <TableHeader className="bg-brand-light/50 border-b border-brand-border">
            <TableRow className="hover:bg-transparent">
              <TableHead className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-brand-gray w-[450px]">Product</TableHead>
              <TableHead className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-brand-gray">Reference</TableHead>
              <TableHead className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-brand-gray">Category</TableHead>
              <TableHead className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-brand-gray">Status</TableHead>
              <TableHead className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-brand-gray text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-brand-gray/60">
                    <PackageOpen className="h-9 w-9 opacity-40 text-brand-gray" />
                    <p className="text-[10px] font-bold uppercase tracking-wider">No products found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="border-b border-brand-border hover:bg-brand-light/20 transition-all last:border-0">
                  {/* Cover image & Title */}
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-12 rounded-xl bg-brand-light overflow-hidden shrink-0 border border-brand-border">
                        <img 
                          src={product.coverImage || `https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=200&h=150&auto=format&fit=crop`} 
                          alt={product.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-brand-black hover:text-brand-black/80 transition-colors">{product.title}</span>
                        <div className="flex items-center gap-0.5 mt-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Reference ID */}
                  <TableCell className="py-4 px-6 font-mono text-[10px] text-brand-gray/60 font-semibold">
                    {product.id}
                  </TableCell>

                  {/* Category Label */}
                  <TableCell className="py-4 px-6 text-xs text-brand-gray capitalize font-bold">
                    {product.category?.replace("-", " ")}
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="py-4 px-6">
                    <Badge status={product.status}>
                      {getStatusLabel(product.status)}
                    </Badge>
                  </TableCell>

                  {/* Dropdown Options */}
                  <TableCell className="py-4 px-6 text-right relative">
                    <div className="flex items-center justify-end gap-2">
                      {onDeleteProduct && (
                        <button 
                          onClick={() => onDeleteProduct(product.id)}
                          className="p-2 hover:bg-red-50 rounded-full text-brand-gray/60 hover:text-red-600 transition-colors active:scale-95"
                          title="Delete"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      )}
                      <button 
                        className="p-2 hover:bg-brand-light rounded-full text-brand-gray/60 hover:text-brand-black transition-colors active:scale-95"
                        title="View Details"
                      >
                        <Globe className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
