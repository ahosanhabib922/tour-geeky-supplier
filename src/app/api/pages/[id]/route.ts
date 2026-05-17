import { NextResponse } from "next/server";
import { queryD1 } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const results = await queryD1("SELECT * FROM pages WHERE id = ?", [id]);


    if (results.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(results[0]);
  } catch (error) {
    console.error("Page GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();
    const { title, content } = body;

    const sql = `
      INSERT INTO pages (id, title, content)
      VALUES (?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        content = excluded.content,
        updated_at = CURRENT_TIMESTAMP
    `;

    await queryD1(sql, [id, title, content]);

    // Trigger revalidation on client side if needed
    const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3001";
    try {
      fetch(`${clientUrl}/api/revalidate?tag=pages&secret=tour-geeky-secret`).catch(() => {});
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Page POST Error:", error);
    return NextResponse.json({ success: false, error: "Failed to save page" }, { status: 500 });
  }
}
