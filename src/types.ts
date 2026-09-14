// src/types.ts - Client-side types for FarmIntel

export type UserRole = "farmer" | "buyer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  language: "hi" | "en" | "hinglish";
  location: {
    district: string;
    state: string;
    village?: string;
  };
  verified?: boolean;
}

export interface Crop {
  id: string;
  name: string;
  hindiName: string;
  variety: string[];
  category: string;
  unit: string;
  standardShelfLifeDays: number;
  currentMsp?: number;
}

export interface MarketPrice {
  id: string;
  cropId: string;
  cropName: string;
  mandiName: string;
  district: string;
  state: string;
  distanceKm: number;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  arrivalTonsToday: number;
  demandStatus: "Very High" | "High" | "Moderate" | "Low";
  priceTrend: "Rising" | "Stable" | "Falling";
  trendPercentage: number;
  transportCostPerQ: number;
  storageCostPerQ: number;
  mandiFeePerQ: number;
  weatherRisk: string;
  updatedAt: string;
  calc?: {
    grossRevenue: number;
    transportTotal: number;
    storageTotal: number;
    otherTotal: number;
    totalExpenses: number;
    netRealisation: number;
    netPerQuintal: number;
  };
  mspBenchmark?: {
    rate: number;
    cropName: string;
    modalDiffFromMsp: number;
    netDiffFromMsp: number;
    isNetAboveMsp: boolean;
    isModalAboveMsp: boolean;
    statusBadge: string;
  };
}

export interface CropListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  cropId: string;
  cropName: string;
  variety: string;
  quantityQuintals: number;
  unit: string;
  harvestDate: string;
  location: {
    village: string;
    district: string;
    state: string;
  };
  expectedPricePerQ: number;
  qualityGrade: string;
  qualityReport?: {
    estimatedMoisturePercent?: number;
    colorUniformityPercent?: number;
    visibleDefectsPercent?: number;
    aiNotes?: string;
  };
  description: string;
  images: string[];
  status: "Active" | "Under Negotiation" | "Sold" | "Cancelled";
  isFpoAggregated?: boolean;
  fpoName?: string;
  createdAt: string;
}

export interface NegotiationEntry {
  senderId: string;
  senderName: string;
  senderRole: "farmer" | "buyer";
  pricePerQ: number;
  message?: string;
  timestamp: string;
}

export type OfferStatus = "PENDING" | "COUNTERED" | "ACCEPTED" | "REJECTED" | "EXPIRED" | "Pending" | "Countered" | "Accepted" | "Rejected" | "Completed";

export interface Offer {
  id: string;
  offerId?: string;
  listingId: string;
  cropName: string;
  crop?: string;
  farmerId: string;
  farmerName: string;
  buyerId: string;
  buyerName: string;
  buyerTrustScore: number;
  buyerVerified: boolean;
  offeredPricePerQ: number;
  pricePerUnit?: number;
  quantityQuintals: number;
  quantity?: number;
  totalAmount: number;
  pickupLocation: string;
  deliveryLocation: string;
  logisticsIncluded: boolean;
  paymentTerms: string;
  status: OfferStatus;
  counterPricePerQ?: number;
  notes?: string;
  message?: string;
  history?: NegotiationEntry[];
  createdAt: string;
  updatedAt: string;
}

export type DealStatus =
  | "CONFIRMED"
  | "TRANSPORT_REQUESTED"
  | "PICKUP_SCHEDULED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "PAYMENT_PENDING"
  | "COMPLETED"
  | "CANCELLED";

