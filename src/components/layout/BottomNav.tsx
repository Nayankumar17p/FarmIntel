// src/components/layout/BottomNav.tsx
import React from "react";
import { Home, TrendingUp, Users, FileText, Truck, CreditCard, Store } from "lucide-react";
import { UserRole } from "../../types";

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: "hi" | "en" | "hinglish";
  activeRole: UserRole;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setCurrentTab,
  language,
  activeRole,
}) => {
  const farmerNavItems = [
    {
      id: "dashboard",
      icon: Home,
      label: language === "hi" ? "होम" : "Home",
    },
    {
      id: "buyers",
      icon: Users,
      label: language === "hi" ? "खरीदार" : "Buyers",
    },
    {
      id: "offers",
      icon: FileText,
      label: language === "hi" ? "ऑफर" : "Offers",
    },
    {
      id: "deals",
      icon: Truck,
      label: language === "hi" ? "लॉजिस्टिक्स" : "Deals",
    },
    {
      id: "transactions",
      icon: CreditCard,
      label: language === "hi" ? "रसीदें" : "Settled",
    },
  ];

  const buyerNavItems = [
    {
      id: "buyer-dashboard",
      icon: Store,
      label: "Dashboard",
    },
    {
      id: "offers",
      icon: FileText,
      label: "Proposals",
    },
    {
      id: "deals",
      icon: Truck,
      label: "Contracts",
    },
    {
      id: "transactions",
      icon: CreditCard,
      label: "Escrow",
    },
    {
      id: "markets",
      icon: TrendingUp,
      label: "Arrivals",
    },
  ];

  const items = activeRole === "buyer" ? buyerNavItems : farmerNavItems;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg px-2 py-1.5 pb-safe">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? "text-emerald-700 font-bold bg-emerald-50/80"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? "text-emerald-600 stroke-[2.4]" : "text-stone-500"
                }`}
              />
              <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-[58px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
