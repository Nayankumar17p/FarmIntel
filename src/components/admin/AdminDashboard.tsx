// src/components/admin/AdminDashboard.tsx
import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Store,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { MarketPrice } from "../../types";
import { FarmLogoIcon } from "../common/FarmLogo";

interface AdminDashboardProps {
  language: "hi" | "en" | "hinglish";
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ language }) => {
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

  const fetchPrices = () => {
    fetch("/api/markets")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setMarketPrices(data);
      })
      .catch((e) => console.error("Failed to fetch market prices:", e));
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handleUpdatePrice = (mandiId: string) => {
    fetch(`/api/markets/${mandiId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ modalPrice: editPrice }),
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(() => {
        setUpdatingId(null);
        fetchPrices();
      })
      .catch((e) => console.error("Failed to update market price:", e));
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="bg-stone-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white p-1 shadow-md flex items-center justify-center shrink-0 border border-white/20 mt-0.5">
            <FarmLogoIcon className="w-full h-full" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 mb-2 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>State Agriculture Directorate &amp; APMC Moderator</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-bold font-serif">
              Mandi Price Moderation &amp; Quality Desk
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 mt-1">
              Real-time control tower for state mandi price updates, buyer trust verifications, and trade monitoring.
            </p>
          </div>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-stone-500 uppercase">Registered Farmers</span>
          <p className="text-2xl font-extrabold text-stone-900 mt-1">12,480</p>
          <span className="text-[11px] text-emerald-700 font-semibold">+340 this week</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-stone-500 uppercase">Volume Traded</span>
          <p className="text-2xl font-extrabold text-stone-900 mt-1">48,200 Q</p>
          <span className="text-[11px] text-emerald-700 font-semibold">₹11.8 Cr Gross Value</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-stone-500 uppercase">Verified Buyers</span>
          <p className="text-2xl font-extrabold text-stone-900 mt-1">142</p>
          <span className="text-[11px] text-stone-500 font-semibold">100% KYC verified</span>
        </div>

        <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-300 shadow-xs">
          <span className="text-xs font-bold text-emerald-900 uppercase">Avg Farmer Net Uplift</span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">+14.2%</p>
          <span className="text-[11px] text-emerald-800 font-semibold">Over local middleman prices</span>
        </div>
      </div>

      {/* Mandi Price Updates Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900">Live Mandi Price Registry</h2>
            <p className="text-xs text-stone-500">
              Update modal rates in real-time as physical auction bids finalize.
            </p>
          </div>
          <button
            onClick={fetchPrices}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center space-x-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Mandi &amp; District</th>
                <th className="py-3 px-4">Crop</th>
                <th className="py-3 px-4 text-right">Modal Rate</th>
                <th className="py-3 px-4 text-center">Trend</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {marketPrices.map((m) => (
                <tr key={m.id} className="hover:bg-stone-50">
                  <td className="py-3 px-4">
                    <p className="font-bold text-stone-900">{m.mandiName}</p>
                    <p className="text-[11px] text-stone-500">{m.district}, {m.state}</p>
                  </td>
                  <td className="py-3 px-4 font-semibold text-stone-700">{m.cropName}</td>
                  <td className="py-3 px-4 text-right">
                    {updatingId === m.id ? (
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="w-24 px-2 py-1 border border-stone-300 rounded font-bold text-right"
                      />
                    ) : (
                      <span className="font-extrabold text-stone-900">₹{m.modalPrice} / Q</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {m.priceTrend} ({m.trendPercentage > 0 ? `+${m.trendPercentage}%` : `${m.trendPercentage}%`})
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {updatingId === m.id ? (
                      <div className="flex justify-end space-x-1">
                        <button
                          onClick={() => handleUpdatePrice(m.id)}
                          className="px-2 py-1 bg-emerald-600 text-white rounded text-xs font-bold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setUpdatingId(null)}
                          className="px-2 py-1 bg-stone-200 text-stone-700 rounded text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setUpdatingId(m.id);
                          setEditPrice(m.modalPrice);
                        }}
                        className="text-xs font-bold text-emerald-700 hover:underline"
                      >
                        Edit Price
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
