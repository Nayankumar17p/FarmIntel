// src/components/farmer/ProfitCalculator.tsx
import React, { useState } from "react";
import { Calculator, ArrowRight, DollarSign, Sparkles, RefreshCw, CheckCircle2, Info } from "lucide-react";

interface ProfitCalculatorProps {
  language: "hi" | "en" | "hinglish";
}

export const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({ language }) => {
  const [crop, setCrop] = useState("Wheat");
  const [quantity, setQuantity] = useState(80);
  const [mandiName, setMandiName] = useState("Patna Mandi (Bazar Samiti)");
  const [mandiPrice, setMandiPrice] = useState(2420);
  const [transportCostPerQ, setTransportCostPerQ] = useState(140);
  const [storageCostPerQ, setStorageCostPerQ] = useState(40);
  const [otherCostPerQ, setOtherCostPerQ] = useState(25);

  // Calculations
  const grossRevenue = quantity * mandiPrice;
  const totalTransport = quantity * transportCostPerQ;
  const totalStorage = quantity * storageCostPerQ;
  const totalOther = quantity * otherCostPerQ;
  const totalExpenses = totalTransport + totalStorage + totalOther;
  const netRealisation = grossRevenue - totalExpenses;
  const netPerQ = quantity > 0 ? Math.round(netRealisation / quantity) : 0;
  const profitMarginPercent = grossRevenue > 0 ? ((netRealisation / grossRevenue) * 100).toFixed(1) : "0";

  const loadPreset = (preset: "patna" | "gaya" | "muzaffarpur") => {
    if (preset === "patna") {
      setMandiName("Patna Mandi (Bazar Samiti)");
      setMandiPrice(2420);
      setTransportCostPerQ(140);
      setStorageCostPerQ(40);
      setOtherCostPerQ(25);
    } else if (preset === "gaya") {
      setMandiName("Gaya Mandi");
      setMandiPrice(2520);
      setTransportCostPerQ(460);
      setStorageCostPerQ(50);
      setOtherCostPerQ(30);
    } else if (preset === "muzaffarpur") {
      setMandiName("Muzaffarpur APMC");
      setMandiPrice(2460);
      setTransportCostPerQ(220);
      setStorageCostPerQ(35);
      setOtherCostPerQ(20);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 mb-2">
          <Calculator className="w-3.5 h-3.5 text-emerald-600" />
          <span>Interactive Farm-to-Market Profit Simulator</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
          {language === "hi" ? "शुद्ध कमाई (Net Realisation) कैलकुलेटर" : "Net Realisation & Profit Calculator"}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          {language === "hi"
            ? "अपनी फसल मात्रा और मंडी दर्ज करें। हम आपको भाड़ा व मंडी खर्च काटकर शुद्ध कमाई बताएंगे।"
            : "Enter your crop details and transportation charges to calculate true pocket earnings before dispatching your vehicle."}
        </p>

        {/* Quick Presets */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-stone-500 mr-1">Quick Mandi Presets:</span>
          <button
            onClick={() => loadPreset("patna")}
            className="px-3 py-1 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            Patna (28 km - Optimal)
          </button>
          <button
            onClick={() => loadPreset("gaya")}
            className="px-3 py-1 text-xs font-bold rounded-xl bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            Gaya (115 km - High Transport)
          </button>
          <button
            onClick={() => loadPreset("muzaffarpur")}
            className="px-3 py-1 text-xs font-bold rounded-xl bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-colors cursor-pointer"
          >
            Muzaffarpur (75 km)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100">
            {language === "hi" ? "इनपुट विवरण भरें" : "Enter Crop & Cost Parameters"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Crop Name */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Crop Name</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Wheat">Wheat (गेहूं)</option>
                <option value="Tomato">Tomato (टमाटर)</option>
                <option value="Maize">Maize (मक्का)</option>
                <option value="Rice">Paddy / Rice (धान)</option>
                <option value="Potato">Potato (आलू)</option>
                <option value="Onion">Onion (प्याज)</option>
              </select>
            </div>

            {/* Quantity in Quintals */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Quantity (Quintals / 100kg)
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Target Mandi */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">Target Mandi</label>
              <input
                type="text"
                value={mandiName}
                onChange={(e) => setMandiName(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Mandi Price per Quintal */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Mandi Price (₹ / Quintal)
              </label>
              <input
                type="number"
                min="100"
                value={mandiPrice}
                onChange={(e) => setMandiPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Transport Cost per Quintal */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Transport Cost (₹ / Quintal)
              </label>
              <input
                type="number"
                min="0"
                value={transportCostPerQ}
                onChange={(e) => setTransportCostPerQ(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Storage / Unloading Cost per Quintal */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Storage / Bagging (₹ / Quintal)
              </label>
              <input
                type="number"
                min="0"
                value={storageCostPerQ}
                onChange={(e) => setStorageCostPerQ(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Mandi Cess / Other Charges per Quintal */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Mandi Cess & Labor (₹ / Quintal)
              </label>
              <input
                type="number"
                min="0"
                value={otherCostPerQ}
                onChange={(e) => setOtherCostPerQ(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right: Results & Pocket Earning Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-900 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Calculation Summary
                </span>
                <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
                  {profitMarginPercent}% Net Retained
                </span>
              </div>

              {/* 3 Prominent Stat Blocks requested by master prompt */}
              <div className="space-y-4 my-5">
                {/* 1. Estimated Gross Income */}
                <div className="bg-stone-800/70 p-3.5 rounded-2xl border border-stone-700/60">
                  <span className="text-[11px] text-stone-400 font-semibold block">
                    {language === "hi" ? "अनुमानित कुल बिक्री (Gross Income)" : "Estimated Gross Income"}
                  </span>
                  <p className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                    ₹{grossRevenue.toLocaleString("en-IN")}
                  </p>
                  <span className="text-[10px] text-stone-400">
                    {quantity} Quintals × ₹{mandiPrice}/Q
                  </span>
                </div>

                {/* 2. Estimated Expenses */}
                <div className="bg-stone-800/70 p-3.5 rounded-2xl border border-stone-700/60">
                  <span className="text-[11px] text-rose-300 font-semibold block">
                    {language === "hi" ? "अनुमानित कुल खर्च (Estimated Expenses)" : "Estimated Expenses"}
                  </span>
                  <p className="text-xl sm:text-2xl font-bold text-rose-400 mt-0.5">
                    - ₹{totalExpenses.toLocaleString("en-IN")}
                  </p>
                  <span className="text-[10px] text-stone-400">
                    Transport: ₹{totalTransport.toLocaleString("en-IN")} | Storage: ₹{totalStorage.toLocaleString("en-IN")} | Cess: ₹{totalOther.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* 3. Expected Net Income (The Hero Metric!) */}
                <div className="bg-emerald-950/70 p-4 rounded-2xl border-2 border-emerald-500 shadow-inner">
                  <span className="text-xs text-emerald-300 font-extrabold uppercase tracking-wide block">
                    {language === "hi" ? "आपकी शुद्ध कमाई (Expected Net Income)" : "Expected Net Income (In Hand)"}
                  </span>
                  <p className="text-3xl sm:text-4xl font-black text-emerald-400 mt-1">
                    ₹{netRealisation.toLocaleString("en-IN")}
                  </p>
                  <div className="mt-2 pt-2 border-t border-emerald-900/80 flex items-center justify-between text-xs text-emerald-200">
                    <span>Effective Net Rate:</span>
                    <span className="font-extrabold text-white text-sm">₹{netPerQ} / Quintal</span>
                  </div>

                  {/* MSP Benchmark Comparison */}
                  <div className="mt-2 pt-2 border-t border-emerald-900/80 flex items-center justify-between text-xs">
                    <span className="text-stone-300">Govt MSP Floor:</span>
                    <span className="font-bold text-amber-300">
                      ₹{crop === "Wheat" ? 2275 : crop === "Maize" ? 2090 : 2300} / Q
                    </span>
                  </div>
                  <div className="mt-1 text-right">
                    {netPerQ >= (crop === "Wheat" ? 2275 : crop === "Maize" ? 2090 : 2300) ? (
                      <span className="text-[10px] text-emerald-300 font-bold bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-700 inline-block">
                        ✓ Net is +₹{netPerQ - (crop === "Wheat" ? 2275 : crop === "Maize" ? 2090 : 2300)} Above MSP
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700 inline-block">
                        ⚠️ Net is -₹{(crop === "Wheat" ? 2275 : crop === "Maize" ? 2090 : 2300) - netPerQ} Below MSP! Check local PACS
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-stone-400 flex items-start space-x-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Formula: Net Realisation = Gross Revenue (₹{grossRevenue.toLocaleString("en-IN")}) − Total Expenses (₹{totalExpenses.toLocaleString("en-IN")}).
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
