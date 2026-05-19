export type ItineraryItem = {
  id: string;
  title: string;
  description: string;
  locationName: string;
  coordinates?: { lat: number; lng: number };
  type: 'start' | 'stop' | 'end';
};

export type AgeGroup = {
  id: string;
  label: string; // Adult, Child, Infant, Senior
  minAge: number;
  maxAge: number;
  price: number;
  netPrice: number;
};

export type PricingSetup = {
  id: string;
  name: string; // e.g., "Summer Special"
  type: "per_person" | "group";
  minParticipants: number;
  maxParticipants: number;
  ageGroups: AgeGroup[];
  groupPrice?: number;
  currency: string;
};

export type LogisticsSettings = {
  howToGetThere: "meeting" | "pickup";
  meetingPoint?: {
    address: string;
    description: string;
    arrivalOffset: string;
  };
  pickup?: {
    areas: string;
    description: string;
    notifyWhen: string;
    pickupOffset: string;
    type: string;
    timeNotification: string;
    timeOffset: string;
  };
  dropoff?: "same" | "different" | "none";
  transportation: string[];
};

export type TimeSlot = {
  id: string;
  time: string;
  capacity: number;
};

export type Availability = {
  type: "daily" | "weekly" | "specific";
  scheduleType?: "slots" | "window";
  daysOfWeek: number[]; // 0 for Sunday, 1 for Monday, etc.
  timeSlots: TimeSlot[];
  openingHours?: {
    start: string;
    end: string;
  };
  startDate?: string;
  endDate?: string;
};

export type ProductOption = {
  id: string;
  referenceName: string;
  maxGroupSize: number;
  isWheelchairAccessible: boolean;
  isPrivate: boolean;
  type: "duration" | "validity";
  duration?: number;
  durationUnit?: "minutes" | "hours" | "days";
  durationValue?: string;
  validityAmount?: number;
  validityUnit?: "days" | "weeks";
  validityType?: "period";
  validityValue?: string;
  bookingType?: "instant" | "manual";
  skipTheLine?: boolean;
  skipTheLineDescription?: string;
  referenceCode?: string;
  cutOffTime?: string;
  languages?: string[];
  hasGuideMaterials?: boolean;
  hasAudioGuides?: boolean;
  hasBooklets?: boolean;
  pricing: PricingSetup[];
  logistics: LogisticsSettings;
  availability?: Availability;
};

export type Product = {
  id?: string;
  language: string;
  category: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  highlights: string[];
  keywords: string[];
  metaTitle?: string;
  metaDescription?: string;
  inclusions: string[];
  exclusions: string[];
  extraInfo: string[];
  healthRestrictions: string[];
  fitnessLevel: "easy" | "moderate" | "strenuous" | "extreme";
  safetyDetails: string;
  options: ProductOption[];
  liabilityPolicy?: string;
  guideType?: string;
  hasFood?: boolean;
  hasTransportation?: boolean;
  currency: string;
  status: "draft" | "published" | "pending" | "archived";
  images: string[];
  coverImage?: string;
  location?: string;
  itinerary: ItineraryItem[];
  notSuitableFor: string[];
  notAllowed: string[];
  whatToBring: string[];
  cancellationPolicy: 'standard' | 'strict' | 'non-refundable';
  slug?: string;
  supplier_id?: string;
  // View-layer fields (populated from DB aggregations or defaults)
  price?: number;
  bookings?: number;
  reviewsCount?: number;
};
