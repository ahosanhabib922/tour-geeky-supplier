import { NextResponse } from "next/server";
import { initDatabase } from "@/lib/init-db";
import { seedBlog } from "@/lib/seed-blog";

export async function GET() {
  try {
    await initDatabase();
    await seedBlog();

    // Seed default pages
    const { queryD1 } = await import("@/lib/db");
    const defaultPages = [
      { id: 'privacy', title: 'Privacy Policy', content: '<h1>Privacy Policy</h1><p>Your privacy is important to us.</p>' },
      { id: 'refund', title: 'Refund Policy', content: '<h1>Refund Policy</h1><p>Information about our refund policy.</p>' },
      { id: 'terms', title: 'Terms & Conditions', content: '<h1>Terms & Conditions</h1><p>Read our terms and conditions.</p>' },
      { id: 'about', title: 'About Us', content: '<h1>About Us</h1><p>Learn more about Tour Geeky.</p>' },
      { id: 'contact', title: 'Contact Us', content: '<h1>Contact Us</h1><p>Get in touch with us.</p>' },
    ];

    for (const page of defaultPages) {
      await queryD1(`
        INSERT INTO pages (id, title, content) 
        VALUES (?, ?, ?)
        ON CONFLICT(id) DO NOTHING
      `, [page.id, page.title, page.content]);
    }

    // 3. Seed Categories
    const defaultCategories = [
      { id: 'attraction', name: 'Attraction', slug: 'attraction', image: '/assets/categories/actraction.png' },
      { id: 'tour', name: 'Tour', slug: 'tour', image: '/assets/categories/tour.png' },
      { id: 'city-card', name: 'City Card', slug: 'city-card', image: '/assets/categories/city-card.png' },
      { id: 'hop-on', name: 'Hop-on Hop-off', slug: 'hop-on', image: '/assets/categories/hop-on.png' },
      { id: 'transfer', name: 'Transfer', slug: 'transfer', image: '/assets/categories/transfer.png' },
      { id: 'rental', name: 'Rental', slug: 'rental', image: '/assets/categories/rental.png' },
      { id: 'boat', name: 'Boat & Cruises', slug: 'boat', image: '/assets/categories/boat.png' },
      { id: 'others', name: 'Others', slug: 'others', image: '/assets/categories/others.png' },
    ];

    for (const cat of defaultCategories) {
      await queryD1(`
        INSERT INTO categories (id, name, slug, image) 
        VALUES (?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET 
          name = excluded.name, 
          slug = excluded.slug, 
          image = excluded.image
      `, [cat.id, cat.name, cat.slug, cat.image]);
    }

    // 4. Data Migration: Update products with old category IDs
    await queryD1("UPDATE products SET category = 'hop-on' WHERE category = 'hop_on_hop_off' OR category = 'hop-on-hop-off'");
    await queryD1("UPDATE products SET category = 'city-card' WHERE category = 'city_card'");
    await queryD1("UPDATE products SET category = 'boat' WHERE category = 'boat-cruises'");

    
    return NextResponse.json({ 
      success: true, 
      message: "Database initialized, blog seeded, and pages created." 
    });

  } catch (error) {
    console.error("Setup Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Setup failed" 
    }, { status: 500 });
  }
}
