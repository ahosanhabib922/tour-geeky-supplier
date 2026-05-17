import { NextResponse } from "next/server";
import { queryD1 } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Static Pages
    const paths = [
      { label: "Home", path: "/" },
      { label: "Blog Listing", path: "/blog" },
      { label: "About Us", path: "/about" },
      { label: "Contact Us", path: "/contact" },
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Terms of Service", path: "/terms" },
      { label: "Refund Policy", path: "/refund" },
      { label: "Wishlist", path: "/wishlist" },
      { label: "Cart", path: "/cart" },
    ];

    // 2. Fetch Categories
    const categories = await queryD1("SELECT name, slug FROM categories");
    categories.forEach((cat: any) => {
      paths.push({ label: `Category: ${cat.name}`, path: `/category/${cat.slug}` });
    });

    // 3. Fetch Blogs
    const blogs = await queryD1("SELECT title, id FROM blog_posts WHERE status = 'published'");
    blogs.forEach((blog: any) => {
      paths.push({ label: `Blog: ${blog.title}`, path: `/blog/${blog.id}` });
    });

    // 4. Fetch Products
    const products = await queryD1("SELECT title, id FROM products WHERE status = 'published'");
    products.forEach((product: any) => {
      paths.push({ label: `Product: ${product.title}`, path: `/products/${product.id}` });
    });

    // 5. Locations (unique from products)
    const locations = await queryD1("SELECT DISTINCT location FROM products WHERE location IS NOT NULL");
    locations.forEach((loc: any) => {
      const slug = loc.location.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
      paths.push({ label: `Location: ${loc.location}`, path: `/location/${slug}` });
    });

    return NextResponse.json(paths);
  } catch (error) {
    console.error("Paths API Error:", error);
    return NextResponse.json([]);
  }
}
