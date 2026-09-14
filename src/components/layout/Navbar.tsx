// src/components/layout/Navbar.tsx
import React, { useState, useEffect } from "react";
import {
  UserCheck,
  Languages,
  Wifi,
  WifiOff,
  Bell,
  ChevronDown,
  LogOut,
  ShieldCheck,
  Store,
  Sparkles,
  Smartphone,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { User, UserRole } from "../../types";
import { FarmLogoIcon } from "../common/FarmLogo";

interface NavbarProps {
  currentUser: User | null;
  activeRole: UserRole;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lowDataMode: boolean;
  setLowDataMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  language: "hi" | "en" | "hinglish";
  setLanguage: (lang: "hi" | "en" | "hinglish") => void;
  onOpenAuth: () => void;
  onSwitchPersona: (personaId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeRole,
  currentTab,
  setCurrentTab,
  lowDataMode,
  setLowDataMode,
  language,
  setLanguage,
  onOpenAuth,
  onSwitchPersona,
}) => {
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const userId = currentUser?.id || (activeRole === "farmer" ? "farmer-1" : "buyer-1");

  const fetchNotifications = () => {
    fetch(`/api/notifications?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setNotifications(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (n: any) => {
    fetch(`/api/notifications/${n.id}/read`, { method: "PATCH" }).catch(() => {});
    setShowNotifications(false);
    fetchNotifications();

    if (n.relatedDealId || n.type?.includes("DEAL") || n.type?.includes("TRANSPORT") || n.type?.includes("LOGISTICS") || n.type?.includes("DELIVERY")) {
      setCurrentTab("deals");
    } else if (n.relatedOfferId || n.type?.includes("OFFER")) {
      setCurrentTab("offers");
    } else if (n.relatedTransactionId || n.type?.includes("PAYMENT")) {
      setCurrentTab("transactions");
    } else {
      setCurrentTab("offers");
    }
  };

  const personas = [
    {
      id: "farmer-1",
      name: "Ramesh Kumar",
      role: "farmer",
      tag: "Farmer (Patna, Wheat 80Q)",
      avatar: "👨‍🌾",
    },
    {
      id: "farmer-2",
      name: "Sunita Devi",
      role: "farmer",
      tag: "Farmer (Muzaffarpur, Tomato 35Q)",
      avatar: "👩‍🌾",
    },
    {
      id: "buyer-1",
      name: "ABC Foods Pvt. Ltd.",
      role: "buyer",
      tag: "Verified Buyer (Flour & Grains)",
      avatar: "🏭",
    },
    {
      id: "admin-1",
      name: "State Agriculture Officer",
      role: "admin",
      tag: "Mandi Admin & Moderator",
      avatar: "🏛️",
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab("dashboard")}>
            <div className="w-10 h-10 rounded-xl bg-white p-1 border border-stone-200/90 shadow-xs flex items-center justify-center hover:border-emerald-500 transition-colors">
              <FarmLogoIcon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-serif">
                  Farm<span className="text-emerald-700">Intel</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <Sparkles className="w-3 h-3 mr-1 text-emerald-600" /> AI Mandi
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-stone-500 -mt-0.5">
                {language === "hi" ? "सही मंडी • सही समय • ज़्यादा शुद्ध कमाई" : "Sell Smarter • Earn Better Net Profit"}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {activeRole === "farmer" && (
              <>
                <button
                  onClick={() => setCurrentTab("dashboard")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === "dashboard"
                      ? "bg-emerald-50 text-emerald-800 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  {language === "hi" ? "डैशबोर्ड" : "Dashboard"}
                </button>
                <button
                  onClick={() => setCurrentTab("buyers")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === "buyers"
                      ? "bg-emerald-50 text-emerald-800 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  {language === "hi" ? "सत्यापित खरीदार" : "Find Buyers"}
                </button>
                <button
                  onClick={() => setCurrentTab("offers")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors relative ${
                    currentTab === "offers"
                      ? "bg-emerald-50 text-emerald-800 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  <span>{language === "hi" ? "ऑफर व सौदे" : "Offers & Bids"}</span>
                  {unreadCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setCurrentTab("deals")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === "deals"
                      ? "bg-emerald-50 text-emerald-800 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  {language === "hi" ? "अनुबंध व लॉजिस्टिक्स" : "Deals & Logistics"}
                </button>
                <button
                  onClick={() => setCurrentTab("transactions")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === "transactions"
                      ? "bg-emerald-50 text-emerald-800 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  {language === "hi" ? "रसीदें" : "Settlements"}
                </button>
                <button
                  onClick={() => setCurrentTab("markets")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === "markets"
                      ? "bg-emerald-50 text-emerald-800 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  {language === "hi" ? "मंडी भाव" : "Mandi Prices"}
                </button>
                <button
                  onClick={() => setCurrentTab("quality")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === "quality"
                      ? "bg-emerald-50 text-emerald-800 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  {language === "hi" ? "📷 AI क्वालिटी" : "📷 AI Quality"}
                </button>
              </>
            )}

            {activeRole === "buyer" && (
              <>
                <button
                  onClick={() => setCurrentTab("buyer-dashboard")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === "buyer-dashboard"
                      ? "bg-emerald-50 text-emerald-800 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  Buyer Dashboard
                </button>
                <button
                  onClick={() => setCurrentTab("offers")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors relative ${
                    currentTab === "offers"
                      ? "bg-emerald-50 text-emerald-800 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  <span>Farmer Proposals</span>
                  {unreadCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setCurrentTab("deals")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === "deals"
                      ? "bg-emerald-50 text-emerald-800 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  Active Deals &amp; Escrow
                </button>
                <button
                  onClick={() => setCurrentTab("transactions")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === "transactions"
                      ? "bg-emerald-50 text-emerald-800 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  Settlement Ledger
                </button>
                <button
                  onClick={() => setCurrentTab("markets")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === "markets"
                      ? "bg-emerald-50 text-emerald-800 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  Mandi Arrivals
                </button>
              </>
            )}

            {activeRole === "admin" && (
              <>
                <button
                  onClick={() => setCurrentTab("admin-dashboard")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === "admin-dashboard"
                      ? "bg-emerald-50 text-emerald-800 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  Admin Portal
                </button>
                <button
                  onClick={() => setCurrentTab("deals")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === "deals"
                      ? "bg-emerald-50 text-emerald-800 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  Deals Monitor
                </button>
                <button
                  onClick={() => setCurrentTab("transactions")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === "transactions"
                      ? "bg-emerald-50 text-emerald-800 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  Escrow Audits
                </button>
                <button
                  onClick={() => setCurrentTab("msp")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === "msp"
                      ? "bg-emerald-50 text-emerald-800 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  ⚖️ MSP Compliance
                </button>
              </>
            )}
          </nav>

          {/* Right Controls: Low Data Mode, Language, Persona Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Auth Portal Link Button */}
            <button
              onClick={() => setCurrentTab("auth")}
              className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentTab === "auth"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{language === "hi" ? "लॉगिन / साइनअप" : "Login / Register"}</span>
            </button>
            {/* Low Data Mode Toggle */}
            <button
              onClick={() => setLowDataMode((prev) => !prev)}
              title={lowDataMode ? "Low Data Mode ON (Images & heavy payloads reduced)" : "Low Data Mode OFF"}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                lowDataMode
                  ? "bg-amber-100 text-amber-900 border-amber-300 shadow-xs"
                  : "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200"
              }`}
            >
              {lowDataMode ? <WifiOff className="w-3.5 h-3.5 text-amber-700" /> : <Wifi className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{lowDataMode ? "Low Data: ON" : "Data Saver"}</span>
            </button>

            {/* Language Selector */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="appearance-none bg-stone-100 text-stone-700 text-xs font-semibold pl-7 pr-6 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="hinglish">Hinglish</option>
                <option value="en">English</option>
              </select>
              <Languages className="w-3.5 h-3.5 text-stone-500 absolute left-2 top-2.5 pointer-events-none" />
              <ChevronDown className="w-3 h-3 text-stone-400 absolute right-2 top-3 pointer-events-none" />
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-200 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <span className="text-xs font-bold text-stone-900">Trade &amp; Logistics Alerts</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {unreadCount} Unread
                    </span>
                  </div>
                  <div className="space-y-1.5 mt-2 max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-stone-400 text-center py-4">No notifications yet</p>
                    ) : (
                      notifications.slice(0, 6).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                            !n.read
                              ? "bg-emerald-50/90 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-stone-50 border border-stone-100 hover:bg-stone-100 text-stone-600"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <p className="font-bold text-stone-900 text-xs">{n.title}</p>
                            {!n.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1"></span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">{n.message}</p>
                          <p className="text-[9px] text-stone-400 mt-1">{n.timestamp}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="flex items-center space-x-2 pl-2 pr-3 py-1 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 transition-colors shadow-xs"
              >
                <span className="text-base">{activeRole === "farmer" ? "👨‍🌾" : activeRole === "buyer" ? "🏭" : "🏛️"}</span>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-stone-900 flex items-center">
                    {currentUser?.name || "Ramesh Kumar"}
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 ml-1" />
                  </div>
                  <div className="text-[10px] text-stone-500 capitalize">{activeRole} Mode</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {showPersonaMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50">
                  <div className="px-3 py-2 border-b border-stone-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                      Quick Demo Persona Switch
                    </p>
                    <p className="text-xs text-stone-500">Test different user perspectives instantly</p>
                  </div>

                  <div className="space-y-1 my-1">
                    {personas.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSwitchPersona(p.id);
                          setShowPersonaMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center space-x-2.5 transition-colors ${
                          currentUser?.id === p.id
                            ? "bg-emerald-50 text-emerald-950 font-semibold border border-emerald-200"
                            : "hover:bg-stone-50 text-stone-700"
                        }`}
                      >
                        <span className="text-xl">{p.avatar}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate">{p.name}</p>
                          <p className="text-[10px] text-stone-500 truncate">{p.tag}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between px-2">
                    <button
                      onClick={() => {
                        setCurrentTab("auth");
                        setShowPersonaMenu(false);
                      }}
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold py-1 flex items-center space-x-1 cursor-pointer"
                    >
                      <Lock className="w-3 h-3 text-emerald-600" />
                      <span>Full Auth Portal</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentTab("landing");
                        setShowPersonaMenu(false);
                      }}
                      className="text-xs text-stone-500 hover:text-stone-800 py-1 cursor-pointer"
                    >
                      View Home
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
