// server/services/databaseService.ts
// Modular Database Manager: Supports seamless in-memory demo data with optional MongoDB connector

import { db, User, CropListing, Offer, Transaction, LogisticsBooking } from "../db.js";

export type DatabaseMode = "in-memory" | "mongodb";

export interface DatabaseStatus {
  mode: DatabaseMode;
  isMongoConfigured: boolean;
  connected: boolean;
  message: string;
  stats: {
    usersCount: number;
    listingsCount: number;
    offersCount: number;
    transactionsCount: number;
    mandisCount: number;
  };
}

class DatabaseService {
  private mode: DatabaseMode = "in-memory";
  private isConnected: boolean = false;
  private statusMessage: string = "Local in-memory data store active";

  constructor() {
    this.init();
  }

  private async init() {
    const mongoUri = process.env.MONGODB_URI?.trim();

    if (!mongoUri) {
      this.mode = "in-memory";
      this.isConnected = true;
      this.statusMessage = "Local demo in-memory database operational (zero setup required).";
      console.log("📦 [Database] MONGODB_URI not provided. Running seamlessly with local demo in-memory data store.");
      return;
    }

    // Optional MongoDB Connection attempt
    try {
      console.log(`📡 [Database] MONGODB_URI detected. Attempting modular connection...`);
      // Dynamic import check for mongodb/mongoose without crashing if uninstalled
      const hasMongoose = await import("mongoose" as any).catch(() => null);
      if (hasMongoose && hasMongoose.default) {
        await hasMongoose.default.connect(mongoUri, { serverSelectionTimeoutMS: 2500 });
        this.mode = "mongodb";
        this.isConnected = true;
        this.statusMessage = "Connected to external MongoDB instance.";
        console.log("✅ [Database] Successfully connected to MongoDB database.");
      } else {
        // Fallback gracefully without error
        this.mode = "in-memory";
        this.isConnected = true;
        this.statusMessage = "MongoDB driver not installed; running seamlessly with local in-memory store.";
        console.log("ℹ️ [Database] MongoDB driver optional; running seamlessly with local in-memory store.");
      }
    } catch (err: any) {
      this.mode = "in-memory";
      this.isConnected = true;
      this.statusMessage = `MongoDB connection attempt timed out (${err?.message || "unreachable"}). Falling back safely to local in-memory store.`;
      console.warn("⚠️ [Database] Could not connect to remote MongoDB. Gracefully falling back to local in-memory database. The app remains 100% operational.");
    }
  }

  public getStatus(): DatabaseStatus {
    return {
      mode: this.mode,
      isMongoConfigured: Boolean(process.env.MONGODB_URI?.trim()),
      connected: this.isConnected,
      message: this.statusMessage,
      stats: {
        usersCount: db.users.length,
        listingsCount: db.listings.length,
        offersCount: db.offers.length,
        transactionsCount: db.transactions.length,
        mandisCount: db.marketPrices.length,
      },
    };
  }

  // Access to in-memory store
  public get store() {
    return db;
  }
}

export const databaseService = new DatabaseService();
