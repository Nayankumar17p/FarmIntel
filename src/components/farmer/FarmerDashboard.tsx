// src/components/farmer/FarmerDashboard.tsx
import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  MapPin,
  Calendar,
  CloudSun,
  ShieldAlert,
  ArrowUpRight,
  PlusCircle,
  Calculator,
  Users,
  Camera,
  Truck,
  Bot,
  Layers,
  ChevronRight,
  Sparkles,
  Info,
  DollarSign,
  Award,
  Clock,
  ArrowRight,
} from "lucide-react";
import { User, CropListing, Offer } from "../../types";
import { FarmLogoIcon } from "../common/FarmLogo";
import { WeatherAlertBanner } from "./WeatherAlertBanner";

interface FarmerDashboardProps {
  currentUser: User | null;
  setCurrentTab: (tab: string) => void;
  language: "hi" | "en" | "hinglish";
  lowDataMode: boolean;
  onOpenQualityCheck: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  currentUser,
  setCurrentTab,
  language,
  lowDataMode,
  onOpenQualityCheck,
}) => {
  const [marketSnapshot, setMarketSnapshot] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/markets/compare?crop=Wheat&quantity=80")
      .then((res) => res.json())
      .then((data) => {
        setMarketSnapshot(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const bestMarket = marketSnapshot?.bestMarket;
  const headlineMarket = marketSnapshot?.headlineHighest;

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Top Greeting Section */}
      <div className="bg-linear-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative background logo watermark */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none pr-6 hidden sm:block">
          <FarmLogoIcon className="w-56 h-56 text-white" />
        </div>
        <div className="absolute top-0 right-1/4 w-32 h-32 rounded-full bg-emerald-400/10 blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-white p-1 shadow-md flex items-center justify-center border border-white/20">
              <FarmLogoIcon className="w-full h-full" />
            </div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-600/60 border border-emerald-400/30 text-xs font-semibold tracking-wide text-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {language === "hi"
                  ? "स्मार्ट इंडिया हैकाथॉन AI कृषि प्लेटफॉर्म"
                  : "AI Farm-to-Market Intelligence Engine"}
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-serif">
            {language === "hi"
              ? `नमस्ते, ${currentUser?.name || "किसान भाई"} 👋`
              : `Namaste, ${currentUser?.name || "Farmer"} 👋`}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            {language === "hi"
              ? "आइए जानें आपकी फसल के लिए सबसे सही मंडी, सही समय और सबसे ज़्यादा शुद्ध कमाई।"
              : "Let's find the best place and the best time to sell your crop for maximum net profit."}
          </p>

          {/* Quick Notice: Net Realisation Principle */}
          <div className="mt-4 flex items-start space-x-2.5 bg-black/20 backdrop-blur-xs border border-white/10 rounded-2xl p-3 sm:p-3.5 text-xs text-emerald-100">
            <Info className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <p>
              <strong className="text-white font-semibold">
                {language === "hi" ? "फार्मइंटेल का सुनहरा नियम: " : "FarmIntel Golden Rule: "}
              </strong>
              {language === "hi"
                ? "सिर्फ सबसे ऊंचा मंडी भाव न देखें! किराया और तुलाई काटकर जो पैसा आपकी जेब में बचे (Net Realisation), वही आपका असली मुनाफा है।"
                : "Don't just chase the headline market price. Compare price minus transport & storage costs to pocket the highest net earnings."}
            </p>
          </div>
        </div>
      </div>

      {/* Regional Weather Alert & Harvest Advisory Banner */}
      <WeatherAlertBanner
        district={currentUser?.location?.district || "Patna"}
        language={language}
        onViewSellingWindow={() => setCurrentTab("selling-window")}
      />

      {/* Today's Market Snapshot Cards */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center">
              <span>{language === "hi" ? "आज का मंडी स्नैपशॉट" : "Today's Market Snapshot"}</span>
              <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-md bg-stone-200 text-stone-700">
                🌾 Wheat (गेहूं)
              </span>
            </h2>
            <p className="text-xs text-stone-500">
              {language === "hi"
                ? "लाइव आवक, मौसम व भाड़ा खर्च के आधार पर विश्लेषण"
                : "Analyzed with live arrivals, transport distance, and regional weather"}
            </p>
          </div>
          <button
            onClick={() => setCurrentTab("markets")}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center self-start sm:self-auto"
          >
            {language === "hi" ? "सभी 5 मंडियां देखें" : "View All Mandis"}
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1: Your Crop */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              {language === "hi" ? "आपकी फसल" : "Your Crop"}
            </span>
            <div className="my-2">
              <span className="text-2xl">🌾</span>
              <p className="text-base font-bold text-stone-900 mt-1">Wheat (गेहूं)</p>
              <p className="text-[11px] text-stone-500">80 Quintal lot</p>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
              Grade A Premium
            </span>
          </div>

          {/* Card 2: Current Best Price */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              {language === "hi" ? "सर्वोत्तम भाव" : "Best Price"}
            </span>
            <div className="my-2">
              <p className="text-xl sm:text-2xl font-extrabold text-stone-900">₹2,460</p>
              <p className="text-[11px] text-stone-500">per Quintal</p>
            </div>
            <span className="text-[10px] text-stone-600 font-medium bg-stone-100 px-2 py-0.5 rounded-md inline-block">
              Muzaffarpur / Patna
            </span>
          </div>

          {/* Card 3: Recommended Best Market (Highest Net!) */}
          <div className="bg-emerald-50/80 p-4 rounded-2xl border-2 border-emerald-500 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">
              ★ TOP NET
            </div>
            <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
              {language === "hi" ? "बेस्ट मंडी (शुद्ध कमाई)" : "Best Market"}
            </span>
            <div className="my-2">
              <p className="text-base font-bold text-emerald-950 truncate">Patna Mandi</p>
              <p className="text-xs font-extrabold text-emerald-700">₹2,215/Q Net Earning</p>
            </div>
            <span className="text-[10px] text-emerald-800 font-semibold">
              Lowest transit cost (28 km)
            </span>
          </div>

          {/* Card 4: Expected Trend */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              {language === "hi" ? "अनुमानित रुझान" : "Expected Trend"}
            </span>
            <div className="my-2">
              <div className="flex items-center space-x-1 text-emerald-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-base font-bold text-emerald-700">↗ Rising</span>
              </div>
              <p className="text-[11px] text-stone-600 mt-1">Price may increase +₹40</p>
            </div>
            <span className="text-[10px] text-stone-500 font-medium">Demand high by mills</span>
          </div>

          {/* Card 5: Weather */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              {language === "hi" ? "मौसम" : "Weather"}
            </span>
            <div className="my-2">
              <div className="flex items-center space-x-1.5 text-amber-600">
                <CloudSun className="w-5 h-5" />
                <span className="text-base font-bold text-stone-900">31°C Clear</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">Rain chance: &lt;5%</p>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
              Safe for Transport
            </span>
          </div>

          {/* Card 6: Recommended Selling Window */}
          <div className="bg-amber-50/90 p-4 rounded-2xl border border-amber-300 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
              {language === "hi" ? "कब बेचें (समय)" : "Recommended"}
            </span>
            <div className="my-2">
              <p className="text-base font-bold text-amber-950">Next 2–3 days</p>
              <p className="text-[10px] text-amber-800 font-medium mt-0.5">Peak buyer inquiry</p>
            </div>
            <span className="text-[9px] text-amber-900 bg-amber-200/80 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">
              Estimate — not guarantee
            </span>
          </div>
        </div>

        {/* Mandatory Disclaimer Badge */}
        <div className="text-[11px] text-stone-500 flex items-center space-x-1 pl-1">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>
            {language === "hi"
              ? "चेतावनी: सभी मूल्य और समय भविष्यवाणियां अनुमान हैं, वित्तीय गारंटी नहीं। अपनी स्थानीय परिस्थिति अवश्य जांचें।"
              : "Disclaimer: Selling-window and price movement forecasts are estimates based on market models, not absolute financial guarantees."}
          </span>
        </div>
      </section>

      {/* QUICK ACTIONS SECTION (Large, Touch-Friendly Rural UI) */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900">
            {language === "hi" ? "त्वरित कार्य (Quick Actions)" : "Quick Actions"}
          </h2>
          <p className="text-xs text-stone-500">
            {language === "hi"
              ? "एक क्लिक में अपनी फसल बेचें, भाव जांचें या खरीदार खोजें"
              : "Fast actions tailored for simple one-tap farmer operation"}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* Action 1: Add Crop */}
          <button
            onClick={() => setCurrentTab("listings")}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/40 shadow-xs transition-all text-center group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl mb-2 group-hover:scale-105 transition-transform">
              🌾
            </div>
            <span className="text-xs font-bold text-stone-900">
              {language === "hi" ? "फसल जोड़ें" : "Add Crop"}
            </span>
            <span className="text-[10px] text-stone-500 mt-0.5">
              {language === "hi" ? "नया लॉट बनाएं" : "Create Lot"}
            </span>
          </button>

          {/* Action 2: Check Prices */}
          <button
            onClick={() => setCurrentTab("markets")}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/40 shadow-xs transition-all text-center group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center text-xl mb-2 group-hover:scale-105 transition-transform">
              📊
            </div>
            <span className="text-xs font-bold text-stone-900">
              {language === "hi" ? "मंडी भाव जांचें" : "Check Prices"}
            </span>
            <span className="text-[10px] text-stone-500 mt-0.5">
              {language === "hi" ? "मंडी तुलना" : "Mandi Compare"}
            </span>
          </button>

          {/* Action 3: Calculate Profit */}
          <button
            onClick={() => setCurrentTab("calculator")}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/40 shadow-xs transition-all text-center group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl mb-2 group-hover:scale-105 transition-transform">
              💰
            </div>
            <span className="text-xs font-bold text-stone-900">
              {language === "hi" ? "मुनाफा जोड़ें" : "Calculate Profit"}
            </span>
            <span className="text-[10px] text-stone-500 mt-0.5">
              {language === "hi" ? "भाड़ा काटकर" : "Net Realisation"}
            </span>
          </button>

          {/* Action 4: Find Buyers */}
          <button
            onClick={() => setCurrentTab("buyers")}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/40 shadow-xs transition-all text-center group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center text-xl mb-2 group-hover:scale-105 transition-transform">
              👨‍🌾
            </div>
            <span className="text-xs font-bold text-stone-900">
              {language === "hi" ? "खरीदार खोजें" : "Find Buyers"}
            </span>
            <span className="text-[10px] text-stone-500 mt-0.5">
              {language === "hi" ? "सत्यापित व्यापारी" : "Verified Buyers"}
            </span>
          </button>

          {/* Action 5: Check Crop Quality */}
          <button
            onClick={onOpenQualityCheck}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/40 shadow-xs transition-all text-center group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center text-xl mb-2 group-hover:scale-105 transition-transform">
              📷
            </div>
            <span className="text-xs font-bold text-stone-900">
              {language === "hi" ? "क्वालिटी जांचें" : "Crop Quality"}
            </span>
            <span className="text-[10px] text-stone-500 mt-0.5">
              {language === "hi" ? "AI फोटो जांच" : "AI Inspection"}
            </span>
          </button>

          {/* Action 6: Find Transport */}
          <button
            onClick={() => setCurrentTab("logistics")}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/40 shadow-xs transition-all text-center group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-800 flex items-center justify-center text-xl mb-2 group-hover:scale-105 transition-transform">
              🚚
            </div>
            <span className="text-xs font-bold text-stone-900">
              {language === "hi" ? "गाड़ी / भाड़ा" : "Find Transport"}
            </span>
            <span className="text-[10px] text-stone-500 mt-0.5">
              {language === "hi" ? "किसान रथ लॉजिस्टिक्स" : "Kisan Fleet"}
            </span>
          </button>

          {/* Action 7: Ask FarmIntel AI */}
          <button
            onClick={() => setCurrentTab("chatbot")}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-emerald-600 text-white border border-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all text-center group cursor-pointer col-span-2 sm:col-span-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center text-xl mb-2 group-hover:scale-105 transition-transform">
              🤖
            </div>
            <span className="text-xs font-bold">
              {language === "hi" ? "पूछें AI" : "Ask FarmIntel"}
            </span>
            <span className="text-[10px] text-emerald-100 mt-0.5">
              {language === "hi" ? "बोलकर पूछें" : "Voice & Chat"}
            </span>
          </button>
        </div>
      </section>

      {/* CORE PRODUCT PRINCIPLE SPOTLIGHT: Headline Price vs Net Realisation */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-100">
          <div>
            <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase bg-emerald-50 px-2.5 py-1 rounded-md">
              SIH Core Intelligence Engine
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 mt-1">
              {language === "hi"
                ? "दिखावटी भाव बनाम आपकी जेब में असली कमाई (Net Realisation)"
                : "Headline Price vs Actual Money in Your Pocket"}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {language === "hi"
                ? "देखें क्यों गया मंडी में ₹2,520 का भाव होने पर भी पटना मंडी (₹2,420) में बेचना ज़्यादा फायदेमंद है!"
                : "See why Gaya with ₹2,520 gross rate actually gives LESS net income than Patna at ₹2,420!"}
            </p>
          </div>
          <button
            onClick={() => setCurrentTab("calculator")}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors shrink-0 cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === "hi" ? "अपना खर्च कैलकुलेट करें" : "Custom Profit Calculator"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
          {/* Comparison Card: Gaya Mandi (The Trap!) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/50 border border-rose-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-900">Gaya Mandi (115 km)</span>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                Highest Gross Price
              </span>
            </div>
            <div className="mt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Headline Mandi Price:</span>
                <span className="font-bold text-stone-900">₹2,520 / Q</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Transport Cost (115 km):</span>
                <span>- ₹460 / Q</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Storage & Mandi Cess:</span>
                <span>- ₹80 / Q</span>
              </div>
              <div className="pt-2 border-t border-rose-200 flex justify-between font-extrabold text-sm text-stone-900">
                <span>Your Net Pocket Earning:</span>
                <span className="text-rose-700">₹1,980 / Q</span>
              </div>
              <p className="text-[11px] text-stone-500 pt-1">
                For 80 Quintals = <strong className="text-stone-800">₹1,58,400 Total</strong>
              </p>
            </div>
          </div>

          {/* Comparison Card: Patna Mandi (The Winner!) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 relative">
            <div className="absolute -top-3 right-4 bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full shadow-xs">
              BEST OPTION ✓
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950">Patna Mandi (28 km)</span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                Maximum Net Profit
              </span>
            </div>
            <div className="mt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Headline Mandi Price:</span>
                <span className="font-bold text-stone-900">₹2,420 / Q</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Transport Cost (28 km):</span>
                <span>- ₹140 / Q</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Storage & Mandi Cess:</span>
                <span>- ₹65 / Q</span>
              </div>
              <div className="pt-2 border-t border-emerald-300 flex justify-between font-extrabold text-sm text-emerald-950">
                <span>Your Net Pocket Earning:</span>
                <span className="text-emerald-700 text-base">₹2,215 / Q</span>
              </div>
              <p className="text-[11px] text-emerald-800 font-semibold pt-1">
                For 80 Quintals = <strong className="text-emerald-950">₹1,77,200 Total</strong>
              </p>
            </div>
          </div>

          {/* Earning Difference Summary Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-900 text-white flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Farmer Net Advantage
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-2">
                +₹18,800
              </p>
              <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                Extra cash in your pocket by choosing <span className="text-white font-semibold">Patna</span> instead of being misled by Gaya&apos;s higher headline price.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab("markets")}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
            >
              <span>Explore All Mandi Comparisons</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Active Listings & Matched Buyers Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Lot Summary */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                {language === "hi" ? "मेरी सक्रिय फसल लॉट" : "My Active Crop Lot"}
              </h3>
              <p className="text-xs text-stone-500">Lot #LOT-101 • Ready for sale</p>
            </div>
            <button
              onClick={() => setCurrentTab("listings")}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Manage Lots →
            </button>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {!lowDataMode && (
              <img
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&auto=format&fit=crop&q=80"
                alt="Wheat"
                className="w-20 h-20 rounded-2xl object-cover border border-stone-200 shrink-0"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-stone-900">Wheat (Sharbati Gold)</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                  Grade A Verified
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Quantity: <strong>80 Quintals</strong> • Harvested: 5 days ago • Location: Danapur Rural
              </p>
              <div className="mt-2 flex items-center space-x-3 text-xs">
                <span className="text-stone-500">
                  Target Price: <strong className="text-stone-900">₹2,450 / Q</strong>
                </span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  4 Buyers Matched
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Incoming Offer Alert */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold text-stone-900 flex items-center">
                <span>{language === "hi" ? "ताज़ा खरीदार ऑफर" : "Recent Buyer Offer"}</span>
                <span className="ml-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </h3>
              <p className="text-xs text-stone-500">Official Purchase Bid</p>
            </div>
            <button
              onClick={() => setCurrentTab("offers")}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              View Offers (1) →
            </button>
          </div>

          <div className="mt-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-900">ABC Foods Pvt. Ltd.</span>
                <span className="ml-2 text-[10px] text-emerald-700 font-semibold">✓ Verified Buyer (4.8★)</span>
              </div>
              <span className="text-xs font-extrabold text-emerald-700">₹2,440 / Q</span>
            </div>
            <p className="text-xs text-stone-600 mt-2">
              Bid for <strong>80 Quintals</strong> = <strong className="text-stone-900">₹1,95,200 Total</strong>
            </p>
            <div className="mt-3 flex space-x-2">
              <button
                onClick={() => setCurrentTab("offers")}
                className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center cursor-pointer transition-colors"
              >
                Review & Accept Offer
              </button>
              <button
                onClick={() => setCurrentTab("chatbot")}
                className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold text-xs cursor-pointer"
              >
                Ask AI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
