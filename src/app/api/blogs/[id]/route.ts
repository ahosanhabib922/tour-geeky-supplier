import { NextResponse } from "next/server";
import { queryD1 } from "@/lib/db";
import { blogPostSchema } from "../../../../../shared/lib/validation";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const results = await queryD1("SELECT * FROM blog_posts WHERE id = ?", [id]);

    
    if (results.length === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const blog = results[0];
    
    try {
      return NextResponse.json({
        ...blog,
        content: typeof blog.content === 'string' ? JSON.parse(blog.content || "{}") : blog.content,
        tags: typeof blog.tags === 'string' ? JSON.parse(blog.tags || "[]") : blog.tags,
      });
    } catch (e) {
      return NextResponse.json({
        ...blog,
        content: { blocks: [] },
        tags: [],
      });
    }
  } catch (error) {
    console.error("Fetch Blog Error:", error);
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}


export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validation = blogPostSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ 
        error: "Validation failed", 
        details: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const blog = validation.data;

    const sql = `
      UPDATE blog_posts SET 
        title = ?, 
        slug = ?, 
        category = ?, 
        content = ?, 
        excerpt = ?, 
        author = ?, 
        cover_image = ?, 
        status = ?, 
        meta_title = ?, 
        meta_description = ?, 
        keywords = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const queryParams = [
      blog.title,
      blog.slug,
      blog.category || null,
      JSON.stringify(blog.content),
      blog.excerpt || null,
      blog.author || "Admin",
      blog.coverImage || null,
      blog.status,
      blog.meta_title || null,
      blog.meta_description || null,
      blog.keywords || null,
      id
    ];

    await queryD1(sql, queryParams);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update Blog Error:", error);
    if (error.message?.includes("UNIQUE constraint failed")) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await queryD1("DELETE FROM blog_posts WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Blog Error:", error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
