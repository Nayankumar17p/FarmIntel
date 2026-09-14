// src/components/farmer/LogisticsView.tsx
import React, { useState, useEffect } from "react";
import {
  Truck,
  MapPin,
  Star,
  CheckCircle2,
  Phone,
  Calendar,
  Navigation,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";
import { LogisticsProvider, LogisticsBooking, User } from "../../types";

interface LogisticsViewProps {
  currentUser: User | null;
  language: "hi" | "en" | "hinglish";
}

export const LogisticsView: React.FC<LogisticsViewProps> = ({ currentUser, language }) => {
  const [providers, setProviders] = useState<LogisticsProvider[]>([]);
  const [bookings, setBookings] = useState<LogisticsBooking[]>([]);
  const [targetMandi, setTargetMandi] = useState("Patna Mandi (Bazar Samiti)");
  const [originAddress, setOriginAddress] = useState("Danapur Rural Farm, Patna");
  const [distanceKm, setDistanceKm] = useState(28);
  const [quantityQ, setQuantityQ] = useState(80);
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [routeDetails, setRouteDetails] = useState<any>(null);

  const fetchLogistics = () => {
    fetch("/api/logistics/providers")
      .then((r) => r.json())
      .then((data) => setProviders(data))
      .catch((e) => console.error(e));

    fetch("/api/logistics/bookings")
      .then((r) => r.json())
      .then((data) => setBookings(data))
      .catch((e) => console.error(e));
  };

  const fetchRouteEstimate = (origin: string, dest: string, qty: number) => {
    fetch(`/api/transport/estimate?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&quantity=${qty}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.route) {
          setRouteDetails(data);
          setDistanceKm(data.route.distanceKm);
        }
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    fetchLogistics();
    fetchRouteEstimate(originAddress, targetMandi, quantityQ);
  }, []);

  const handleMandiChange = (mandi: string) => {
    setTargetMandi(mandi);
    fetchRouteEstimate(originAddress, mandi, quantityQ);
  };

  const handleQuantityChange = (qty: number) => {
    const validQty = Math.max(5, qty);
    setQuantityQ(validQty);
    fetchRouteEstimate(originAddress, targetMandi, validQty);
  };

  const handleBookTransport = (provider: LogisticsProvider) => {
    const estimatedCost = provider.baseFare + distanceKm * provider.ratePerKm;

    fetch("/api/logistics/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        providerId: provider.id,
        providerName: provider.name,
        vehicleType: provider.vehicleType,
        pickupAddress: originAddress,
        destinationMandi: targetMandi,
        distanceKm,
        quantityQuintals: quantityQ,
        estimatedCost,
        scheduledDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      }),
    })
      .then((r) => r.json())
      .then((booking) => {
        setBookingSuccess(
          `Vehicle Booked! ${provider.vehicleType} (${provider.name}) assigned. Tracking ID: #${booking.booking?.trackingNumber || "TRK-SUCCESS"}`
        );
        fetchLogistics();
        setTimeout(() => setBookingSuccess(""), 5000);
      })
      .catch((e) => console.error("Booking error:", e));
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-900 mb-1.5 border border-orange-200">
            <Truck className="w-3.5 h-3.5 text-orange-700" />
            <span>Kisan Fleet &amp; Agri Logistics Network</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
            {language === "hi" ? "वाहन बुकिंग व भाड़ा दरें" : "Farm-to-Mandi Transport & Fleet"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {language === "hi"
              ? "सत्यापित वाहन चालकों और ट्रैक्टर ट्रॉलियों से उचित प्रति किलोमीटर दर पर भाड़ा बुक करें।"
              : "Book Tata Ace mini-trucks, 14ft medium trucks, and tractor trolleys with transparent per-km billing."}
          </p>
        </div>

        {/* Route & Distance Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-stone-50 p-2 rounded-2xl border border-stone-200 text-xs">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <select
              value={targetMandi}
              onChange={(e) => handleMandiChange(e.target.value)}
              className="font-bold text-stone-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="Patna Mandi (Bazar Samiti)">Patna Mandi (Bazar Samiti)</option>
              <option value="Gaya Mandi">Gaya Mandi</option>
              <option value="Muzaffarpur APMC">Muzaffarpur APMC</option>
              <option value="Begusarai Market">Begusarai Market</option>
              <option value="Samastipur Mandi">Samastipur Mandi</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 bg-stone-50 p-2 rounded-2xl border border-stone-200 text-xs">
            <span className="text-stone-500 font-semibold">Lot Size:</span>
            <input
              type="number"
              min="5"
              max="500"
              value={quantityQ}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              className="w-16 font-bold text-stone-900 bg-white border border-stone-300 rounded-lg px-2 py-0.5 text-xs text-center focus:outline-emerald-500"
            />
            <span className="font-bold text-stone-700">Q</span>
          </div>
        </div>
      </div>

      {/* Local Transport Distance & Cost Estimation Analysis Banner */}
      {routeDetails && (
        <div className="bg-linear-to-r from-emerald-50 via-white to-amber-50 rounded-3xl p-5 border border-emerald-200/80 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  {routeDetails.route.roadQuality}
                </span>
                <span className="text-xs font-semibold text-stone-500">
                  {routeDetails.route.distanceKm} km • Est. Transit: {routeDetails.route.estimatedTransitTimeFormatted}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                  Demo Distance Engine (No Maps Key Required)
                </span>
              </div>
              <p className="text-xs text-stone-700">
                Route: <strong className="text-stone-900">{routeDetails.route.origin}</strong> →{" "}
                <strong className="text-stone-900">{routeDetails.route.destination}</strong>
              </p>
            </div>

            {routeDetails.fpoAggregationSavingRs > 0 && (
              <div className="bg-amber-100/80 border border-amber-300 px-3 py-2 rounded-2xl text-xs text-amber-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold block">FPO Group Transport Incentive:</span>
                  <span className="text-[11px]">
                    {routeDetails.fpoSavingExplanation}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {bookingSuccess && (
        <div className="bg-emerald-50 border-2 border-emerald-500 p-4 rounded-2xl text-xs font-bold text-emerald-900 flex items-center space-x-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{bookingSuccess}</span>
        </div>
      )}

      {/* Available Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {providers.map((p) => {
          const estimatedCost = p.baseFare + distanceKm * p.ratePerKm;
          const costPerQuintal = quantityQ > 0 ? Math.round(estimatedCost / quantityQ) : 0;

          return (
            <div
              key={p.id}
              className="bg-white rounded-3xl p-5 border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <span className="text-2xl">
                    {p.vehicleType.includes("Tractor") ? "🚜" : "🚚"}
                  </span>
                  <div className="flex items-center space-x-1 text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    <span>{p.rating}★</span>
                  </div>
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-bold text-stone-900">{p.name}</h3>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">{p.vehicleType}</p>
                  <p className="text-[11px] text-stone-500">Max Capacity: {p.capacityQuintals} Quintals</p>
                </div>

                {/* Pricing Details */}
                <div className="my-4 p-3 rounded-2xl bg-stone-50 space-y-1 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Base Fare:</span>
                    <span className="font-bold text-stone-900">₹{p.baseFare}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Rate / km:</span>
                    <span className="font-bold text-stone-900">₹{p.ratePerKm}/km</span>
                  </div>
                  <div className="pt-1.5 border-t border-stone-200 flex justify-between font-extrabold text-stone-900">
                    <span>Est. Trip Fare ({distanceKm}km):</span>
                    <span className="text-emerald-700 text-sm">₹{estimatedCost}</span>
                  </div>
                  <p className="text-[10px] text-stone-500 pt-0.5">
                    ≈ ₹{costPerQuintal}/Q for {quantityQ}Q lot
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleBookTransport(p)}
                className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Book Vehicle Now</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Active Bookings & Tracking List */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
        <h3 className="text-base font-bold text-stone-900 pb-3 border-b border-stone-100 flex items-center justify-between">
          <span>Active Transport Dispatches &amp; Tracking</span>
          <span className="text-xs font-semibold text-stone-500">
            {bookings.length} Bookings Recorded
          </span>
        </h3>

        <div className="divide-y divide-stone-100 mt-2">
          {bookings.map((b) => (
            <div key={b.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-stone-900 text-sm">{b.providerName}</span>
                  <span className="text-stone-500">• {b.vehicleType}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    ● {b.status}
                  </span>
                </div>
                <p className="text-stone-600 mt-1">
                  Route: {b.pickupAddress} → <strong className="text-stone-800">{b.destinationMandi}</strong> ({b.distanceKm} km)
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Tracking ID: <strong>#{b.trackingNumber}</strong> • Scheduled Date: {b.scheduledDate}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-stone-500 block">Total Freight:</span>
                <span className="text-base font-extrabold text-stone-900">
                  ₹{b.estimatedCost.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
