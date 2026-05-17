"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from "react";
import { Product, ProductOption } from "@/types/product";
import { api } from "@/lib/api";

interface ProductFormContextType {
  product: Product;
  updateProduct: (updates: Partial<Product>) => void;
  addOption: (option: Omit<ProductOption, "id">) => void;
  removeOption: (id: string) => void;
  updateOption: (id: string, updates: Partial<ProductOption>) => void;
  isSubmitting: boolean;
  submitProduct: (manualProduct?: Product) => Promise<Product | null>;
}

const ProductFormContext = createContext<ProductFormContextType | undefined>(undefined);

const DEFAULT_PRODUCT: Product = {
  language: "English",
  category: "",
  title: "",
  shortDescription: "",
  longDescription: "",
  highlights: [],
  keywords: [],
  inclusions: [],
  exclusions: [],
  extraInfo: [],
  healthRestrictions: [],
  fitnessLevel: "easy",
  safetyDetails: "",
  options: [],
  currency: "EUR",
  status: "draft",
  images: [],
  location: "",
  itinerary: [],
  notSuitableFor: [],
  notAllowed: [],
  whatToBring: [],
  cancellationPolicy: 'standard',
};

export function ProductFormProvider({ children, initialData }: { children: ReactNode; initialData?: Product }) {
  const [product, setProduct] = useState<Product>(initialData || DEFAULT_PRODUCT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lastSavedRef = useRef<string>("");

  // Sync state if initialData changes (critical for edit mode)
  useEffect(() => {
    if (initialData) {
      setProduct(initialData);
    }
  }, [initialData]);

  const updateProduct = useCallback((updates: Partial<Product>) => {
    setProduct((prev) => ({ ...prev, ...updates }));
  }, []);

  const submitProduct = useCallback(async (manualProduct?: Product) => {
    const targetProduct = manualProduct || product;
    const productJson = JSON.stringify(targetProduct);
    if (productJson === lastSavedRef.current) return null;

    setIsSubmitting(true);
    try {
      let result: Product | null;
      if (targetProduct.id) {
        result = await api.updateProduct(targetProduct.id, targetProduct);
      } else {
        result = await api.createProduct(targetProduct);
        if (result?.id) {
          setProduct(prev => ({ ...prev, id: result!.id }));
        }
      }

      if (result) {
        lastSavedRef.current = JSON.stringify({ ...targetProduct, id: result.id });
      }
      return result;
    } catch (error) {
      console.error("Failed to submit product:", error);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [product]);

  const addOption = useCallback((option: Omit<ProductOption, "id">) => {
    const newOption: ProductOption = {
      ...option,
      id: crypto.randomUUID(),
    } as ProductOption;
    setProduct((prev) => ({
      ...prev,
      options: [...prev.options, newOption],
    }));
  }, []);

  const removeOption = useCallback((id: string) => {
    setProduct((prev) => ({
      ...prev,
      options: prev.options.filter((o) => o.id !== id),
    }));
  }, []);

  const updateOption = useCallback((id: string, updates: Partial<ProductOption>) => {
    setProduct((prev) => ({
      ...prev,
      options: prev.options.map((o) => (o.id === id ? { ...o, ...updates } : o)),
    }));
  }, []);

  // Auto-save (debounced) — only drafts with content
  useEffect(() => {
    if (isSubmitting || product.status !== "draft") return;
    if (!product.title && !product.id) return;

    const currentJson = JSON.stringify(product);
    if (currentJson === lastSavedRef.current) return;

    // Prevent accidental status downgrade
    try {
      const lastSaved = JSON.parse(lastSavedRef.current || "{}");
      if (lastSaved.status === "published" && product.status === "draft") return;
    } catch { /* noop */ }

    const timer = setTimeout(() => {
      submitProduct();
    }, 2000);

    return () => clearTimeout(timer);
  }, [product, isSubmitting, submitProduct]);

  return (
    <ProductFormContext.Provider
      value={{ product, updateProduct, addOption, removeOption, updateOption, isSubmitting, submitProduct }}
    >
      {children}
    </ProductFormContext.Provider>
  );
}

export function useProductForm() {
  const context = useContext(ProductFormContext);
  if (context === undefined) {
    throw new Error("useProductForm must be used within a ProductFormProvider");
  }
  return context;
}
