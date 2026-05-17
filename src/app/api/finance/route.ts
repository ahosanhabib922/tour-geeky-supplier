import { NextRequest, NextResponse } from "next/server";
import { queryD1 } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const supplierId = request.nextUrl.searchParams.get("supplier_id");

    // Get commission rate for this supplier
    let commissionRate = 10; // default 10%
    if (supplierId) {
      const supplierResult = await queryD1(
        "SELECT commission_rate FROM users WHERE id = ?", [supplierId]
      );
      if (supplierResult?.[0]?.commission_rate) {
        commissionRate = supplierResult[0].commission_rate;
      }
    }

    // Build WHERE clause
    const whereClause = supplierId
      ? "WHERE (b.supplier_id = ? OR p.supplier_id = ?)"
      : "WHERE 1=1";
    const params = supplierId ? [supplierId, supplierId] : [];

    // Gross sales
    const grossResult = await queryD1(`
      SELECT COALESCE(SUM(b.total_price), 0) as total 
      FROM bookings b
      LEFT JOIN products p ON b.product_id = p.id
      ${whereClause} AND b.status = 'confirmed'
    `, params);
    const grossSales = grossResult?.[0]?.total || 0;

    // Commission paid
    const commissionPaid = grossSales * (commissionRate / 100);

    // Net earnings
    const netEarnings = grossSales - commissionPaid;

    // Total bookings count
    const countResult = await queryD1(`
      SELECT COUNT(*) as count 
      FROM bookings b
      LEFT JOIN products p ON b.product_id = p.id
      ${whereClause}
    `, params);
    const totalBookings = countResult?.[0]?.count || 0;

    // Recent payouts (individual booking transactions)
    const transactions = await queryD1(`
      SELECT 
        b.id, b.customer_name, b.total_price, b.currency,
        b.payment_status, b.status, b.created_at,
        p.title as product_title
      FROM bookings b
      LEFT JOIN products p ON b.product_id = p.id
      ${whereClause}
      ORDER BY b.created_at DESC
      LIMIT 15
    `, params);

    return NextResponse.json({
      grossSales,
      commissionRate,
      commissionPaid,
      netEarnings,
      totalBookings,
      transactions: transactions || []
    });
  } catch (error) {
    console.error("Supplier Finance API Error:", error);
    return NextResponse.json({ error: "Failed to fetch finance data" }, { status: 500 });
  }
}
