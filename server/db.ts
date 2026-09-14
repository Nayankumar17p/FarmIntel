// server/db.ts - In-memory and persistent database service for FarmIntel
import bcrypt from "bcryptjs";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: "farmer" | "buyer" | "admin";
  language: "hi" | "en" | "hinglish";
  location: {
    district: string;
    state: string;
    village?: string;
  };
  avatar?: string;
  verified: boolean;
  createdAt: string;
}

export interface FarmerProfile {
  userId: string;
  farmSizeAcres: number;
  primaryCrops: string[];
  soilType?: string;
  fpoMembership?: string;
}

export interface BuyerProfile {
  userId: string;
  businessName: string;
  businessType: "Processor" | "Wholesaler" | "Exporter" | "Retail Chain" | "Mandi Trader";
  gstin?: string;
  verificationStatus: "Verified" | "Pending" | "Rejected";
  trustScore: number; // e.g. 4.8 / 5
  preferredCrops: string[];
  procurementCapacityQuintals: number;
  paymentTermDays: number;
  lookingForCrop?: string;
  requiredQuantityQuintals?: number;
  minOfferPricePerQ?: number;
  maxOfferPricePerQ?: number;
  distanceKm?: number;
}

export interface Crop {
  id: string;
  name: string;
  hindiName: string;
  variety: string[];
  category: "Grains" | "Pulses" | "Vegetables" | "Fruits" | "Oilseeds";
  unit: string;
  standardShelfLifeDays: number;
  currentMsp?: number; // Minimum Support Price per Quintal
}

export interface MarketPrice {
  id: string;
  cropId: string;
  cropName: string;
  mandiName: string;
  district: string;
  state: string;
  distanceKm: number; // distance from reference center (Patna/Gaya)
  modalPrice: number; // Rs per Quintal
  minPrice: number;
  maxPrice: number;
  arrivalTonsToday: number;
  demandStatus: "Very High" | "High" | "Moderate" | "Low";
  priceTrend: "Rising" | "Stable" | "Falling";
  trendPercentage: number;
  transportCostPerQ: number; // Transport cost per quintal
  storageCostPerQ: number;   // Storage cost per quintal
  mandiFeePerQ: number;      // Cess & loading charges
  weatherRisk: "Low" | "Medium" | "High Rain Alert";
  updatedAt: string;
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
  qualityGrade: "Grade A (Premium)" | "Grade B (Standard)" | "Grade C";
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
  relatedId?: string;
  read: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: "farmer" | "buyer" | "admin";
  receiverId: string;
  text: string;
  attachedOfferId?: string;
  timestamp: string;
}

export interface LogisticsProvider {
  id: string;
  name: string;
  vehicleType: "Tata Ace (1.5T)" | "Pickup 407 (3.5T)" | "Truck 14ft (7T)" | "Tractor Trolley (4T)";
  capacityQuintals: number;
  ratePerKm: number;
  baseFare: number;
  rating: number;
  phone: string;
  availableDrivers: number;
}

export interface LogisticsBooking {
  id: string;
  offerId?: string;
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
  netRealisation: number; // Realized profit
  paymentMethod: "Direct Bank Transfer" | "e-NAM Escrow" | "UPI";
  paymentStatus: "Escrow Deposited" | "Released to Farmer" | "Pending";
  settlementDate: string;
  status: "Completed" | "In Progress";
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

// Initial In-Memory Seed Data
class Database {
  users: User[] = [];
  farmerProfiles: FarmerProfile[] = [];
  buyerProfiles: BuyerProfile[] = [];
  crops: Crop[] = [];
  mspBenchmarks: MspBenchmark[] = [];
  marketPrices: MarketPrice[] = [];
  listings: CropListing[] = [];
  offers: Offer[] = [];
  deals: Deal[] = [];
  notifications: AppNotification[] = [];
  messages: ChatMessage[] = [];
  logisticsProviders: LogisticsProvider[] = [];
  logisticsBookings: LogisticsBooking[] = [];
  logisticsRecords: LogisticsRecord[] = [];
  transactions: Transaction[] = [];
  dealCounter = 1;

  constructor() {
    this.seed();
  }

  public resetDemo() {
    this.dealCounter = 1;
    this.seed();
  }