export interface Deal {
  id: string;
  dealId: string; // e.g. FI-2026-0001
  offerId: string;
  farmerId: string;
  farmerName: string;
  buyerId: string;
  buyerName: string;
  listingId: string;
  crop: string;
  quantity: number;
  price: number;
  totalAmount: number;
  status: DealStatus;
  pickupLocation: string;
  deliveryLocation: string;
  logisticsId?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export type LogisticsStatus =
  | "REQUESTED"
  | "ASSIGNED"
  | "PICKUP_SCHEDULED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED";

export interface LogisticsRecord {
  id: string;
  logisticsId: string;
  dealId: string;
  provider: string;
  vehicleNumber: string;
  driver: string;
  driverPhone?: string;
  pickupLocation: string;
  destination: string;
  estimatedCost: number;
  status: LogisticsStatus;
  scheduledDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type:
    | "NEW_OFFER"
    | "OFFER_ACCEPTED"
    | "COUNTER_OFFER"
    | "TRANSPORT_REQUESTED"
    | "TRANSPORT_ASSIGNED"
    | "PICKUP_SCHEDULED"
    | "SHIPMENT_IN_TRANSIT"
    | "DELIVERY_COMPLETED"
    | "PAYMENT_COMPLETED"
    | "INFO";
  title: string;
  message: string;
  relatedId?: string; // offerId, dealId, etc.
  read: boolean;
  createdAt: string;
}

export interface Buyer {
  userId: string;
  name: string;
  businessName: string;
  businessType: string;
  phone?: string;
  verificationStatus: "Verified" | "Pending" | "Rejected";
  trustScore: number;
  preferredCrops: string[];
  procurementCapacityQuintals: number;
  paymentTermDays: number;
  location: {
    district: string;
    state: string;
  };
  offeredEstimatePrice?: number;
  distanceKm?: number;
  lookingForCrop?: string;
  requiredQuantityQuintals?: number;
  minOfferPricePerQ?: number;
  maxOfferPricePerQ?: number;
}

export interface LogisticsProvider {
  id: string;
  name: string;
  vehicleType: string;
  capacityQuintals: number;
  ratePerKm: number;
  baseFare: number;
  rating: number;
  phone: string;
  availableDrivers: number;
}

export interface LogisticsBooking {
  id: string;
  farmerId: string;
  farmerName: string;
  providerId: string;
  providerName: string;
  vehicleType: string;
  pickupAddress: string;
  destinationMandi: string;
  distanceKm: number;
  quantityQuintals: number;
  estimatedCost: number;
  scheduledDate: string;
  status: "Requested" | "Assigned" | "Scheduled" | "In Transit" | "Delivered";
  trackingNumber: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  listingId: string;
  offerId: string;
  cropName: string;
  farmerId: string;
  farmerName: string;
  buyerId: string;
  buyerName: string;
  quantityQuintals: number;
  pricePerQ: number;
  grossAmount: number;
  transportCost: number;
  storageAndHandlingCost: number;
  mandiTaxes: number;
  totalExpenses: number;
  netRealisation: number;
  paymentMethod: string;
  paymentStatus: string;
  settlementDate: string;
  status: string;
}

export interface WeatherData {
  location: string;
  source?: "live-api" | "demo-simulation";
  current: {
    tempC: number;
    condition: string;
    humidity: number;
    windKph: number;
    rainChancePercent: number;
    impactOnCrop: string;
  };
  forecast5Days: Array<{
    day: string;
    tempC: number;
    condition: string;
    rainProb: string;
  }>;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  text: string;
  attachedOfferId?: string;
  timestamp: string;
}

export interface MspBenchmark {
  id: string;
  cropId: string;
  cropName: string;
  hindiName: string;
  season: "Rabi" | "Kharif";
  effectiveYear: string;
  mspRate: number; // Rs per quintal
  costOfProduction: number; // A2+FL in Rs/Q
  marginOverCostPercent: number; // return percentage over A2+FL
  procuringAgencies: string[];
  procurementPeriod: string;
  qualityNorms: string;
  status: "Active Procurement" | "Upcoming" | "Completed";
  advisory: string;
}

export interface MspComparison {
  benchmark: MspBenchmark;
  offeredPrice: number;
  diff: number;
  diffPercent: number;
  isAboveMsp: boolean;
  statusBadge: string;
  advice: string;
  procurementAlert: string;
}

export interface EmailValidationResult {
  valid: boolean;
  message: string;
  suggestion?: string;
  domain?: string;
  isDisposable?: boolean;
  isCorporateOrGov?: boolean;
}

export interface PhoneValidationResult {
  valid: boolean;
  message: string;
  formatted?: string;
  raw?: string;
}

export interface OtpState {
  sent: boolean;
  countdown: number;
  simulatedCode?: string;
  channel?: string;
  loading: boolean;
  error?: string;
}
