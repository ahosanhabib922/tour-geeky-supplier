import { z } from "zod";

export const navItemSchema = z.object({
  name: z.string(),
  href: z.string(),
  hasDropdown: z.boolean().default(false),
  subItems: z.array(z.object({
    name: z.string(),
    href: z.string(),
  })).optional().default([]),
});

export const siteSettingsSchema = z.object({
  hero: z.object({
    title: z.string(),
    description: z.string(),
    images: z.array(z.string()),
    ctaText: z.string().default("Get Started"),
    ctaLink: z.string().default("/"),
    subText: z.string().default("Pause or cancel service anytime."),
  }),
  navigation: z.array(navItemSchema),
  sections: z.object({
    trending: z.object({
      title: z.string().default("Trending Activities"),
      description: z.string().optional(),
    }),
    categories: z.object({
      title: z.string().default("Explore by Category"),
      description: z.string().default("Find the perfect vibe for your next summer adventure."),
    }),
  }),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export type NavItem = z.infer<typeof navItemSchema>;
