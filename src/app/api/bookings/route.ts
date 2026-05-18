import { NextRequest, NextResponse } from "next/server";
import { queryD1 } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const supplierId = request.nextUrl.searchParams.get("supplier_id");
    const email = request.nextUrl.searchParams.get("email");
    let sql: string;
    let params: any[] = [];

    let targetSupplierId = supplierId;

    if (email) {
      const supplierResult = await queryD1("SELECT id FROM suppliers WHERE email = ?", [email]);
      if (supplierResult && supplierResult.length > 0) {
        targetSupplierId = supplierResult[0].id;
      } else {
        return NextResponse.json([]); // email provided but supplier not found
      }
    }

    if (targetSupplierId) {
      sql = `
        SELECT b.*, p.title as product_title 
        FROM bookings b
        LEFT JOIN products p ON b.product_id = p.id
        WHERE b.supplier_id = ? OR p.supplier_id = ?
        ORDER BY b.created_at DESC
      `;
      params = [targetSupplierId, targetSupplierId];
    } else {
      sql = `
        SELECT b.*, p.title as product_title 
        FROM bookings b
        LEFT JOIN products p ON b.product_id = p.id
        ORDER BY b.created_at DESC
      `;
    }

    const bookings = await queryD1(sql, params);
    return NextResponse.json(bookings || []);
  } catch (error) {
    console.error("Supplier Bookings API Error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
