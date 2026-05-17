import { NextResponse } from "next/server";
import { queryD1 } from "@/lib/db";
import { siteSettingsSchema, SiteSettings } from "@shared/index";

const DEFAULT_SETTINGS: SiteSettings = {
  hero: {
    title: "Radiant Revelries,\nSparkling Summer Parties Easy!",
    description: "Dive into the ultimate summer party experience with SumipSplash Celebrations! We specialize in creating vibrant events.",
    images: [
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572338146746-12c125712534?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531722569936-825d3dd91b15?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=600&auto=format&fit=crop"
    ],
    ctaText: "Get Started",
    ctaLink: "/",
    subText: "Pause or cancel service anytime."
  },
  navigation: [
    { name: 'Home', href: '/', hasDropdown: false, subItems: [] },
    { name: 'Planning', href: '#', hasDropdown: true, subItems: [] },
    { name: 'Summer-Parties', href: '#', hasDropdown: true, subItems: [] },
    { name: 'Pricing', href: '#', hasDropdown: false, subItems: [] },
    { name: 'FAQs', href: '#', hasDropdown: false, subItems: [] },
  ],
  sections: {
    trending: {
      title: "Trending Activities",
      description: ""
    },
    categories: {
      title: "Explore by Category",
      description: "Find the perfect vibe for your next summer adventure."
    }
  }
};

export async function GET() {
  try {
    // Ensure table exists
    await queryD1(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const results = await queryD1("SELECT value FROM site_settings WHERE key = 'landing_page'");
    
    if (results.length === 0) {
      return NextResponse.json(DEFAULT_SETTINGS);
    }

    return NextResponse.json(JSON.parse(results[0].value));
  } catch (error) {
    console.error("Settings GET Error:", error);
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = siteSettingsSchema.safeParse(body);
    
    if (!validation.success) {
      console.log("VALIDATION FAILED:", validation.error.flatten());
      return NextResponse.json({ 
        success: false, 
        error: "Validation failed", 
        details: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }


    const sql = `
      INSERT INTO site_settings (key, value)
      VALUES ('landing_page', ?)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = CURRENT_TIMESTAMP
    `;

    await queryD1(sql, [JSON.stringify(validation.data)]);
    
    // Trigger revalidation on the client side
    // We try both localhost and a potential production URL from environment variables
    const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3001";
    try {
      fetch(`${clientUrl}/api/revalidate?tag=site-settings&secret=tour-geeky-secret`).catch(() => {});
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings POST Error:", error);
    return NextResponse.json({ success: false, error: "Failed to save settings" }, { status: 500 });
  }
}
