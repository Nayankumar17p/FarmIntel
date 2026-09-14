// src/components/buyer/BuyerDashboard.tsx
import React, { useState, useEffect } from "react";
import {
  Store,
  Search,
  Filter,
  ShieldCheck,
  MapPin,
  Send,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { CropListing, User } from "../../types";
import { FarmLogoIcon } from "../common/FarmLogo";

interface BuyerDashboardProps {
  currentUser: User | null;
  language: "hi" | "en" | "hinglish";
  lowDataMode: boolean;
  onOpenChat: (farmerId: string, farmerName: string) => void;
  onNavigateToOffers?: () => void;
  onNavigateToDeals?: () => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({
  currentUser,
  language,
  lowDataMode,
  onOpenChat,
  onNavigateToOffers,
  onNavigateToDeals,
}) => {
  const [listings, setListings] = useState<CropListing[]>([]);
  const [selectedCrop, setSelectedCrop] = useState("All");
  const [minGrade, setMinGrade] = useState("All");
  const [offerModalLot, setOfferModalLot] = useState<CropListing | null>(null);
  const [bidPrice, setBidPrice] = useState(2440);
  const [offerSentMessage, setOfferSentMessage] = useState("");

  const fetchListings = () => {
    fetch("/api/listings")
      .then((r) => r.json())
      .then((data) => setListings(data))
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const filteredListings = listings.filter((l) => {
    if (selectedCrop !== "All" && l.cropName !== selectedCrop) return false;
    if (minGrade !== "All" && !l.qualityGrade.includes(minGrade)) return false;
    return true;
  });

  const submitBuyerOffer = () => {
    if (!offerModalLot) return;

    fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId: offerModalLot.id,
        cropName: offerModalLot.cropName,
        farmerId: offerModalLot.farmerId,
        farmerName: offerModalLot.farmerName,
        offeredPricePerQ: bidPrice,
        quantityQuintals: offerModalLot.quantityQuintals,
        notes: `Purchase proposal from ${currentUser?.name || "ABC Foods"} for full lot of ${offerModalLot.quantityQuintals}Q`,
      }),
    })
      .then((r) => r.json())
      .then(() => {
        setOfferSentMessage(`Formal purchase bid of ₹${bidPrice}/Q submitted to ${offerModalLot.farmerName}!`);
        setTimeout(() => {
          setOfferSentMessage("");
          setOfferModalLot(null);
        }, 2200);
      });
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white p-1 shadow-md flex items-center justify-center shrink-0 border border-white/20 mt-0.5">
            <FarmLogoIcon className="w-full h-full" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 mb-2 border border-emerald-500/30">
              <Store className="w-3.5 h-3.5" />
              <span>Institutional Procurement Portal</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-bold font-serif">
              {currentUser?.name || "ABC Foods Pvt. Ltd."}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 mt-1">
              Browse verified farm-gate harvested lots directly from verified farmers and FPOs.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onNavigateToOffers && (
            <button
              onClick={onNavigateToOffers}
              className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Direct Farmer Proposals →
            </button>
          )}

          {onNavigateToDeals && (
            <button
              onClick={onNavigateToDeals}
              className="py-2 px-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 font-bold text-xs transition-colors cursor-pointer"
            >
              Active Deals &amp; Escrow
            </button>
          )}

          <div className="flex items-center space-x-3 bg-stone-800/80 p-2.5 rounded-2xl border border-stone-700">
            <div className="text-right">
              <span className="text-[10px] text-stone-400 uppercase font-bold">Quota</span>
              <p className="text-sm font-extrabold text-emerald-400">1,500 Q</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-stone-600 mr-1 flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1 text-stone-400" /> Filter Crop:
          </span>
          {["All", "Wheat", "Tomato", "Maize"].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCrop(c)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCrop === c
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-stone-500 font-semibold">Min Grade:</span>
          <select
            value={minGrade}
            onChange={(e) => setMinGrade(e.target.value)}
            className="px-2.5 py-1 rounded-xl border border-stone-300 text-stone-700 font-semibold focus:outline-none"
          >
            <option value="All">All Grades</option>
            <option value="Grade A">Grade A Only</option>
            <option value="Grade B">Grade B+</option>
          </select>
        </div>
      </div>

      {/* Lots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredListings.map((lot) => (
          <div
            key={lot.id}
            className="bg-white rounded-3xl p-5 border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900">{lot.cropName}</h3>
                  <p className="text-xs text-stone-500">{lot.variety}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {lot.qualityGrade}
                </span>
              </div>

              <div className="my-4 flex space-x-3">
                {!lowDataMode && lot.images?.[0] && (
                  <img
                    src={lot.images[0]}
                    alt={lot.cropName}
                    className="w-20 h-20 rounded-2xl object-cover border border-stone-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="flex-1 space-y-1 text-xs text-stone-700">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Available Volume:</span>
                    <span className="font-extrabold text-stone-900">{lot.quantityQuintals} Quintals</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Farmer Expected:</span>
                    <span className="font-bold text-emerald-700">₹{lot.expectedPricePerQ} / Q</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Seller:</span>
                    <span className="font-medium text-stone-800">{lot.farmerName}</span>
                  </div>
                  <div className="flex items-center text-[11px] text-stone-500 pt-0.5">
                    <MapPin className="w-3 h-3 mr-1 text-stone-400" />
                    <span>{lot.location?.village}, {lot.location?.district}</span>
                  </div>
                </div>
              </div>

              {lot.qualityReport?.aiNotes && (
                <div className="p-2.5 bg-stone-50 rounded-xl text-[11px] text-stone-600 border border-stone-200/80">
                  <span className="font-bold text-stone-800">Quality Verified: </span>
                  {lot.qualityReport.aiNotes}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setOfferModalLot(lot);
                  setBidPrice(lot.expectedPricePerQ - 10);
                }}
                className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Place Purchase Bid</span>
              </button>

              <button
                onClick={() => onOpenChat(lot.farmerId, lot.farmerName)}
                className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-stone-600" />
                <span>Chat Farmer</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Offer Modal */}
      {offerModalLot && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">Make Formal Purchase Offer</h3>
                <p className="text-xs text-stone-500">
                  Lot: {offerModalLot.cropName} ({offerModalLot.quantityQuintals} Quintals) by {offerModalLot.farmerName}
                </p>
              </div>
              <button
                onClick={() => setOfferModalLot(null)}
                className="text-stone-400 hover:text-stone-700 font-bold text-lg"
              >
                ×
              </button>
            </div>

            {offerSentMessage ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-semibold text-center">
                ✓ {offerSentMessage}
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Your Bid Price (₹ / Quintal)
                  </label>
                  <input
                    type="number"
                    value={bidPrice}
                    onChange={(e) => setBidPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-base font-extrabold border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="p-3 bg-stone-50 rounded-xl text-stone-600">
                  <div className="flex justify-between font-bold">
                    <span>Total Purchase Commitment:</span>
                    <span className="text-emerald-700 text-sm">
                      ₹{(bidPrice * offerModalLot.quantityQuintals).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <button
                  onClick={submitBuyerOffer}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Submit Official Purchase Bid
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
