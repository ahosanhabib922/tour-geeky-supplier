import { z } from "zod";

export const itineraryItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  locationName: z.string(),
  type: z.enum(['start', 'stop', 'end']),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional()
});

export const ageGroupSchema = z.object({
  id: z.string(),
  label: z.string(),
  minAge: z.number(),
  maxAge: z.number(),
  price: z.number().min(0),
  netPrice: z.number().min(0)
});

export const pricingSetupSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["per_person", "group"]),
  minParticipants: z.number(),
  maxParticipants: z.number(),
  ageGroups: z.array(ageGroupSchema),
  groupPrice: z.number().optional(),
  currency: z.string()
});

export const productOptionSchema = z.object({
  id: z.string(),
  referenceName: z.string().min(1, "Option name is required"),
  type: z.enum(["duration", "validity"]),
  pricing: z.array(pricingSetupSchema),
  // Add other fields as needed based on types
}).passthrough();

export const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  shortDescription: z.string().min(10, "Short description is too short"),
  longDescription: z.string().min(20, "Long description is too short"),
  currency: z.string().default("EUR"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  images: z.array(z.string()).default([]),
  options: z.array(productOptionSchema).default([]),
  itinerary: z.array(itineraryItemSchema).default([]),
  notSuitableFor: z.array(z.string()).default([]),
  notAllowed: z.array(z.string()).default([]),
  whatToBring: z.array(z.string()).default([]),
  // Add other critical fields
}).passthrough();

export const blogPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug is required"),
  category: z.string().optional(),
  content: z.any(), // Editor.js JSON data
  excerpt: z.string().optional(),
  author: z.string().optional(),
  coverImage: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("published"),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  keywords: z.string().optional(),
});

