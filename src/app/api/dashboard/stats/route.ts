import { NextRequest, NextResponse } from "next/server";
import { queryD1 } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const supplierId = request.nextUrl.searchParams.get("supplier_id");

    if (supplierId) {
      // Supplier-scoped stats
      const productsResult = await queryD1(
        "SELECT COUNT(*) as count FROM products WHERE supplier_id = ?", [supplierId]
      );
      const totalProducts = productsResult?.[0]?.count || 0;

      const ordersResult = await queryD1(
        "SELECT COUNT(*) as count FROM bookings WHERE supplier_id = ? AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')",
        [supplierId]
      );
      const monthlyOrders = ordersResult?.[0]?.count || 0;

      const revenueResult = await queryD1(
        "SELECT SUM(total_price) as total FROM bookings WHERE supplier_id = ? AND status = 'confirmed'",
        [supplierId]
      );
      const totalRevenue = revenueResult?.[0]?.total || 0;

      return NextResponse.json({
        totalProducts,
        monthlyOrders,
        totalRevenue
      });
    }

    // Fallback: platform-wide stats (no supplier filter)
    const usersResult = await queryD1("SELECT COUNT(*) as count FROM users");
    const totalUsers = usersResult?.[0]?.count || 0;

    const ordersResult = await queryD1(
      "SELECT COUNT(*) as count FROM bookings WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')"
    );
    const monthlyOrders = ordersResult?.[0]?.count || 0;

    const revenueResult = await queryD1("SELECT SUM(total_price) as total FROM bookings WHERE status = 'confirmed'");
    const totalRevenue = revenueResult?.[0]?.total || 0;

    return NextResponse.json({
      totalUsers,
      monthlyOrders,
      totalRevenue
    });
  } catch (error) {
    console.error("Dashboard Stats API Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
