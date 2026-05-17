import { NextResponse } from "next/server";
import { queryD1 } from "@/lib/db";

export async function GET() {
  try {
    const sql = `
      SELECT 
        u.id, u.name, u.email, u.phone, u.image, u.role, u.created_at,
        u.supplier_name, u.company_name, u.supplier_status, u.commission_rate,
        (SELECT COUNT(*) FROM products p WHERE p.supplier_id = u.id) as products_count,
        (SELECT COUNT(*) FROM bookings b WHERE b.supplier_id = u.id) as bookings_count,
        (SELECT COALESCE(SUM(b.total_price), 0) FROM bookings b WHERE b.supplier_id = u.id AND b.payment_status = 'paid') as total_revenue
      FROM users u
      WHERE u.role = 'supplier' OR u.supplier_name IS NOT NULL OR u.company_name IS NOT NULL
      ORDER BY u.created_at DESC
    `;
    const suppliers = await queryD1(sql);
    return NextResponse.json(suppliers || []);
  } catch (error) {
    console.error("Admin Suppliers GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, supplier_name, company_name, commission_rate } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const id = "sup_" + Math.random().toString(36).substring(2, 11);
    const sql = `
      INSERT INTO users (id, name, email, role, supplier_name, company_name, supplier_status, commission_rate)
      VALUES (?, ?, ?, 'supplier', ?, ?, 'pending', ?)
    `;
    await queryD1(sql, [
      id,
      name || supplier_name || "New Supplier",
      email,
      supplier_name || name || "New Supplier",
      company_name || null,
      commission_rate !== undefined ? Number(commission_rate) : 10.0
    ]);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Admin Suppliers POST Error:", error);
    return NextResponse.json({ error: "Failed to create supplier" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, supplier_status, commission_rate, company_name, supplier_name } = body;

    if (!id) {
      return NextResponse.json({ error: "Supplier ID is required" }, { status: 400 });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (supplier_status !== undefined) {
      updates.push("supplier_status = ?");
      values.push(supplier_status);
    }
    if (commission_rate !== undefined) {
      updates.push("commission_rate = ?");
      values.push(Number(commission_rate));
    }
    if (company_name !== undefined) {
      updates.push("company_name = ?");
      values.push(company_name);
    }
    if (supplier_name !== undefined) {
      updates.push("supplier_name = ?");
      values.push(supplier_name);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(id);
    const sql = `
      UPDATE users 
      SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await queryD1(sql, values);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin Suppliers PUT Error:", error);
    return NextResponse.json({ error: "Failed to update supplier" }, { status: 500 });
  }
}