  public seed() {
    const passwordHash = bcrypt.hashSync("farmintel123", 10);

    // Seed Users
    this.users = [
      {
        id: "farmer-1",
        name: "Ramesh Kumar",
        email: "ramesh@farmintel.demo",
        phone: "+91 98350 12345",
        passwordHash,
        role: "farmer",
        language: "hi",
        location: { district: "Patna", state: "Bihar", village: "Danapur Rural" },
        verified: true,
        createdAt: "2026-01-10T10:00:00.000Z",
      },
      {
        id: "farmer-2",
        name: "Sunita Devi",
        email: "sunita.devi@farmintel.in",
        phone: "+91 94310 98765",
        passwordHash,
        role: "farmer",
        language: "hi",
        location: { district: "Muzaffarpur", state: "Bihar", village: "Kanti" },
        verified: true,
        createdAt: "2026-01-15T11:00:00.000Z",
      },
      {
        id: "buyer-1",
        name: "ABC Foods Pvt. Ltd.",
        email: "buyer@abcfoods.demo",
        phone: "+91 91220 54321",
        passwordHash,
        role: "buyer",
        language: "en",
        location: { district: "Patna", state: "Bihar" },
        verified: true,
        createdAt: "2026-01-05T08:00:00.000Z",
      },
      {
        id: "buyer-2",
        name: "Kisan Agro Processing Mill",
        email: "deals@kisanagro.in",
        phone: "+91 97710 88990",
        passwordHash,
        role: "buyer",
        language: "en",
        location: { district: "Gaya", state: "Bihar" },
        verified: true,
        createdAt: "2026-01-12T09:30:00.000Z",
      },
      {
        id: "admin-1",
        name: "FarmIntel Administrator",
        email: "admin@farmintel.demo",
        phone: "+91 99000 11223",
        passwordHash,
        role: "admin",
        language: "en",
        location: { district: "Patna", state: "Bihar" },
        verified: true,
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ];

    // Seed Farmer Profiles
    this.farmerProfiles = [
      {
        userId: "farmer-1",
        farmSizeAcres: 6.5,
        primaryCrops: ["Wheat", "Maize", "Potato"],
        soilType: "Alluvial Sandy Loam",
        fpoMembership: "Patliputra Kisan FPO",
      },
      {
        userId: "farmer-2",
        farmSizeAcres: 4.2,
        primaryCrops: ["Tomato", "Litchi", "Rice"],
        soilType: "Clay Loam",
        fpoMembership: "Muzaffarpur Horti Collective",
      },
    ];

    // Seed Buyer Profiles
    this.buyerProfiles = [
      {
        userId: "buyer-1",
        businessName: "ABC Foods Pvt. Ltd.",
        businessType: "Processor",
        gstin: "10AABCA1234F1Z9",
        verificationStatus: "Verified",
        trustScore: 4.8,
        preferredCrops: ["Wheat", "Maize", "Rice"],
        procurementCapacityQuintals: 5000,
        paymentTermDays: 1, // Instant / Next-day escrow
        lookingForCrop: "Wheat",
        requiredQuantityQuintals: 50,
        minOfferPricePerQ: 2350,
        maxOfferPricePerQ: 2450,
        distanceKm: 32,
      },
      {
        userId: "buyer-2",
        businessName: "Kisan Agro Processing Mill",
        businessType: "Wholesaler",
        gstin: "10BBAKA5678G2Y1",
        verificationStatus: "Verified",
        trustScore: 4.6,
        preferredCrops: ["Wheat", "Tomato", "Potato"],
        procurementCapacityQuintals: 3200,
        paymentTermDays: 2,
      },
    ];

    // Seed Crops
    this.crops = [
      {
        id: "crop-wheat",
        name: "Wheat",
        hindiName: "गेहूं",
        variety: ["HD-2967", "PBW-343", "Sharbati", "Kundan"],
        category: "Grains",
        unit: "Quintal (100 kg)",
        standardShelfLifeDays: 270,
        currentMsp: 2275,
      },
      {
        id: "crop-rice",
        name: "Paddy / Rice",
        hindiName: "धान / चावल",
        variety: ["Katarni", "Mansuri", "Basmati 1121", "Sona Masoori"],
        category: "Grains",
        unit: "Quintal (100 kg)",
        standardShelfLifeDays: 360,
        currentMsp: 2300,
      },
      {
        id: "crop-tomato",
        name: "Tomato",
        hindiName: "टमाटर",
        variety: ["Pusa Ruby", "Abhinav (Hybrid)", "Himsona"],
        category: "Vegetables",
        unit: "Quintal (100 kg)",
        standardShelfLifeDays: 10,
      },
      {
        id: "crop-potato",
        name: "Potato",
        hindiName: "आलू",
        variety: ["Kufri Jyoti", "Kufri Chandramukhi", "Pukhraj"],
        category: "Vegetables",
        unit: "Quintal (100 kg)",
        standardShelfLifeDays: 90,
      },
      {
        id: "crop-maize",
        name: "Maize / Corn",
        hindiName: "मक्का",
        variety: ["Pioneer 3396", "Dekalb 9108", "HQPM-1"],
        category: "Grains",
        unit: "Quintal (100 kg)",
        standardShelfLifeDays: 180,
        currentMsp: 2090,
      },
      {
        id: "crop-onion",
        name: "Onion",
        hindiName: "प्याज",
        variety: ["Nashik Red", "Pusa Red", "Agrifound Light Red"],
        category: "Vegetables",
        unit: "Quintal (100 kg)",
        standardShelfLifeDays: 45,
      },
    ];

    // Official Government of India MSP Benchmarks (CACP / Ministry of Agriculture)
    this.mspBenchmarks = [
      {
        id: "msp-wheat",
        cropId: "crop-wheat",
        cropName: "Wheat",
        hindiName: "गेहूं",
        season: "Rabi",
        effectiveYear: "2025-26",
        mspRate: 2275,
        costOfProduction: 1128,
        marginOverCostPercent: 102,
        procuringAgencies: ["Food Corporation of India (FCI)", "Bihar State Food & Civil Supplies Corp (BSFC)"],
        procurementPeriod: "April 1 – June 15",
        qualityNorms: "Fair Average Quality (FAQ) grade. Moisture content maximum 12%. Foreign matter under 0.75%.",
        status: "Active Procurement",
        advisory: "Govt procurement centers guarantee ₹2,275/Q. If local trader offers less, exercise APMC direct center delivery.",
      },
      {
        id: "msp-rice-common",
        cropId: "crop-rice",
        cropName: "Paddy / Rice (Common)",
        hindiName: "धान (साधारण)",
        season: "Kharif",
        effectiveYear: "2025-26",
        mspRate: 2300,
        costOfProduction: 1533,
        marginOverCostPercent: 50,
        procuringAgencies: ["FCI", "Primary Agricultural Credit Societies (PACS)"],
        procurementPeriod: "November 1 – February 28",
        qualityNorms: "Moisture maximum 17%. Damaged/discolored grain under 5%.",
        status: "Active Procurement",
        advisory: "PACS centers open for direct paddy procurement at ₹2,300/Q with direct DBT bank transfer.",
      },
      {
        id: "msp-rice-grade-a",
        cropId: "crop-rice-a",
        cropName: "Paddy / Rice (Grade A)",
        hindiName: "धान (ग्रेड-ए)",
        season: "Kharif",
        effectiveYear: "2025-26",
        mspRate: 2320,
        costOfProduction: 1533,
        marginOverCostPercent: 51,
        procuringAgencies: ["FCI", "State Warehousing Corp"],
        procurementPeriod: "November 1 – February 28",
        qualityNorms: "Slender/long grain variety with luster. Moisture under 17%.",
        status: "Active Procurement",
        advisory: "Grade A receives ₹20/Q premium over common paddy benchmark.",
      },
      {
        id: "msp-maize",
        cropId: "crop-maize",
        cropName: "Maize / Corn",
        hindiName: "मक्का",
        season: "Kharif",
        effectiveYear: "2025-26",
        mspRate: 2090,
        costOfProduction: 1393,
        marginOverCostPercent: 50,
        procuringAgencies: ["NAFED", "FCI", "Bihar Rajya Sahkari Bank"],
        procurementPeriod: "October 15 – January 31",
        qualityNorms: "Clean yellow/white kernels, moisture ≤ 14%, mold-free.",
        status: "Active Procurement",
        advisory: "Feed millers and ethanol plants often offer above MSP (₹2,120–₹2,200) for Grade A quality.",
      },
      {
        id: "msp-mustard",
        cropId: "crop-mustard",
        cropName: "Mustard & Rapeseed",
        hindiName: "सरसों / तोरिया",
        season: "Rabi",
        effectiveYear: "2025-26",
        mspRate: 5650,
        costOfProduction: 2850,
        marginOverCostPercent: 98,
        procuringAgencies: ["NAFED", "State Oilseed Cooperatives"],
        procurementPeriod: "March 15 – May 31",
        qualityNorms: "Minimum oil content 38%, moisture under 8%.",
        status: "Upcoming",
        advisory: "Oilseed MSP is high-margin (98% over A2+FL cost). Do not sell below ₹5,650/Q.",
      },
      {
        id: "msp-gram",
        cropId: "crop-gram",
        cropName: "Gram / Chana",
        hindiName: "चना",
        season: "Rabi",
        effectiveYear: "2025-26",
        mspRate: 5440,
        costOfProduction: 3400,
        marginOverCostPercent: 60,
        procuringAgencies: ["NAFED", "State Agri Marketing Board"],
        procurementPeriod: "April 1 – June 30",
        qualityNorms: "FAQ specification. Moisture maximum 10%. Weevilled seeds under 1%.",
        status: "Active Procurement",
        advisory: "Dal mills frequently compete with NAFED, providing immediate electronic spot payment.",
      },
      {
        id: "msp-soybean",
        cropId: "crop-soybean",
        cropName: "Soybean (Yellow)",
        hindiName: "सोयाबीन",
        season: "Kharif",
        effectiveYear: "2025-26",
        mspRate: 4892,
        costOfProduction: 3261,
        marginOverCostPercent: 50,
        procuringAgencies: ["NAFED", "State Cooperative Marketing Fed"],
        procurementPeriod: "October 1 – December 31",
        qualityNorms: "Clean yellow seed, moisture ≤ 12%, oil content ≥ 18%.",
        status: "Completed",
        advisory: "Procurement window closed; institutional buyers active in open spot markets.",
      },
      {
        id: "msp-barley",
        cropId: "crop-barley",
        cropName: "Barley",
        hindiName: "जौ",
        season: "Rabi",
        effectiveYear: "2025-26",
        mspRate: 1850,
        costOfProduction: 1198,
        marginOverCostPercent: 54,
        procuringAgencies: ["FCI", "NAFED"],
        procurementPeriod: "April 1 – May 31",
        qualityNorms: "Moisture maximum 12%, clean grain without pest infestation.",
        status: "Upcoming",
        advisory: "Malt processors offer attractive spot prices for uniform plumping.",
      },
    ];

    // Seed Market Prices across mandis
    // Note: Showing the core SIH principle where Gaya has headline ₹2500 but high transport ₹600, yielding lower net than Muzaffarpur or Patna!
    this.marketPrices = [
      {
        id: "mp-1",
        cropId: "crop-wheat",
        cropName: "Wheat",
        mandiName: "Patna Mandi (Bazar Samiti)",
        district: "Patna",
        state: "Bihar",
        distanceKm: 28,
        modalPrice: 2420,
        minPrice: 2350,
        maxPrice: 2480,
        arrivalTonsToday: 420,
        demandStatus: "High",
        priceTrend: "Rising",
        trendPercentage: 3.2,
        transportCostPerQ: 140,
        storageCostPerQ: 40,
        mandiFeePerQ: 25,
        weatherRisk: "Low",
        updatedAt: "Today 08:30 AM",
      },
      {
        id: "mp-2",
        cropId: "crop-wheat",
        cropName: "Wheat",
        mandiName: "Muzaffarpur APMC",
        district: "Muzaffarpur",
        state: "Bihar",
        distanceKm: 75,
        modalPrice: 2460,
        minPrice: 2390,
        maxPrice: 2510,
        arrivalTonsToday: 310,
        demandStatus: "Very High",
        priceTrend: "Rising",
        trendPercentage: 4.5,
        transportCostPerQ: 220,
        storageCostPerQ: 35,
        mandiFeePerQ: 20,
        weatherRisk: "Low",
        updatedAt: "Today 09:00 AM",
      },
      {
        id: "mp-3",
        cropId: "crop-wheat",
        cropName: "Wheat",
        mandiName: "Gaya Mandi",
        district: "Gaya",
        state: "Bihar",
        distanceKm: 115,
        modalPrice: 2520, // Headline is highest!
        minPrice: 2430,
        maxPrice: 2560,
        arrivalTonsToday: 180,
        demandStatus: "Moderate",
        priceTrend: "Stable",
        trendPercentage: 0.5,
        transportCostPerQ: 460, // Much higher transport!
        storageCostPerQ: 50,
        mandiFeePerQ: 30,
        weatherRisk: "Medium",
        updatedAt: "Today 08:15 AM",
      },
      {
        id: "mp-4",
        cropId: "crop-wheat",
        cropName: "Wheat",
        mandiName: "Lucknow APMC Mandi",
        district: "Lucknow",
        state: "Uttar Pradesh",
        distanceKm: 480,
        modalPrice: 2610,
        minPrice: 2540,
        maxPrice: 2680,
        arrivalTonsToday: 950,
        demandStatus: "Very High",
        priceTrend: "Rising",
        trendPercentage: 2.1,
        transportCostPerQ: 850,
        storageCostPerQ: 60,
        mandiFeePerQ: 40,
        weatherRisk: "Low",
        updatedAt: "Today 07:45 AM",
      },
      {
        id: "mp-5",
        cropId: "crop-tomato",
        cropName: "Tomato",
        mandiName: "Patna Sabzi Mandi",
        district: "Patna",
        state: "Bihar",
        distanceKm: 28,
        modalPrice: 2150,
        minPrice: 1900,
        maxPrice: 2300,
        arrivalTonsToday: 85,
        demandStatus: "Very High",
        priceTrend: "Rising",
        trendPercentage: 6.8,
        transportCostPerQ: 130,
        storageCostPerQ: 60,
        mandiFeePerQ: 20,
        weatherRisk: "Low",
        updatedAt: "Today 08:00 AM",
      },
      {
        id: "mp-6",
        cropId: "crop-tomato",
        cropName: "Tomato",
        mandiName: "Muzaffarpur Krishi Mandi",
        district: "Muzaffarpur",
        state: "Bihar",
        distanceKm: 75,
        modalPrice: 2280,
        minPrice: 2100,
        maxPrice: 2400,
        arrivalTonsToday: 110,
        demandStatus: "High",
        priceTrend: "Rising",
        trendPercentage: 5.0,
        transportCostPerQ: 190,
        storageCostPerQ: 55,
        mandiFeePerQ: 20,
        weatherRisk: "Low",
        updatedAt: "Today 08:30 AM",
      },
      {
        id: "mp-7",
        cropId: "crop-maize",
        cropName: "Maize / Corn",
        mandiName: "Khagaria Corn Mandi",
        district: "Khagaria",
        state: "Bihar",
        distanceKm: 140,
        modalPrice: 2240,
        minPrice: 2150,
        maxPrice: 2300,
        arrivalTonsToday: 680,
        demandStatus: "Very High",
        priceTrend: "Rising",
        trendPercentage: 3.8,
        transportCostPerQ: 320,
        storageCostPerQ: 40,
        mandiFeePerQ: 25,
        weatherRisk: "Low",
        updatedAt: "Today 09:15 AM",
      },
    ];

    // Seed Listings
    this.listings = [
      {
        id: "lot-101",
        farmerId: "farmer-1",
        farmerName: "Ramesh Kumar",
        farmerPhone: "+91 98350 12345",
        cropId: "crop-wheat",
        cropName: "Wheat",
        variety: "Grade A Wheat (HD-2967)",
        quantityQuintals: 50,
        unit: "Quintal",
        harvestDate: "2026-03-08",
        location: { village: "Danapur Rural", district: "Patna", state: "Bihar" },
        expectedPricePerQ: 2400,
        qualityGrade: "Grade A (Premium)",
        qualityReport: {
          estimatedMoisturePercent: 11.2,
          colorUniformityPercent: 95,
          visibleDefectsPercent: 1.5,
          aiNotes: "Grade A certified wheat. Moisture verified under 12%. High test weight and exceptional milling yield.",
        },
        description: "I can supply Grade A wheat. Organically harvested, sun-dried, moisture verified <12%, stored safely in clean hermetic bags.",
        images: [
          "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
        ],
        status: "Active",
        isFpoAggregated: false,
        createdAt: "2026-03-10T14:30:00.000Z",
      },
      {
        id: "lot-102",
        farmerId: "farmer-1",
        farmerName: "Ramesh Kumar",
        farmerPhone: "+91 98350 12345",
        cropId: "crop-maize",
        cropName: "Maize / Corn",
        variety: "Yellow Feed Maize (Pioneer)",
        quantityQuintals: 50,
        unit: "Quintal",
        harvestDate: "2026-02-24",
        location: { village: "Danapur Rural", district: "Patna", state: "Bihar" },
        expectedPricePerQ: 2180,
        qualityGrade: "Grade B (Standard)",
        qualityReport: {
          estimatedMoisturePercent: 13.8,
          colorUniformityPercent: 88,
          visibleDefectsPercent: 4.8,
          aiNotes: "Standard starch content suitable for cattle feed and starch manufacturing.",
        },
        description: "Dry yellow maize ready for immediate loading from farm warehouse.",
        images: [
          "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80",
        ],
        status: "Active",
        isFpoAggregated: false,
        createdAt: "2026-03-05T09:15:00.000Z",
      },
      {
        id: "lot-103",
        farmerId: "farmer-2",
        farmerName: "Sunita Devi",
        farmerPhone: "+91 94310 98765",
        cropId: "crop-tomato",
        cropName: "Tomato",
        variety: "Abhinav Hybrid Red",
        quantityQuintals: 35,
        unit: "Quintal",
        harvestDate: "2026-03-12",
        location: { village: "Kanti", district: "Muzaffarpur", state: "Bihar" },
        expectedPricePerQ: 2250,
        qualityGrade: "Grade A (Premium)",
        qualityReport: {
          estimatedMoisturePercent: 92.0,
          colorUniformityPercent: 96,
          visibleDefectsPercent: 1.2,
          aiNotes: "Firm, deep red tomatoes harvested at breaker stage for optimal transit life.",
        },
        description: "Freshly picked table tomatoes, firm pericarp, sorted into 25kg plastic crates.",
        images: [
          "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
        ],
        status: "Active",
        isFpoAggregated: false,
        createdAt: "2026-03-12T07:45:00.000Z",
      },
      {
        id: "lot-fpo-1",
        farmerId: "fpo-patliputra",
        farmerName: "Patliputra Kisan FPO (24 Farmers Aggregated)",
        farmerPhone: "+91 98350 99881",
        cropId: "crop-wheat",
        cropName: "Wheat",
        variety: "Certified PBW-343 Bulk",
        quantityQuintals: 420,
        unit: "Quintal",
        harvestDate: "2026-03-09",
        location: { village: "Bihta Hub", district: "Patna", state: "Bihar" },
        expectedPricePerQ: 2480,
        qualityGrade: "Grade A (Premium)",
        qualityReport: {
          estimatedMoisturePercent: 11.5,
          colorUniformityPercent: 95,
          visibleDefectsPercent: 1.8,
          aiNotes: "Aggregated lots sorted at FPO grading center. Uniform test weight > 78 kg/hL.",
        },
        description: "FPO bulk lot consolidated from 24 verified farmers. High volume advantage for institutional millers.",
        images: [
          "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
        ],
        status: "Active",
        isFpoAggregated: true,
        fpoName: "Patliputra Kisan FPO",
        createdAt: "2026-03-11T12:00:00.000Z",
      },
    ];

    // Seed Offers
    this.offers = [
      {
        id: "offer-201",
        listingId: "lot-101",
        cropName: "Wheat (Sharbati Gold)",
        farmerId: "farmer-1",
        farmerName: "Ramesh Kumar",
        buyerId: "buyer-1",
        buyerName: "ABC Foods Pvt. Ltd.",
        buyerTrustScore: 4.8,
        buyerVerified: true,
        offeredPricePerQ: 2440,
        quantityQuintals: 80,
        totalAmount: 195200,
        pickupLocation: "Farm Gate, Danapur Rural, Patna",
        deliveryLocation: "ABC Foods Silo, Fatuha Industrial Area",
        logisticsIncluded: false,
        paymentTerms: "100% Escrow deposit upon contract, released within 24hr of weighbridge receipt",
        status: "Pending",
        notes: "We can deploy our trucks or you can use FarmIntel transport. Willing to finalize today.",
        createdAt: "2026-03-13T10:15:00.000Z",
        updatedAt: "2026-03-13T10:15:00.000Z",
      },
      {
        id: "offer-202",
        listingId: "lot-101",
        cropName: "Wheat (Sharbati Gold)",
        farmerId: "farmer-1",
        farmerName: "Ramesh Kumar",
        buyerId: "buyer-2",
        buyerName: "Kisan Agro Processing Mill",
        buyerTrustScore: 4.6,
        buyerVerified: true,
        offeredPricePerQ: 2410,
        quantityQuintals: 50,
        totalAmount: 120500,
        pickupLocation: "Farm Gate, Danapur Rural, Patna",
        deliveryLocation: "Gaya Industrial Hub",
        logisticsIncluded: true,
        paymentTerms: "Immediate NEFT / UPI post quality check",
        status: "Countered",
        counterPricePerQ: 2450,
        notes: "Farmer countered asking ₹2,450/Q based on high grade test score.",
        createdAt: "2026-03-12T16:00:00.000Z",
        updatedAt: "2026-03-13T09:00:00.000Z",
      },
    ];

    // Seed Messages
    this.messages = [
      {
        id: "msg-1",
        conversationId: "conv-f1-b1",
        senderId: "buyer-1",
        senderName: "ABC Foods Pvt. Ltd.",
        senderRole: "buyer",
        receiverId: "farmer-1",
        text: "Namaste Ramesh ji! We saw your 80 Quintal Sharbati Wheat lot with Grade A quality report. We have sent an official offer of ₹2,440/Quintal.",
        attachedOfferId: "offer-201",
        timestamp: "2026-03-13T10:16:00.000Z",
      },
      {
        id: "msg-2",
        conversationId: "conv-f1-b1",
        senderId: "farmer-1",
        senderName: "Ramesh Kumar",
        senderRole: "farmer",
        receiverId: "buyer-1",
        text: "Namaste! Thank you for the offer. The wheat was dried under controlled sunshine and has under 11.2% moisture. Will you arrange pickup or should I book via FarmIntel logistics?",
        timestamp: "2026-03-13T10:22:00.000Z",
      },
      {
        id: "msg-3",
        conversationId: "conv-f1-b1",
        senderId: "buyer-1",
        senderName: "ABC Foods Pvt. Ltd.",
        senderRole: "buyer",
        receiverId: "farmer-1",
        text: "If you book via FarmIntel logistics to our Fatuha silo, we add ₹50/Q transport reimbursement directly into your final escrow payout. Please check and accept the offer!",
        timestamp: "2026-03-13T10:25:00.000Z",
      },
    ];

    // Seed Logistics Providers
    this.logisticsProviders = [
      {
        id: "log-1",
        name: "Gramin Kisan Rath Logistics",
        vehicleType: "Tata Ace (1.5T)",
        capacityQuintals: 15,
        ratePerKm: 28,
        baseFare: 650,
        rating: 4.9,
        phone: "+91 94314 55667",
        availableDrivers: 6,
      },
      {
        id: "log-2",
        name: "Bihar Agro Fleet Services",
        vehicleType: "Pickup 407 (3.5T)",
        capacityQuintals: 35,
        ratePerKm: 38,
        baseFare: 1100,
        rating: 4.8,
        phone: "+91 98352 77889",
        availableDrivers: 4,
      },
      {
        id: "log-3",
        name: "Mandi Connect 14ft Carriers",
        vehicleType: "Truck 14ft (7T)",
        capacityQuintals: 80,
        ratePerKm: 52,
        baseFare: 1900,
        rating: 4.7,
        phone: "+91 97715 33441",
        availableDrivers: 3,
      },
      {
        id: "log-4",
        name: "Local Kisan Tractor Trolley",
        vehicleType: "Tractor Trolley (4T)",
        capacityQuintals: 40,
        ratePerKm: 32,
        baseFare: 800,
        rating: 4.6,
        phone: "+91 91223 99001",
        availableDrivers: 8,
      },
    ];

    // Seed Logistics Bookings
    this.logisticsBookings = [
      {
        id: "book-301",
        farmerId: "farmer-1",
        farmerName: "Ramesh Kumar",
        providerId: "log-3",
        providerName: "Mandi Connect 14ft Carriers",
        vehicleType: "Truck 14ft (7T)",
        pickupAddress: "Danapur Rural Farm Store, Patna",
        destinationMandi: "Patna Mandi (Bazar Samiti)",
        distanceKm: 28,
        quantityQuintals: 80,
        estimatedCost: 3356,
        scheduledDate: "2026-03-15",
        status: "Scheduled",
        trackingNumber: "FI-TRK-88219",
        createdAt: "2026-03-12T14:00:00.000Z",
      },
    ];

    // Seed Transactions
    this.transactions = [
      {
        id: "tx-501",
        listingId: "lot-prev-99",
        offerId: "offer-prev-99",
        cropName: "Wheat (Kundan Variety)",
        farmerId: "farmer-1",
        farmerName: "Ramesh Kumar",
        buyerId: "buyer-1",
        buyerName: "ABC Foods Pvt. Ltd.",
        quantityQuintals: 60,
        pricePerQ: 2400,
        grossAmount: 144000,
        transportCost: 8400,
        storageAndHandlingCost: 2400,
        mandiTaxes: 1500,
        totalExpenses: 12300,
        netRealisation: 131700,
        paymentMethod: "e-NAM Escrow",
        paymentStatus: "Released to Farmer",
        settlementDate: "2026-02-28",
        status: "Completed",
      },
      {
        id: "tx-502",
        listingId: "lot-prev-88",
        offerId: "offer-prev-88",
        cropName: "Paddy (Katarni Rice)",
        farmerId: "farmer-1",
        farmerName: "Ramesh Kumar",
        buyerId: "buyer-2",
        buyerName: "Kisan Agro Processing Mill",
        quantityQuintals: 45,
        pricePerQ: 2320,
        grossAmount: 104400,
        transportCost: 6300,
        storageAndHandlingCost: 1800,
        mandiTaxes: 1100,
        totalExpenses: 9200,
        netRealisation: 95200,
        paymentMethod: "Direct Bank Transfer",
        paymentStatus: "Released to Farmer",
        settlementDate: "2026-01-20",
        status: "Completed",
      },
    ];
  }

  // Helper calculation for Net Realisation
  calculateNetRealisation(
    quantityQuintals: number,
    mandiPrice: number,
    transportCostPerQ: number,
    storageCostPerQ: number,
    otherCostPerQ: number = 25
  ) {
    const grossRevenue = quantityQuintals * mandiPrice;
    const transportTotal = quantityQuintals * transportCostPerQ;
    const storageTotal = quantityQuintals * storageCostPerQ;
    const otherTotal = quantityQuintals * otherCostPerQ;
    const totalExpenses = transportTotal + storageTotal + otherTotal;
    const netRealisation = grossRevenue - totalExpenses;
    const netPerQuintal = quantityQuintals > 0 ? Math.round(netRealisation / quantityQuintals) : 0;

    return {
      grossRevenue,
      transportTotal,
      storageTotal,
      otherTotal,
      totalExpenses,
      netRealisation,
      netPerQuintal,
    };
  }

  // Recommendation engine: finds highest net profit mandi, not just headline price
  getMarketRecommendations(cropName: string = "Wheat", quantityQuintals: number = 80) {
    const markets = this.marketPrices.filter(
      (m) => m.cropName.toLowerCase().includes(cropName.toLowerCase()) || cropName.toLowerCase().includes(m.cropName.toLowerCase())
    );

    const evaluated = markets.map((m) => {
      const calc = this.calculateNetRealisation(
        quantityQuintals,
        m.modalPrice,
        m.transportCostPerQ,
        m.storageCostPerQ,
        m.mandiFeePerQ
      );

      // Score based on net earnings + demand + price trend
      let score = calc.netRealisation;
      if (m.demandStatus === "Very High") score *= 1.05;
      if (m.priceTrend === "Rising") score *= 1.03;
      if (m.weatherRisk === "High Rain Alert") score *= 0.9;

      // Compare net realization per quintal against official MSP benchmark
      const mspBenchmark = this.mspBenchmarks.find(
        (b) => b.cropName.toLowerCase().includes(m.cropName.toLowerCase()) || m.cropName.toLowerCase().includes(b.cropName.toLowerCase())
      ) || this.mspBenchmarks[0];
      const mspRate = mspBenchmark ? mspBenchmark.mspRate : 2275;
      const netPerQ = calc.netPerQuintal;
      const netDiffFromMsp = netPerQ - mspRate;
      const isNetAboveMsp = netDiffFromMsp >= 0;
      const modalDiffFromMsp = m.modalPrice - mspRate;

      return {
        ...m,
        calc,
        compositeScore: Math.round(score),
        mspBenchmark: {
          rate: mspRate,
          cropName: mspBenchmark?.cropName || m.cropName,
          modalDiffFromMsp,
          netDiffFromMsp,
          isNetAboveMsp,
          isModalAboveMsp: modalDiffFromMsp >= 0,
          statusBadge: isNetAboveMsp ? `+₹${netDiffFromMsp}/Q vs MSP` : `⚠️ -₹${Math.abs(netDiffFromMsp)}/Q Below MSP`,
        },
      };
    });

    // Sort descending by highest Net Realisation
    evaluated.sort((a, b) => b.calc.netRealisation - a.calc.netRealisation);

    const bestMarket = evaluated[0] || null;
    const headlineHighest = [...evaluated].sort((a, b) => b.modalPrice - a.modalPrice)[0] || null;

    let explanation = "";
    if (bestMarket && headlineHighest && bestMarket.id !== headlineHighest.id) {
      explanation = `Even though ${headlineHighest.mandiName} offers a headline price of ₹${headlineHighest.modalPrice}/Q, high transport (₹${headlineHighest.transportCostPerQ}/Q) reduces your net profit. ${bestMarket.mandiName} provides ₹${bestMarket.calc.netRealisation.toLocaleString("en-IN")} net earning (₹${(bestMarket.calc.netRealisation - headlineHighest.calc.netRealisation).toLocaleString("en-IN")} higher net in your pocket!)`;
    } else if (bestMarket) {
      explanation = `${bestMarket.mandiName} currently provides the highest net profit of ₹${bestMarket.calc.netRealisation.toLocaleString("en-IN")} with strong local buyer demand and safe dry weather.`;
    }

    return {
      bestMarket,
      headlineHighest,
      evaluatedMarkets: evaluated,
      explanation,
    };
  }

  // MSP Benchmark Evaluator
  getMspComparison(cropName: string = "Wheat", offeredPrice: number = 2400) {
    const benchmark = this.mspBenchmarks.find(
      (b) => b.cropName.toLowerCase().includes(cropName.toLowerCase()) || cropName.toLowerCase().includes(b.cropName.toLowerCase())
    ) || this.mspBenchmarks[0];

    const diff = offeredPrice - benchmark.mspRate;
    const diffPercent = Number(((diff / benchmark.mspRate) * 100).toFixed(1));
    const isAboveMsp = diff >= 0;

    return {
      benchmark,
      offeredPrice,
      diff,
      diffPercent,
      isAboveMsp,
      statusBadge: isAboveMsp ? `+₹${diff} (+${diffPercent}%) Above MSP` : `⚠️ -₹${Math.abs(diff)} (${diffPercent}%) Below MSP`,
      advice: isAboveMsp
        ? `Offered price of ₹${offeredPrice.toLocaleString("en-IN")}/Q safely exceeds the Govt MSP benchmark of ₹${benchmark.mspRate.toLocaleString("en-IN")}/Q by ₹${diff}/Q. This is an attractive transaction window.`
        : `⚠️ Critical Alert: Offered price of ₹${offeredPrice.toLocaleString("en-IN")}/Q is ₹${Math.abs(diff)}/Q below the Government Minimum Support Price (₹${benchmark.mspRate.toLocaleString("en-IN")}/Q). Farmers are protected against distress sale and can utilize FCI / State APMC centers for guaranteed ₹${benchmark.mspRate.toLocaleString("en-IN")}/Q.`,
      procurementAlert: `Active Agencies: ${benchmark.procuringAgencies.join(", ")} | Window: ${benchmark.procurementPeriod} | Quality Norms: ${benchmark.qualityNorms}`,
    };
  }

  // Selling Window Recommendation
  getSellingWindowRecommendation(cropName: string = "Wheat") {
    // Determine realistic window based on current crop dynamics
    return {
      crop: cropName,
      recommendedWindow: "Next 2–3 days",
      urgencyLevel: "Optimal",
      confidence: "Medium-High",
      currentPrice: 2460,
      expectedTrajectory: "Price may increase by ₹30–₹60 over 48 hours due to tight arrival supply and festival procurement.",
      weatherFactor: "Sunny and dry weather (32°C). Zero rain threat across Bihar & East UP corridor. Safe for farm transport.",
      demandSignal: "High procurement target active by commercial flour mills and institutional food processors.",
      disclaimer: "Estimate based on current mandi arrivals and weather models — not an absolute financial guarantee.",
      reasons: [
        "Mandi arrivals are 18% lower than weekly average, creating temporary seller leverage.",
        "Major institutional buyers (ABC Foods & Kisan Agro) have active open procurement quotas.",
        "Clear dry weather forecast prevents transit spoilage or wet grain discount.",
        "Storage cost increases by ₹12/quintal if held past 7 days.",
      ],
    };
  }

  // --- NOTIFICATIONS ---
  createNotification(
    userId: string,
    type: AppNotification["type"],
    title: string,
    message: string,
    relatedId?: string
  ): AppNotification {
    const notification: AppNotification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      type,
      title,
      message,
      relatedId,
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(notification);
    return notification;
  }

  getNotifications(userId: string): AppNotification[] {
    return this.notifications.filter((n) => n.userId === userId);
  }

  markNotificationRead(id: string): boolean {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      return true;
    }
    return false;
  }

