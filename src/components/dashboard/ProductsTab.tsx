import React, { useState } from "react";
import { Search, Plus, Star, Globe, PackageOpen, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Input } from "../ui/Input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../ui/Table";

interface ProductsTabProps {
  products: any[];
  bookings?: any[];
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onOpenModal: () => void;
  onDeleteProduct?: (id: string) => void;
}

export function ProductsTab({
  products,
  bookings = [],
  searchQuery,
  onSearchQueryChange,
  onOpenModal,
  onDeleteProduct,
}: ProductsTabProps) {
  const [filterStatus, setFilterStatus] = useState("all");

  const getProductBookingsCount = (productId: string) => {
    return bookings.filter((b: any) => b.product_id === productId).length;
  };

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
          <div className="hidden lg:block">
            <Button onClick={onOpenModal} className="h-11 px-5 shrink-0 flex items-center gap-2 font-bold text-[13px]">
              <Plus className="h-4.5 w-4.5" /> Create Product
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Card List (Visible only on mobile/tablet) */}
      <div className="block lg:hidden space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-brand-border/40">
            <PackageOpen className="h-8 w-8 opacity-20 mx-auto mb-2 text-brand-gray" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">No products found</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-brand-border/40 p-5 space-y-4 hover:shadow-md transition-shadow">
              {/* Product Header: ID & Status Badge */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-muted-foreground">{product.id}</span>
                <Badge variant={product.status === "published" ? "default" : "secondary"}>
                  {getStatusLabel(product.status)}
                </Badge>
              </div>

              {/* Cover Image & Info */}
              <div className="flex gap-4">
                <div className="h-14 w-16 rounded-lg bg-muted overflow-hidden shrink-0">
                  <img 
                    src={product.coverImage || `https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=200&h=150&auto=format&fit=crop`} 
                    alt={product.title} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center space-y-1">
                  <h4 className="font-bold text-sm text-brand-black leading-tight line-clamp-1">{product.title}</h4>
                  <span className="text-[11px] text-muted-foreground capitalize font-semibold">{product.category?.replace("-", " ")}</span>
                  <div className="flex items-center gap-0.5">
                    <span className="text-[11px] text-muted-foreground">★ New (No reviews)</span>
                  </div>
                </div>
              </div>

              {/* Sells & Reviews Mobile Row */}
              <div className="grid grid-cols-2 gap-4 py-2.5 px-3.5 bg-brand-light/30 rounded-xl text-center text-xs">
                <div>
                  <span className="text-muted-foreground block text-[9px] uppercase font-bold tracking-wider mb-0.5">Sells</span>
                  <span className="font-bold text-brand-black">{getProductBookingsCount(product.id)} sold</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[9px] uppercase font-bold tracking-wider mb-0.5">Reviews</span>
                  <span className="font-bold text-brand-black">0 reviews</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-brand-border/30">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Actions</span>
                <div className="flex items-center gap-2">
                  {onDeleteProduct && (
                    <button 
                      onClick={() => onDeleteProduct(product.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-bold transition-all active:scale-95"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  )}
                  <button 
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-light text-brand-black rounded-full text-xs font-bold transition-all active:scale-95"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Clean Table (Visible only on desktop) */}
      <div className="hidden lg:block w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[350px]">Product</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Sells</TableHead>
              <TableHead>Reviews</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <PackageOpen className="h-8 w-8 opacity-20" />
                    <p>No products found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  {/* Cover image & Title */}
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-12 rounded-md bg-muted overflow-hidden shrink-0">
                        <img 
                          src={product.coverImage || `https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=200&h=150&auto=format&fit=crop`} 
                          alt={product.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{product.title}</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">New</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Reference ID */}
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {product.id}
                  </TableCell>

                  {/* Category Label */}
                  <TableCell className="text-muted-foreground capitalize">
                    {product.category?.replace("-", " ")}
                  </TableCell>

                  {/* Sells */}
                  <TableCell className="font-semibold text-brand-black">
                    {getProductBookingsCount(product.id)} sold
                  </TableCell>

                  {/* Reviews */}
                  <TableCell className="text-muted-foreground font-medium">
                    0 reviews
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell>
                    <Badge variant={product.status === "published" ? "default" : "secondary"}>
                      {getStatusLabel(product.status)}
                    </Badge>
                  </TableCell>

                  {/* Dropdown Options */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onDeleteProduct && (
                        <button 
                          onClick={() => onDeleteProduct(product.id)}
                          className="p-2 hover:bg-red-50 rounded-full text-brand-gray/60 hover:text-red-600 transition-colors active:scale-95"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                      <button 
                        className="p-2 hover:bg-brand-light rounded-full text-brand-gray/60 hover:text-brand-black transition-colors active:scale-95"
                        title="View Details"
                      >
                        <Globe className="h-4 w-4" />
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
