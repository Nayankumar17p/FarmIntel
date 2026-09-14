// src/components/auth/AuthModal.tsx
import React, { useState } from "react";
import {
  X,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { User, UserRole } from "../../types";
import { FarmLogoIcon } from "../common/FarmLogo";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: User, token?: string) => void;
  language: "hi" | "en" | "hinglish";
  onOpenFullAuth?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onSuccess,
  language,
  onOpenFullAuth,
}) => {
  const [authMode, setAuthMode] = useState<"otp" | "password">("otp");
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>("farmer");
  const [name, setName] = useState("Ramesh Kumar");
  const [phone, setPhone] = useState("9835012345");
  const [email, setEmail] = useState("ramesh@kisan.in");
  const [password, setPassword] = useState("password123");
  const [district, setDistrict] = useState("Patna");

  // OTP state
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneOrEmail: phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to dispatch OTP");

      setOtpSent(true);
      setSimulatedOtp(data.otp);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneOrEmail: phone,
          otp: otpCode,
          role,
          name,
          district,
          state: "Bihar",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      if (data.token) {
        localStorage.setItem("farmintel_token", data.token);
        localStorage.setItem("farmintel_user", JSON.stringify(data.user));
      }
      onSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        phone,
        password,
        name: isLogin ? undefined : name,
        role,
        district,
        state: "Bihar",
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (!res.user && res.error) {
          throw new Error(res.error);
        }
        if (res.token) {
          localStorage.setItem("farmintel_token", res.token);
          localStorage.setItem("farmintel_user", JSON.stringify(res.user));
        }
        onSuccess(res.user, res.token);
        onClose();
      })
      .catch((e: any) => {
        setErrorMsg(e.message || "Authentication error");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 pb-3">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 border border-stone-200 shadow-xs flex items-center justify-center shrink-0">
              <FarmLogoIcon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-bold mb-0.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>JWT &amp; DLT Verified Portal</span>
              </div>
              <h2 className="text-lg font-bold text-stone-900 font-serif">
                {language === "hi" ? "फार्म-इंटेल प्रवेश द्वार" : "FarmIntel Access"}
              </h2>
              <p className="text-xs text-stone-500">
                {language === "hi"
                  ? "मंडी भाव, एमएसपी सुरक्षा एवं खरीदार मिलान"
                  : "Real-time Mandis, MSP floor analysis & direct escrow"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole("farmer")}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              role === "farmer"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
            }`}
          >
            👨‍🌾 {language === "hi" ? "किसान (Farmer)" : "Farmer Portal"}
          </button>
          <button
            type="button"
            onClick={() => setRole("buyer")}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              role === "buyer"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
            }`}
          >
            🏭 {language === "hi" ? "खरीदार (Buyer)" : "Buyer / Mill"}
          </button>
        </div>

        {/* Method Switcher: Instant OTP vs Email Password */}
        <div className="flex border-b border-stone-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthMode("otp");
              setErrorMsg("");
            }}
            className={`pb-2 px-3 border-b-2 cursor-pointer transition-colors ${
              authMode === "otp"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            📱 Mobile OTP Login
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("password");
              setErrorMsg("");
            }}
            className={`pb-2 px-3 border-b-2 cursor-pointer transition-colors ${
              authMode === "password"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            🔑 Email &amp; Password
          </button>
        </div>

        {/* Error alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <p className="font-semibold">{errorMsg}</p>
          </div>
        )}

        {/* Simulated OTP toast */}
        {simulatedOtp && (
          <div className="p-2.5 rounded-xl bg-emerald-900 text-white text-xs flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] text-emerald-300 font-bold uppercase block">SMS Code Preview</span>
              <p className="font-bold text-amber-300 tracking-wider text-sm">{simulatedOtp}</p>
            </div>
            <button
              type="button"
              onClick={() => setOtpCode(simulatedOtp)}
              className="px-2 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold"
            >
              Fill Code
            </button>
          </div>
        )}

        {/* Form Body */}
        {authMode === "otp" ? (
          !otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {language === "hi" ? "10-अंकों का मोबाइल नंबर" : "10-Digit Mobile Phone"}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400 font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="9835012345"
                    className="w-full pl-11 pr-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length < 10}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Send 6-Digit OTP</span>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Enter 6-Digit Verification Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="••••••"
                  className="w-full text-center tracking-[0.5em] text-lg font-bold py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Verify &amp; Enter</span>}
              </button>
            </form>
          )
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
            {!isLogin && (
              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Name / Trading Firm</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="block font-bold text-stone-700 mb-1">Email or Phone</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <span>{isLogin ? "Sign In & Enter Platform" : "Complete Registration"}</span>
              )}
            </button>
          </form>
        )}

        {/* Bottom Actions */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-emerald-700 font-bold hover:underline"
          >
            {isLogin ? "Need a new account? Register" : "Already registered? Login"}
          </button>

          {onOpenFullAuth && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenFullAuth();
              }}
              className="text-stone-700 hover:text-emerald-800 font-bold flex items-center space-x-1"
            >
              <span>Full Portal</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

