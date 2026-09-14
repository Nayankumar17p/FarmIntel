// src/components/farmer/FpoView.tsx
import React, { useState } from "react";
import { Users, Truck, Sparkles, CheckCircle2, TrendingUp, ArrowRight, ShieldCheck } from "lucide-react";

interface FpoViewProps {
  language: "hi" | "en" | "hinglish";
}

export const FpoView: React.FC<FpoViewProps> = ({ language }) => {
  const [joinedPool, setJoinedPool] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-900 mb-1.5 border border-purple-200">
            <Users className="w-3.5 h-3.5 text-purple-700" />
            <span>FPO Cooperative Collective Power</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
            {language === "hi" ? "एफपीओ बल्क लॉट एकत्रीकरण" : "FPO Collective Bulk Aggregation"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {language === "hi"
              ? "छोटे किसान मिलकर बड़ा लॉट बनाएं। भाड़ा 35% कम करें और बड़ी मिलों से प्रीमियम भाव पाएं।"
              : "Pool individual 20-50Q harvest lots into 400Q+ commercial rakes to slash freight and negotiate premium institutional contracts."}
          </p>
        </div>
      </div>

      {/* Featured FPO Pool Card */}
      <div className="bg-linear-to-br from-purple-900 via-indigo-950 to-stone-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/30 text-purple-200 border border-purple-400/30">
              Active Regional Pool #FPO-PAT-88
            </span>
            <span className="text-xs text-purple-300">Patliputra Kisan Producer Co.</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Sharbati Wheat Mega-Lot (420 Quintals)
            </h2>
            <p className="text-sm text-purple-200 mt-1">
              Currently pooled by <strong>24 local farmers</strong> in Danapur-Bihta cluster.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-purple-200">
              <span>Pool Progress: 420 / 500 Quintals target</span>
              <span className="font-bold text-amber-300">84% Full</span>
            </div>
            <div className="h-3 w-full bg-purple-950 rounded-full overflow-hidden border border-purple-800">
              <div className="h-full bg-linear-to-r from-emerald-400 to-teal-300 rounded-full w-[84%]" />
            </div>
          </div>

          {/* FPO Advantages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <span className="text-purple-300 block text-[10px] uppercase font-bold">Transport Savings</span>
              <p className="text-base font-extrabold text-white mt-0.5">- ₹55 / Q Saved</p>
              <p className="text-[10px] text-purple-200">Shared 16-wheel truck fleet</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <span className="text-purple-300 block text-[10px] uppercase font-bold">Corporate Premium</span>
              <p className="text-base font-extrabold text-amber-300 mt-0.5">+ ₹65 / Q Uplift</p>
              <p className="text-[10px] text-purple-200">Direct flour mill bulk contract</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <span className="text-purple-300 block text-[10px] uppercase font-bold">Total Gain / 80Q</span>
              <p className="text-base font-extrabold text-emerald-400 mt-0.5">+ ₹9,600</p>
              <p className="text-[10px] text-purple-200">Extra net cash in hand</p>
            </div>
          </div>

          <div className="pt-3">
            {joinedPool ? (
              <div className="p-3 rounded-xl bg-emerald-600/30 border border-emerald-400 text-xs font-bold text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You have pledged 80 Quintals to this FPO pool. Transporter pickup scheduled for Friday morning.</span>
              </div>
            ) : (
              <button
                onClick={() => setJoinedPool(true)}
                className="py-3 px-6 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-stone-950 font-extrabold text-xs shadow-lg cursor-pointer transition-all flex items-center space-x-2"
              >
                <span>Join Pool with My 80Q Wheat Lot</span>
                <ArrowRight className="w-4 h-4 text-stone-950" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