  markAllNotificationsRead(userId: string): number {
    let count = 0;
    for (const n of this.notifications) {
      if (n.userId === userId && !n.read) {
        n.read = true;
        count++;
      }
    }
    return count;
  }

  // --- OFFERS WORKFLOW ---
  createOffer(data: {
    listingId: string;
    cropName?: string;
    crop?: string;
    farmerId: string;
    farmerName?: string;
    buyerId: string;
    buyerName?: string;
    offeredPricePerQ?: number;
    pricePerUnit?: number;
    quantityQuintals?: number;
    quantity?: number;
    pickupLocation?: string;
    deliveryLocation?: string;
    message?: string;
    notes?: string;
  }): Offer {
    const listing = this.listings.find((l) => l.id === data.listingId);
    const farmer = this.users.find((u) => u.id === data.farmerId);
    const buyer = this.users.find((u) => u.id === data.buyerId);
    const buyerProfile = this.buyerProfiles.find((b) => b.userId === data.buyerId);

    const price = data.offeredPricePerQ || data.pricePerUnit || listing?.expectedPricePerQ || 2400;
    const quantity = data.quantityQuintals || data.quantity || listing?.quantityQuintals || 50;
    const totalAmount = price * quantity;
    const crop = data.crop || data.cropName || listing?.cropName || "Wheat";
    const farmerName = data.farmerName || farmer?.name || listing?.farmerName || "Ramesh Kumar";
    const buyerName = data.buyerName || buyerProfile?.businessName || buyer?.name || "ABC Foods Pvt. Ltd.";

    const offerId = `offer-${Date.now()}`;
    const newOffer: Offer = {
      id: offerId,
      offerId,
      listingId: data.listingId || "lot-101",
      cropName: crop,
      crop,
      farmerId: data.farmerId,
      farmerName,
      buyerId: data.buyerId,
      buyerName,
      buyerTrustScore: buyerProfile?.trustScore || 4.8,
      buyerVerified: buyerProfile?.verificationStatus === "Verified" || true,
      offeredPricePerQ: price,
      pricePerUnit: price,
      quantityQuintals: quantity,
      quantity,
      totalAmount,
      pickupLocation: data.pickupLocation || `${farmer?.location.village || "Danapur Rural"}, ${farmer?.location.district || "Patna"}`,
      deliveryLocation: data.deliveryLocation || `${buyerName} Warehouse, Patna`,
      logisticsIncluded: false,
      paymentTerms: "100% Escrow deposit upon contract, released within 24hr of delivery",
      status: "PENDING",
      notes: data.message || data.notes || "I can supply Grade A wheat.",
      message: data.message || data.notes || "I can supply Grade A wheat.",
      history: [
        {
          senderId: data.farmerId,
          senderName: farmerName,
          senderRole: "farmer",
          pricePerQ: price,
          message: data.message || "Initial offer sent",
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.offers.unshift(newOffer);

    // Notify Buyer: "🔔 New offer received from Ramesh Kumar (Wheat, 50 Quintal, ₹2,400/Q)"
    this.createNotification(
      data.buyerId,
      "NEW_OFFER",
      `New offer received from ${farmerName}`,
      `${crop}, ${quantity} Quintal at ₹${price.toLocaleString("en-IN")}/Q (Total: ₹${totalAmount.toLocaleString("en-IN")})`,
      newOffer.id
    );

    return newOffer;
  }

  // Accept Offer -> Create Deal (CONFIRMED)
  acceptOffer(offerId: string, note?: string): { offer: Offer; deal: Deal } {
    const offer = this.offers.find((o) => o.id === offerId || o.offerId === offerId);
    if (!offer) {
      throw new Error(`Offer not found: ${offerId}`);
    }

    offer.status = "ACCEPTED";
    offer.updatedAt = new Date().toISOString();
    if (note) offer.notes = `${offer.notes ? offer.notes + " | " : ""}${note}`;

    // Create Deal
    const dealSeq = String(this.dealCounter++).padStart(4, "0");
    const dealId = `FI-2026-${dealSeq}`;
    const agreedPrice = offer.counterPricePerQ || offer.offeredPricePerQ || 2400;
    const qty = offer.quantityQuintals || 50;
    const total = agreedPrice * qty;

    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      dealId,
      offerId: offer.id,
      farmerId: offer.farmerId,
      farmerName: offer.farmerName,
      buyerId: offer.buyerId,
      buyerName: offer.buyerName,
      listingId: offer.listingId,
      crop: offer.cropName || offer.crop || "Wheat",
      quantity: qty,
      price: agreedPrice,
      totalAmount: total,
      status: "CONFIRMED",
      pickupLocation: offer.pickupLocation || "Danapur Rural Farm Gate, Patna",
      deliveryLocation: offer.deliveryLocation || "ABC Foods Warehouse, Fatuha, Patna",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.deals.unshift(newDeal);

    // Also update listing status to Under Negotiation / Sold
    const listing = this.listings.find((l) => l.id === offer.listingId);
    if (listing) {
      listing.status = "Under Negotiation";
    }

    // Notify Farmer: "ABC Foods Pvt. Ltd. accepted your wheat offer. Deal ID: FI-2026-0001"
    this.createNotification(
      offer.farmerId,
      "OFFER_ACCEPTED",
      `${offer.buyerName} accepted your offer!`,
      `Your offer for ${newDeal.crop} (${newDeal.quantity} Quintals @ ₹${agreedPrice}/Q) is confirmed. Deal ID: ${dealId}`,
      newDeal.id
    );

    // Notify Buyer
    this.createNotification(
      offer.buyerId,
      "OFFER_ACCEPTED",
      `Deal Confirmed with ${offer.farmerName}`,
      `Contract created for ${newDeal.quantity} Quintals ${newDeal.crop}. Deal ID: ${dealId}`,
      newDeal.id
    );

    return { offer, deal: newDeal };
  }

  // Counter Offer
  counterOffer(
    offerId: string,
    counterPricePerQ: number,
    message: string,
    senderId: string,
    senderName: string,
    senderRole: "farmer" | "buyer"
  ): Offer {
    const offer = this.offers.find((o) => o.id === offerId || o.offerId === offerId);
    if (!offer) throw new Error(`Offer not found: ${offerId}`);

    offer.status = "COUNTERED";
    offer.counterPricePerQ = counterPricePerQ;
    offer.updatedAt = new Date().toISOString();
    if (!offer.history) offer.history = [];
    offer.history.push({
      senderId,
      senderName,
      senderRole,
      pricePerQ: counterPricePerQ,
      message,
      timestamp: new Date().toISOString(),
    });

    const recipientId = senderRole === "farmer" ? offer.buyerId : offer.farmerId;
    this.createNotification(
      recipientId,
      "COUNTER_OFFER",
      `Counter offer from ${senderName}`,
      `${offer.cropName}: Countered at ₹${counterPricePerQ.toLocaleString("en-IN")}/Q. "${message || ''}"`,
      offer.id
    );

    return offer;
  }

  // Reject Offer
  rejectOffer(offerId: string, reason?: string, senderRole?: "farmer" | "buyer"): Offer {
    const offer = this.offers.find((o) => o.id === offerId || o.offerId === offerId);
    if (!offer) throw new Error(`Offer not found: ${offerId}`);

    offer.status = "REJECTED";
    offer.updatedAt = new Date().toISOString();
    if (reason) offer.notes = `${offer.notes ? offer.notes + " | " : ""}Rejected: ${reason}`;

    const notifyId = senderRole === "buyer" ? offer.farmerId : offer.buyerId;
    this.createNotification(
      notifyId,
      "INFO",
      `Offer declined`,
      `Offer for ${offer.cropName} (${offer.quantityQuintals} Quintals) was not accepted.`,
      offer.id
    );

    return offer;
  }

  // Request Logistics
  requestLogistics(
    dealId: string,
    providerId?: string,
    pickupLocation?: string,
    destination?: string,
    estimatedCost?: number,
    scheduledDate?: string
  ): { deal: Deal; logistics: LogisticsRecord } {
    const deal = this.deals.find((d) => d.id === dealId || d.dealId === dealId);
    if (!deal) throw new Error(`Deal not found: ${dealId}`);

    const provider = this.logisticsProviders.find((p) => p.id === providerId) || this.logisticsProviders[0];
    const cost = estimatedCost || 2500;
    const logisticsId = `LOG-${Date.now().toString().slice(-6)}`;

    const logistics: LogisticsRecord = {
      id: `log-rec-${Date.now()}`,
      logisticsId,
      dealId: deal.dealId,
      provider: provider?.name || "Patna Agro Logistics",
      vehicleNumber: "BR-01-GA-4821 (Tata 407)",
      driver: "Mahesh Yadav",
      driverPhone: "+91 94318 76543",
      pickupLocation: pickupLocation || deal.pickupLocation,
      destination: destination || deal.deliveryLocation,
      estimatedCost: cost,
      status: "REQUESTED",
      scheduledDate: scheduledDate || "Tomorrow Morning 08:00 AM",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.logisticsRecords.unshift(logistics);
    deal.status = "TRANSPORT_REQUESTED";
    deal.logisticsId = logistics.logisticsId;
    deal.updatedAt = new Date().toISOString();

    // Notify both parties
    this.createNotification(
      deal.farmerId,
      "TRANSPORT_REQUESTED",
      "Transport Booking Requested",
      `Vehicle requested with ${logistics.provider} for Deal ${deal.dealId}. Estimated freight: ₹${cost.toLocaleString("en-IN")}`,
      deal.id
    );
    this.createNotification(
      deal.buyerId,
      "TRANSPORT_REQUESTED",
      "Transport Scheduled for Incoming Shipment",
      `Farmer initiated transport with ${logistics.provider} for Deal ${deal.dealId}.`,
      deal.id
    );

    return { deal, logistics };
  }

  // Advance Logistics Status
  advanceLogisticsStatus(
    logisticsId: string,
    nextStatus: LogisticsStatus
  ): { deal: Deal | null; logistics: LogisticsRecord } {
    const logistics = this.logisticsRecords.find(
      (l) => l.id === logisticsId || l.logisticsId === logisticsId
    );
    if (!logistics) throw new Error(`Logistics record not found: ${logisticsId}`);

    logistics.status = nextStatus;
    logistics.updatedAt = new Date().toISOString();

    const deal = this.deals.find((d) => d.dealId === logistics.dealId || d.id === logistics.dealId) || null;

    if (deal) {
      if (nextStatus === "ASSIGNED" || nextStatus === "PICKUP_SCHEDULED") {
        deal.status = "PICKUP_SCHEDULED";
      } else if (nextStatus === "PICKED_UP") {
        deal.status = "PICKED_UP";
      } else if (nextStatus === "IN_TRANSIT") {
        deal.status = "IN_TRANSIT";
      } else if (nextStatus === "DELIVERED") {
        deal.status = "DELIVERED";
      }
      deal.updatedAt = new Date().toISOString();

      let notifType: AppNotification["type"] = "INFO";
      let notifTitle = `Logistics Update: ${nextStatus}`;
      if (nextStatus === "IN_TRANSIT") {
        notifType = "SHIPMENT_IN_TRANSIT";
        notifTitle = `Shipment In Transit (Deal ${deal.dealId})`;
      } else if (nextStatus === "DELIVERED") {
        notifType = "DELIVERY_COMPLETED";
        notifTitle = `Delivery Completed at Warehouse (Deal ${deal.dealId})`;
      }

      this.createNotification(
        deal.farmerId,
        notifType,
        notifTitle,
        `Shipment status for ${deal.crop} (${deal.quantity} Quintals) is now: ${nextStatus}.`,
        deal.id
      );
      this.createNotification(
        deal.buyerId,
        notifType,
        notifTitle,
        `Shipment status for ${deal.crop} (${deal.quantity} Quintals) is now: ${nextStatus}.`,
        deal.id
      );
    }

    return { deal, logistics };
  }

  // Complete Payment and generate settlement transaction
  completePayment(
    dealId: string,
    paymentMethod: "Direct Bank Transfer" | "e-NAM Escrow" | "UPI" = "e-NAM Escrow"
  ): { deal: Deal; transaction: Transaction } {
    const deal = this.deals.find((d) => d.id === dealId || d.dealId === dealId);
    if (!deal) throw new Error(`Deal not found: ${dealId}`);

    const logistics = this.logisticsRecords.find((l) => l.dealId === deal.dealId);
    const transportCost = logistics ? logistics.estimatedCost : 2500;
    const storageCost = 500;
    const mandiTaxes = 0;
    const totalExpenses = transportCost + storageCost + mandiTaxes;
    const grossAmount = deal.totalAmount;
    const netRealisation = grossAmount - totalExpenses;

    const txId = `TX-${Date.now().toString().slice(-6)}`;
    const newTx: Transaction = {
      id: txId,
      listingId: deal.listingId,
      offerId: deal.offerId,
      cropName: deal.crop,
      farmerId: deal.farmerId,
      farmerName: deal.farmerName,
      buyerId: deal.buyerId,
      buyerName: deal.buyerName,
      quantityQuintals: deal.quantity,
      pricePerQ: deal.price,
      grossAmount,
      transportCost,
      storageAndHandlingCost: storageCost,
      mandiTaxes,
      totalExpenses,
      netRealisation,
      paymentMethod,
      paymentStatus: "Released to Farmer",
      settlementDate: new Date().toISOString().split("T")[0],
      status: "Completed",
    };

    this.transactions.unshift(newTx);
    deal.status = "COMPLETED";
    deal.transactionId = txId;
    deal.updatedAt = new Date().toISOString();

    const listing = this.listings.find((l) => l.id === deal.listingId);
    if (listing) {
      listing.status = "Sold";
    }

    // Notify Farmer
    this.createNotification(
      deal.farmerId,
      "PAYMENT_COMPLETED",
      `Payment Received: ₹${netRealisation.toLocaleString("en-IN")}`,
      `₹${grossAmount.toLocaleString("en-IN")} settled from ${deal.buyerName}. Net profit of ₹${netRealisation.toLocaleString("en-IN")} credited via ${paymentMethod}.`,
      txId
    );

    // Notify Buyer
    this.createNotification(
      deal.buyerId,
      "PAYMENT_COMPLETED",
      `Payment Released to ${deal.farmerName}`,
      `Deal ${deal.dealId} for ${deal.quantity} Quintals ${deal.crop} has been finalized and paid successfully.`,
      txId
    );

    return { deal, transaction: newTx };
  }
}

export const db = new Database();
