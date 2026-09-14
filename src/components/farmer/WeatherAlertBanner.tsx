// src/components/farmer/WeatherAlertBanner.tsx
// Weather alert banner utilizing the mock agro-weather engine to notify farmers about rain or optimal harvesting conditions

import React, { useState, useEffect } from "react";
import {
  CloudRain,
  Sun,
  CloudSun,
  AlertTriangle,
  CheckCircle2,
  Wind,
  Droplets,
  Calendar,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  RefreshCw,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { WeatherData } from "../../types";

interface WeatherAlertBannerProps {
  district?: string;
  language: "hi" | "en" | "hinglish";
  onViewSellingWindow?: () => void;
  className?: string;
}

const DISTRICT_PRESETS = [
  { id: "Patna", label: "Patna (पटना)", type: "optimal" },
  { id: "Darbhanga", label: "Darbhanga (दरभंगा - Rain Alert)", type: "rain" },
  { id: "Rohtas", label: "Rohtas (रोहतास)", type: "optimal" },
  { id: "Purnia", label: "Purnia (पूर्णिया - Showers)", type: "rain" },
  { id: "Muzaffarpur", label: "Muzaffarpur (मुजफ्फरपुर)", type: "cloudy" },
  { id: "Gaya", label: "Gaya (गया)", type: "optimal" },
];

export const WeatherAlertBanner: React.FC<WeatherAlertBannerProps> = ({
  district = "Patna",
  language,
  onViewSellingWindow,
  className = "",
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>(district);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const fetchWeather = (dist: string) => {
    setLoading(true);
    fetch(`/api/weather?district=${encodeURIComponent(dist)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Weather fetch failed");
        return res.json();
      })
      .then((data: WeatherData) => {
        setWeather(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch weather alert:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWeather(selectedDistrict);
  }, [selectedDistrict]);

  // Keep synced if parent district prop updates
  useEffect(() => {
    if (district && district !== selectedDistrict) {
      setSelectedDistrict(district);
    }
  }, [district]);

  if (!weather && loading) {
    return (
      <div className={`p-4 rounded-3xl bg-stone-100 animate-pulse border border-stone-200 text-stone-500 text-xs flex items-center space-x-2 ${className}`}>
        <RefreshCw className="w-4 h-4 animate-spin text-stone-400" />
        <span>
          {language === "hi"
            ? "क्षेत्रीय मौसम व कटाई परिस्थितियों का विश्लेषण हो रहा है..."
            : "Analyzing regional weather and harvesting conditions..."}
        </span>
      </div>
    );
  }

  if (!weather) return null;

  const rainChance = weather.current.rainChancePercent ?? 10;
  const isRainWarning =
    rainChance >= 40 ||
    weather.current.condition.toLowerCase().includes("rain") ||
    weather.current.condition.toLowerCase().includes("shower") ||
    weather.current.condition.toLowerCase().includes("thunderstorm");

  const isOptimalHarvest =
    !isRainWarning &&
    weather.current.humidity <= 60 &&
    rainChance <= 20 &&
    weather.current.tempC >= 25;

  return (
    <div
      id="farmer-weather-alert-banner"
      className={`rounded-3xl transition-all duration-200 overflow-hidden shadow-xs border ${
        isRainWarning
          ? "bg-linear-to-r from-amber-50 via-orange-50/80 to-amber-100/70 border-amber-300 text-amber-950"
          : isOptimalHarvest
          ? "bg-linear-to-r from-emerald-50 via-teal-50/80 to-emerald-100/70 border-emerald-300 text-emerald-950"
          : "bg-linear-to-r from-sky-50 via-slate-50 to-blue-50/70 border-sky-200 text-slate-900"
      } ${className}`}
    >
      {/* Banner Header Bar */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Left Title & Status Badge */}
          <div className="flex items-start space-x-3">
            <div
              className={`w-11 h-11 rounded-2xl p-2 shrink-0 flex items-center justify-center shadow-xs ${
                isRainWarning
                  ? "bg-amber-500 text-white ring-4 ring-amber-200/70"
                  : isOptimalHarvest
                  ? "bg-emerald-600 text-white ring-4 ring-emerald-200/70"
                  : "bg-sky-600 text-white ring-4 ring-sky-200/70"
              }`}
            >
              {isRainWarning ? (
                <CloudRain className="w-6 h-6 animate-bounce" />
              ) : isOptimalHarvest ? (
                <Sun className="w-6 h-6" />
              ) : (
                <CloudSun className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                    isRainWarning
                      ? "bg-amber-600 text-white"
                      : isOptimalHarvest
                      ? "bg-emerald-700 text-white"
                      : "bg-sky-700 text-white"
                  }`}
                >
                  {isRainWarning ? (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>
                        {language === "hi"
                          ? "बारिश की चेतावनी (Rain Alert)"
                          : "Upcoming Rain Alert"}
                      </span>
                    </>
                  ) : isOptimalHarvest ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {language === "hi"
                          ? "कटाई हेतु उत्तम मौसम (Optimal Harvest)"
                          : "Optimal Harvesting Window"}
                      </span>
                    </>
                  ) : (
                    <>
                      <CloudSun className="w-3.5 h-3.5" />
                      <span>
                        {language === "hi"
                          ? "स्थानीय मौसम अपडेट (Weather Update)"
                          : "Regional Weather Advisory"}
                      </span>
                    </>
                  )}
                </span>

                {/* District Indicator */}
                <div className="flex items-center text-xs font-semibold text-stone-600 space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{weather.location}</span>
                </div>
              </div>

              {/* Dynamic Headline Text */}
              <h3 className="text-base sm:text-lg font-bold font-serif leading-snug">
                {isRainWarning ? (
                  language === "hi" ? (
                    <span>
                      सावधान: <strong>{selectedDistrict}</strong> में अगले 24–48 घंटों में बारिश की {rainChance}% आशंका
                    </span>
                  ) : (
                    <span>
                      Precipitation Alert: <strong>{rainChance}% chance of upcoming rain</strong> in {selectedDistrict}
                    </span>
                  )
                ) : isOptimalHarvest ? (
                  language === "hi" ? (
                    <span>
                      फसल कटाई व मंडी ढुलाई के लिए अनुकूल समय — <strong>{selectedDistrict}</strong> में मौसम पूरी तरह साफ
                    </span>
                  ) : (
                    <span>
                      Ideal harvesting &amp; open-road mandi transit conditions across <strong>{selectedDistrict}</strong>
                    </span>
                  )
                ) : (
                  <span>
                    Current Agricultural Weather Conditions for <strong>{selectedDistrict}</strong>
                  </span>
                )}
              </h3>
            </div>
          </div>

          {/* Right Action & Quick District Switcher */}
          <div className="flex items-center flex-wrap gap-2 self-start lg:self-center">
            {/* District Quick Switcher Dropdown */}
            <div className="flex items-center space-x-1.5 bg-white/90 px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 shadow-2xs">
              <span className="text-[11px] text-stone-400">District:</span>
              <select
                id="weather-district-select"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-transparent font-bold text-stone-900 focus:outline-hidden cursor-pointer"
                title="Switch district to test rain alert or optimal harvesting window"
              >
                {DISTRICT_PRESETS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Jump to Selling Window Tab */}
            {onViewSellingWindow && (
              <button
                id="view-selling-window-btn"
                onClick={onViewSellingWindow}
                className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                  isRainWarning
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-emerald-700 hover:bg-emerald-800 text-white"
                }`}
                title="View multi-day market selling window"
              >
                <span>{language === "hi" ? "बिक्री समय देखें" : "Selling Window"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Collapse/Expand Toggle */}
            <button
              id="toggle-weather-banner-collapse"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-xl bg-white/80 hover:bg-white text-stone-600 border border-stone-200 transition-colors"
              title={isCollapsed ? "Expand weather details" : "Collapse weather details"}
              aria-label="Toggle weather banner details"
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Expanded Details */}
        {!isCollapsed && (
          <div className="mt-4 pt-3.5 border-t border-black/10 space-y-3.5">
            {/* Direct Actionable Farmer Advisory */}
            <div className="flex items-start space-x-2.5 text-xs sm:text-sm leading-relaxed">
              <div className="mt-0.5 shrink-0">
                {isRainWarning ? (
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                )}
              </div>
              <div>
                <span className="font-bold">
                  {language === "hi" ? "कृषि व कटाई परामर्श (Harvest Advisory): " : "Farmer Action Advisory: "}
                </span>
                <span className="opacity-90">
                  {weather.current.impactOnCrop ||
                    (isRainWarning
                      ? "खेत कटाई रोकें या कटी फसल को तुरंत वाटरप्रूफ तिरपाल से ढकें। गीली फसल पर मंडी में ₹150-₹250/क्विंटल कटौती का जोखिम।"
                      : "धूपदार सूखा मौसम। गेहूं, मक्का की कटाई, सुखाने और खुली ट्रॉली से मंडी ढुलाई के लिए पूरी तरह सुरक्षित।")}
                </span>
              </div>
            </div>

            {/* Live Metrics Row & 5-Day Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-1">
              {/* Metric 1: Temp */}
              <div className="bg-white/85 p-2.5 rounded-2xl border border-black/5 flex flex-col justify-center">
                <span className="text-[10px] uppercase font-bold text-stone-500">
                  {language === "hi" ? "तापमान" : "Temperature"}
                </span>
                <span className="text-lg font-extrabold text-stone-900">
                  {weather.current.tempC}°C
                </span>
                <span className="text-[10px] text-stone-500 truncate">{weather.current.condition}</span>
              </div>

              {/* Metric 2: Rain Chance */}
              <div
                className={`p-2.5 rounded-2xl border flex flex-col justify-center ${
                  isRainWarning
                    ? "bg-amber-100/90 border-amber-300 text-amber-950"
                    : "bg-white/85 border-black/5 text-stone-900"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-stone-500">
                  <span>{language === "hi" ? "बारिश का खतरा" : "Rain Risk"}</span>
                  <CloudRain className={`w-3.5 h-3.5 ${isRainWarning ? "text-amber-700" : "text-stone-400"}`} />
                </div>
                <span className={`text-lg font-extrabold ${isRainWarning ? "text-amber-800" : "text-stone-900"}`}>
                  {rainChance}%
                </span>
                <span className="text-[10px] text-stone-500">
                  {rainChance > 40 ? "High Threat" : rainChance > 15 ? "Moderate" : "Dry / Safe"}
                </span>
              </div>

              {/* Metric 3: Humidity */}
              <div className="bg-white/85 p-2.5 rounded-2xl border border-black/5 flex flex-col justify-center">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-stone-500">
                  <span>{language === "hi" ? "आर्द्रता (नमी)" : "Humidity"}</span>
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <span className="text-lg font-extrabold text-stone-900">
                  {weather.current.humidity}%
                </span>
                <span className="text-[10px] text-stone-500">
                  {weather.current.humidity > 70 ? "Moist Air" : "Good for Drying"}
                </span>
              </div>

              {/* Metric 4: Wind Speed */}
              <div className="bg-white/85 p-2.5 rounded-2xl border border-black/5 flex flex-col justify-center">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-stone-500">
                  <span>{language === "hi" ? "हवा की गति" : "Wind Speed"}</span>
                  <Wind className="w-3.5 h-3.5 text-teal-600" />
                </div>
                <span className="text-lg font-extrabold text-stone-900">
                  {weather.current.windKph} km/h
                </span>
                <span className="text-[10px] text-stone-500">
                  {weather.current.windKph > 20 ? "Breezy / Wind Risk" : "Calm Air"}
                </span>
              </div>

              {/* 5-Day Forecast Micro Strip (Spans 3 cols on large screens) */}
              <div className="col-span-2 sm:col-span-4 lg:col-span-3 bg-white/90 p-2.5 rounded-2xl border border-black/5">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-stone-500 mb-1.5">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    <span>5-Day District Agro Forecast</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold lowercase">
                    {weather.source === "live-api" ? "live feed" : "agro-model"}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1 text-center">
                  {weather.forecast5Days.slice(0, 5).map((f, i) => {
                    const probNum = parseInt(f.rainProb, 10) || 0;
                    const dayRainAlert = probNum >= 40;

                    return (
                      <div
                        key={i}
                        className={`p-1.5 rounded-xl border text-[10px] transition-colors ${
                          dayRainAlert
                            ? "bg-amber-100/70 border-amber-300 font-bold text-amber-900"
                            : "bg-stone-50/80 border-stone-200/80 text-stone-700"
                        }`}
                      >
                        <p className="font-bold truncate">{f.day}</p>
                        <p className="font-extrabold text-stone-900">{f.tempC}°</p>
                        <span
                          className={`inline-block px-1 py-0.2 rounded text-[9px] font-bold ${
                            dayRainAlert
                              ? "bg-amber-500 text-white"
                              : "text-stone-500"
                          }`}
                          title={`Rain probability: ${f.rainProb}`}
                        >
                          💧{f.rainProb}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherAlertBanner;
