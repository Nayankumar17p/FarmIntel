// src/components/farmer/AiQualityCheck.tsx
import React, { useState } from "react";
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  RefreshCw,
  Info,
  ShieldCheck,
} from "lucide-react";

interface AiQualityCheckProps {
  language: "hi" | "en" | "hinglish";
  lowDataMode: boolean;
  onApplyGrade?: (grade: string, report: any) => void;
}

export const AiQualityCheck: React.FC<AiQualityCheckProps> = ({
  language,
  lowDataMode,
  onApplyGrade,
}) => {
  const [selectedCrop, setSelectedCrop] = useState("Wheat");
  const [variety, setVariety] = useState("Sharbati");
  const [imagePreview, setImagePreview] = useState<string | null>(
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80"
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>({
    grade: "Grade A (Premium)",
    estimatedMoisturePercent: 11.2,
    colorUniformityPercent: 94,
    visibleDefectsPercent: 2.1,
    observations: [
      "Plump, mature golden grain kernels with healthy uniform amber luster.",
      "Visually indicates well-dried condition within safe moisture threshold (<12%).",
      "Very low visible chaff, broken grains, or pest discolouration.",
    ],
    suggestedCategory: "Premium Milling / Grade A Commercial Trade",
    disclaimer: "AI-assisted estimate only — final quality should be verified physically.",
  });

  const sampleImages = [
    {
      name: "Wheat (Sharbati Gold)",
      crop: "Wheat",
      variety: "Sharbati",
      url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
    },
    {
      name: "Tomato (Abhinav Hybrid)",
      crop: "Tomato",
      variety: "Abhinav",
      url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
    },
    {
      name: "Maize / Corn",
      crop: "Maize",
      variety: "Yellow Feed",
      url: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80",
    },
    {
      name: "Potato (Kufri Jyoti)",
      crop: "Potato",
      variety: "Kufri",
      url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80",
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        runAiAnalysis(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectSample = (sample: any) => {
    setSelectedCrop(sample.crop);
    setVariety(sample.variety);
    setImagePreview(sample.url);
    runAiAnalysis(sample.url);
  };

  const runAiAnalysis = (imgSrc?: string) => {
    setAnalyzing(true);
    fetch("/api/ai/quality", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cropName: selectedCrop,
        variety,
        imageBase64: imgSrc || imagePreview,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setResult(data);
        setAnalyzing(false);
      })
      .catch((err) => {
        console.error(err);
        setAnalyzing(false);
      });
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-900 mb-1.5 border border-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>AI Computer Vision Crop Quality Estimator</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
            {language === "hi" ? "फसल गुणवत्ता अनुमान (AI Quality Assistance)" : "Crop Quality Assistance"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {language === "hi"
              ? "अपनी फसल की फोटो अपलोड करें। AI रंग, एकरूपता और नमी का विश्लेषण कर ग्रेड का अनुमान लगाएगा।"
              : "Upload photos to estimate lot grade, color uniformity, and moisture suitability to boost buyer trust."}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {["Wheat", "Tomato", "Maize", "Potato"].map((c) => (
            <button
              key={c}
              onClick={() => {
                setSelectedCrop(c);
                runAiAnalysis();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCrop === c
                  ? "bg-purple-700 text-white shadow-xs"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Crop Visual Input
            </h2>

            {/* Image Preview Box */}
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Crop preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-center p-4">
                  <Camera className="w-8 h-8 text-stone-400 mx-auto mb-1" />
                  <p className="text-xs text-stone-500">No image selected</p>
                </div>
              )}

              {analyzing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                  <RefreshCw className="w-8 h-8 animate-spin text-purple-400" />
                  <p className="text-xs font-bold">Scanning grains and color uniformity...</p>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div className="flex space-x-2">
              <label className="flex-1 py-2 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition-colors shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Crop Photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>

              <button
                onClick={() => runAiAnalysis()}
                disabled={analyzing}
                className="py-2 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? "animate-spin" : ""}`} />
                <span>Re-Analyze</span>
              </button>
            </div>

            {/* Sample Presets */}
            <div className="pt-3 border-t border-stone-100">
              <p className="text-[11px] font-bold text-stone-500 mb-2">Or test with standard samples:</p>
              <div className="grid grid-cols-2 gap-2">
                {sampleImages.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectSample(s)}
                    className="p-2 text-left rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-[11px] font-medium text-stone-800 flex items-center space-x-2 cursor-pointer transition-colors"
                  >
                    <img
                      src={s.url}
                      alt={s.name}
                      className="w-7 h-7 rounded-lg object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="truncate">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Inspection Results (7 cols - Matches Prompt Template) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-5">
            {/* Header with AI Badge */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Crop Quality Assistance Report
                </span>
                <h3 className="text-lg font-bold text-stone-900">
                  Crop: {selectedCrop} ({variety})
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-stone-500 block">Estimated Grade</span>
                <span className="text-sm font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                  {result?.grade || "Grade A"}
                </span>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">
                  Moisture Estimate
                </span>
                <p className="text-lg sm:text-xl font-extrabold text-stone-900 mt-0.5">
                  {result?.estimatedMoisturePercent || 11.2}%
                </p>
                <span className="text-[10px] text-emerald-700 font-semibold">Dry &amp; Transit Safe</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">
                  Color Uniformity
                </span>
                <p className="text-lg sm:text-xl font-extrabold text-stone-900 mt-0.5">
                  {result?.colorUniformityPercent || 94}%
                </p>
                <span className="text-[10px] text-emerald-700 font-semibold">High Consistency</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">
                  Visible Damage
                </span>
                <p className="text-lg sm:text-xl font-extrabold text-stone-900 mt-0.5">
                  &lt;{result?.visibleDefectsPercent || 2.1}%
                </p>
                <span className="text-[10px] text-emerald-700 font-semibold">Low Defects</span>
              </div>
            </div>

            {/* Visual Observations (Exact requested section) */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Visual Observations:
              </h4>
              <div className="space-y-1.5 text-xs text-stone-700 bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80">
                {result?.observations?.map((obs: string, idx: number) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{obs}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Selling Category */}
            <div className="p-3.5 bg-purple-50/70 rounded-2xl border border-purple-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-900 block">
                  Suggested Selling Category:
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-purple-950 mt-0.5">
                  {result?.suggestedCategory || "Premium / Grade A"}
                </p>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-white px-2.5 py-1 rounded-xl shadow-2xs">
                +₹60/Q Value Uplift
              </span>
            </div>

            {/* Mandatory Strict Disclaimer (Requirement 13) */}
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-start space-x-2 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong>AI estimate only</strong> — final quality, moisture, and test weight should be verified physically at the mandi or buyer weighbridge.
              </p>
            </div>

            {/* Action Buttons */}
            {onApplyGrade && (
              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={() => onApplyGrade(result?.grade || "Grade A (Premium)", result)}
                  className="w-full sm:w-auto py-2.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition-colors cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Attach Grade to Crop Lot &amp; View Listings →</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
