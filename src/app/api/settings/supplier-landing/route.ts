import { NextResponse } from "next/server";
import { queryD1 } from "@/lib/db";

const DEFAULT_SUPPLIER_LANDING_CMS = {
  navItems: [
    { label: "Overview", href: "/landing" },
    { label: "Benefits", href: "/landing/benefits" },
    { label: "Growth Hub", href: "/landing/growthhub" },
    { label: "FAQs", href: "/landing/faq" },
    { label: "Help Center", href: "/landing/helpcenter" }
  ],
  pages: {
    overview: {
      hero_show: true,
      hero_badge: "Operator Onboarding Hub",
      hero_title: "Grow Your Activity Business with\nTour Geeky Partner",
      hero_description: "List your sunset cruises, yachting excursions, historical walking tours, and vineyard wine tastings. Reach active global Greece travelers and manage bookings effortlessly.",
      hero_ctaText: "Apply Now",
      hero_image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80",
      benefits_show: true,
      benefits_title: "Why Partner with Us?",
      benefits_subtitle: "Everything you need to list, manage, and scale Greece experiential business.",
      stats_show: true,
      stats_title: "Our Greece Marketplace Impact",
      stats_subtitle: "Greece's premier channel for premium experiential excursions.",
      workflow_show: true,
      workflow_title: "How It Works",
      workflow_subtitle: "Simple 4-step workflow from partner registration to payout.",
      stories_show: true,
      stories_title: "Greek Operator Stories",
      stories_subtitle: "Hear from verified travel operators running experiences on Tour Geeky Greece.",
      faq_show: true,
      faq_title: "Frequently Asked Questions",
      faq_subtitle: "Have questions about payouts, listings, or commissions?"
    },
    benefits: {
      hero_show: true,
      hero_badge: "Partner Privileges & Growth",
      hero_title: "Keep More of What You Earn with Tour Geeky",
      hero_description: "Discover why Greek yacht captains, independent travel curators, and boutique activity planners choose our transparent 10% flat commission model.",
      table_show: true,
      table_title: "Comparing Industry Commissions",
      table_subtitle: "How Tour Geeky stacks up against global third-party channels."
    },
    growthhub: {
      hero_show: true,
      hero_badge: "Operator Growth & Optimizations",
      hero_title: "Accelerate Your Experiential Brand with Growth Hub",
      hero_description: "Gain strategic market insights, dynamic pricing recommendations, and expert content formatting guides from the Tour Geeky operations crew.",
      tips_show: true,
      tips_title: "Seasonal Strategy Manual",
      tips_subtitle: "Maximal sales strategies optimized for Greece tourist seasons."
    },
    faq: {
      hero_show: true,
      hero_badge: "Partner Support & Help Manual",
      hero_title: "Operator Frequently Asked Questions",
      hero_description: "Quickly find answers regarding secure payouts, commission rates, guest cancellations, bad-weather contingencies, and listing setup wizards."
    },
    helpcenter: {
      hero_show: true,
      hero_badge: "Operational Assistance Hub",
      hero_title: "How Can We Support Your Operations?",
      hero_description: "Reach our operator support center directly or browse detailed step-by-step walkthroughs to configure prices, sync schedules, and authorize Stripe bank accounts.",
      guides_show: true,
      guides_title: "Onboarding Setup Handbook",
      guides_subtitle: "Everything you need to configure in under 10 minutes."
    }
  }
};

export async function GET() {
  try {
    const results = await queryD1("SELECT value FROM site_settings WHERE key = 'supplier_landing_cms'");
    
    if (results.length === 0) {
      return NextResponse.json(DEFAULT_SUPPLIER_LANDING_CMS);
    }

    return NextResponse.json(JSON.parse(results[0].value));
  } catch (error) {
    console.error("Supplier CMS GET Error:", error);
    return NextResponse.json(DEFAULT_SUPPLIER_LANDING_CMS);
  }
}
