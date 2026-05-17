import { queryD1 } from "./db";

const BLOG_POSTS = [
  {
    id: '1',
    title: 'Top 10 Hidden Beaches for Private Summer Parties',
    slug: 'hidden-beaches-private-parties',
    category: 'Guide',
    content: `
      <p>Discover the most secluded spots for your next beach celebration, away from the usual tourist crowds. In this guide, we reveal our top picks for pristine coastlines where you can host the ultimate private party.</p>
      <h2>1. Cala Luna, Sardinia</h2>
      <p>Reachable only by boat or a challenging hike, Cala Luna offers dramatic cliffs and turquoise waters perfect for an intimate gathering.</p>
      <h2>2. Shipwreck Beach, Zakynthos</h2>
      <p>While popular, the evening hours offer a serene atmosphere as the day-trippers leave. The limestone cliffs provide a natural amphitheater for your music.</p>
    `,
    author: 'Sarah Mitchell',
    cover_image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'Discover the most secluded spots for your next beach celebration, away from the usual tourist crowds.'
  },
  {
    id: '2',
    title: 'How to Organize the Ultimate Yacht Getaway',
    slug: 'ultimate-yacht-getaway',
    category: 'Planning',
    content: `
      <p>Everything you need to know about chartering a yacht and planning a perfect day at sea. From choosing the right vessel to selecting the perfect itinerary, we've got you covered.</p>
      <h2>Choosing Your Yacht</h2>
      <p>Consider the size of your group and the level of luxury you desire. Catamarans are great for stability, while motor yachts offer speed and prestige.</p>
    `,
    author: 'James Wilson',
    cover_image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'Everything you need to know about chartering a yacht and planning a perfect day at sea.'
  }
];

export async function seedBlog() {
  console.log("🌱 Seeding Blog Posts...");
  try {
    for (const post of BLOG_POSTS) {
      await queryD1(`
        INSERT INTO blog_posts (id, title, slug, category, content, author, cover_image, excerpt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(slug) DO UPDATE SET
          title = excluded.title,
          content = excluded.content,
          author = excluded.author,
          cover_image = excluded.cover_image,
          excerpt = excluded.excerpt,
          updated_at = CURRENT_TIMESTAMP
      `, [post.id, post.title, post.slug, post.category, post.content, post.author, post.cover_image, post.excerpt]);
    }
    console.log("✅ Seeding complete.");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    throw err;
  }
}
