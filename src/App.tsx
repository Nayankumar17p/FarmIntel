// src/App.tsx
import React, { useState, useEffect } from "react";
import { Navbar } from "./components/layout/Navbar";
import { BottomNav } from "./components/layout/BottomNav";
import { FarmerDashboard } from "./components/farmer/FarmerDashboard";
import { MarketIntelligence } from "./components/farmer/MarketIntelligence";
import { ProfitCalculator } from "./components/farmer/ProfitCalculator";
import { SellingWindow } from "./components/farmer/SellingWindow";
import { BuyerMatching } from "./components/farmer/BuyerMatching";
import { CropListings } from "./components/farmer/CropListings";
import { AiQualityCheck } from "./components/farmer/AiQualityCheck";
import { AiChatbot } from "./components/farmer/AiChatbot";
import { OffersNegotiation } from "./components/farmer/OffersNegotiation";
import { LogisticsView } from "./components/farmer/LogisticsView";
import { TransactionsView } from "./components/farmer/TransactionsView";
import { FpoView } from "./components/farmer/FpoView";
import { MspBenchmarkView } from "./components/farmer/MspBenchmarkView";
import { BuyerDashboard } from "./components/buyer/BuyerDashboard";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { LandingPage } from "./components/landing/LandingPage";
import { AuthModal } from "./components/auth/AuthModal";
import { AuthPage } from "./components/auth/AuthPage";
import { ChatModal } from "./components/farmer/ChatModal";
import { DealsWorkflowView } from "./components/deals/DealsWorkflowView";
import { DemoWorkflowBanner } from "./components/common/DemoWorkflowBanner";
import { User, UserRole, Buyer } from "./types";
import { Bot, Sparkles } from "lucide-react";
import { FarmLogo } from "./components/common/FarmLogo";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>({
    id: "farmer-1",
    name: "Ramesh Kumar",
    email: "ramesh@kisan.in",
    phone: "9876543210",
    role: "farmer",
    language: "hi",
    location: {
      village: "Danapur Rural",
      district: "Patna",
      state: "Bihar",
    },
    verified: true,
  });

  const [activeRole, setActiveRole] = useState<UserRole>("farmer");
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [lowDataMode, setLowDataMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<"hi" | "en" | "hinglish">("hi");
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [activeChat, setActiveChat] = useState<{ id: string; name: string } | null>(null);

  // Restore stored session if authenticated previously
  useEffect(() => {
    try {
      const stored = localStorage.getItem("farmintel_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) {
          setCurrentUser(parsed);
          if (parsed.role) setActiveRole(parsed.role);
        }
      }
    } catch (e) {
      console.error("Failed to parse saved user", e);
    }
  }, []);

  const handleSwitchPersona = (personaId: string) => {
    if (personaId === "farmer-1") {
      setCurrentUser({
        id: "farmer-1",
        name: "Ramesh Kumar",
        email: "ramesh@kisan.in",
        phone: "9876543210",
        role: "farmer",
        language: "hi",
        location: { village: "Danapur Rural", district: "Patna", state: "Bihar" },
        verified: true,
      });
      setActiveRole("farmer");
      setCurrentTab("dashboard");
    } else if (personaId === "farmer-2") {
      setCurrentUser({
        id: "farmer-2",
        name: "Sunita Devi",
        email: "sunita@kisan.in",
        phone: "9876543211",
        role: "farmer",
        language: "hi",
        location: { village: "Kanti", district: "Muzaffarpur", state: "Bihar" },
        verified: true,
      });
      setActiveRole("farmer");
      setCurrentTab("dashboard");
    } else if (personaId === "buyer-1") {
      setCurrentUser({
        id: "buyer-1",
        name: "ABC Foods Pvt. Ltd.",
        email: "procurement@abcfoods.com",
        phone: "9123456780",
        role: "buyer",
        language: "en",
        location: { district: "Patna", state: "Bihar" },
        verified: true,
      });
      setActiveRole("buyer");
      setCurrentTab("buyer-dashboard");
    } else if (personaId === "admin-1") {
      setCurrentUser({
        id: "admin-1",
        name: "State Agriculture Officer",
        email: "admin@agri.bihar.gov.in",
        phone: "9000000000",
        role: "admin",
        language: "en",
        location: { district: "Patna", state: "Bihar" },
        verified: true,
      });
      setActiveRole("admin");
      setCurrentTab("admin-dashboard");
    }
  };

  const handleRoleSelectFromLanding = (role: UserRole) => {
    if (role === "farmer") {
      handleSwitchPersona("farmer-1");
    } else if (role === "buyer") {
      handleSwitchPersona("buyer-1");
    } else {
      handleSwitchPersona("admin-1");
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white pb-16 lg:pb-0">
      {/* Universal Top Navigation */}
      <Navbar
        currentUser={currentUser}
        activeRole={activeRole}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lowDataMode={lowDataMode}
        setLowDataMode={setLowDataMode}
        language={language}
        setLanguage={setLanguage}
        onOpenAuth={() => setShowAuthModal(true)}
        onSwitchPersona={handleSwitchPersona}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6">
        {/* Interactive 2-Sided Demo Workflow Assistant Banner */}
        <DemoWorkflowBanner
          currentUser={currentUser}
          activeRole={activeRole}
          currentTab={currentTab}
          onSwitchPersona={handleSwitchPersona}
          setCurrentTab={setCurrentTab}
          onNavigateTab={(tab) => setCurrentTab(tab)}
          onResetSuccess={() => {
            setCurrentTab(activeRole === "buyer" ? "offers" : "buyers");
          }}
        />

        {/* Landing Page */}
        {currentTab === "landing" && (
          <LandingPage onSelectRole={handleRoleSelectFromLanding} language={language} />
        )}

        {/* Dedicated Full Authentication & Registration Portal */}
        {currentTab === "auth" && (
          <AuthPage
            language={language}
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              setActiveRole(user.role);
              setCurrentTab(user.role === "buyer" ? "buyer-dashboard" : "dashboard");
            }}
          />
        )}

        {/* MSP Statutory Benchmarks & Comparison Engine */}
        {currentTab === "msp" && (
          <MspBenchmarkView language={language} />
        )}

        {/* Farmer Tabs */}
        {activeRole === "farmer" && (
          <>
            {currentTab === "dashboard" && (
              <FarmerDashboard
                currentUser={currentUser}
                setCurrentTab={setCurrentTab}
                language={language}
                lowDataMode={lowDataMode}
                onOpenQualityCheck={() => setCurrentTab("quality")}
              />
            )}

            {currentTab === "markets" && (
              <MarketIntelligence
                language={language}
                lowDataMode={lowDataMode}
                onSelectMarket={() => setCurrentTab("calculator")}
              />
            )}

            {currentTab === "calculator" && <ProfitCalculator language={language} />}

            {currentTab === "selling-window" && (
              <SellingWindow language={language} lowDataMode={lowDataMode} />
            )}

            {currentTab === "buyers" && (
              <BuyerMatching
                language={language}
                onOpenChat={(id, name) => setActiveChat({ id, name })}
                onSendOffer={() => setCurrentTab("offers")}
                onNavigateToOffers={() => setCurrentTab("offers")}
                onSwitchPersona={handleSwitchPersona}
              />
            )}

            {currentTab === "listings" && (
              <CropListings
                language={language}
                lowDataMode={lowDataMode}
                onOpenQualityCheck={() => setCurrentTab("quality")}
              />
            )}

            {currentTab === "quality" && (
              <AiQualityCheck
                language={language}
                lowDataMode={lowDataMode}
                onApplyGrade={() => setCurrentTab("listings")}
              />
            )}

            {currentTab === "chatbot" && (
              <AiChatbot currentUser={currentUser} language={language} />
            )}

            {currentTab === "offers" && (
              <OffersNegotiation
                currentUser={currentUser}
                language={language}
                onOpenChat={(id, name) => setActiveChat({ id, name })}
                onViewTransactions={() => setCurrentTab("transactions")}
                onNavigateToDeals={() => setCurrentTab("deals")}
                onSwitchPersona={handleSwitchPersona}
              />
            )}

            {currentTab === "deals" && (
              <DealsWorkflowView
                currentUser={currentUser}
                language={language}
                onNavigateToTransactions={() => setCurrentTab("transactions")}
                onSwitchPersona={handleSwitchPersona}
              />
            )}

            {currentTab === "logistics" && (
              <LogisticsView currentUser={currentUser} language={language} />
            )}

            {currentTab === "transactions" && (
              <TransactionsView currentUser={currentUser} language={language} />
            )}

            {currentTab === "fpo" && <FpoView language={language} />}
          </>
        )}

        {/* Buyer Views */}
        {activeRole === "buyer" && (
          <>
            {currentTab === "buyer-dashboard" && (
              <BuyerDashboard
                currentUser={currentUser}
                language={language}
                lowDataMode={lowDataMode}
                onOpenChat={(id, name) => setActiveChat({ id, name })}
                onNavigateToOffers={() => setCurrentTab("offers")}
                onNavigateToDeals={() => setCurrentTab("deals")}
              />
            )}

            {currentTab === "markets" && (
              <MarketIntelligence
                language={language}
                lowDataMode={lowDataMode}
                onSelectMarket={() => setCurrentTab("calculator")}
              />
            )}

            {currentTab === "offers" && (
              <OffersNegotiation
                currentUser={currentUser}
                language={language}
                onOpenChat={(id, name) => setActiveChat({ id, name })}
                onViewTransactions={() => setCurrentTab("transactions")}
                onNavigateToDeals={() => setCurrentTab("deals")}
                onSwitchPersona={handleSwitchPersona}
              />
            )}

            {currentTab === "deals" && (
              <DealsWorkflowView
                currentUser={currentUser}
                language={language}
                onNavigateToTransactions={() => setCurrentTab("transactions")}
                onSwitchPersona={handleSwitchPersona}
              />
            )}

            {currentTab === "transactions" && (
              <TransactionsView currentUser={currentUser} language={language} />
            )}
          </>
        )}

        {/* Admin Views */}
        {activeRole === "admin" && (
          <>
            {currentTab === "admin-dashboard" && <AdminDashboard language={language} />}

            {currentTab === "deals" && (
              <DealsWorkflowView
                currentUser={currentUser}
                language={language}
                onNavigateToTransactions={() => setCurrentTab("transactions")}
                onSwitchPersona={handleSwitchPersona}
              />
            )}

            {currentTab === "transactions" && (
              <TransactionsView currentUser={currentUser} language={language} />
            )}

            {currentTab === "markets" && (
              <MarketIntelligence
                language={language}
                lowDataMode={lowDataMode}
                onSelectMarket={() => setCurrentTab("calculator")}
              />
            )}
          </>
        )}

        {/* Global Branded Footer */}
        <footer className="mt-16 pt-8 pb-12 border-t border-stone-200 text-stone-500 text-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <FarmLogo size="sm" subtext="AI Farm-to-Market Intelligence & Trading" />
            </div>
            <p className="text-[11px] text-stone-400 text-center sm:text-right">
              {language === "hi"
                ? "किसानों के लाभ के लिए समर्पित • स्मार्ट इंडिया हैकथॉन नवाचार"
                : "Dedicated to Farmers' Net Profit • Smart India Hackathon Innovation"}
            </p>
          </div>
        </footer>
      </main>

      {/* Floating Action AI Button (Quick access to AI advisor) */}
      {activeRole === "farmer" && currentTab !== "chatbot" && (
        <button
          onClick={() => setCurrentTab("chatbot")}
          className="fixed bottom-20 lg:bottom-8 right-5 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-xl flex items-center space-x-2 transition-all hover:scale-105 cursor-pointer"
          title="Ask FarmIntel AI Advisor"
        >
          <Bot className="w-5 h-5 text-white" />
          <span className="hidden sm:inline font-bold text-xs">
            {language === "hi" ? "पूछें AI (Ask FarmIntel)" : "Ask AI Advisor"}
          </span>
        </button>
      )}

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        activeRole={activeRole}
      />

      {/* Real-time Buyer-Farmer Direct Chat Modal */}
      {activeChat && (
        <ChatModal
          currentUser={currentUser}
          targetBuyerId={activeChat.id}
          targetBuyerName={activeChat.name}
          onClose={() => setActiveChat(null)}
        />
      )}

      {/* Authentication Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onOpenFullAuth={() => {
            setShowAuthModal(false);
            setCurrentTab("auth");
          }}
          onSuccess={(user) => {
            setCurrentUser(user);
            setActiveRole(user.role);
            setCurrentTab(user.role === "buyer" ? "buyer-dashboard" : "dashboard");
          }}
          language={language}
        />
      )}
    </div>
  );
}
