import { NextResponse } from "next/server";
import { queryD1 } from "@/lib/db";

export async function GET() {
  try {
    // Fetch users and their booking counts/total spent
    const sql = `
      SELECT 
        u.*, 
        COUNT(b.id) as bookings_count,
        SUM(b.total_price) as total_spent
      FROM users u
      LEFT JOIN bookings b ON u.id = b.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `;
    const customers = await queryD1(sql);

    return NextResponse.json(customers || []);
  } catch (error) {
    console.error("Admin Customers API Error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
