"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductsTab } from "@/components/dashboard/ProductsTab";
import { api } from "@/lib/api";
import { Product } from "@/types/product";
import { INITIAL_PRODUCTS } from "@/constants/mockData";

export default function SupplierProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await api.getProducts();
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          // Fallback to mock data if DB is empty
          setProducts(INITIAL_PRODUCTS as any[]);
        }
      } catch (error) {
        console.error("Failed to load live products from DB, falling back to mock:", error);
        setProducts(INITIAL_PRODUCTS as any[]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      // Check if it's a mock product or real DB product
      if (id.startsWith("prod_")) {
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        const success = await api.deleteProduct(id);
        if (success) {
          setProducts(prev => prev.filter(p => p.id !== id));
        }
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-500">
      <ProductsTab 
        products={products as any[]}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onOpenModal={() => router.push("/products/create")}
        onDeleteProduct={handleDelete}
      />
    </div>
  );
}
