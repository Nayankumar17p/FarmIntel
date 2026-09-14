// src/components/auth/AuthPage.tsx
import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Smartphone,
  Mail,
  Lock,
  User as UserIcon,
  MapPin,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  KeyRound,
  RefreshCw,
  Sparkles,
  Award,
  Clock,
  HelpCircle,
} from "lucide-react";
import { User, UserRole, EmailValidationResult, PhoneValidationResult, OtpState } from "../../types";
import { FarmLogoIcon } from "../common/FarmLogo";

interface AuthPageProps {
  onSuccess: (user: User, token: string) => void;
  language: "hi" | "en" | "hinglish";
  defaultRole?: UserRole;
  onBackToApp: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onSuccess,
  language,
  defaultRole = "farmer",
  onBackToApp,
}) => {
  const [activeRole, setActiveRole] = useState<UserRole>(defaultRole);
  const [authMethod, setAuthMethod] = useState<"otp" | "password" | "register">("otp");
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [district, setDistrict] = useState("Patna");
  const [village, setVillage] = useState("Danapur Rural");

  // Farmer specifics
  const [farmSize, setFarmSize] = useState("5.0");
  const [selectedCrops, setSelectedCrops] = useState<string[]>(["Wheat", "Maize"]);
  const [fpoMember, setFpoMember] = useState(true);
  const [fpoName, setFpoName] = useState("Patliputra Kisan FPO");

  // Buyer specifics
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState<string>("Wholesaler");
  const [gstin, setGstin] = useState("");
  const [procurementCapacity, setProcurementCapacity] = useState("2500");

  // OTP State
  const [otpCode, setOtpCode] = useState("");
  const [otpState, setOtpState] = useState<OtpState>({
    sent: false,
    countdown: 0,
    loading: false,
  });
  const [smsNotification, setSmsNotification] = useState<{
    show: boolean;
    code: string;
    target: string;
  } | null>(null);

  // Live Validations
  const [emailValidation, setEmailValidation] = useState<EmailValidationResult | null>(null);
  const [phoneValidation, setPhoneValidation] = useState<PhoneValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const cropOptions = ["Wheat", "Paddy / Rice", "Maize", "Mustard", "Gram / Chana", "Tomato", "Potato", "Onion"];

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: any;
    if (otpState.countdown > 0) {
      timer = setInterval(() => {
        setOtpState((prev) => ({ ...prev, countdown: prev.countdown - 1 }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpState.countdown]);

  // Live Email Validation debounce
  useEffect(() => {
    if (!email || email.length < 4) {
      setEmailValidation(null);
      return;
    }
    const timer = setTimeout(() => {
      fetch("/api/auth/validate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
        .then((r) => r.json())
        .then((data: EmailValidationResult) => {
          setEmailValidation(data);
        })
        .catch(() => {});
    }, 400);

    return () => clearTimeout(timer);
  }, [email]);

  // Live Phone Validation
  useEffect(() => {
    if (!phone || phone.length < 5) {
      setPhoneValidation(null);
      return;
    }
    const timer = setTimeout(() => {
      fetch("/api/auth/validate-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })
        .then((r) => r.json())
        .then((data: PhoneValidationResult) => {
          setPhoneValidation(data);
        })
        .catch(() => {});
    }, 300);

    return () => clearTimeout(timer);
  }, [phone]);

  const toggleCrop = (crop: string) => {
    setSelectedCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    );
  };

  // Handler: Request OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const target = authMethod === "otp" ? phone : email;
    if (!target) {
      setErrorMessage(
        language === "hi"
          ? "कृपया मोबाइल नंबर या ईमेल दर्ज करें"
          : "Please enter your mobile phone or email"
      );
      return;
    }

    setOtpState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneOrEmail: target, purpose: isRegisterMode ? "register" : "login" }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setOtpState({
        sent: true,
        countdown: 45,
        loading: false,
        simulatedCode: data.otp,
        channel: data.channel,
      });

      // Show realistic SMS simulation toast for immediate testability
      setSmsNotification({
        show: true,
        code: data.otp,
        target: target,
      });

      setSuccessMessage(data.message);
    } catch (err: any) {
      setOtpState((prev) => ({ ...prev, loading: false }));
      setErrorMessage(err.message);
    }
  };

  // Handler: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const target = phone || email;

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneOrEmail: target,
          otp: otpCode,
          role: activeRole,
          name: name || (activeRole === "farmer" ? "Ramesh Kumar" : "Agri Buyer"),
          district,
          state: "Bihar",
          farmSizeAcres: farmSize,
          primaryCrops: selectedCrops,
          fpoMembership: fpoMember ? fpoName : undefined,
          businessName,
          businessType,
          gstin,
          procurementCapacityQuintals: procurementCapacity,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "OTP verification failed");
      }

      if (data.token && data.user) {
        localStorage.setItem("farmintel_token", data.token);
        localStorage.setItem("farmintel_user", JSON.stringify(data.user));
        onSuccess(data.user, data.token);
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler: Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: email || phone,
          password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.token && data.user) {
        localStorage.setItem("farmintel_token", data.token);
        localStorage.setItem("farmintel_user", JSON.stringify(data.user));
        onSuccess(data.user, data.token);
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler: Email/Password Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (emailValidation && !emailValidation.valid) {
      setErrorMessage(emailValidation.message);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          role: activeRole,
          district,
          state: "Bihar",
          village,
          farmSizeAcres: farmSize,
          primaryCrops: selectedCrops,
          fpoMembership: fpoMember ? fpoName : undefined,
          businessName: activeRole === "buyer" ? businessName : undefined,
          businessType: activeRole === "buyer" ? businessType : undefined,
          gstin: activeRole === "buyer" ? gstin : undefined,
          procurementCapacityQuintals: activeRole === "buyer" ? procurementCapacity : undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      if (data.token && data.user) {
        localStorage.setItem("farmintel_token", data.token);
        localStorage.setItem("farmintel_user", JSON.stringify(data.user));
        onSuccess(data.user, data.token);
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // One-click demo persona login
  const handleDemoLogin = async (personaId: string) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/auth/demo-switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personaId }),
      });
      const data = await res.json();
      if (data.token && data.user) {
        localStorage.setItem("farmintel_token", data.token);
        localStorage.setItem("farmintel_user", JSON.stringify(data.user));
        onSuccess(data.user, data.token);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed demo login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackToApp}
            className="flex items-center space-x-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3 py-1.5 rounded-xl shadow-2xs hover:bg-stone-50 transition-colors"
          >
            <span>←</span>
            <span>{language === "hi" ? "वापस मुख्य पोर्टल पर" : "Back to Mandi Portal"}</span>
          </button>

          <div className="flex items-center space-x-2 text-xs font-medium text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit JWT Encrypted &amp; CDAC DLT Verified</span>
          </div>
        </div>

        {/* SMS Toast notification simulation banner */}
        {smsNotification && smsNotification.show && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950 text-white shadow-xl border border-emerald-700/50 flex items-start justify-between animate-fadeIn">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-emerald-800/80 text-emerald-200 mt-0.5">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Kisan SMS Gateway Alert
                  </span>
                  <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-800">
                    Real-time Test Simulation
                  </span>
                </div>
                <p className="text-sm font-medium mt-1">
                  OTP for FarmIntel Login is{" "}
                  <span className="text-amber-300 font-mono font-bold text-base px-1.5 py-0.5 bg-black/40 rounded-lg">
                    {smsNotification.code}
                  </span>
                  . Valid for 5 minutes. Do not share.
                </p>
                <p className="text-xs text-stone-300 mt-0.5">
                  Dispatched to {smsNotification.target} via National CDAC Agriculture Gateway
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <button
                onClick={() => {
                  setOtpCode(smsNotification.code);
                  setSmsNotification(null);
                }}
                className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-colors shadow-xs"
              >
                Auto-Fill Code
              </button>
              <button
                onClick={() => setSmsNotification(null)}
                className="text-[11px] text-stone-400 hover:text-stone-200"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
          {/* Hero Banner Header */}
          <div className="bg-radial from-stone-900 via-stone-900 to-stone-950 text-white p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 opacity-15 pointer-events-none flex items-center pr-12">
              <FarmLogoIcon className="w-72 h-72 text-emerald-400" />
            </div>

            <div className="relative z-10 max-w-xl">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow-md flex items-center justify-center border border-white/20">
                  <FarmLogoIcon className="w-full h-full" />
                </div>
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{language === "hi" ? "भारत सरकार ई-मंडी सुरक्षा मानक" : "Farm-to-Market Trading Network"}</span>
                  </div>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-serif">
                {language === "hi"
                  ? "फार्म-इंटेल प्रवेश द्वार"
                  : "FarmIntel Authentication & Access"}
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm mt-1 leading-relaxed">
                {language === "hi"
                  ? "सत्यापित किसान और संस्थागत खरीदार पोर्टल: वास्तविक मंडी भाव, एमएसपी सुरक्षा एवं डिजिटल एस्क्रो"
                  : "Sign in to access Mandi Net-Realisation Intelligence, Govt MSP Benchmarks, and Direct Escrow Contracts."}
              </p>
            </div>

            {/* Role Switcher Tabs */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                onClick={() => setActiveRole("farmer")}
                className={`py-3 px-4 rounded-2xl flex items-center justify-center space-x-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeRole === "farmer"
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/50"
                    : "bg-white/10 text-stone-300 hover:bg-white/20 border border-white/10"
                }`}
              >
                <span className="text-lg">👨‍🌾</span>
                <div className="text-left">
                  <div>{language === "hi" ? "किसान भाई (Farmer Portal)" : "Farmer Portal"}</div>
                  <div className="text-[10px] font-normal opacity-80">
                    {language === "hi" ? "फसल बेचना व मंडी भाव" : "Sell Produce & Compare Mandis"}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveRole("buyer")}
                className={`py-3 px-4 rounded-2xl flex items-center justify-center space-x-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeRole === "buyer"
                    ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30 ring-2 ring-amber-400/50"
                    : "bg-white/10 text-stone-300 hover:bg-white/20 border border-white/10"
                }`}
              >
                <span className="text-lg">🏭</span>
                <div className="text-left">
                  <div>{language === "hi" ? "खरीदार / मिलर्स (Buyer Portal)" : "Buyer & Mill Portal"}</div>
                  <div className="text-[10px] font-normal opacity-80">
                    {language === "hi" ? "थोक खरीद व बोली" : "Bulk Procurement & Bidding"}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Form Content Area */}
          <div className="p-6 sm:p-8">
            {/* Auth Method Navigation Tabs */}
            <div className="flex border-b border-stone-200 mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod("otp");
                  setIsRegisterMode(false);
                  setErrorMessage("");
                }}
                className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                  authMethod === "otp" && !isRegisterMode
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{language === "hi" ? "मोबाइल OTP लॉगिन" : "Instant Mobile OTP"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMethod("password");
                  setIsRegisterMode(false);
                  setErrorMessage("");
                }}
                className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                  authMethod === "password" && !isRegisterMode
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{language === "hi" ? "पासवर्ड लॉगिन" : "Email & Password"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(true);
                  setAuthMethod("register");
                  setErrorMessage("");
                }}
                className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                  isRegisterMode
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>
                  {language === "hi"
                    ? activeRole === "farmer"
                      ? "नया किसान पंजीकरण"
                      : "नया खरीदार पंजीकरण"
                    : `New ${activeRole === "farmer" ? "Farmer" : "Buyer"} Registration`}
                </span>
              </button>
            </div>

            {/* Error & Success alerts */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2.5">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{errorMessage}</p>
                  {emailValidation?.suggestion && (
                    <button
                      type="button"
                      onClick={() => setEmail(emailValidation.suggestion!)}
                      className="mt-1 text-emerald-700 underline font-bold cursor-pointer"
                    >
                      Did you mean {emailValidation.suggestion}? Click to use.
                    </button>
                  )}
                </div>
              </div>
            )}

            {successMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <p className="font-semibold">{successMessage}</p>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* VIEW 1: Mobile OTP Flow                              */}
            {/* ---------------------------------------------------- */}
            {authMethod === "otp" && !isRegisterMode && (
              <div className="space-y-5 max-w-md mx-auto">
                <div className="text-center">
                  <h3 className="text-base font-bold text-stone-900 font-serif">
                    {language === "hi"
                      ? "मोबाइल नंबर द्वारा तुरंत प्रवेश करें"
                      : "Direct OTP Sign-In"}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    {language === "hi"
                      ? "बिना पासवर्ड के सुरक्षित 6-अंकों के ओटीपी से लॉगिन करें"
                      : "Receive a fast 6-digit code via SMS. No complicated passwords needed."}
                  </p>
                </div>

                {!otpState.sent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        {language === "hi" ? "10-अंकों का मोबाइल नंबर" : "10-Digit Mobile Number"}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 font-semibold text-xs">
                          +91
                        </div>
                        <input
                          type="tel"
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                          placeholder="98350 12345"
                          className="w-full pl-12 pr-3 py-2.5 text-sm font-semibold border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          required
                        />
                      </div>
                      {phoneValidation && (
                        <p
                          className={`text-[11px] mt-1 font-medium ${
                            phoneValidation.valid ? "text-emerald-700" : "text-amber-700"
                          }`}
                        >
                          {phoneValidation.valid ? "✓ " + phoneValidation.message : "⚠ " + phoneValidation.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={otpState.loading || (phone.length > 0 && phone.length < 10)}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      {otpState.loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Sending OTP...</span>
                        </>
                      ) : (
                        <>
                          <span>{language === "hi" ? "ओटीपी भेजें (Send OTP)" : "Send Verification OTP"}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fadeIn">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-stone-700">
                          {language === "hi" ? "6-अंकों का ओटीपी दर्ज करें" : "Enter 6-Digit OTP"}
                        </label>
                        <button
                          type="button"
                          onClick={() => setOtpState({ sent: false, countdown: 0, loading: false })}
                          className="text-[11px] text-emerald-700 hover:underline font-semibold"
                        >
                          {language === "hi" ? "नंबर बदलें" : "Change Number"}
                        </button>
                      </div>

                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                        placeholder="••••••"
                        className="w-full text-center tracking-[0.6em] text-xl font-bold py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        autoFocus
                        required
                      />

                      <div className="flex items-center justify-between text-xs text-stone-500 mt-2">
                        <span>
                          {otpState.countdown > 0 ? (
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5 text-stone-400" />
                              <span>Resend in {otpState.countdown}s</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSendOtp()}
                              className="text-emerald-700 font-bold hover:underline"
                            >
                              Resend OTP Code
                            </button>
                          )}
                        </span>

                        {otpState.simulatedCode && (
                          <button
                            type="button"
                            onClick={() => setOtpCode(otpState.simulatedCode!)}
                            className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                          >
                            Paste Demo Code ({otpState.simulatedCode})
                          </button>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otpCode.length !== 6}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Verifying Token...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>{language === "hi" ? "सत्यापित कर प्रवेश करें" : "Verify & Enter Portal"}</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* VIEW 2: Password Login                              */}
            {/* ---------------------------------------------------- */}
            {authMethod === "password" && !isRegisterMode && (
              <form onSubmit={handlePasswordLogin} className="space-y-4 max-w-md mx-auto">
                <div className="text-center mb-2">
                  <h3 className="text-base font-bold text-stone-900 font-serif">
                    {language === "hi" ? "पासवर्ड द्वारा सुरक्षित लॉगिन" : "Sign In with Password"}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Enter your registered email address or mobile number
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === "hi" ? "ईमेल अथवा मोबाइल नंबर" : "Email Address or Mobile"}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ramesh.farmer@farmintel.in"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  {emailValidation && (
                    <div className="mt-1 text-[11px]">
                      {emailValidation.valid ? (
                        <p className="text-emerald-700 font-medium">✓ {emailValidation.message}</p>
                      ) : (
                        <p className="text-red-600 font-medium">⚠ {emailValidation.message}</p>
                      )}
                      {emailValidation.suggestion && (
                        <button
                          type="button"
                          onClick={() => setEmail(emailValidation.suggestion!)}
                          className="text-emerald-800 underline font-semibold mt-0.5"
                        >
                          Did you mean {emailValidation.suggestion}?
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-stone-700">
                      {language === "hi" ? "गोपनीय पासवर्ड" : "Password"}
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthMethod("otp")}
                      className="text-[11px] text-emerald-700 hover:underline"
                    >
                      Forgot password? Use OTP
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>{language === "hi" ? "लॉगिन करें" : "Sign In with Password"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ---------------------------------------------------- */}
            {/* VIEW 3: Full Registration Form (Farmer vs Buyer)     */}
            {/* ---------------------------------------------------- */}
            {isRegisterMode && (
              <form onSubmit={handleRegister} className="space-y-4 max-w-2xl mx-auto">
                <div className="text-center mb-3">
                  <h3 className="text-base font-bold text-stone-900 font-serif">
                    {activeRole === "farmer"
                      ? language === "hi"
                        ? "किसान भाई पंजीकरण फॉर्म"
                        : "Farmer Producer Registration"
                      : language === "hi"
                      ? "संस्थागत खरीदार / मिलर्स पंजीकरण"
                      : "Commercial Buyer & Processor Registration"}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {activeRole === "farmer"
                      ? "Register your farm size and crops to receive customized Mandi recommendations"
                      : "Register your procurement license and GSTIN to participate in direct mandi auctions"}
                  </p>
                </div>

                {/* Common Basic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      {activeRole === "farmer" ? "Full Name (किसान का नाम)" : "Authorized Contact Person"}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={activeRole === "farmer" ? "e.g. Ramesh Kumar" : "e.g. Rajesh Singhal"}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      {language === "hi" ? "मोबाइल नंबर (Mobile Phone)" : "Mobile Phone (DLT SMS)"}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98350 12345"
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      {language === "hi" ? "ईमेल पता (Email Validator)" : "Email Address (Verified)"}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={activeRole === "farmer" ? "ramesh@kisan.in" : "procurement@company.com"}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                    {emailValidation && (
                      <p
                        className={`text-[11px] mt-1 font-medium ${
                          emailValidation.valid ? "text-emerald-700" : "text-red-600"
                        }`}
                      >
                        {emailValidation.valid ? "✓ " + emailValidation.message : "⚠ " + emailValidation.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      {language === "hi" ? "पासवर्ड (Password)" : "Set Account Password"}
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>

                {/* Farmer Role Specific Fields */}
                {activeRole === "farmer" && (
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3 text-xs">
                    <div className="flex items-center space-x-2 text-emerald-900 font-bold">
                      <FarmLogoIcon className="w-5 h-5" />
                      <span>Farm &amp; Crop Information (खेत व फसल विवरण)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">District (जिला)</label>
                        <select
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                        >
                          <option value="Patna">Patna (पटना)</option>
                          <option value="Muzaffarpur">Muzaffarpur (मुज़फ़्फ़रपुर)</option>
                          <option value="Gaya">Gaya (गया)</option>
                          <option value="Nalanda">Nalanda (नालंदा)</option>
                          <option value="Samastipur">Samastipur (समस्तीपुर)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Village (गांव)</label>
                        <input
                          type="text"
                          value={village}
                          onChange={(e) => setVillage(e.target.value)}
                          placeholder="e.g. Danapur Rural"
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Land Size (एकड़)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={farmSize}
                          onChange={(e) => setFarmSize(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1.5">
                        Primary Crops Harvested (मुख्य फसलें)
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {cropOptions.map((crop) => (
                          <button
                            key={crop}
                            type="button"
                            onClick={() => toggleCrop(crop)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                              selectedCrops.includes(crop)
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100"
                            }`}
                          >
                            {crop}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1 flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="fpoMemberCheck"
                        checked={fpoMember}
                        onChange={(e) => setFpoMember(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <label htmlFor="fpoMemberCheck" className="font-semibold text-stone-800">
                        Member of an FPO / Farmer Collective (एफपीओ सदस्य)
                      </label>
                    </div>

                    {fpoMember && (
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">FPO Name</label>
                        <input
                          type="text"
                          value={fpoName}
                          onChange={(e) => setFpoName(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Buyer Role Specific Fields */}
                {activeRole === "buyer" && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3 text-xs">
                    <div className="flex items-center space-x-2 text-amber-950 font-bold">
                      <Building2 className="w-4 h-4 text-amber-700" />
                      <span>Commercial Entity &amp; Trade License (व्यवसाय विवरण)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Company / Mill Name</label>
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="e.g. Kisan Flour Mills Pvt. Ltd."
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Business Type</label>
                        <select
                          value={businessType}
                          onChange={(e) => setBusinessType(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                        >
                          <option value="Processor">Processor / Mill</option>
                          <option value="Wholesaler">Wholesaler / Trader</option>
                          <option value="Exporter">Exporter</option>
                          <option value="Retail Chain">Retail Supermarket Chain</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          GSTIN / Mandi Trader License
                        </label>
                        <input
                          type="text"
                          value={gstin}
                          onChange={(e) => setGstin(e.target.value)}
                          placeholder="10AABCA1234F1Z9"
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-mono uppercase"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          Monthly Capacity (Quintals)
                        </label>
                        <input
                          type="number"
                          value={procurementCapacity}
                          onChange={(e) => setProcurementCapacity(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center space-x-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Creating Account &amp; Issuing JWT...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {language === "hi" ? "खाता बनाएं और लॉगिन करें" : "Complete Registration & Sign In"}
                      </span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Bottom Demo Quick Personas */}
            <div className="mt-8 pt-6 border-t border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    {language === "hi" ? "त्वरित डेमो लॉगिन (1-Click Switch)" : "Fast One-Click Demo Access"}
                  </span>
                </div>
                <span className="text-[11px] text-stone-400">Pre-seeded accounts</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin("farmer-1")}
                  className="p-2.5 rounded-xl border border-stone-200 hover:border-emerald-300 bg-stone-50 hover:bg-emerald-50/40 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-1.5">
                    <span className="text-base">👨‍🌾</span>
                    <span className="text-xs font-bold text-stone-900 group-hover:text-emerald-800 truncate">
                      Ramesh Kumar
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 truncate mt-0.5">Farmer (Patna, Wheat)</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin("farmer-2")}
                  className="p-2.5 rounded-xl border border-stone-200 hover:border-emerald-300 bg-stone-50 hover:bg-emerald-50/40 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-1.5">
                    <span className="text-base">👩‍🌾</span>
                    <span className="text-xs font-bold text-stone-900 group-hover:text-emerald-800 truncate">
                      Sunita Devi
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 truncate mt-0.5">Farmer (Tomato 35Q)</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin("buyer-1")}
                  className="p-2.5 rounded-xl border border-stone-200 hover:border-amber-300 bg-stone-50 hover:bg-amber-50/40 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-1.5">
                    <span className="text-base">🏭</span>
                    <span className="text-xs font-bold text-stone-900 group-hover:text-amber-800 truncate">
                      ABC Foods Ltd.
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 truncate mt-0.5">Verified Grain Buyer</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin("admin-1")}
                  className="p-2.5 rounded-xl border border-stone-200 hover:border-blue-300 bg-stone-50 hover:bg-blue-50/40 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-1.5">
                    <span className="text-base">🏛️</span>
                    <span className="text-xs font-bold text-stone-900 group-hover:text-blue-800 truncate">
                      Agri Officer
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 truncate mt-0.5">Mandi Administrator</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
