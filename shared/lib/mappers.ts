import { Product } from "../types/product";

/** Safely parse JSON with a fallback value */
function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

/**
 * Maps a raw D1 database row (snake_case) to a Product object (camelCase).
 * Single source of truth — used by both admin and client API routes.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapProductFromDB(p: Record<string, any>): Product & { slug?: string; latitude?: number; longitude?: number } {
  return {
    id: p.id,
    title: p.title,
    category: p.category,
    location: p.location,
    shortDescription: p.short_description,
    longDescription: p.long_description,
    status: p.status,
    currency: p.currency,
    coverImage: p.cover_image,
    language: p.language,
    safetyDetails: p.safety_details,
    fitnessLevel: p.fitness_level,
    guideType: p.guide_type,
    hasFood: p.has_food === 1,
    hasTransportation: p.has_transportation === 1,
    metaTitle: p.meta_title,
    metaDescription: p.meta_description,
    // JSON fields — safely parsed
    images: safeJsonParse(p.images, []),
    keywords: safeJsonParse(p.keywords, []),
    highlights: safeJsonParse(p.highlights, []),
    options: safeJsonParse(p.options, []),
    inclusions: safeJsonParse(p.inclusions, []),
    exclusions: safeJsonParse(p.exclusions, []),
    healthRestrictions: safeJsonParse(p.health_restrictions, []),
    extraInfo: safeJsonParse(p.extra_info, []),
    itinerary: safeJsonParse(p.itinerary, []),
    notSuitableFor: safeJsonParse(p.not_suitable_for, []),
    notAllowed: safeJsonParse(p.not_allowed, []),
    whatToBring: safeJsonParse(p.what_to_bring, []),
    cancellationPolicy: p.cancellation_policy || 'standard',
    // Extra DB fields
    slug: p.slug,
    latitude: p.latitude,
    longitude: p.longitude,
    supplier_id: p.supplier_id,
  };
}
