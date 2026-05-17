import { NextResponse } from "next/server";
import { queryD1 } from "@/lib/db";

export async function GET() {
  try {
    // 1. Total Customers
    const usersResult = await queryD1("SELECT COUNT(*) as count FROM users");
    const totalUsers = usersResult?.[0]?.count || 0;

    // 2. Monthly Orders
    const ordersResult = await queryD1(
      "SELECT COUNT(*) as count FROM bookings WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')"
    );
    const monthlyOrders = ordersResult?.[0]?.count || 0;

    // 3. Total Revenue
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
