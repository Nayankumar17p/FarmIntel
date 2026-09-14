// src/components/farmer/MspBenchmarkView.tsx
import React, { useState, useEffect } from "react";
import {
  Scale,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Info,
  CheckCircle2,
  Building,
  Calendar,
  FileCheck,
  Calculator,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle,
  PhoneCall,
  Search,
  Filter,
} from "lucide-react";
import { MspBenchmark } from "../../types";

interface MspBenchmarkViewProps {
  language: "hi" | "en" | "hinglish";
  onNavigateToMarkets?: () => void;
}

export const MspBenchmarkView: React.FC<MspBenchmarkViewProps> = ({
  language,
  onNavigateToMarkets,
}) => {
  const [benchmarks, setBenchmarks] = useState<MspBenchmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [seasonFilter, setSeasonFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Interactive Calculator State
  const [calcCrop, setCalcCrop] = useState<string>("Wheat");
  const [calcOfferedPrice, setCalcOfferedPrice] = useState<number>(2450);
  const [calcQuantity, setCalcQuantity] = useState<number>(80);
  const [calcTransportCost, setCalcTransportCost] = useState<number>(280);
  const [calcMandiFees, setCalcMandiFees] = useState<number>(50);

  useEffect(() => {
    fetch("/api/msp/benchmarks")
      .then((r) => r.json())
      .then((data) => {
        if (data.benchmarks) {
          setBenchmarks(data.benchmarks);
        }
      })
      .catch((e) => console.error("Error fetching MSP benchmarks:", e))
      .finally(() => setLoading(false));
  }, []);

  const filteredBenchmarks = benchmarks.filter((b) => {
    const matchesSeason = seasonFilter === "All" || b.season === seasonFilter;
    const matchesSearch =
      b.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.hindiName.includes(searchTerm);
    return matchesSeason && matchesSearch;
  });

  // Selected benchmark for calculator
  const activeBenchmark =
    benchmarks.find(
      (b) =>
        b.cropName.toLowerCase().includes(calcCrop.toLowerCase()) ||
        calcCrop.toLowerCase().includes(b.cropName.toLowerCase())
    ) || benchmarks[0];

  // Calculations
  const mspRate = activeBenchmark ? activeBenchmark.mspRate : 2275;
  const grossIncome = calcOfferedPrice * calcQuantity;
  const totalExpenses = (calcTransportCost + calcMandiFees) * calcQuantity;
  const netRealisation = grossIncome - totalExpenses;
  const netPerQuintal = calcQuantity > 0 ? Math.round(netRealisation / calcQuantity) : 0;
  const netDiffFromMsp = netPerQuintal - mspRate;
  const isNetAboveMsp = netDiffFromMsp >= 0;

  // Comparison with selling directly at local PACS/FCI at MSP with minimal transport (₹40/Q)
  const localMspNetPerQ = mspRate - 40;
  const localMspTotalNet = localMspNetPerQ * calcQuantity;
  const netSavingsAtMsp = localMspTotalNet - netRealisation;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <Scale className="w-3.5 h-3.5" />
            <span>Govt. of India CACP Statutory Benchmark (2025–26)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight">
            {language === "hi"
              ? "न्यूनतम समर्थन मूल्य (MSP) एवं सुरक्षा मानदंड"
              : "Minimum Support Price (MSP) Benchmark Suite"}
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm mt-2 leading-relaxed">
            {language === "hi"
              ? "एमएसपी केवल एक भाव नहीं, किसान का वैधानिक सुरक्षा कवच है। जानिए आधिकारिक मूल्य, उत्पादन लागत, और जानिए कि दूर की मंडी में जाने पर परिवहन खर्च काटने के बाद क्या आपकी शुद्ध कमाई एमएसपी से कम तो नहीं रह जाती।"
              : "Compare official government procurement benchmarks against current mandi prices. Prevent distress sales by calculating net returns after logistics and transport deductions."}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10 text-xs">
            <div>
              <p className="text-stone-400 text-[10px] uppercase">Effective Season</p>
              <p className="font-bold text-white mt-0.5">Rabi &amp; Kharif 2025-26</p>
            </div>
            <div>
              <p className="text-stone-400 text-[10px] uppercase">Statutory Rule</p>
              <p className="font-bold text-emerald-400 mt-0.5">≥ 50% Profit over A2+FL</p>
            </div>
            <div>
              <p className="text-stone-400 text-[10px] uppercase">Procuring Bodies</p>
              <p className="font-bold text-white mt-0.5">FCI • NAFED • PACS • BSFC</p>
            </div>
            <div>
              <p className="text-stone-400 text-[10px] uppercase">Payment Mode</p>
              <p className="font-bold text-emerald-400 mt-0.5">Direct DBT to Bank (48h)</p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SECTION 1: Interactive Net Realisation vs MSP Calulcator */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 font-serif">
                {language === "hi"
                  ? "मंडी शुद्ध कमाई बनाम एमएसपी कैलकुलेटर"
                  : "Mandi Net-Realisation vs. MSP Checker"}
              </h2>
              <p className="text-xs text-stone-500">
                Determine if distant mandi transport costs drag your realized profit below guaranteed MSP
              </p>
            </div>
          </div>

          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 self-start sm:self-auto">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Prevents False High-Price Traps
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Inputs Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Select Crop</label>
                <select
                  value={calcCrop}
                  onChange={(e) => setCalcCrop(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold"
                >
                  <option value="Wheat">Wheat (गेहूं)</option>
                  <option value="Paddy / Rice (Common)">Paddy Common (धान)</option>
                  <option value="Maize / Corn">Maize (मक्का)</option>
                  <option value="Mustard & Rapeseed">Mustard (सरसों)</option>
                  <option value="Gram / Chana">Gram / Chana (चना)</option>
                  <option value="Soybean (Yellow)">Soybean (सोयाबीन)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Offered Mandi Price (₹ / Quintal)
                </label>
                <input
                  type="number"
                  value={calcOfferedPrice}
                  onChange={(e) => setCalcOfferedPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Lot Quantity (Quintals)
                </label>
                <input
                  type="number"
                  value={calcQuantity}
                  onChange={(e) => setCalcQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Transport Cost (₹ / Quintal)
                </label>
                <input
                  type="number"
                  value={calcTransportCost}
                  onChange={(e) => setCalcTransportCost(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold"
                />
                <span className="text-[10px] text-stone-500">e.g. Gaya / Patna distance freight</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Mandi Cess, Weighing &amp; Handling (₹ / Quintal)
              </label>
              <input
                type="number"
                value={calcMandiFees}
                onChange={(e) => setCalcMandiFees(Number(e.target.value))}
                className="w-full max-w-xs px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-semibold"
              />
            </div>
          </div>

          {/* Outcome & Comparison Card */}
          <div className="lg:col-span-6 bg-stone-50 rounded-2xl p-5 border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <span className="text-xs font-bold text-stone-500 uppercase">
                    Official Govt. MSP
                  </span>
                  <p className="text-xl font-bold text-stone-900 font-serif">
                    ₹{mspRate.toLocaleString("en-IN")}{" "}
                    <span className="text-xs font-normal text-stone-500">/ Quintal</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-stone-500 uppercase">
                    Your Mandi Net Realisation
                  </span>
                  <p
                    className={`text-xl font-bold font-serif ${
                      isNetAboveMsp ? "text-emerald-700" : "text-amber-700"
                    }`}
                  >
                    ₹{netPerQuintal.toLocaleString("en-IN")}{" "}
                    <span className="text-xs font-normal text-stone-500">/ Quintal</span>
                  </p>
                </div>
              </div>

              {/* Status Alert Banner */}
              <div
                className={`mt-4 p-4 rounded-xl border flex items-start space-x-3 text-xs ${
                  isNetAboveMsp
                    ? "bg-emerald-50 text-emerald-950 border-emerald-300"
                    : "bg-amber-50 text-amber-950 border-amber-300"
                }`}
              >
                {isNetAboveMsp ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-bold text-sm">
                    {isNetAboveMsp
                      ? `Favorable Deal: ₹${netDiffFromMsp}/Q (+${(
                          (netDiffFromMsp / mspRate) *
                          100
                        ).toFixed(1)}%) Above Govt MSP`
                      : `Critical Warning: Net Realisation is ₹${Math.abs(
                          netDiffFromMsp
                        )}/Q Below MSP!`}
                  </p>
                  <p className="mt-1 leading-relaxed opacity-90">
                    {isNetAboveMsp
                      ? `After deducting ₹${(calcTransportCost + calcMandiFees)}/Q in transit expenses, you still earn more than the government support price. Proceed with this mandi sale.`
                      : `Although the headline mandi price is ₹${calcOfferedPrice}/Q, high transport (₹${calcTransportCost}/Q) and handling drag your actual pocket earnings down to ₹${netPerQuintal}/Q. Selling locally at the nearest PACS/FCI procurement center yields ₹${localMspNetPerQ}/Q (saving you ₹${netSavingsAtMsp.toLocaleString("en-IN")} on ${calcQuantity} quintals)!`}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
              <span className="text-stone-500">
                Total Net for {calcQuantity}Q:{" "}
                <strong className="text-stone-900">
                  ₹{netRealisation.toLocaleString("en-IN")}
                </strong>
              </span>
              {onNavigateToMarkets && (
                <button
                  type="button"
                  onClick={onNavigateToMarkets}
                  className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center space-x-1"
                >
                  <span>Compare Nearby Mandis</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SECTION 2: Official MSP Benchmarks Table & Cards     */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 font-serif">
              {language === "hi"
                ? "वर्तमान विपणन वर्ष 2025-26 के आधिकारिक समर्थन मूल्य"
                : "Official MSP Benchmark Schedules (2025–26)"}
            </h2>
            <p className="text-xs text-stone-500">
              Approved by Cabinet Committee on Economic Affairs (CCEA) &amp; CACP
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search crop..."
                className="pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex rounded-xl bg-stone-100 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSeasonFilter("All")}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  seasonFilter === "All"
                    ? "bg-white text-stone-900 shadow-2xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSeasonFilter("Rabi")}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  seasonFilter === "Rabi"
                    ? "bg-white text-stone-900 shadow-2xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                Rabi (रबी)
              </button>
              <button
                type="button"
                onClick={() => setSeasonFilter("Kharif")}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  seasonFilter === "Kharif"
                    ? "bg-white text-stone-900 shadow-2xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                Kharif (खरीफ)
              </button>
            </div>
          </div>
        </div>

        {/* Benchmarks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBenchmarks.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                      {b.season} Crop
                    </span>
                    <h3 className="font-bold text-stone-900 text-base mt-1">
                      {b.cropName}{" "}
                      <span className="text-stone-500 text-xs font-normal">
                        ({b.hindiName})
                      </span>
                    </h3>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      b.status === "Active Procurement"
                        ? "bg-emerald-100 text-emerald-800"
                        : b.status === "Upcoming"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                {/* Rates */}
                <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                  <div>
                    <p className="text-[10px] text-stone-500 uppercase font-semibold">
                      Govt. MSP Rate
                    </p>
                    <p className="text-lg font-bold text-emerald-700 font-serif">
                      ₹{b.mspRate.toLocaleString("en-IN")}
                      <span className="text-[10px] font-normal text-stone-500"> / Q</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-500 uppercase font-semibold">
                      A2+FL Cost &amp; Return
                    </p>
                    <p className="text-xs font-bold text-stone-800">
                      Cost: ₹{b.costOfProduction}
                      <span className="text-emerald-700 font-bold ml-1">
                        (+{b.marginOverCostPercent}%)
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600">
                  <p className="flex items-center space-x-1.5 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>Window: {b.procurementPeriod}</span>
                  </p>
                  <p className="flex items-center space-x-1.5 text-[11px]">
                    <Building className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">Agencies: {b.procuringAgencies.join(", ")}</span>
                  </p>
                  <p className="text-[11px] text-stone-500 pt-1 border-t border-stone-100 leading-snug">
                    <strong className="text-stone-700">FAQ Specs:</strong> {b.qualityNorms}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-100">
                <p className="text-[11px] text-stone-600 italic bg-amber-50/60 p-2 rounded-lg border border-amber-200/50">
                  💡 {b.advisory}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SECTION 3: APMC & MSP Legal Awareness Guide         */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <FileCheck className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-stone-900 text-sm">
            Required Documents for Procurement
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            To register at Government PACS / FCI centers, keep your Land Record / LPC (भू-अभिलेख),
            Aadhaar card, and Active Bank Passbook ready for direct DBT transfers.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Scale className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-stone-900 text-sm">
            Fair Average Quality (FAQ) Standards
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Govt centers test moisture with digital meters. Wheat must have moisture ≤ 12%,
            Paddy ≤ 17%. Dry your grains on tarpaulin sheets before arriving to avoid discounts.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <PhoneCall className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-stone-900 text-sm">
            Kisan Call Center &amp; Grievance
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            If any local APMC trader threatens distress sales or refuses fair auctioning, dial
            toll-free Kisan Call Center <strong>1800-180-1551</strong> or contact your District Agri Officer.
          </p>
        </div>
      </div>
    </div>
  );
};
