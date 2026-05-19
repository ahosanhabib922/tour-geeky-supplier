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
      benefits: [
        { "title": "10% Flat Commission", "desc": "Transparent and fair pricing. No setup fees, no monthly costs, and no hidden charges. You only pay when you make a sale." },
        { "title": "Global Marketplace Reach", "desc": "Instantly distribute your tours, sunset cruises, wine tastings, and experiences to hundreds of thousands of Greece-bound travelers." },
        { "title": "Secure & Automated Payouts", "desc": "We process payments securely via Revolut and automatically distribute operator payouts twice a month directly to your bank account." },
        { "title": "Robust Analytics & Tools", "desc": "Access our state-of-the-art supplier portal. Track bookings, monitor gross earnings, manage availability calendars, and list activities in minutes." }
      ],

      stats_show: true,
      stats_title: "Our Greece Marketplace Impact",
      stats_subtitle: "Greece's premier channel for premium experiential excursions.",
      stats: [
        { "value": "2.4M+", "label": "Monthly Active Travelers", "desc": "Global exposure" },
        { "value": "150+", "label": "Greek Operator Partners", "desc": "Trusted Aegean network" },
        { "value": "120K+", "label": "Confirmed Bookings", "desc": "Completed experiences" },
        { "value": "10%", "label": "Platform Commission", "desc": "Flat rate, no hidden fees" }
      ],

      workflow_show: true,
      workflow_title: "How It Works",
      workflow_subtitle: "Simple 4-step workflow from partner registration to payout.",
      steps: [
        { "step": "01", "title": "Submit Brand Profile", "desc": "Fill in our quick 1-minute partner application form. Provide your brand name and basic contact details." },
        { "step": "02", "title": "Get Verified", "desc": "Our operator onboarding team reviews and verifies your details to ensure the highest catalog standard." },
        { "step": "03", "title": "List Experiences", "desc": "Use our premium step-by-step activity listing wizard to upload descriptions, pricing options, itineraries, and images." },
        { "step": "04", "title": "Receive Bookings", "desc": "Travelers book your activities. You receive automated notifications, traveler lists, and prompt payouts." }
      ],

      stories_show: true,
      stories_title: "Greek Operator Stories",
      stories_subtitle: "Hear from verified travel operators running experiences on Tour Geeky Greece.",
      stories: [
        { "name": "Captain Dimitris", "role": "Founder, Aegean Sails Ltd", "avatar": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&h=100&q=80", "rating": 5, "quote": "\"Sailing with Tour Geeky has doubled our sunset cruise bookings in Crete and Athens. Payouts are incredibly fast, and their listing wizard took just minutes to configure. We went live with 4 yachts within the first day.\"" },
        { "name": "Eleni Vance", "role": "Host, Athens Vineyard Estates", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80", "rating": 5, "quote": "\"Their local support crew and Greek translation helper attracted travelers from America and East Asia to our boutique vineyard tours near Mount Hymettus.\"" }
      ],

      faq_show: true,
      faq_title: "Frequently Asked Questions",
      faq_subtitle: "Have questions about payouts, listings, or commissions?",
      faqs: [
        { "q": "What is the cost to list activities on Tour Geeky?", "a": "Listing your experiences is 100% free! There are no listing fees, registration fees, or hidden subscription costs. We only charge a flat 10% commission on confirmed bookings." },
        { "q": "How and when do I receive payouts?", "a": "Payouts are automatically calculated and processed securely via Revolut. Operator earnings are sent twice a month directly to your linked bank account." },
        { "q": "What credentials do I need to get approved?", "a": "We verify that you are a Greece travel agency, local tour provider, cruise operator, or licensed guide. A valid phone number and website/social presence are usually sufficient for instant approval." },
        { "q": "Can I manage cancelations and refunds?", "a": "Yes! You can choose your cancelation policy (e.g. Standard 24h, Strict, or Non-refundable) during the product creation wizard. The platform automatically handles refund requests based on your chosen rules." }
      ]
    },
    benefits: {
      hero_show: true,
      hero_badge: "Partner Privileges & Growth",
      hero_title: "Keep More of What You Earn with Tour Geeky",
      hero_description: "Discover why Greek yacht captains, independent travel curators, and boutique activity planners choose our transparent 10% flat commission model.",
      
      table_show: true,
      table_title: "Comparing Industry Commissions",
      table_subtitle: "How Tour Geeky stacks up against global third-party channels.",
      
      coreBenefits: [
        { "title": "10% Flat Fee Commission Structure", "headline": "Keep 90% of your ticket sales.", "desc": "Unlike other large international OTAs that demand up to 25% or 30% commission, Tour Geeky maintains a flat, transparent 10% fee. No annual memberships, no listing costs, and no hidden contract surprises." },
        { "title": "Aegean & Grecian Targeted Marketing", "headline": "Expose your tours to active buyers.", "desc": "Our localized search engines actively direct high-value travelers from the US, UK, and East Asia searching specifically for premium sailing excursions in Mykonos, Santorini historical walking tours, and vineyard crawls in Crete." },
        { "title": "Direct Revolut Settlement Infrastructure", "headline": "Automated payouts twice a month.", "desc": "Your funds are stored in escrow safely and transferred automatically directly to your local bank account via secure Revolut business operator payouts twice a month, completely eliminating invoice waiting periods." },
        { "title": "Dedicated Greek Operator Support Crew", "headline": "Your personal growth managers.", "desc": "We don't believe in generic robot helplines. Every operator receives access to local, dedicated partners in Athens, Paros, and Chania to help construct optimal prices, high-quality images, and rich description copies." }
      ],
      comparisonTable: [
        { "channel": "Tour Geeky Partner", "commission": "10% Flat Rate", "cost": "€0 Free", "settlement": "Twice Monthly (Revolut)" },
        { "channel": "Global OTAs (Viator / GetYourGuide)", "commission": "22% - 28%", "cost": "€25 Listing Charge", "settlement": "Monthly Invoice" },
        { "channel": "Local Greek Agencies (Athens Walk-ins)", "commission": "15% - 20%", "cost": "Requires Retainer", "settlement": "30-day Post Excursion" }
      ]
    },
    growthhub: {
      hero_show: true,
      hero_badge: "Operator Growth & Optimizations",
      hero_title: "Accelerate Your Experiential Brand with Growth Hub",
      hero_description: "Gain strategic market insights, dynamic pricing recommendations, and expert content formatting guides from the Tour Geeky operations crew.",
      
      tips_show: true,
      tips_title: "Seasonal Strategy Manual",
      tips_subtitle: "Maximal sales strategies optimized for Greece tourist seasons.",
      
      growthStrategies: [
        { "metric": "Dynamic Pricing Adjustments", "desc": "Capitalize on seasonal demand surges. Our tool provides suggestion algorithms that automatically recommend capacity price alterations for Aegean high-seasons (June - September) versus milder shoulder months (April and October).", "impact": "+24% bookings value" },
        { "metric": "High-Definition Listing Scoring", "desc": "Upload crystal-clear panoramic drone shots of yacht decks and vivid snapshots of historic ruins. Our listing optimization score prompts you on precisely what content structure and travel amenities customers search for most.", "impact": "+40% conversion rate" },
        { "metric": "Instant Confirmation & Booking Sliders", "desc": "Enable instant confirmations and synchronize live capacities directly with external calendars. Travelers prefer immediate checkouts over standard 'request-to-book' systems, boosting direct placement clicks.", "impact": "+35% customer engagement" }
      ],
      seasonalTips: [
        { "title": "Peak Summer Surge (Jun-Sep)", "tips": ["Create special Sunset Yachting itineraries with premium local wine inclusions.", "Add additional 5:00 PM evening slots to capture the sunset golden hour.", "Double your slot capacity on weekends to capture sudden walk-in bookings."] },
        { "title": "Shoulder Season Growth (Apr-May & Oct)", "tips": ["Offer early-bird promotional codes and family booking options.", "Transition catamaran routes to historical land-based archaeological walks.", "Highlight cozy indoor options for food tours and olive oil tastings."] }
      ]
    },
    faq: {
      hero_show: true,
      hero_badge: "Partner Support & Help Manual",
      hero_title: "Operator Frequently Asked Questions",
      hero_description: "Quickly find answers regarding secure payouts, commission rates, guest cancellations, bad-weather contingencies, and listing setup wizards.",
      
      categories: [
        {
          "title": "Commissions & Payouts",
          "items": [
            { "q": "Is there an onboarding or listing fee?", "a": "No! Listing your experiences on Tour Geeky is completely free. We do not charge registration fees, catalog placement charges, or monthly software fees. You only pay when you make a verified sale." },
            { "q": "What is the flat commission structure?", "a": "We maintain a flat 10% commission on all completed bookings. The remaining 90% is yours. Revolut processing fees are included in this flat 10%, meaning there are absolutely no separate payment processing deductibles." },
            { "q": "When and how do I receive payouts?", "a": "All payouts are handled securely via Revolut direct bank transfers. We automatically initiate operator settlements twice a month: on the 15th (for bookings completed between 1st-14th) and on the last day of the month (for bookings completed between 15th-29th)." }
          ]
        },
        {
          "title": "Listing Experiences & Options",
          "items": [
            { "q": "How many activities can I list?", "a": "You can list unlimited activities! We encourage our partners to showcase all available options—from luxury sunset cruises to guided day treks and food tastings." },
            { "q": "What credentials do I need for account approval?", "a": "We verify that you are a Greece-registered tourism organization, yacht operator, licensed guide, or local activity host. You will need to provide a valid contact number and a web/social presence during registration." },
            { "q": "How do option pricing tiers work?", "a": "Our listing wizard lets you create multiple pricing options (e.g. Standard Ticket, VIP Upgrade, Private Charter) under a single activity. You can also specify different prices for adults and children." }
          ]
        },
        {
          "title": "Bookings & Cancelations",
          "items": [
            { "q": "How am I notified of traveler bookings?", "a": "The instant a customer completes their checkout, you receive an automated email notification and SMS alert containing the traveler's name, headcount, slot time, and specific custom requirements." },
            { "q": "What cancelation policies can I select?", "a": "During activity creation, you can select from three standard refund rules: (1) Standard: Free cancellation up to 24 hours prior. (2) Strict: Free cancellation up to 7 days prior. (3) Non-refundable: All ticket sales are final." },
            { "q": "How are bad-weather cancellations handled?", "a": "For maritime and outdoor activities, if bad weather prevents safe execution, you can log into the portal and click 'Cancel Slot'. Our platform automatically handles refund requests based on your chosen rules." }
          ]
        }
      ]
    },
    helpcenter: {
      hero_show: true,
      hero_badge: "Operational Assistance Hub",
      hero_title: "How Can We Support Your Operations?",
      hero_description: "Reach our operator support center directly or browse detailed step-by-step walkthroughs to configure prices, sync schedules, and authorize Revolut bank accounts.",
      
      guides_show: true,
      guides_title: "Onboarding Setup Handbook",
      guides_subtitle: "Everything you need to configure in under 10 minutes.",
      
      supportChannels: [
        { "title": "Email Assistance Team", "value": "info@gerromantours.com", "hours": "Mon - Sun: 9:00 AM - 8:00 PM (EET)" },
        { "title": "English Support Line", "value": "+39 342 034 2257", "hours": "Urgent boat capacity calls" },
        { "title": "Italian Support Line", "value": "+39 324 804 2892", "hours": "Urgent boat capacity calls" }
      ],
      onboardingSteps: [
        { "title": "1. Brand Authentication", "desc": "Authenticate using a verified Google Account or direct Email registration inside the Application modal window." },
        { "title": "2. Supplier Profile Setup", "desc": "Provide your operating brand name, registered corporate name, contact phone number, and brief description." },
        { "title": "3. Direct Revolut Integration", "desc": "Link your company IBAN or bank details via our secure Revolut merchant configuration panel." },
        { "title": "4. Create Activity Listing", "desc": "Specify your excursions, ticket option variables (VIP/Standard), calendar schedules, and high-definition photos." }
      ]
    }
  }
};

