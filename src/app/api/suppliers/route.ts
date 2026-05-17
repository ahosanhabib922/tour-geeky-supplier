import { NextResponse } from "next/server";
import { queryD1 } from "@/lib/db";

export async function GET() {
  try {
    const sql = `
      SELECT 
        s.id, s.name, s.email, s.phone, s.supplier_name, s.company_name, s.supplier_status, s.commission_rate, s.created_at,
        u.image, u.role,
        (SELECT COUNT(*) FROM products p WHERE p.supplier_id = s.id) as products_count,
        (SELECT COUNT(*) FROM bookings b WHERE b.supplier_id = s.id) as bookings_count,
        (SELECT COALESCE(SUM(b.total_price), 0) FROM bookings b WHERE b.supplier_id = s.id AND b.payment_status = 'paid') as total_revenue
      FROM suppliers s
      LEFT JOIN users u ON s.id = u.id
      ORDER BY s.created_at DESC
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
    const { id: firebaseUid, name, email, supplier_name, company_name, phone, commission_rate } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. Check if user already exists in D1 database by email or firebaseUid
    const checkUserSql = "SELECT id, role FROM users WHERE email = ? OR id = ?";
    const existingUsers = await queryD1(checkUserSql, [email, firebaseUid || ""]);

    let userId: string;

    if (existingUsers && existingUsers.length > 0) {
      userId = existingUsers[0].id;
      
      // Update existing user profile role to 'supplier'
      const updateUserSql = `
        UPDATE users 
        SET 
          role = 'supplier',
          name = COALESCE(?, name),
          phone = COALESCE(?, phone),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      await queryD1(updateUserSql, [name || null, phone || null, userId]);
    } else {
      // 2. User doesn't exist, create user record first
      userId = firebaseUid || "sup_" + Math.random().toString(36).substring(2, 11);
      const insertUserSql = `
        INSERT INTO users (id, name, email, phone, role)
        VALUES (?, ?, ?, ?, 'supplier')
      `;
      await queryD1(insertUserSql, [
        userId,
        name || "New Supplier User",
        email,
        phone || null
      ]);
    }

    // 3. Create or update the business profile in the suppliers table
    const checkSupplierSql = "SELECT id FROM suppliers WHERE id = ? OR email = ?";
    const existingSuppliers = await queryD1(checkSupplierSql, [userId, email]);

    if (existingSuppliers && existingSuppliers.length > 0) {
      const updateSupplierSql = `
        UPDATE suppliers
        SET
          name = COALESCE(?, name),
          phone = COALESCE(?, phone),
          supplier_name = ?,
          company_name = ?,
          supplier_status = 'pending',
          commission_rate = COALESCE(?, commission_rate),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      await queryD1(updateSupplierSql, [
        name || null,
        phone || null,
        supplier_name || "New Supplier Brand",
        company_name || null,
        commission_rate !== undefined ? Number(commission_rate) : 10.0,
        userId
      ]);
    } else {
      const insertSupplierSql = `
        INSERT INTO suppliers (id, user_id, name, email, phone, supplier_name, company_name, supplier_status, commission_rate)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)
      `;
      await queryD1(insertSupplierSql, [
        userId,
        userId,
        name || "New Supplier",
        email,
        phone || null,
        supplier_name || "New Supplier Brand",
        company_name || null,
        commission_rate !== undefined ? Number(commission_rate) : 10.0
      ]);
    }

    return NextResponse.json({ success: true, id: userId });
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
      UPDATE suppliers 
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
