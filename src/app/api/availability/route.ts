import { NextResponse } from "next/server";
import { queryD1 } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const optionId = searchParams.get("optionId");
  const date = searchParams.get("date");

  if (!productId || !optionId || !date) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const override = await queryD1(
      "SELECT * FROM availability_overrides WHERE product_id = ? AND option_id = ? AND date = ?",
      [productId, optionId, date]
    );

    const inventory = await queryD1(
      "SELECT * FROM inventory WHERE product_id = ? AND option_id = ? AND date = ?",
      [productId, optionId, date]
    );

    return NextResponse.json({
      override: override[0] || null,
      inventory: inventory || []
    });
  } catch (error) {
    console.error("Availability GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, optionId, date, isBlocked, capacityOverride } = body;

    const sql = `
      INSERT INTO availability_overrides (id, product_id, option_id, date, is_blocked, capacity_override)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(product_id, option_id, date) DO UPDATE SET
        is_blocked = excluded.is_blocked,
        capacity_override = excluded.capacity_override
    `;

    const id = `${productId}_${optionId}_${date}`;
    await queryD1(sql, [id, productId, optionId, date, isBlocked ? 1 : 0, capacityOverride]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Availability POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
