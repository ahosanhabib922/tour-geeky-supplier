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

    // Trigger Resend email sending for Supplier Registration application (Direct dependency-free HTTPS fetch)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const fromEmail = process.env.RESEND_FROM_EMAIL_PARTNERS || process.env.RESEND_FROM_EMAIL || 'Tour Geeky <bookings@info.oratiq.com>';
      const replyTo = process.env.RESEND_REPLY_TO || 'ahosanhabib922@gmail.com';
      const adminEmail = process.env.RESEND_ADMIN_EMAIL || 'ahosanhabib922@gmail.com';

      // 1. Send Welcome Email to Supplier
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: fromEmail,
            to: email,
            replyTo: replyTo,
            subject: `Tour Geeky Greece: Application Received!`,
            html: `
              <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; color: #1e293b;">
                <div style="text-align: center; margin-bottom: 32px;">
                  <h2 style="font-size: 20px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #0f172a; margin: 0;">TOUR GEEKY</h2>
                  <span style="font-size: 10px; font-weight: 700; color: #64748b; letter-spacing: 2px; text-transform: uppercase;">Greece Partner Onboarding</span>
                </div>

                <div style="margin-bottom: 24px;">
                  <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 12px 0; letter-spacing: -0.5px;">Welcome to Tour Geeky Greece, ${name || "Partner"}!</h1>
                  <p style="font-size: 14px; color: #475569; margin: 0; line-height: 1.6;">Thank you for your interest in joining Greece's premier curated marketplace for tours and activities. We have received your partner registration application for <strong>${company_name || supplier_name || "your agency"}</strong>.</p>
                </div>

                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; margin-bottom: 32px;">
                  <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 8px; letter-spacing: 1px;">Application Status</span>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                    <span style="display: inline-block; background-color: #fef3c7; border: 1px solid #fde68a; color: #d97706; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 12px; border-radius: 9999px;">Pending Admin Review</span>
                  </div>
                  <p style="font-size: 13px; color: #475569; margin: 0; line-height: 1.5;">Our local partner success desk reviews all Greece operator requests within 24 to 48 business hours to ensure high-quality standards for our international travelers.</p>
                </div>

                <div style="margin-bottom: 32px; border-top: 1px solid #f1f5f9; padding-top: 24px;">
                  <h3 style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #0f172a; margin: 0 0 12px 0; letter-spacing: 1px;">Registration Profile</h3>
                  <p style="font-size: 13px; color: #334155; margin: 0 0 6px 0;"><strong>Company Name:</strong> ${company_name || "N/A"}</p>
                  <p style="font-size: 13px; color: #334155; margin: 0 0 6px 0;"><strong>Brand Name:</strong> ${supplier_name || "N/A"}</p>
                  <p style="font-size: 13px; color: #334155; margin: 0 0 6px 0;"><strong>Contact Email:</strong> ${email}</p>
                  <p style="font-size: 13px; color: #334155; margin: 0;"><strong>Contact Phone:</strong> ${phone || "N/A"}</p>
                </div>

                <div style="border-top: 1px solid #f1f5f9; padding-top: 24px; margin-bottom: 32px;">
                  <h3 style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #0f172a; margin: 0 0 12px 0; letter-spacing: 1px;">Next Steps</h3>
                  <ol style="font-size: 13px; color: #475569; padding-left: 20px; margin: 0; line-height: 1.6;">
                    <li style="margin-bottom: 8px;">Our Greece admin team will verify your company status and operating licensing.</li>
                    <li style="margin-bottom: 8px;">Once approved, you will receive a secondary activation email to log into the <strong>Tour Geeky Supplier Portal</strong>.</li>
                    <li style="margin-bottom: 0;">In the supplier portal, you will be able to upload your visual active catalogs, inventory hours, and set payouts accounts.</li>
                  </ol>
                </div>

                <div style="border-top: 1px solid #f1f5f9; padding-top: 24px; text-align: center; font-size: 11px; color: #94a3b8;">
                  If you did not request this partner registration, please ignore this email or reach us at <a href="mailto:partners@tourgeeky.com" style="color: #0f172a; text-decoration: underline;">partners@tourgeeky.com</a>.
                  <div style="margin-top: 16px; font-size: 10px;">
                    &copy; 2026 Tour Geeky Partner Services. Athens, Greece.
                  </div>
                </div>
              </div>
            `
          })
        });
      } catch (suppMailErr) {
        console.error("Supplier Onboarding Welcome Email Failed:", suppMailErr);
      }

      // 2. Send Alert Email to Admin Notification Desk
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: fromEmail,
            to: adminEmail,
            replyTo: replyTo,
            subject: `🚨 New Operator Registration Request: ${company_name || supplier_name}`,
            html: `
              <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 24px; color: #0f172a;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <span style="font-size: 10px; font-weight: 800; color: #dc2626; border: 1px solid #fca5a5; background-color: #fef2f2; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px;">Admin Dashboard Alert</span>
                </div>

                <h1 style="font-size: 20px; font-weight: 800; margin: 0 0 16px 0; color: #0f172a;">New Partner Account Under Review</h1>
                <p style="font-size: 14px; color: #334155; line-height: 1.5; margin: 0 0 24px 0;">A new tour operator has submitted an onboarding request. Details are registered in Cloudflare D1:</p>

                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 24px; font-size: 13px;">
                  <p style="margin: 0 0 8px 0;"><strong>Company Registered:</strong> ${company_name || "N/A"}</p>
                  <p style="margin: 0 0 8px 0;"><strong>Brand:</strong> ${supplier_name || "N/A"}</p>
                  <p style="margin: 0 0 8px 0;"><strong>Contact Full Name:</strong> ${name || "N/A"}</p>
                  <p style="margin: 0 0 8px 0;"><strong>Contact Email:</strong> ${email}</p>
                  <p style="margin: 0 0 8px 0;"><strong>Contact Phone:</strong> ${phone || "N/A"}</p>
                  <p style="margin: 0;"><strong>Assigned ID:</strong> ${userId}</p>
                </div>

                <div style="text-align: center; margin-top: 32px;">
                  <a href="${process.env.RESEND_ADMIN_PORTAL_URL || 'https://admin-tourgeeky.vercel.app'}/suppliers" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-weight: 700; font-size: 12px; text-transform: uppercase; padding: 12px 24px; border-radius: 12px; text-decoration: none; letter-spacing: 0.5px;">Review Application inside Admin Portal</a>
                </div>
              </div>
            `
          })
        });
      } catch (adminMailErr) {
        console.error("Admin Registration Request Notification Failed:", adminMailErr);
      }
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
