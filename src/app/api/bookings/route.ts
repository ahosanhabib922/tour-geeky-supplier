import { NextResponse } from "next/server";
import { queryD1 } from "@/lib/db";

export async function GET() {
  try {
    const sql = `
      SELECT b.*, p.title as product_title 
      FROM bookings b
      LEFT JOIN products p ON b.product_id = p.id
      ORDER BY b.created_at DESC
    `;
    const bookings = await queryD1(sql);

    return NextResponse.json(bookings || []);
  } catch (error) {
    console.error("Admin Bookings API Error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
