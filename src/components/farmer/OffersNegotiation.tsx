// src/components/farmer/OffersNegotiation.tsx
import React, { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ShieldCheck,
  Star,
  MapPin,
  CreditCard,
  Truck,
  DollarSign,
  ArrowRight,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Building,
  User as UserIcon,
} from "lucide-react";
import { Offer, User } from "../../types";

interface OffersNegotiationProps {
  currentUser: User | null;
  language: "hi" | "en" | "hinglish";
  onOpenChat: (otherUserId: string, otherUserName: string) => void;
  onViewTransactions: () => void;
  onNavigateToDeals?: (dealId?: string) => void;
  onSwitchPersona?: (personaId: string) => void;
}

export const OffersNegotiation: React.FC<OffersNegotiationProps> = ({
  currentUser,
  language,
  onOpenChat,
  onViewTransactions,
  onNavigateToDeals,
  onSwitchPersona,
}) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [counterModalOffer, setCounterModalOffer] = useState<Offer | null>(null);
  const [counterPrice, setCounterPrice] = useState(2380);
  const [counterNote, setCounterNote] = useState("Can you do ₹2,380 for immediate pickup?");
  const [actionSuccess, setActionSuccess] = useState("");
  const [lastCreatedDealId, setLastCreatedDealId] = useState<string | null>(null);

  const isBuyer = currentUser?.role === "buyer";
  const isFarmer = currentUser?.role === "farmer";

  const fetchOffers = () => {
    fetch("/api/offers")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setOffers(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Failed to fetch offers:", e);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOffers();
    const interval = setInterval(fetchOffers, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = (offer: Offer) => {
    fetch(`/api/offers/${offer.id}/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        const dealId = data.deal?.dealId || "FI-2026-0001";
        setLastCreatedDealId(dealId);
        setActionSuccess(`Deal Confirmed! Binding agreement generated: ${dealId}`);
        fetchOffers();
        setTimeout(() => setActionSuccess(""), 5000);
      })
      .catch((e) => console.error("Failed to accept offer:", e));
  };

  const handleReject = (offer: Offer) => {
    fetch(`/api/offers/${offer.id}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(() => {
        setActionSuccess(`Offer #${offer.id} was rejected.`);
        fetchOffers();
        setTimeout(() => setActionSuccess(""), 3000);
      })
      .catch((e) => console.error("Failed to reject offer:", e));
  };

  const handleCounter = () => {
    if (!counterModalOffer) return;

    fetch(`/api/offers/${counterModalOffer.id}/counter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        counterPricePerQ: counterPrice,
        note: counterNote,
      }),
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(() => {
        setActionSuccess(`Counter offer of ₹${counterPrice}/Q submitted to ${counterModalOffer.farmerName || "Farmer"}.`);
        setCounterModalOffer(null);
        fetchOffers();
        setTimeout(() => setActionSuccess(""), 4000);
      })
      .catch((e) => console.error("Failed to submit counter offer:", e));
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 mb-1.5 border border-emerald-200">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {isBuyer ? "Institutional Bids & Proposals" : "Direct Crop Offers & Counter-Bids"}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
            {language === "hi"
              ? "खरीदार-किसान सौदेबाजी व प्रस्ताव"
              : isBuyer
              ? "Buyer Offer Review & Negotiation"
              : "Offers & Trade Negotiations"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {isBuyer
              ? "Review direct proposals from farmers, submit competitive counter-offers, and lock legally binding procurement contracts."
              : "Review offers, accept buyer counter-bids, and generate binding trade contracts with escrow protection."}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {onNavigateToDeals && (
            <button
              onClick={() => onNavigateToDeals()}
              className="py-2 px-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <span>View Confirmed Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onViewTransactions}
            className="py-2 px-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Ledger</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="bg-emerald-50 border-2 border-emerald-500 p-4 rounded-2xl text-xs font-bold text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm">{actionSuccess}</span>
          </div>

          {lastCreatedDealId && onNavigateToDeals && (
            <button
              onClick={() => onNavigateToDeals(lastCreatedDealId)}
              className="py-1.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center space-x-1 self-start sm:self-auto cursor-pointer"
            >
              <span>Go to Deal &amp; Arrange Transport</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Offers List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center text-stone-500">
            Loading active trade proposals...
          </div>
        ) : offers.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center text-stone-500 space-y-2">
            <p className="font-semibold text-stone-700">No active trade proposals found.</p>
            <p className="text-xs">
              {isFarmer
                ? "Go to 'Find Buyers' to send a proposal to ABC Foods Pvt. Ltd."
                : "Awaiting farm-gate direct offers from farmers."}
            </p>
          </div>
        ) : (
          offers.map((offer) => {
            const statusUpper = (offer.status || "").toUpperCase();
            const isAccepted = statusUpper === "ACCEPTED";
            const isCountered = statusUpper === "COUNTERED";
            const isPending = statusUpper === "PENDING";
            const isRejected = statusUpper === "REJECTED";

            const displayPrice = isCountered && offer.counterPricePerQ ? offer.counterPricePerQ : offer.offeredPricePerQ;
            const displayTotal = displayPrice * offer.quantityQuintals;

            return (
              <div
                key={offer.id}
                className={`bg-white rounded-3xl p-6 border transition-all shadow-xs ${
                  isAccepted
                    ? "border-emerald-500 bg-emerald-50/20"
                    : isCountered
                    ? "border-blue-400 bg-blue-50/20"
                    : isPending
                    ? "border-amber-300"
                    : "border-stone-200 opacity-80"
                }`}
              >
                {/* Top Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-stone-900 flex items-center">
                        {isBuyer ? (
                          <>
                            <UserIcon className="w-4 h-4 mr-1 text-emerald-700" />
                            <span>Seller: {offer.farmerName || "Ramesh Kumar"}</span>
                          </>
                        ) : (
                          <>
                            <Building className="w-4 h-4 mr-1 text-blue-700" />
                            <span>Buyer: {offer.buyerName || "ABC Foods Pvt. Ltd."}</span>
                          </>
                        )}
                      </h3>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        Verified (4.8★)
                      </span>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          isPending
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : isAccepted
                            ? "bg-emerald-600 text-white"
                            : isCountered
                            ? "bg-blue-100 text-blue-900 border border-blue-300"
                            : "bg-rose-100 text-rose-900"
                        }`}
                      >
                        {offer.status}
                      </span>
                    </div>

                    <p className="text-xs text-stone-500 mt-1">
                      Commodity: <strong className="text-stone-800">{offer.cropName}</strong> • Volume:{" "}
                      <strong className="text-stone-800">{offer.quantityQuintals} Quintals</strong> • Offer ID: #{offer.id}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-bold text-stone-500">
                      {isCountered ? "Counter Price" : "Offered Price"}
                    </span>
                    <p className="text-2xl font-extrabold text-emerald-700">
                      ₹{displayPrice}
                      <span className="text-xs font-normal text-stone-500"> / Q</span>
                    </p>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 text-xs">
                  <div className="p-3 bg-stone-50 rounded-2xl">
                    <span className="text-stone-500 font-medium block">Quantity:</span>
                    <span className="font-bold text-stone-900 text-sm">{offer.quantityQuintals} Quintals</span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-2xl">
                    <span className="text-stone-500 font-medium block">Total Value:</span>
                    <span className="font-extrabold text-stone-900 text-sm">
                      ₹{displayTotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-2xl">
                    <span className="text-stone-500 font-medium block">Quality Grade:</span>
                    <span className="font-bold text-emerald-800">Grade A Verified</span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-2xl">
                    <span className="text-stone-500 font-medium block">Payment Terms:</span>
                    <span className="font-bold text-stone-900">
                      {offer.paymentTerms || "100% Escrow on Delivery"}
                    </span>
                  </div>
                </div>

                {/* Counter Offer Highlight Box */}
                {isCountered && (
                  <div className="p-4 bg-blue-50 border border-blue-300 rounded-2xl text-xs text-blue-950 space-y-1.5 mb-3">
                    <div className="flex items-center space-x-2 font-bold text-sm text-blue-900">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>
                        Buyer Counter-Offer: ₹{offer.counterPricePerQ} / Quintal (Total: ₹{displayTotal.toLocaleString("en-IN")})
                      </span>
                    </div>
                    {offer.counterNote && (
                      <p className="text-stone-700 italic">
                        &ldquo;{offer.counterNote}&rdquo;
                      </p>
                    )}
                  </div>
                )}

                {/* Bottom Bar: Locations & Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
                  <div className="text-xs text-stone-600 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-stone-400" />
                    Pickup: {offer.pickupLocation} → Delivery: {offer.deliveryLocation}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() =>
                        onOpenChat(
                          isBuyer ? offer.farmerId || "farmer-1" : offer.buyerId || "buyer-1",
                          isBuyer ? offer.farmerName || "Ramesh Kumar" : offer.buyerName || "ABC Foods Pvt. Ltd."
                        )
                      }
                      className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>

                    {/* BUYER ACTIONS when Offer is Pending */}
                    {isBuyer && isPending && (
                      <>
                        <button
                          onClick={() => handleReject(offer)}
                          className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>

                        <button
                          onClick={() => {
                            setCounterModalOffer(offer);
                            setCounterPrice(2380);
                            setCounterNote("Can you do ₹2,380 for immediate pickup?");
                          }}
                          className="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold cursor-pointer"
                        >
                          Counter Offer (₹2,380)
                        </button>

                        <button
                          onClick={() => handleAccept(offer)}
                          className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1 shadow-xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept Offer (₹{offer.offeredPricePerQ}/Q)</span>
                        </button>
                      </>
                    )}

                    {/* FARMER ACTIONS when Offer is Countered */}
                    {isFarmer && isCountered && (
                      <>
                        <button
                          onClick={() => handleReject(offer)}
                          className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject Counter</span>
                        </button>

                        <button
                          onClick={() => handleAccept(offer)}
                          className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1 shadow-xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept Counter (₹{offer.counterPricePerQ}/Q)</span>
                        </button>
                      </>
                    )}

                    {/* Pending state on farmer side: offer waiting for buyer */}
                    {isFarmer && isPending && (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-amber-800 font-semibold bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                          Waiting for ABC Foods Pvt. Ltd. to review
                        </span>
                        {onSwitchPersona && (
                          <button
                            onClick={() => onSwitchPersona("buyer-1")}
                            className="py-1.5 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                          >
                            Switch to ABC Foods to Respond →
                          </button>
                        )}
                      </div>
                    )}

                    {/* Accepted state */}
                    {isAccepted && (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-emerald-700 flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                          Deal Confirmed!
                        </span>
                        {onNavigateToDeals && (
                          <button
                            onClick={() => onNavigateToDeals(offer.dealId)}
                            className="py-1.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer flex items-center space-x-1"
                          >
                            <span>Go to Deal &amp; Transport</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Counter Offer Modal */}
      {counterModalOffer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">Make Counter-Offer</h3>
                <p className="text-xs text-stone-500">
                  Seller offered: ₹{counterModalOffer.offeredPricePerQ}/Q for {counterModalOffer.quantityQuintals} Quintals
                </p>
              </div>
              <button
                onClick={() => setCounterModalOffer(null)}
                className="text-stone-400 hover:text-stone-700 font-bold text-lg"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Counter Price (₹ / Quintal)
                </label>
                <input
                  type="number"
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-base font-extrabold border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Negotiation Note / Terms
                </label>
                <input
                  type="text"
                  value={counterNote}
                  onChange={(e) => setCounterNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl space-y-1 text-stone-600">
                <div className="flex justify-between">
                  <span>Revised Deal Total:</span>
                  <span className="font-extrabold text-stone-900">
                    ₹{(counterPrice * counterModalOffer.quantityQuintals).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold text-[11px]">
                  <span>Farmer: {counterModalOffer.farmerName || "Ramesh Kumar"}</span>
                  <span>Pickup: Danapur Rural</span>
                </div>
              </div>

              <button
                onClick={handleCounter}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Send Counter-Offer to Ramesh Kumar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
