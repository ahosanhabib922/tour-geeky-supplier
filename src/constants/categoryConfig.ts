export type CategoryId = "attraction" | "tour" | "city-card" | "hop-on" | "transfer" | "rental" | "boat" | "others";

export interface CategoryConfig {
  id: CategoryId;
  label: string;
  icon: string;
  description: string;
  allowedSteps: number[]; // Step indices (0-based)
  labels: {
    logistics?: string;
    meetingPoint?: string;
  };
}

export const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  attraction: {
    id: "attraction",
    label: "Attraction",
    icon: "Ticket",
    description: "Like entry to a landmark, theme park, show",
    allowedSteps: [0, 1, 2, 3, 4, 5, 7, 8, 9], // Skips 6 (Itinerary)
    labels: { logistics: "Entry Details" }
  },
  tour: {
    id: "tour",
    label: "Tour",
    icon: "Globe",
    description: "Like a guided walking tour, day trip, city cruise",
    allowedSteps: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    labels: {}
  },
  "city-card": {
    id: "city-card",
    label: "City Card",
    icon: "CreditCard",
    description: "A pass for multiple attractions or transport within a city",
    allowedSteps: [0, 1, 2, 3, 4, 5, 7, 8, 9], // Skips 6
    labels: { logistics: "Pass Details" }
  },
  "hop-on": {
    id: "hop-on",
    label: "Hop-on Hop-off",
    icon: "Bus",
    description: "Entry to a hop-on hop-off bus or boat",
    allowedSteps: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    labels: { logistics: "Ticket Details" }
  },
  transfer: {
    id: "transfer",
    label: "Transfer",
    icon: "Car",
    description: "Transportation services like airport or bus transfers",
    allowedSteps: [0, 1, 2, 3, 4, 5, 7, 8, 9], // Skips 6
    labels: { meetingPoint: "Pickup Point" }
  },
  rental: {
    id: "rental",
    label: "Rental",
    icon: "Key",
    description: "Experience rentals like costumes, adventure equipment, unique vehicle drives",
    allowedSteps: [0, 1, 2, 3, 4, 5, 7, 8, 9], // Skips 6
    labels: { logistics: "Rental Terms", meetingPoint: "Pickup Location" }
  },
  boat: {
    id: "boat",
    label: "Boat & Cruises",
    icon: "Ship",
    description: "Private boat tours, cruises, and water activities.",
    allowedSteps: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    labels: { meetingPoint: "Departure Pier" }
  },
  others: {
    id: "others",
    label: "Others",
    icon: "Layers",
    description: "Like a cooking class or multiple activities sold together",
    allowedSteps: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    labels: {}
  }
};
