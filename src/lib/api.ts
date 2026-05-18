import { Product } from "@/types/product";
import { auth } from "@/lib/firebase";

/**
 * Admin API client — talks to Next.js API routes.
 * Each method does ONE fetch, no unnecessary full-list loading.
 */
export const api = {
  getProducts: async (): Promise<Product[]> => {
    const email = auth.currentUser?.email || "";
    const res = await fetch(`/api/products?email=${encodeURIComponent(email)}&t=${Date.now()}`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  },

  getBookings: async (): Promise<any[]> => {
    const email = auth.currentUser?.email || "";
    const res = await fetch(`/api/bookings?email=${encodeURIComponent(email)}&t=${Date.now()}`);
    if (!res.ok) throw new Error("Failed to fetch bookings");
    return res.json();
  },

  getProductById: async (id: string): Promise<Product | null> => {
    const res = await fetch(`/api/products/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch product");
    return res.json();
  },

  createProduct: async (product: Omit<Product, "id">): Promise<Product> => {
    const email = auth.currentUser?.email || "";
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...product, supplier_email: email }),
    });
    if (!res.ok) throw new Error("Failed to create product");
    const data = await res.json();
    return data.product;
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product | null> => {
    const email = auth.currentUser?.email || "";
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...updates, id, supplier_email: email }),
    });
    if (!res.ok) throw new Error("Failed to update product");
    const data = await res.json();
    return data.product;
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    return res.ok;
  },
};
