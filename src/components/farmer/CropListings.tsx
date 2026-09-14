// src/components/farmer/CropListings.tsx
import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  CheckCircle2,
  Calendar,
  MapPin,
  Sparkles,
  Layers,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Camera,
} from "lucide-react";
import { CropListing } from "../../types";

interface CropListingsProps {
  language: "hi" | "en" | "hinglish";
  lowDataMode: boolean;
  onOpenQualityCheck: () => void;
}

export const CropListings: React.FC<CropListingsProps> = ({
  language,
  lowDataMode,
  onOpenQualityCheck,
}) => {
  const [listings, setListings] = useState<CropListing[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [successBanner, setSuccessBanner] = useState<any>(null);

  // Form states
  const [cropName, setCropName] = useState("Wheat");
  const [variety, setVariety] = useState("Sharbati Gold (HD-2967)");
  const [quantity, setQuantity] = useState(80);
  const [expectedPrice, setExpectedPrice] = useState(2450);
  const [qualityGrade, setQualityGrade] = useState("Grade A (Premium)");
  const [village, setVillage] = useState("Danapur Rural");
  const [district, setDistrict] = useState("Patna");
  const [description, setDescription] = useState(
    "Organically sun-dried Sharbati wheat, moisture verified under 11.2%, sorted and packed in 50kg bags."
  );
  const [isFpo, setIsFpo] = useState(false);

  const fetchListings = () => {
    fetch("/api/listings")
      .then((r) => r.json())
      .then((data) => setListings(data))
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleCreateLot = (e: React.FormEvent) => {
    e.preventDefault();

    fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cropName,
        variety,
        quantityQuintals: quantity,
        expectedPricePerQ: expectedPrice,
        qualityGrade,
        location: { village, district, state: "Bihar" },
        description,
        isFpoAggregated: isFpo,
        fpoName: isFpo ? "Patliputra Kisan FPO Hub" : undefined,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        setSuccessBanner({
          crop: cropName,
          quantity,
          price: expectedPrice,
          matchedBuyers: res.matchedBuyersCount || 4,
        });
        setShowAddForm(false);
        fetchListings();
        setTimeout(() => setSuccessBanner(null), 8000);
      });
  };

  const handleDeleteListing = (id: string) => {
    fetch(`/api/listings/${id}`, { method: "DELETE" })
      .then(() => fetchListings())
      .catch((e) => console.error(e));
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header & New Lot CTA */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 mb-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Farm Lot Registry & Marketplace</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
            {language === "hi" ? "मेरी फसल लॉट सूची" : "Crop Lot Listings & Inventory"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {language === "hi"
              ? "अपनी फसल का लॉट बनाकर सीधे सत्यापित खरीदारों और राइस/फ्लोर मिलों को दिखाएं।"
              : "Register lots to broadcast directly to verified millers, exporters, and wholesale buyers."}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="py-2.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 cursor-pointer transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showAddForm ? "Close Form" : "+ Create New Crop Lot"}</span>
        </button>
      </div>

      {/* Success Notification Banner (Prompt Specification) */}
      {successBanner && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-5 shadow-sm space-y-1">
          <div className="flex items-center space-x-2 text-emerald-900 font-extrabold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Your Crop Lot is Live!</span>
          </div>
          <p className="text-xs text-emerald-800">
            <strong>{successBanner.crop}</strong> — {successBanner.quantity} Quintal @ Expected Price:{" "}
            <strong>₹{successBanner.price}/Q</strong>
          </p>
          <p className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-xl inline-block mt-1">
            🎯 {successBanner.matchedBuyers} buyers immediately matched with open buying quotas!
          </p>
        </div>
      )}

      {/* Add New Lot Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateLot}
          className="bg-white p-6 rounded-3xl border-2 border-emerald-500/60 shadow-lg space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-base font-bold text-stone-900">
              {language === "hi" ? "नई फसल लॉट जोड़ें" : "Create New Harvested Lot"}
            </h2>
            <button
              type="button"
              onClick={onOpenQualityCheck}
              className="text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 flex items-center space-x-1"
            >
              <Camera className="w-3.5 h-3.5 text-purple-600" />
              <span>Use AI Quality Check First</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Crop Name */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">Crop Name</label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full px-3 py-2 font-semibold border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Wheat">Wheat (गेहूं)</option>
                <option value="Tomato">Tomato (टमाटर)</option>
                <option value="Maize">Maize (मक्का)</option>
                <option value="Rice">Paddy / Rice (धान)</option>
                <option value="Potato">Potato (आलू)</option>
              </select>
            </div>

            {/* Variety */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">Variety</label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="e.g. Sharbati Gold / PBW-343"
                className="w-full px-3 py-2 font-semibold border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">Quantity (Quintals)</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 font-bold border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            {/* Expected Price */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">Expected Price (₹ / Quintal)</label>
              <input
                type="number"
                min="100"
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(Number(e.target.value))}
                className="w-full px-3 py-2 font-bold border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            {/* Quality Grade */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">Quality Grade</label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value)}
                className="w-full px-3 py-2 font-semibold border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Grade A (Premium)">Grade A (Premium / Clean / Low Moisture)</option>
                <option value="Grade B (Standard)">Grade B (Standard Commercial)</option>
                <option value="Grade C">Grade C (Feed / Processing)</option>
              </select>
            </div>

            {/* Location (Village & District) */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">Pickup Village & District</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="Village"
                  className="w-1/2 px-2.5 py-2 border border-stone-300 rounded-xl"
                />
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="District"
                  className="w-1/2 px-2.5 py-2 border border-stone-300 rounded-xl"
                />
              </div>
            </div>

            {/* FPO Aggregation checkbox */}
            <div className="sm:col-span-2 lg:col-span-3 flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="fpoCheck"
                checked={isFpo}
                onChange={(e) => setIsFpo(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
              <label htmlFor="fpoCheck" className="text-xs font-semibold text-stone-700 cursor-pointer">
                This lot is aggregated by a Farmer Producer Organization (FPO Bulk Lot)
              </label>
            </div>

            {/* Description */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block font-bold text-stone-700 mb-1">Lot Description & Storage Condition</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="py-2 px-4 rounded-xl border border-stone-300 text-stone-700 font-semibold text-xs hover:bg-stone-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm cursor-pointer"
            >
              Publish Crop Lot
            </button>
          </div>
        </form>
      )}

      {/* Existing Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {listings.map((lot) => (
          <div
            key={lot.id}
            className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-stone-900">{lot.cropName}</h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800">
                      {lot.qualityGrade}
                    </span>
                    {lot.isFpoAggregated && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-purple-100 text-purple-800">
                        FPO Bulk
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5 font-medium">{lot.variety}</p>
                </div>
                <button
                  onClick={() => handleDeleteListing(lot.id)}
                  className="text-stone-400 hover:text-rose-600 p-1 rounded-lg"
                  title="Remove Listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Lot Details */}
              <div className="mt-4 flex space-x-4">
                {!lowDataMode && lot.images?.[0] && (
                  <img
                    src={lot.images[0]}
                    alt={lot.cropName}
                    className="w-24 h-24 rounded-2xl object-cover border border-stone-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="flex-1 space-y-1.5 text-xs text-stone-700">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Lot Quantity:</span>
                    <span className="font-bold text-stone-900">{lot.quantityQuintals} Quintals</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Expected Price:</span>
                    <span className="font-extrabold text-emerald-700">₹{lot.expectedPricePerQ} / Q</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Total Lot Value:</span>
                    <span className="font-bold text-stone-900">
                      ₹{(lot.quantityQuintals * lot.expectedPricePerQ).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex items-center text-[11px] text-stone-500 pt-1">
                    <MapPin className="w-3 h-3 mr-1 text-stone-400" />
                    <span>
                      {lot.location.village}, {lot.location.district}
                    </span>
                  </div>
                </div>
              </div>

              {lot.qualityReport?.aiNotes && (
                <div className="mt-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200/80 text-[11px] text-stone-600">
                  <span className="font-bold text-stone-800">Quality Note: </span>
                  {lot.qualityReport.aiNotes}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                ● Status: {lot.status}
              </span>
              <span className="text-[11px] text-stone-500">
                Created: {new Date(lot.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
