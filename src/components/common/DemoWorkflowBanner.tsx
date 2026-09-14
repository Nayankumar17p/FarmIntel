// src/components/common/DemoWorkflowBanner.tsx
import React, { useState, useEffect } from "react";
import {
  Users,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Send,
  Truck,
  CreditCard,
} from "lucide-react";
import { User, UserRole, Offer, Deal } from "../../types";

interface DemoWorkflowBannerProps {
  currentUser?: User | null;
  activeRole?: UserRole;
  currentTab?: string;
  onSwitchPersona: (personaId: string) => void;
  setCurrentTab?: (tab: string) => void;
  onNavigateTab?: (tab: string) => void;
  onResetSuccess?: () => void;
}

export const DemoWorkflowBanner: React.FC<DemoWorkflowBannerProps> = ({
  currentUser,
  activeRole,
  currentTab,
  onSwitchPersona,
  setCurrentTab,
  onNavigateTab,
  onResetSuccess,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState("");

  const navigateTo = (tab: string) => {
    if (typeof setCurrentTab === "function") {
      setCurrentTab(tab);
    } else if (typeof onNavigateTab === "function") {
      onNavigateTab(tab);
    }
  };

  const effectiveRole: UserRole = activeRole || currentUser?.role || "farmer";

  const refreshState = () => {
    fetch("/api/offers")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setOffers(d))
      .catch(() => {});

    fetch("/api/deals")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setDeals(d))
      .catch(() => {});
  };

  useEffect(() => {
    refreshState();
    const interval = setInterval(refreshState, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleReset = () => {
    setResetting(true);
    fetch("/api/demo/reset", { method: "POST" })
      .then((r) => r.json())
      .then((data) => {
        setResetting(false);
        setResetMsg("Demo Reset! Ramesh (Farmer) & ABC Foods (Buyer) restored.");
        refreshState();
        onSwitchPersona("farmer-1");
        navigateTo("dashboard");
        if (onResetSuccess) onResetSuccess();
        setTimeout(() => setResetMsg(""), 3500);
      })
      .catch((err) => {
        console.error(err);
        setResetting(false);
      });
  };

  // Determine current demo stage
  const latestDeal = deals[0];
  const latestOffer = offers[0];

  let currentStep = 1;
  let stepTitle = "Step 1: Ramesh sends Offer to ABC Foods";
  let stepDesc = "Go to 'Find Buyers' or Dashboard to send 50Q Wheat offer at ₹2,400/Q.";

  if (latestDeal) {
    if (latestDeal.status === "COMPLETED") {
      currentStep = 5;
      stepTitle = "Step 5: Settlement & Escrow Complete!";
      stepDesc = "Escrow funds settled. View digital receipt in Transactions.";
    } else if (latestDeal.status === "DELIVERED") {
      currentStep = 4;
      stepTitle = "Step 4: Cargo Delivered at ABC Foods Warehouse";
      stepDesc = "Switch to ABC Foods to confirm delivery and release escrow.";
    } else if (
      ["TRANSPORT_REQUESTED", "PICKUP_SCHEDULED", "PICKED_UP", "IN_TRANSIT"].includes(latestDeal.status)
    ) {
      currentStep = 3;
      stepTitle = `Step 3: Transport in Progress (${latestDeal.status.replace(/_/g, " ")})`;
      stepDesc = "Follow live fleet tracking or advance status in Deals & Logistics.";
    } else {
      currentStep = 3;
      stepTitle = `Step 3: Deal ${latestDeal.dealId} Confirmed!`;
      stepDesc = "Agreement locked! Next: Click 'Arrange Transport' in Deals view.";
    }
  } else if (latestOffer) {
    if (latestOffer.status === "Accepted") {
      currentStep = 3;
      stepTitle = "Step 3: Offer Accepted — Generating Deal";
      stepDesc = "Contract confirmed. Move to Deals tab.";
    } else if (latestOffer.status === "Countered") {
      currentStep = 2;
      stepTitle = `Step 2: ABC Foods Counter-Offered ₹${latestOffer.counterPricePerQ || 2380}/Q`;
      stepDesc = "Switch to Ramesh (Farmer) to review and accept counter-offer.";
    } else if (latestOffer.status === "Pending") {
      currentStep = 2;
      stepTitle = "Step 2: Offer Pending Buyer Review";
      stepDesc = "Switch to ABC Foods Pvt. Ltd. (Buyer) to Counter or Accept offer.";
    }
  }

  return (
    <div className="bg-stone-900 text-white border-b border-stone-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Left Title & Status */}
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold tracking-wide uppercase text-emerald-400">
                  Two-Sided Demo Scenario
                </span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                  {stepTitle}
                </span>
              </div>
              <p className="text-[11px] text-stone-300 line-clamp-1">{stepDesc}</p>
            </div>
          </div>

          {/* Right Controls: Quick Switcher & Reset */}
          <div className="flex items-center space-x-2 shrink-0">
            {effectiveRole === "farmer" ? (
              <button
                onClick={() => {
                  onSwitchPersona("buyer-1");
                  navigateTo("offers");
                }}
                className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
              >
                <span>Switch to ABC Foods (Buyer)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onSwitchPersona("farmer-1");
                  navigateTo("offers");
                }}
                className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
              >
                <span>Switch to Ramesh (Farmer)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => navigateTo("deals")}
              className="py-1.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 cursor-pointer hidden sm:inline-flex items-center space-x-1"
            >
              <span>View Deals</span>
            </button>

            <button
              onClick={handleReset}
              disabled={resetting}
              title="Reset Demo Scenario to initial state"
              className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 border border-stone-700 cursor-pointer transition-colors"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${resetting ? "animate-spin text-emerald-400" : ""}`} />
            </button>
          </div>
        </div>

        {resetMsg && (
          <div className="mt-2 p-2 bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 rounded-xl text-xs font-semibold text-center animate-in fade-in">
            ✓ {resetMsg}
          </div>
        )}
      </div>
    </div>
  );
};