function mergeCMS(dbData: any, defaults: any) {
  const merged = { ...defaults, ...dbData };
  merged.navItems = dbData.navItems && dbData.navItems.length > 0 ? dbData.navItems : defaults.navItems;
  merged.pages = { ...defaults.pages, ...dbData.pages };
  
  for (const pageKey of Object.keys(defaults.pages)) {
    merged.pages[pageKey] = {
      ...defaults.pages[pageKey],
      ...(dbData.pages?.[pageKey] || {})
    };
    
    const pageDefault = defaults.pages[pageKey];
    const pageDb = dbData.pages?.[pageKey] || {};
    for (const fieldKey of Object.keys(pageDefault)) {
      if (Array.isArray(pageDefault[fieldKey])) {
        if (!pageDb[fieldKey] || !Array.isArray(pageDb[fieldKey])) {
          merged.pages[pageKey][fieldKey] = pageDefault[fieldKey];
        }
      }
    }
  }
  return merged;
}

export async function GET() {
  try {
    const results = await queryD1("SELECT value FROM site_settings WHERE key = 'supplier_landing_cms'");
    
    if (results.length === 0) {
      return NextResponse.json(DEFAULT_SUPPLIER_LANDING_CMS);
    }

    const parsed = JSON.parse(results[0].value);
    const merged = mergeCMS(parsed, DEFAULT_SUPPLIER_LANDING_CMS);
    return NextResponse.json(merged);
  } catch (error) {
    console.error("Supplier CMS GET Error:", error);
    return NextResponse.json(DEFAULT_SUPPLIER_LANDING_CMS);
  }
}

