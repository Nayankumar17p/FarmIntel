// src/components/farmer/MarketIntelligence.tsx
import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  MapPin,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  Filter,
  Info,
  Calendar,
  Layers,
  Sparkles,
  Search,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { MarketPrice } from "../../types";

interface MarketIntelligenceProps {
  language: "hi" | "en" | "hinglish";
  lowDataMode: boolean;
  onSelectMarket?: (market: MarketPrice) => void;
}

export const MarketIntelligence: React.FC<MarketIntelligenceProps> = ({
  language,
  lowDataMode,
  onSelectMarket,
}) => {
  const [selectedCrop, setSelectedCrop] = useState("Wheat");
  const [quantity, setQuantity] = useState(80);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const availableCrops = [
    { id: "Wheat", name: "Wheat (गेहूं)", emoji: "🌾" },
    { id: "Tomato", name: "Tomato (टमाटर)", emoji: "🍅" },
    { id: "Maize", name: "Maize (मक्का)", emoji: "🌽" },
    { id: "Paddy", name: "Paddy / Rice (धान)", emoji: "🍚" },
    { id: "Potato", name: "Potato (आलू)", emoji: "🥔" },
  ];

  const fetchMarkets = () => {
    setLoading(true);
    fetch(`/api/markets/compare?crop=${selectedCrop}&quantity=${quantity}`)
      .then((res) => res.json())
      .then((data) => {
        setComparisonData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMarkets();
  }, [selectedCrop, quantity]);

  const bestMarket = comparisonData?.bestMarket;
  const headlineMarket = comparisonData?.headlineHighest;
  const markets: MarketPrice[] = comparisonData?.evaluatedMarkets || [];

  // Data for Recharts comparison
  const chartData = markets.map((m) => ({
    name: m.mandiName.replace(" Mandi", "").replace(" (Bazar Samiti)", ""),
    "Headline Price": m.modalPrice,
    "Transport Cost": m.transportCostPerQ,
    "Net Earning (Pocket)": m.calc?.netPerQuintal || (m.modalPrice - m.transportCostPerQ - m.storageCostPerQ),
  }));

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header & Crop Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Smart Mandi Comparison Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
            {language === "hi" ? "मंडी भाव व शुद्ध कमाई तुलना" : "Market Intelligence & Net Realisation"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {language === "hi"
              ? "केवल कच्चा मंडी भाव नहीं, बल्कि भाड़ा व स्टोरेज खर्च काटकर वास्तविक लाभ की तुलना करें।"
              : "Compare headline prices minus transport and storage expenses to find your highest net pocket earnings."}
          </p>
        </div>

        {/* Controls: Crop Pill Tabs & Quantity */}
        <div className="flex flex-wrap items-center gap-2">
          {availableCrops.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCrop(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCrop === c.id
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {c.emoji} {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Quantity Slider */}
      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-stone-700 whitespace-nowrap">
            {language === "hi" ? "आपकी फसल मात्रा:" : "Your Lot Quantity:"}
          </span>
          <input
            type="range"
            min="10"
            max="300"
            step="5"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full sm:w-60 accent-emerald-600 cursor-pointer"
          />
          <span className="text-xs font-extrabold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-stone-300">
            {quantity} Quintals
          </span>
        </div>
        <p className="text-[11px] text-stone-500 text-center sm:text-right">
          {language === "hi"
            ? "मात्रा बदलने पर कुल भाड़ा और शुद्ध मुनाफा स्वतः अपडेट होगा।"
            : "Total transport costs and net earnings automatically recalculate with quantity."}
        </p>
      </div>

      {/* RECOMMENDATION SPOTLIGHT BANNER */}
      {bestMarket && (
        <div className="bg-linear-to-r from-emerald-50 via-teal-50 to-emerald-100 p-5 sm:p-6 rounded-3xl border-2 border-emerald-400 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                  ✓ RECOMMENDED MARKET
                </span>
                <span className="text-xs font-bold text-emerald-950">
                  {bestMarket.mandiName}
                </span>
                {bestMarket.mspBenchmark && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      bestMarket.mspBenchmark.isNetAboveMsp
                        ? "bg-emerald-200 text-emerald-900"
                        : "bg-amber-200 text-amber-900"
                    }`}
                  >
                    MSP ₹{bestMarket.mspBenchmark.rate}: {bestMarket.mspBenchmark.statusBadge}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-stone-700 font-medium pt-1 max-w-2xl">
                {comparisonData?.explanation ||
                  `Selling here gives you the highest net cash of ₹${bestMarket.calc?.netRealisation.toLocaleString("en-IN")} after paying transport.`}
              </p>
            </div>

            <div className="flex items-center space-x-4 shrink-0 bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-emerald-200">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-stone-500">
                  {language === "hi" ? "शुद्ध कमाई (हाथ में)" : "Net Realisation"}
                </span>
                <p className="text-lg sm:text-2xl font-extrabold text-emerald-700">
                  ₹{bestMarket.calc?.netRealisation.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="h-8 w-px bg-stone-200" />
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-stone-500">
                  {language === "hi" ? "प्रति क्विंटल शुद्ध" : "Per Quintal"}
                </span>
                <p className="text-sm font-bold text-stone-900">
                  ₹{bestMarket.calc?.netPerQuintal} / Q
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MSP Floor Price Statutory Card */}
      {bestMarket?.mspBenchmark && (
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-stone-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <span className="text-lg">⚖️</span>
            <div>
              <span className="font-bold text-amber-950">
                Official Govt. MSP Floor for {selectedCrop}: ₹{bestMarket.mspBenchmark.rate} / Quintal
              </span>
              <p className="text-stone-600 text-[11px] mt-0.5">
                Statutory CACP benchmark. Always compare your Net Realisation after transport against this floor.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 self-start sm:self-auto shrink-0">
            <span
              className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                bestMarket.mspBenchmark.isNetAboveMsp
                  ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                  : "bg-amber-100 text-amber-900 border border-amber-300"
              }`}
            >
              Recommended Net: {bestMarket.mspBenchmark.netDiffFromMsp >= 0 ? "+" : ""}
              ₹{bestMarket.mspBenchmark.netDiffFromMsp}/Q vs MSP
            </span>
          </div>
        </div>
      )}

      {/* CORE COMPARISON TABLE */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              {language === "hi" ? "मंडी-वार शुद्ध लाभ विश्लेषण" : "Mandi-by-Mandi Net Profit Breakdown"}
            </h2>
            <p className="text-xs text-stone-500">
              {language === "hi"
                ? "मंडी भाव में से प्रति क्विंटल भाड़ा, तुलाई व सेस काटकर शुद्ध कमाई की गणना"
                : "Exact calculation of Gross Price - Transport - Storage = Real Net Pocket Cash"}
            </p>
          </div>
          <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-full self-start sm:self-auto">
            Sorted by Highest Net Earnings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-600 font-semibold">
                <th className="py-3 px-4">Mandi & Distance</th>
                <th className="py-3 px-4 text-right">Headline Price</th>
                <th className="py-3 px-4 text-right">Transport Cost</th>
                <th className="py-3 px-4 text-right">Storage/Cess</th>
                <th className="py-3 px-4 text-right font-bold text-emerald-800 bg-emerald-50/60">
                  Net Earning / Q
                </th>
                <th className="py-3 px-4 text-right font-bold text-emerald-950 bg-emerald-100/50">
                  Total Net ({quantity}Q)
                </th>
                <th className="py-3 px-4 text-center">Demand & Weather</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {markets.map((m, idx) => {
                const isBest = bestMarket && m.id === bestMarket.id;
                const isHeadlineTop = headlineMarket && m.id === headlineMarket.id && !isBest;

                return (
                  <tr
                    key={m.id}
                    className={`hover:bg-stone-50/80 transition-colors ${
                      isBest ? "bg-emerald-50/40 font-medium" : ""
                    }`}
                  >
                    {/* Mandi Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        {isBest && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                        )}
                        <div>
                          <p className="font-bold text-stone-900 flex items-center">
                            {m.mandiName}
                            {isBest && (
                              <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-extrabold bg-emerald-600 text-white rounded">
                                BEST NET
                              </span>
                            )}
                            {isHeadlineTop && (
                              <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-900 rounded border border-amber-300">
                                High Gross Trap
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-stone-500 flex items-center mt-0.5">
                            <MapPin className="w-3 h-3 mr-0.5 text-stone-400" />
                            {m.district}, {m.state} • {m.distanceKm} km away
                          </p>
                          {m.mspBenchmark && (
                            <div className="mt-1 flex items-center space-x-1">
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  m.mspBenchmark.isNetAboveMsp
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-amber-100 text-amber-900 border border-amber-300"
                                }`}
                              >
                                MSP: {m.mspBenchmark.statusBadge} ({m.mspBenchmark.netDiffFromMsp >= 0 ? "+" : ""}₹{m.mspBenchmark.netDiffFromMsp}/Q)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Headline Price */}
                    <td className="py-3.5 px-4 text-right font-bold text-stone-900">
                      ₹{m.modalPrice}
                      <span className="text-[10px] text-stone-400 font-normal block">
                        ₹{m.minPrice} - ₹{m.maxPrice}
                      </span>
                    </td>

                    {/* Transport Cost */}
                    <td className="py-3.5 px-4 text-right text-rose-600 font-medium">
                      - ₹{m.transportCostPerQ}
                      <span className="text-[10px] text-stone-400 block">
                        Total ₹{(m.transportCostPerQ * quantity).toLocaleString("en-IN")}
                      </span>
                    </td>

                    {/* Storage & Cess */}
                    <td className="py-3.5 px-4 text-right text-stone-600">
                      - ₹{m.storageCostPerQ + m.mandiFeePerQ}
                      <span className="text-[10px] text-stone-400 block">Cess + handling</span>
                    </td>

                    {/* Net per Quintal */}
                    <td className="py-3.5 px-4 text-right font-extrabold text-emerald-700 bg-emerald-50/60 text-sm sm:text-base">
                      ₹{m.calc?.netPerQuintal || (m.modalPrice - m.transportCostPerQ - m.storageCostPerQ)}
                    </td>

                    {/* Total Net Realisation */}
                    <td className="py-3.5 px-4 text-right font-extrabold text-emerald-950 bg-emerald-100/50 text-sm sm:text-base">
                      ₹{m.calc?.netRealisation.toLocaleString("en-IN")}
                    </td>

                    {/* Demand & Weather Status */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            m.demandStatus === "Very High"
                              ? "bg-emerald-100 text-emerald-800"
                              : m.demandStatus === "High"
                              ? "bg-teal-100 text-teal-800"
                              : "bg-stone-100 text-stone-700"
                          }`}
                        >
                          {m.demandStatus} Demand
                        </span>
                        <span className="text-[10px] text-stone-500 mt-0.5">
                          {m.arrivalTonsToday}T today • {m.weatherRisk}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Bar Chart: Headline Price vs Net Realisation */}
      {!lowDataMode && chartData.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
          <div className="mb-4">
            <h3 className="text-base font-bold text-stone-900">
              {language === "hi" ? "चार्ट: दिखावटी भाव बनाम वास्तविक शुद्ध लाभ" : "Visual Price Spread: Headline vs Net Realisation"}
            </h3>
            <p className="text-xs text-stone-500">
              Notice how transport charges compress margins on distant markets with apparent high prices.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
                <XAxis dataKey="name" stroke="#78716c" fontSize={11} tickLine={false} />
                <YAxis stroke="#78716c" fontSize={11} tickLine={false} domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e7e5e4",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                  }}
                  formatter={(val: any) => [`₹${val} / Q`, ""]}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="Headline Price" fill="#94a3b8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Transport Cost" fill="#f87171" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Net Earning (Pocket)" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
