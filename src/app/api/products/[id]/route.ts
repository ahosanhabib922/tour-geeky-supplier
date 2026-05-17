import { NextResponse } from "next/server";
import { queryD1 } from "@/lib/db";
import { mapProductFromDB } from "@shared/lib/mappers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const results = await queryD1("SELECT * FROM products WHERE id = ?", [id]);

    if (results.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(mapProductFromDB(results[0]));
  } catch (error) {
    console.error("GET Product Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await queryD1("DELETE FROM products WHERE id = ?", [id]);

    // Clean up auxiliary tables (safe — won't fail if tables don't exist)
    const auxiliaryTables = ["availability_overrides", "inventory"];
    for (const table of auxiliaryTables) {
      try {
        await queryD1(`DELETE FROM ${table} WHERE product_id = ?`, [id]);
      } catch {
        // Table may not exist — safe to ignore
      }
    }

    // Trigger revalidation on the client side
    const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3001";
    try {
      fetch(`${clientUrl}/api/revalidate?tag=products&secret=tour-geeky-secret`).catch(() => {});
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("DELETE Error:", message);
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
  }
}
