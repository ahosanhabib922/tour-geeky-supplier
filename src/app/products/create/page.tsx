"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProductFormProvider } from "@/hooks/useProductForm";
import { ProductWizard } from "@/components/forms/ProductWizard";

export default function SupplierCreateProductPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-6xl mx-auto pb-12 animate-in fade-in duration-500">
      <ProductFormProvider>
        <ProductWizard onSuccess={() => {
          alert("Product successfully created and submitted for verification!");
          router.push("/products");
        }} />
      </ProductFormProvider>
    </div>
  );
}
