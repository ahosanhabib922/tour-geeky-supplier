"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductsTab } from "@/components/dashboard/ProductsTab";
import { INITIAL_PRODUCTS } from "@/constants/mockData";

export default function SupplierProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-full animate-in fade-in duration-500">
      <ProductsTab 
        products={products}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onOpenModal={() => router.push("/products/create")}
        onDeleteProduct={(id) => {
          if (window.confirm("Delete this product?")) {
            setProducts(prev => prev.filter(p => p.id !== id));
          }
        }}
      />
    </div>
  );
}
