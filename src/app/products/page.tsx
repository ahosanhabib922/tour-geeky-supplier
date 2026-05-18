"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductsTab } from "@/components/dashboard/ProductsTab";
import { api } from "@/lib/api";
import { Product } from "@/types/product";

export default function SupplierProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadCatalogData = async () => {
      try {
        const [productsData, bookingsData] = await Promise.all([
          api.getProducts(),
          api.getBookings()
        ]);

        if (productsData) {
          setProducts(productsData);
        }

        if (bookingsData) {
          setBookings(bookingsData);
        }
      } catch (error) {
        console.error("Failed to load live catalog from DB:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCatalogData();
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
        <div className="w-6 h-6 border-2 border-brand-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-500">
      <ProductsTab 
        products={products as any[]}
        bookings={bookings}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onOpenModal={() => router.push("/products/create")}
        onDeleteProduct={handleDelete}
      />
    </div>
  );
}
