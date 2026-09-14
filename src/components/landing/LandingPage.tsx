// src/components/landing/LandingPage.tsx
import React from "react";
import {
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Truck,
  Sparkles,
  Award,
  Layers,
  Bot,
} from "lucide-react";
import { UserRole } from "../../types";
import { FarmLogoIcon } from "../common/FarmLogo";

interface LandingPageProps {
  onSelectRole: (role: UserRole) => void;
  language: "hi" | "en" | "hinglish";
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole, language }) => {
  const steps = [
    {
      num: "01",
      title: language === "hi" ? "फसल लॉट जोड़ें" : "Register Crop Lot",
      desc: language === "hi" ? "मात्रा, किस्म और स्थान दर्ज करें" : "Enter variety, volume (Q), and farm-gate location.",
      icon: "🌾",
    },
    {
      num: "02",
      title: language === "hi" ? "AI गुणवत्ता जांच" : "AI Quality Assessment",
      desc: language === "hi" ? "फोटो से रंग, एकरूपता व ग्रेड का अनुमान" : "Computer vision scans grain luster, size, and moisture.",
      icon: "📷",
    },
    {
      num: "03",
      title: language === "hi" ? "शुद्ध कमाई मंडी तुलना" : "Net Realisation Compare",
      desc: language === "hi" ? "भाड़ा काटकर सबसे अधिक शुद्ध मुनाफा खोजें" : "Factor transport & handling to identify true pocket profit.",
      icon: "💰",
    },
    {
      num: "04",
      title: language === "hi" ? "सत्यापित खरीदार मैचिंग" : "Match Verified Buyers",
      desc: language === "hi" ? "सीधे राइस/आटा मिलों और व्यापारियों से जुड़ें" : "Direct access to KYC-verified institutional buyers.",
      icon: "🤝",
    },
    {
      num: "05",
      title: language === "hi" ? "सुरक्षित सौदा व भुगतान" : "Lock Deal & Settle",
      desc: language === "hi" ? "डिजिटल रसीद और पारदर्शी बैंक ट्रांसफर" : "Guaranteed trade agreements and direct bank transfers.",
      icon: "✓",
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-linear-to-b from-stone-900 via-emerald-950 to-stone-900 text-white p-8 sm:p-14 overflow-hidden shadow-2xl border border-stone-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          {/* Official Farm Logo Emblem */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-white p-2.5 shadow-2xl border border-white/20 flex items-center justify-center transform hover:scale-105 transition-transform">
            <FarmLogoIcon className="w-full h-full" />
          </div>

          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-bold tracking-wide text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Smart India Hackathon (SIH) Innovation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-serif leading-tight">
            Sell Smarter. <br />
            <span className="text-emerald-400">Earn Better.</span>
          </h1>

          <p className="text-sm sm:text-lg text-stone-300 leading-relaxed max-w-2xl mx-auto font-sans">
            AI-Powered Farm-to-Market Intelligence &amp; Trading Platform helping Indian farmers optimize where and when to sell crops for maximum <strong className="text-white">net profit</strong>.
          </p>

          {/* Primary CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onSelectRole("farmer")}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer group"
            >
              <span>I am a Farmer (किसान प्रवेश)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onSelectRole("buyer")}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm sm:text-base backdrop-blur-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>I am a Buyer (व्यापारी / मिलर्स)</span>
            </button>
          </div>
        </div>

        {/* Live Mandi Ticker Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center justify-around gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-stone-400">Patna Mandi Wheat:</span>
            <span className="font-extrabold text-white">₹2,420 / Q (↗ +₹40)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-stone-400">Muzaffarpur APMC:</span>
            <span className="font-extrabold text-white">₹2,460 / Q (↗ +₹55)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-stone-400">Gaya Mandi:</span>
            <span className="font-extrabold text-white">₹2,520 / Q (High Freight Alert)</span>
          </div>
        </div>
      </div>

      {/* 5-Step Visual Flow */}
      <section className="space-y-6 max-w-6xl mx-auto">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
            Transparent Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
            How FarmIntel Works in 5 Simple Steps
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto">
            From field harvesting to net cash in your bank account without exploitative middleman commission.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((s, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-xs font-black text-stone-300 font-serif">{s.num}</span>
                </div>
                <h3 className="text-sm font-bold text-stone-900 mt-3">{s.title}</h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Principle Comparison Highlight */}
      <section className="bg-emerald-50 rounded-3xl p-6 sm:p-10 border border-emerald-200 max-w-5xl mx-auto text-center space-y-4">
        <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
          Why Farmers Earn More With FarmIntel
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-emerald-950 font-serif">
          Net Realisation = (Mandi Price × Quantity) − Transport − Storage − Mandi Fees
        </h3>
        <p className="text-xs sm:text-sm text-stone-700 max-w-2xl mx-auto">
          Other apps only tell you the highest headline price, leading farmers to drive 100+ km only to lose ₹15,000–₹25,000 on diesel and vehicle freight. FarmIntel does the math so you always pocket the maximum net cash.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onSelectRole("farmer")}
            className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm cursor-pointer"
          >
            Launch Live Platform Now →
          </button>
        </div>
      </section>
    </div>
  );
};
