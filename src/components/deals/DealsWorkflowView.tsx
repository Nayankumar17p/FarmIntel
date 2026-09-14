// src/components/deals/DealsWorkflowView.tsx
import React, { useState, useEffect } from "react";
import {
  FileCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Phone,
  Building,
  User as UserIcon,
  RotateCcw,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Deal, LogisticsRecord, User, DealStatus, LogisticsStatus } from "../../types";

interface DealsWorkflowViewProps {
  currentUser: User | null;
  language: "hi" | "en" | "hinglish";
  onNavigateToTransactions: () => void;
  onSwitchPersona?: (personaId: string) => void;
}

export const DealsWorkflowView: React.FC<DealsWorkflowViewProps> = ({
  currentUser,
  language,
  onNavigateToTransactions,
  onSwitchPersona,
}) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [dealDetail, setDealDetail] = useState<(Deal & { logistics?: LogisticsRecord; transaction?: any }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Transport modal state
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState("trans-1");

  const transporters = [
    {
      id: "trans-1",
      name: "Patna Agro Logistics",
      vehicle: "Tata 407 (4 Ton)",
      cost: 2500,
      driver: "Mahesh Yadav",
      phone: "+91 94318 76543",
      regNo: "BR-01-GA-4821",
      eta: "Within 2 Hours",
      rating: "4.9★",
    },
    {
      id: "trans-2",
      name: "Kisan Fleet Express",
      vehicle: "Mahindra Bolero Maxi (2.5 Ton)",
      cost: 2200,
      driver: "Rajesh Singh",
      phone: "+91 98350 12489",
      regNo: "BR-01-EB-3190",
      eta: "Within 3 Hours",
      rating: "4.7★",
    },
    {
      id: "trans-3",
      name: "Ganga Carrier",
      vehicle: "Eicher 14ft (6 Ton)",
      cost: 2800,
      driver: "Amit Kumar",
      phone: "+91 99342 77810",
      regNo: "BR-02-TC-9912",
      eta: "Tomorrow 8:00 AM",
      rating: "4.8★",
    },
  ];

  const fetchDeals = () => {
    fetch("/api/deals")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDeals(data);
          if (data.length > 0 && !selectedDealId) {
            setSelectedDealId(data[0].id || data[0].dealId);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch deals:", err);
        setLoading(false);
      });
  };

  const fetchDealDetail = (id: string) => {
    fetch(`/api/deals/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setDealDetail(data);
        }
      })
      .catch((err) => console.error("Failed to fetch deal detail:", err));
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  useEffect(() => {
    if (selectedDealId) {
      fetchDealDetail(selectedDealId);
    }
  }, [selectedDealId]);

  // Request Transport
  const handleConfirmTransport = () => {
    if (!dealDetail) return;
    setActionLoading(true);

    const provider = transporters.find((t) => t.id === selectedTransporter) || transporters[0];

    fetch("/api/logistics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dealId: dealDetail.dealId,
        providerId: provider.id,
        pickupLocation: dealDetail.pickupLocation,
        destination: dealDetail.deliveryLocation,
        estimatedCost: provider.cost,
        scheduledDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setActionLoading(false);
        setShowTransportModal(false);
        setStatusMessage("Transport scheduled successfully! Driver details assigned.");
        fetchDeals();
        fetchDealDetail(dealDetail.dealId);
        setTimeout(() => setStatusMessage(""), 4000);
      })
      .catch((err) => {
        console.error(err);
        setActionLoading(false);
      });
  };

  // Advance Logistics Status
  const handleAdvanceLogistics = (nextStatus: LogisticsStatus) => {
    if (!dealDetail) return;
    setActionLoading(true);

    fetch(`/api/logistics/${dealDetail.dealId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    })
      .then((r) => r.json())
      .then((data) => {
        setActionLoading(false);
        setStatusMessage(`Logistics updated: ${nextStatus.replace(/_/g, " ")}`);
        fetchDeals();
        fetchDealDetail(dealDetail.dealId);
        setTimeout(() => setStatusMessage(""), 4000);
      })
      .catch((err) => {
        console.error(err);
        setActionLoading(false);
      });
  };

  // Release Payment & Complete Deal
  const handleReleasePayment = () => {
    if (!dealDetail) return;
    setActionLoading(true);

    fetch(`/api/deals/${dealDetail.dealId}/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentMethod: "e-NAM Escrow" }),
    })
      .then((r) => r.json())
      .then((data) => {
        setActionLoading(false);
        setStatusMessage("Escrow funds released! Net amount deposited to farmer's verified bank account.");
        fetchDeals();
        fetchDealDetail(dealDetail.dealId);
        setTimeout(() => setStatusMessage(""), 4000);
      })
      .catch((err) => {
        console.error(err);
        setActionLoading(false);
      });
  };

  const isFarmer = currentUser?.role === "farmer";
  const isBuyer = currentUser?.role === "buyer";

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 mb-1.5 border border-emerald-200">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Digital Contracts &amp; Escrow Mandi Settlements</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
            {language === "hi" ? "सक्रिय सौदे एवं लॉजिस्टिक्स" : "Active Deals & Contract Execution"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {language === "hi"
              ? "अनुबंध की स्थिति, वाहन डिस्पैच, डिलीवरी सत्यापन और एस्क्रो भुगतान का लाइव ट्रैकिंग।"
              : "Track legally binding agreements, dispatch transport, verify delivery receipt, and release escrow funds."}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onNavigateToTransactions}
            className="py-2 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
          >
            <span>View Mandi Receipts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-500 text-emerald-950 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-xs animate-in fade-in duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-stone-500 text-sm">Loading confirmed deals...</div>
      ) : deals.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-stone-200 text-center space-y-3">
          <FileCheck className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No Confirmed Deals Yet</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Once a buyer accepts an offer or the farmer accepts a counter-offer, an official binding deal is created here with automatic escrow protection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Deal List Selector */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider px-1">
              Confirmed Agreements ({deals.length})
            </h2>
            <div className="space-y-2.5">
              {deals.map((deal) => {
                const isSelected = (deal.id || deal.dealId) === selectedDealId;
                return (
                  <button
                    key={deal.id || deal.dealId}
                    onClick={() => {
                      setSelectedDealId(deal.id || deal.dealId);
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50/70 border-emerald-500 shadow-xs ring-1 ring-emerald-500"
                        : "bg-white border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-stone-900">{deal.dealId}</span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          deal.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-800"
                            : deal.status === "DELIVERED"
                            ? "bg-blue-100 text-blue-900"
                            : deal.status === "IN_TRANSIT"
                            ? "bg-purple-100 text-purple-900"
                            : deal.status === "TRANSPORT_REQUESTED"
                            ? "bg-orange-100 text-orange-900"
                            : "bg-amber-100 text-amber-900"
                        }`}
                      >
                        {deal.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-stone-700 mt-1">
                      {deal.crop} • {deal.quantity} Quintals
                    </p>

                    <div className="flex justify-between items-center text-xs text-stone-500 mt-2 pt-2 border-t border-stone-100">
                      <span>Agreed: ₹{deal.price}/Q</span>
                      <span className="font-bold text-stone-900">
                        ₹{(deal.totalAmount || deal.price * deal.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="text-[11px] text-stone-500 mt-1 flex items-center justify-between">
                      <span>{deal.buyerName}</span>
                      <span>{new Date(deal.createdAt).toLocaleDateString()}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deal Detail & Workflow Actions */}
          <div className="lg:col-span-2 space-y-6">
            {dealDetail ? (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-6">
                {/* Deal Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-stone-100">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-xl font-bold text-stone-900">{dealDetail.dealId}</h2>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 flex items-center">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        Binding Contract
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Created on {new Date(dealDetail.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-stone-500">Contract Total</span>
                    <p className="text-2xl font-extrabold text-emerald-700">
                      ₹{dealDetail.totalAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Workflow Progress Stepper */}
                <div>
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
                    Contract Execution Lifecycle
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    {/* Step 1: Confirmed */}
                    <div
                      className={`p-3 rounded-2xl border transition-all ${
                        dealDetail.status === "CONFIRMED"
                          ? "bg-emerald-50 border-emerald-500 font-bold text-emerald-950"
                          : "bg-stone-50 border-stone-200 text-stone-700"
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center text-xs mb-1">
                        ✓
                      </div>
                      <p className="font-bold text-xs">Deal Confirmed</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">Price ₹{dealDetail.price}/Q Locked</p>
                    </div>

                    {/* Step 2: Transport */}
                    <div
                      className={`p-3 rounded-2xl border transition-all ${
                        ["TRANSPORT_REQUESTED", "PICKUP_SCHEDULED", "PICKED_UP", "IN_TRANSIT"].includes(dealDetail.status)
                          ? "bg-orange-50 border-orange-500 font-bold text-orange-950"
                          : ["DELIVERED", "COMPLETED"].includes(dealDetail.status)
                          ? "bg-emerald-50/50 border-emerald-300 text-emerald-900"
                          : "bg-stone-50 border-stone-200 text-stone-400"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs mb-1 ${
                          ["DELIVERED", "COMPLETED"].includes(dealDetail.status)
                            ? "bg-emerald-600 text-white"
                            : ["TRANSPORT_REQUESTED", "PICKUP_SCHEDULED", "PICKED_UP", "IN_TRANSIT"].includes(dealDetail.status)
                            ? "bg-orange-600 text-white"
                            : "bg-stone-200 text-stone-600"
                        }`}
                      >
                        <Truck className="w-3 h-3" />
                      </div>
                      <p className="font-bold text-xs">Logistics</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        {dealDetail.status === "IN_TRANSIT"
                          ? "In Transit"
                          : dealDetail.status === "TRANSPORT_REQUESTED"
                          ? "Dispatched"
                          : ["DELIVERED", "COMPLETED"].includes(dealDetail.status)
                          ? "Completed"
                          : "Pending Dispatch"}
                      </p>
                    </div>

                    {/* Step 3: Delivery */}
                    <div
                      className={`p-3 rounded-2xl border transition-all ${
                        dealDetail.status === "DELIVERED"
                          ? "bg-blue-50 border-blue-500 font-bold text-blue-950"
                          : dealDetail.status === "COMPLETED"
                          ? "bg-emerald-50/50 border-emerald-300 text-emerald-900"
                          : "bg-stone-50 border-stone-200 text-stone-400"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs mb-1 ${
                          dealDetail.status === "COMPLETED"
                            ? "bg-emerald-600 text-white"
                            : dealDetail.status === "DELIVERED"
                            ? "bg-blue-600 text-white"
                            : "bg-stone-200 text-stone-600"
                        }`}
                      >
                        📦
                      </div>
                      <p className="font-bold text-xs">Delivery</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        {dealDetail.status === "DELIVERED"
                          ? "Arrived at Hub"
                          : dealDetail.status === "COMPLETED"
                          ? "Verified"
                          : "Awaiting Arrival"}
                      </p>
                    </div>

                    {/* Step 4: Settlement */}
                    <div
                      className={`p-3 rounded-2xl border transition-all ${
                        dealDetail.status === "COMPLETED"
                          ? "bg-emerald-100 border-emerald-600 font-bold text-emerald-950"
                          : "bg-stone-50 border-stone-200 text-stone-400"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs mb-1 ${
                          dealDetail.status === "COMPLETED" ? "bg-emerald-600 text-white" : "bg-stone-200 text-stone-600"
                        }`}
                      >
                        ₹
                      </div>
                      <p className="font-bold text-xs">Settlement</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        {dealDetail.status === "COMPLETED" ? "Escrow Paid" : "Escrow Held"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Parties Details Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                    <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px] block">
                      Farmer / Seller
                    </span>
                    <p className="font-bold text-stone-900 text-sm flex items-center">
                      <UserIcon className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                      {dealDetail.farmerName}
                    </p>
                    <p className="text-stone-600 flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-stone-400" />
                      {dealDetail.pickupLocation}
                    </p>
                    <p className="text-[11px] text-stone-500">ID: {dealDetail.farmerId} • Verified Farmer</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                    <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px] block">
                      Buyer / Processor
                    </span>
                    <p className="font-bold text-stone-900 text-sm flex items-center">
                      <Building className="w-3.5 h-3.5 mr-1 text-blue-700" />
                      {dealDetail.buyerName}
                    </p>
                    <p className="text-stone-600 flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-stone-400" />
                      {dealDetail.deliveryLocation}
                    </p>
                    <p className="text-[11px] text-stone-500">Verified Buyer • Trust Score 4.8/5</p>
                  </div>
                </div>

                {/* Logistics Section */}
                <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-orange-700" />
                      <span className="font-bold text-stone-900 text-sm">Transport &amp; Freight Execution</span>
                    </div>
                    {dealDetail.logistics ? (
                      <span className="font-extrabold text-[11px] px-2.5 py-0.5 rounded-full bg-orange-200 text-orange-900">
                        Status: {dealDetail.logistics.status.replace(/_/g, " ")}
                      </span>
                    ) : (
                      <span className="text-stone-500">Transport Not Yet Booked</span>
                    )}
                  </div>

                  {dealDetail.logistics ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-orange-200/60">
                        <div>
                          <span className="text-stone-500 block">Transporter:</span>
                          <span className="font-bold text-stone-800">{dealDetail.logistics.providerName}</span>
                        </div>
                        <div>
                          <span className="text-stone-500 block">Vehicle &amp; Reg:</span>
                          <span className="font-bold text-stone-800">
                            {dealDetail.logistics.vehicleType} ({dealDetail.logistics.vehicleNumber})
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-500 block">Driver:</span>
                          <span className="font-bold text-stone-800">
                            {dealDetail.logistics.driverName} ({dealDetail.logistics.driverPhone})
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-500 block">Freight Charge:</span>
                          <span className="font-extrabold text-orange-900">
                            ₹{dealDetail.logistics.estimatedCost?.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Advance Logistics Controls */}
                      {dealDetail.status !== "COMPLETED" && (
                        <div className="pt-3 border-t border-orange-200/60 flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-bold text-stone-600">Simulate Fleet Progress:</span>
                          {dealDetail.logistics.status === "REQUESTED" && (
                            <button
                              disabled={actionLoading}
                              onClick={() => handleAdvanceLogistics("PICKUP_SCHEDULED")}
                              className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                            >
                              Confirm Pickup Schedule →
                            </button>
                          )}
                          {dealDetail.logistics.status === "PICKUP_SCHEDULED" && (
                            <button
                              disabled={actionLoading}
                              onClick={() => handleAdvanceLogistics("PICKED_UP")}
                              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                            >
                              Mark Cargo Picked Up →
                            </button>
                          )}
                          {dealDetail.logistics.status === "PICKED_UP" && (
                            <button
                              disabled={actionLoading}
                              onClick={() => handleAdvanceLogistics("IN_TRANSIT")}
                              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                            >
                              Mark In Transit (On Route) →
                            </button>
                          )}
                          {dealDetail.logistics.status === "IN_TRANSIT" && (
                            <button
                              disabled={actionLoading}
                              onClick={() => handleAdvanceLogistics("DELIVERED")}
                              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                            >
                              Mark Delivered at Warehouse →
                            </button>
                          )}
                          {dealDetail.logistics.status === "DELIVERED" && dealDetail.status !== "COMPLETED" && (
                            <span className="text-blue-800 font-bold">
                              ✓ Cargo reached warehouse. Awaiting buyer quality check &amp; escrow release.
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <p className="text-stone-600 text-xs">
                        Next required action: Assign transport to pick up 50 Quintals of Wheat from Danapur Rural.
                      </p>
                      <button
                        onClick={() => setShowTransportModal(true)}
                        className="py-2 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-xs cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Arrange Transport Now</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Delivery & Escrow Release Action Card */}
                {dealDetail.status === "DELIVERED" && (
                  <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 space-y-3">
                    <div className="flex items-center space-x-2 text-emerald-950">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <h3 className="font-bold text-sm">Delivery Receipt &amp; Escrow Settlement Trigger</h3>
                    </div>
                    <p className="text-xs text-stone-700">
                      The shipment of <strong>50 Quintals Wheat</strong> has been delivered at <strong>{dealDetail.deliveryLocation}</strong>.
                      As the buyer, inspect lot specifications and release escrow funds to Ramesh Kumar.
                    </p>

                    <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs space-y-1">
                      <div className="flex justify-between text-stone-600">
                        <span>Contract Gross Value:</span>
                        <span className="font-bold text-stone-900">₹{dealDetail.totalAmount.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-stone-600">
                        <span>Transport Cost Deduction:</span>
                        <span className="font-bold text-orange-700">-₹2,500</span>
                      </div>
                      <div className="flex justify-between text-stone-600">
                        <span>Handling &amp; Mandi Taxes:</span>
                        <span className="font-bold text-stone-700">-₹500</span>
                      </div>
                      <div className="flex justify-between text-emerald-800 font-extrabold pt-1 border-t border-stone-100 text-sm">
                        <span>Net Bank Transfer to Ramesh Kumar:</span>
                        <span>₹{(dealDetail.totalAmount - 3000).toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-2">
                      <button
                        disabled={actionLoading}
                        onClick={handleReleasePayment}
                        className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md flex items-center justify-center space-x-2 cursor-pointer transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                        <span>Confirm Delivery &amp; Release Escrow Payment</span>
                      </button>

                      {isFarmer && onSwitchPersona && (
                        <button
                          onClick={() => onSwitchPersona("buyer-1")}
                          className="py-2.5 px-3 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold"
                        >
                          Switch to ABC Foods to Release
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Completed Deal Summary */}
                {dealDetail.status === "COMPLETED" && (
                  <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-300 space-y-3">
                    <div className="flex items-center space-x-2 text-emerald-950">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-bold text-sm">Transaction Successfully Settled</h3>
                    </div>
                    <p className="text-xs text-stone-600">
                      Escrow release completed. Both buyer and seller have fulfilled contract obligations. An official Mandi Settlement Ledger is archived.
                    </p>
                    <button
                      onClick={onNavigateToTransactions}
                      className="py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>View &amp; Print Digital Mandi Settlement Receipt →</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-10 border border-stone-200 text-center text-stone-500">
                Select a deal from the list to view contract details.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Transport Selection Modal */}
      {showTransportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">Arrange Farm-Gate Transport</h3>
                <p className="text-xs text-stone-500">
                  Select a certified agricultural transporter for Deal #{dealDetail?.dealId}
                </p>
              </div>
              <button
                onClick={() => setShowTransportModal(false)}
                className="text-stone-400 hover:text-stone-700 font-bold text-lg"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-stone-600">
                Route: <strong>{dealDetail?.pickupLocation}</strong> → <strong>{dealDetail?.deliveryLocation}</strong>
              </p>

              <div className="space-y-2">
                {transporters.map((t) => (
                  <label
                    key={t.id}
                    onClick={() => setSelectedTransporter(t.id)}
                    className={`block p-3 rounded-2xl border transition-all cursor-pointer ${
                      selectedTransporter === t.id
                        ? "bg-orange-50/80 border-orange-500 ring-1 ring-orange-500"
                        : "bg-white border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="transporter"
                          checked={selectedTransporter === t.id}
                          onChange={() => setSelectedTransporter(t.id)}
                          className="text-orange-600 focus:ring-orange-500"
                        />
                        <span className="font-bold text-stone-900">{t.name}</span>
                        <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                          {t.rating}
                        </span>
                      </div>
                      <span className="font-extrabold text-orange-800 text-sm">₹{t.cost.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="mt-2 pl-6 grid grid-cols-2 gap-1 text-[11px] text-stone-600">
                      <div>Vehicle: <strong>{t.vehicle}</strong></div>
                      <div>Driver: <strong>{t.driver}</strong></div>
                      <div>Reg No: <strong>{t.regNo}</strong></div>
                      <div>Availability: <strong>{t.eta}</strong></div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="p-3 bg-stone-50 rounded-xl space-y-1 text-stone-600">
                <div className="flex justify-between">
                  <span>Estimated Freight:</span>
                  <span className="font-bold text-stone-900">
                    ₹{transporters.find((t) => t.id === selectedTransporter)?.cost.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Payment:</span>
                  <span>Deducted automatically from escrow on delivery</span>
                </div>
              </div>

              <button
                disabled={actionLoading}
                onClick={handleConfirmTransport}
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                {actionLoading ? "Scheduling Transport..." : "Confirm Transport Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
