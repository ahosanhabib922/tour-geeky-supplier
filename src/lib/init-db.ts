import { queryD1 } from "./db";

export async function initDatabase() {
  console.log("🚀 Initializing Database Schema...");

  try {
    // 1. Site Settings Table
    console.log("Creating site_settings table...");
    await queryD1(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Products Table
    console.log("Creating products table...");
    await queryD1(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT,
        location TEXT,
        short_description TEXT,
        long_description TEXT,
        status TEXT DEFAULT 'published',
        currency TEXT DEFAULT 'USD',
        cover_image TEXT,
        images TEXT, -- JSON array
        keywords TEXT, -- JSON array
        highlights TEXT, -- JSON array
        options TEXT, -- JSON array (Pricing, Logistics, Availability)
        language TEXT DEFAULT 'English',
        inclusions TEXT, -- JSON array
        exclusions TEXT, -- JSON array
        health_restrictions TEXT, -- JSON array
        safety_details TEXT,
        fitness_level TEXT DEFAULT 'easy',
        guide_type TEXT DEFAULT 'none',
        has_food INTEGER DEFAULT 0,
        has_transportation INTEGER DEFAULT 0,
        slug TEXT UNIQUE,
        meta_title TEXT,
        meta_description TEXT,
        latitude REAL,
        longitude REAL,
        itinerary TEXT, -- JSON array
        supplier_id TEXT, -- Multi-supplier tracking
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Bookings Table
    console.log("Creating bookings table...");
    await queryD1(`
      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        product_id TEXT,
        user_id TEXT, -- Link to users table
        customer_name TEXT,
        customer_email TEXT,
        customer_phone TEXT,
        booking_date TEXT,
        travel_date TEXT,
        total_price REAL,
        currency TEXT,
        status TEXT DEFAULT 'pending',
        payment_status TEXT DEFAULT 'unpaid',
        metadata TEXT, -- JSON
        supplier_id TEXT, -- Multi-supplier tracking
        commission_amount REAL DEFAULT 0.0, -- Platform fee
        supplier_payout REAL DEFAULT 0.0, -- Supplier net payout
        payout_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // 4. Categories Table
    console.log("Creating categories table...");
    await queryD1(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE,
        description TEXT,
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. Blog Posts Table
    console.log("Creating blog_posts table...");
    await queryD1(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        category TEXT,
        content TEXT NOT NULL, -- Markdown or HTML
        excerpt TEXT,
        author TEXT,
        cover_image TEXT,
        tags TEXT, -- JSON array
        status TEXT DEFAULT 'published',
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 6. Static Pages Table
    console.log("Creating pages table...");
    await queryD1(`
      CREATE TABLE IF NOT EXISTS pages (
        id TEXT PRIMARY KEY, -- 'privacy', 'terms', 'refund', 'about', 'contact'
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 7. Users Table
    console.log("Creating users table...");
    await queryD1(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        password TEXT, -- Optional for passwordless
        phone TEXT,
        image TEXT,
        role TEXT DEFAULT 'user',
        supplier_name TEXT, -- Supplier display name
        company_name TEXT, -- Supplier legal business name
        supplier_status TEXT DEFAULT 'pending', -- Onboarding status: 'pending', 'active', 'suspended'
        commission_rate REAL DEFAULT 10.0, -- Supplier commission rate
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 8. Verification Codes Table (OTP)
    console.log("Creating verification_codes table...");
    await queryD1(`
      CREATE TABLE IF NOT EXISTS verification_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        code TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        attempts INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure 'attempts' column exists (in case table already existed)
    try {
      await queryD1("ALTER TABLE verification_codes ADD COLUMN attempts INTEGER DEFAULT 0");
    } catch (e) {
      // Column might already exist, ignore error
    }

    // 9. Wishlist Table
    console.log("Creating wishlist table...");
    await queryD1(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id),
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
      )
    `);

    // --- Safe Migrations for Multi-Supplier Support ---
    console.log("Running safe multi-supplier schema alterations...");
    
    // 1. Alter Users Table
    const alterUsers = [
      "ALTER TABLE users ADD COLUMN supplier_name TEXT",
      "ALTER TABLE users ADD COLUMN company_name TEXT",
      "ALTER TABLE users ADD COLUMN supplier_status TEXT DEFAULT 'pending'",
      "ALTER TABLE users ADD COLUMN commission_rate REAL DEFAULT 10.0"
    ];
    for (const sql of alterUsers) {
      try {
        await queryD1(sql);
      } catch (e) {
        // Suppress error if column already exists
      }
    }

    // 2. Alter Products Table
    try {
      await queryD1("ALTER TABLE products ADD COLUMN supplier_id TEXT");
    } catch (e) {
      // Suppress error if column already exists
    }

    // 3. Alter Bookings Table
    const alterBookings = [
      "ALTER TABLE bookings ADD COLUMN supplier_id TEXT",
      "ALTER TABLE bookings ADD COLUMN commission_amount REAL DEFAULT 0.0",
      "ALTER TABLE bookings ADD COLUMN supplier_payout REAL DEFAULT 0.0",
      "ALTER TABLE bookings ADD COLUMN payout_status TEXT DEFAULT 'pending'"
    ];
    for (const sql of alterBookings) {
      try {
        await queryD1(sql);
      } catch (e) {
        // Suppress error if column already exists
      }
    }

    console.log("✅ Database initialization complete.");

  } catch (err) {
    console.error("❌ Database initialization failed:", err);
    throw err;
  }
}
