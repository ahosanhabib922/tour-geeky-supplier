import { NextRequest, NextResponse } from "next/server";
import { queryD1 } from "@/lib/db";
import { mapProductFromDB, productSchema } from "@shared/index";

export async function GET(request: NextRequest) {
  try {
    const supplierId = request.nextUrl.searchParams.get("supplier_id");
    let results;
    if (supplierId) {
      results = await queryD1("SELECT * FROM products WHERE supplier_id = ? ORDER BY created_at DESC", [supplierId]);
    } else {
      results = await queryD1("SELECT * FROM products ORDER BY created_at DESC");
    }
    const products = results.map(mapProductFromDB);
    return NextResponse.json(products);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    
    // Validate with Zod
    const validation = productSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json({ 
        success: false, 
        error: "Validation failed", 
        details: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }
    
    const product = validation.data;
    const id = (rawBody.id as string) || crypto.randomUUID();

    // Generate slug if missing
    const slug =
      product.slug ||
      product.title
        ?.toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-")
        .trim();

    const sql = `
      INSERT INTO products (
        id, title, category, location, short_description, long_description, status, 
        currency, cover_image, images, keywords, highlights, options, language, 
        inclusions, exclusions, health_restrictions, safety_details,
        fitness_level, guide_type, has_food, has_transportation,
        slug, meta_title, meta_description, latitude, longitude, itinerary,
        not_suitable_for, not_allowed, what_to_bring, cancellation_policy, supplier_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        category = excluded.category,
        location = excluded.location,
        short_description = excluded.short_description,
        long_description = excluded.long_description,
        status = excluded.status,
        currency = excluded.currency,
        cover_image = excluded.cover_image,
        images = excluded.images,
        keywords = excluded.keywords,
        highlights = excluded.highlights,
        options = excluded.options,
        language = excluded.language,
        inclusions = excluded.inclusions,
        exclusions = excluded.exclusions,
        health_restrictions = excluded.health_restrictions,
        safety_details = excluded.safety_details,
        fitness_level = excluded.fitness_level,
        guide_type = excluded.guide_type,
        has_food = excluded.has_food,
        has_transportation = excluded.has_transportation,
        slug = excluded.slug,
        meta_title = excluded.meta_title,
        meta_description = excluded.meta_description,
        latitude = excluded.latitude,
        longitude = excluded.longitude,
        itinerary = excluded.itinerary,
        not_suitable_for = excluded.not_suitable_for,
        not_allowed = excluded.not_allowed,
        what_to_bring = excluded.what_to_bring,
        cancellation_policy = excluded.cancellation_policy,
        supplier_id = excluded.supplier_id,
        updated_at = CURRENT_TIMESTAMP
    `;

    const params = [
      id,
      product.title,
      product.category,
      product.location,
      product.shortDescription,
      product.longDescription,
      (product.status || "published").toLowerCase(),
      product.currency,
      product.coverImage,
      JSON.stringify(product.images || []),
      JSON.stringify(product.keywords || []),
      JSON.stringify(product.highlights || []),
      JSON.stringify(product.options || []),
      product.language || "English",
      JSON.stringify(product.inclusions || []),
      JSON.stringify(product.exclusions || []),
      JSON.stringify(product.healthRestrictions || []),
      product.safetyDetails || null,
      product.fitnessLevel || "easy",
      product.guideType || "none",
      product.hasFood ? 1 : 0,
      product.hasTransportation ? 1 : 0,
      slug,
      product.metaTitle || null,
      product.metaDescription || null,
      product.latitude || null,
      product.longitude || null,
      JSON.stringify(product.itinerary || []),
      JSON.stringify(product.notSuitableFor || []),
      JSON.stringify(product.notAllowed || []),
      JSON.stringify(product.whatToBring || []),
      product.cancellationPolicy || 'standard',
      product.supplier_id || null,
    ];

    await queryD1(sql, params);

    // Trigger revalidation on the client side
    const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000";
    try {
      fetch(`${clientUrl}/api/revalidate?tag=products&secret=tour-geeky-secret`).catch(() => {});
    } catch (e) {}

    return NextResponse.json({ success: true, product: { ...product, id, slug } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("POST API ERROR:", message);
    return NextResponse.json({ success: false, error: "Failed to save product" }, { status: 500 });
  }
}
