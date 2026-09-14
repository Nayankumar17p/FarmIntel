// src/components/farmer/BuyerMatching.tsx
import React, { useState, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  Star,
  MapPin,
  Send,
  MessageCircle,
  Building,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";
import { Buyer, CropListing } from "../../types";

interface BuyerMatchingProps {
  language: "hi" | "en" | "hinglish";
  onOpenChat: (buyerId: string, buyerName: string) => void;
  onSendOffer: (buyer: Buyer) => void;
  onNavigateToOffers?: () => void;
  onSwitchPersona?: (personaId: string) => void;
}

export const BuyerMatching: React.FC<BuyerMatchingProps> = ({
  language,
  onOpenChat,
  onSendOffer,
  onNavigateToOffers,
  onSwitchPersona,
}) => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [selectedCrop, setSelectedCrop] = useState("Wheat");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<Buyer | null>(null);
  const [bidPrice, setBidPrice] = useState(2400);
  const [bidQty, setBidQty] = useState(50);
  const [deliveryLocation, setDeliveryLocation] = useState("ABC Foods Warehouse, Patna");
  const [offerMessage, setOfferMessage] = useState("I can supply Grade A wheat.");
  const [submittedOffer, setSubmittedOffer] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/buyers/match?crop=${selectedCrop}&quantity=50`)
      .then((res) => res.json())
      .then((data) => {
        setBuyers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedCrop]);

  const handleSendDirectOffer = (buyer: Buyer) => {
    setShowModal(buyer);
    setBidPrice(2400);
    setBidQty(buyer.requiredQuantityQuintals || 50);
    setDeliveryLocation(buyer.businessName === "ABC Foods Pvt. Ltd." ? "ABC Foods Warehouse, Patna" : `${buyer.location?.district || "Patna"} Hub`);
    setOfferMessage("I can supply Grade A wheat.");
  };

  const submitOfferToBuyer = () => {
    if (!showModal) return;

    fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId: "lot-1",
        buyerId: showModal.userId,
        cropName: selectedCrop,
        quantityQuintals: bidQty,
        offeredPricePerQ: bidPrice,
        deliveryLocation: deliveryLocation,
        notes: offerMessage,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setSubmittedOffer(data);
      })
      .catch((err) => console.error("Failed to send offer:", err));
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 mb-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Institutional & Private Mill Procurement</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
            {language === "hi" ? "सत्यापित खरीदार मैचिंग" : "Verified Buyer Matching"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {language === "hi"
              ? "आपकी फसल, मात्रा, ग्रेड और स्थान के अनुसार सत्यापित खरीदारों से सीधा संपर्क करें।"
              : "Pre-vetted food processors, flour millers, and wholesalers seeking your exact grade and volume."}
          </p>
        </div>

        {/* Crop Filter Tabs */}
        <div className="flex items-center space-x-2">
          {["Wheat", "Tomato", "Maize", "Rice"].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCrop(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCrop === c
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Buyer Cards Grid (Format specifically requested in Master Prompt Section 11) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {buyers.map((b) => (
          <div
            key={b.userId}
            className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Buyer Name & Verification Badge */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900 leading-snug">
                    {b.businessName}
                  </h3>
                  <div className="flex items-center space-x-1 text-emerald-700 text-xs font-bold mt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>✓ Verified Buyer</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 px-2.5 py-1 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{b.trustScore || 4.7}/5</span>
                </div>
              </div>

              {/* Requirement & Offered Price */}
              <div className="my-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-medium">Looking for:</span>
                  <span className="font-bold text-stone-900">
                    {b.lookingForCrop || selectedCrop} ({b.requiredQuantityQuintals || 50} Quintals)
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-stone-200">
                  <span className="text-stone-500 font-medium">Offer Range:</span>
                  <span className="text-sm font-extrabold text-emerald-700">
                    ₹{b.minOfferPricePerQ || 2350} - ₹{b.maxOfferPricePerQ || 2450} / Q
                  </span>
                </div>
              </div>

              {/* Location & Distance */}
              <div className="space-y-1 text-xs text-stone-600">
                <p className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-stone-400" />
                  <span>{b.location?.district}, {b.location?.state}</span>
                </p>
                <p className="flex items-center text-stone-500 pl-4.5">
                  Distance: <strong className="ml-1 text-stone-800">{b.distanceKm || 32} km</strong>
                </p>
                <p className="text-[11px] text-stone-500 pl-4.5">
                  Payment: <strong>{b.paymentTermDays === 1 ? "Instant Escrow" : `${b.paymentTermDays} Days NEFT`}</strong>
                </p>
              </div>
            </div>

            {/* Actions: View Buyer, Send Offer, Chat */}
            <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSendDirectOffer(b)}
                className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Offer</span>
              </button>

              <button
                onClick={() => onOpenChat(b.userId, b.businessName)}
                className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-stone-600" />
                <span>Chat</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Send Offer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">Send Direct Offer</h3>
                <p className="text-xs text-stone-500">{showModal.businessName}</p>
              </div>
              <button
                onClick={() => setShowModal(null)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                ×
              </button>
            </div>

            {submittedOffer ? (
              <div className="space-y-4 py-2">
                <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border-2 border-emerald-500 text-xs space-y-2">
                  <div className="flex items-center space-x-2 font-extrabold text-sm text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Offer Sent Successfully!</span>
                  </div>
                  <p>
                    Offer ID: <strong>#{submittedOffer.offer?.id || submittedOffer.id || "offer-1001"}</strong>
                  </p>
                  <p>
                    Recipient: <strong>{showModal.businessName}</strong> • Status:{" "}
                    <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      PENDING
                    </span>
                  </p>
                  <p className="text-stone-600 pt-1">
                    50 Quintals Wheat @ ₹2,400 / Q (Total: ₹1,20,000)
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  {onSwitchPersona && (
                    <button
                      onClick={() => {
                        setShowModal(null);
                        setSubmittedOffer(null);
                        onSwitchPersona("buyer-1");
                        if (onNavigateToOffers) onNavigateToOffers();
                      }}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <span>Switch to ABC Foods to Review Offer →</span>
                    </button>
                  )}

                  {onNavigateToOffers && (
                    <button
                      onClick={() => {
                        setShowModal(null);
                        setSubmittedOffer(null);
                        onNavigateToOffers();
                      }}
                      className="w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs cursor-pointer"
                    >
                      View in My Offers &amp; Negotiations
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl space-y-1 border border-stone-200/80">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Listing:</span>
                    <span className="font-bold text-stone-900">Wheat (50 Quintal)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Quality:</span>
                    <span className="font-bold text-emerald-800">Grade A Verified</span>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Offer Price (₹ / Quintal)</label>
                  <input
                    type="number"
                    value={bidPrice}
                    onChange={(e) => setBidPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-bold border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Quantity (Quintals)</label>
                  <input
                    type="number"
                    value={bidQty}
                    onChange={(e) => setBidQty(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-bold border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Delivery Location</label>
                  <input
                    type="text"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Proposal Message</label>
                  <input
                    type="text"
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="p-3 bg-stone-50 rounded-xl text-stone-600">
                  <div className="flex justify-between font-semibold">
                    <span>Total Deal Value:</span>
                    <span className="text-emerald-700 font-extrabold text-sm">
                      ₹{(bidPrice * bidQty).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <button
                  onClick={submitOfferToBuyer}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Submit Offer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
