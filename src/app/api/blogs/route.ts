import { NextResponse } from "next/server";
import { queryD1 } from "@/lib/db";
import { blogPostSchema } from "../../../../shared/lib/validation";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const results = await queryD1("SELECT * FROM blog_posts ORDER BY created_at DESC");
    
    // Parse JSON fields
    const blogs = results.map((blog: any) => {
      let parsedContent: { blocks: any[] } = { blocks: [] };
      let parsedTags: string[] = [];

      try {
        if (typeof blog.content === 'string') {
          if (blog.content.trim().startsWith('{')) {
            parsedContent = JSON.parse(blog.content);
          } else if (blog.content) {
            // Handle legacy HTML content by wrapping it in a single paragraph block
            parsedContent = {
              blocks: [{
                type: 'paragraph',
                data: { text: blog.content }
              }]
            };
          }
        } else {
          parsedContent = blog.content || { blocks: [] };
        }
      } catch (e) {
        console.error(`Error parsing blog content ${blog.id}:`, e);
      }

      try {
        parsedTags = typeof blog.tags === 'string' ? JSON.parse(blog.tags || "[]") : (blog.tags || []);
      } catch (e) {
        console.error(`Error parsing blog tags ${blog.id}:`, e);
      }

      return {
        ...blog,
        content: parsedContent,
        tags: parsedTags,
      };
    });

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Fetch Blogs Error:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = blogPostSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ 
        error: "Validation failed", 
        details: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const blog = validation.data;
    const id = uuidv4();

    const sql = `
      INSERT INTO blog_posts (
        id, title, slug, category, content, excerpt, author, cover_image, 
        status, meta_title, meta_description, keywords, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      id,
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
      blog.status === "published" ? new Date().toISOString() : null
    ];

    await queryD1(sql, params);

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("Create Blog Error:", error);
    if (error.message?.includes("UNIQUE constraint failed")) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
