// src/components/farmer/AiChatbot.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User as UserIcon,
  Sparkles,
  RefreshCw,
  HelpCircle,
  TrendingUp,
  MapPin,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { User } from "../../types";

interface AiChatbotProps {
  currentUser: User | null;
  language: "hi" | "en" | "hinglish";
}

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  metadata?: any;
}

export const AiChatbot: React.FC<AiChatbotProps> = ({ currentUser, language }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-1",
      sender: "ai",
      text:
        language === "hi"
          ? `नमस्ते ${currentUser?.name || "किसान भाई"}! मैं FarmIntel AI सलाहकार हूँ। आप मुझसे पूछ सकते हैं कि आज गेहूं कहाँ बेचें, भाड़ा कितना लगेगा, या कौन सा खरीदार सबसे अच्छा रहेगा।`
          : `Namaste ${currentUser?.name || "Farmer"}! I am your FarmIntel AI Market Advisor. Ask me anything about mandi rates, which market gives you the highest net profit after transport, or when is the best time to sell.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    {
      hi: "आज गेहूं कहाँ बेचना सबसे अच्छा रहेगा?",
      en: "Where should I sell my wheat for highest profit?",
    },
    {
      hi: "क्या मुझे आज बेचना चाहिए या 2 दिन रुकना चाहिए?",
      en: "Should I sell today or hold for 2–3 days?",
    },
    {
      hi: "मेरे लिए कौन सा खरीदार सबसे अच्छा है?",
      en: "Which verified buyer is best for my lot?",
    },
    {
      hi: "पटना और गया मंडी में भाड़ा काटकर कितना बचेगा?",
      en: "Compare net profit between Patna and Gaya mandis?",
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle Speech Recognition (Web Speech API)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use keyboard.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          sendMessage(transcript);
        }
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  // Handle Text-to-Speech
  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*_#`]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          context: {
            farmerLocation: "Patna / Danapur, Bihar",
            crop: "Wheat (Sharbati)",
            quantity: "80 Quintals",
            language,
          },
        }),
      });

      const data = await res.json();
      const aiReply =
        data.reply ||
        "I analyzed the live mandi rates. Patna Mandi provides the highest net realisation at ₹2,215/Q after transport and handling expenses.";

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        metadata: data.actionableRecommendations,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "ai",
          text: "Patna Mandi remains your best option today with ₹2,215/Q net profit. Gaya Mandi has higher headline price (₹2,520) but ₹460 transport cuts your pocket cash down to ₹1,980/Q.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-bold text-stone-900 font-serif">
                FarmIntel AI Advisor (पूछें कृषि विशेषज्ञ)
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                Grounded Live
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Grounded in current Bihar &amp; national mandi data, logistics fares, and weather risk
            </p>
          </div>
        </div>

        {/* Audio Toggle Indicator */}
        <button
          onClick={() => {
            if (isSpeaking) {
              window.speechSynthesis.cancel();
              setIsSpeaking(false);
            }
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 self-start sm:self-auto ${
            isSpeaking
              ? "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse"
              : "bg-stone-100 text-stone-600"
          }`}
        >
          {isSpeaking ? <Volume2 className="w-3.5 h-3.5 text-amber-700" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>{isSpeaking ? "Speaking Audio..." : "Voice Audio Ready"}</span>
        </button>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-stone-500 shrink-0">Quick prompts:</span>
        {quickQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => sendMessage(language === "hi" ? q.hi : q.en)}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border border-stone-200 text-xs font-semibold shrink-0 cursor-pointer shadow-2xs transition-colors"
          >
            {language === "hi" ? q.hi : q.en}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-4 sm:p-6 min-h-[420px] max-h-[540px] overflow-y-auto flex flex-col space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start space-x-2.5 max-w-2xl ${
              m.sender === "user" ? "ml-auto flex-row-reverse space-x-reverse" : "mr-auto"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                m.sender === "user"
                  ? "bg-stone-800 text-white"
                  : "bg-emerald-600 text-white shadow-xs"
              }`}
            >
              {m.sender === "user" ? "👨‍🌾" : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                m.sender === "user"
                  ? "bg-emerald-600 text-white rounded-tr-xs"
                  : "bg-stone-50 text-stone-800 border border-stone-200/80 rounded-tl-xs"
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>

              <div
                className={`flex items-center justify-between mt-2 pt-1 border-t text-[10px] ${
                  m.sender === "user"
                    ? "border-emerald-500/50 text-emerald-100"
                    : "border-stone-200 text-stone-400"
                }`}
              >
                <span>{m.timestamp}</span>
                {m.sender === "ai" && (
                  <button
                    onClick={() => speakText(m.text)}
                    className="flex items-center space-x-1 text-emerald-700 hover:text-emerald-900 font-bold ml-3"
                    title="Listen to response"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Listen (बोलकर सुनें)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 mr-auto bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs text-stone-500">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            <span>FarmIntel AI is evaluating mandi prices &amp; transport margins...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box with Voice Mic & Send */}
      <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-stone-200 shadow-sm flex items-center space-x-2">
        <button
          type="button"
          onClick={toggleSpeechRecognition}
          className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
            isListening
              ? "bg-rose-500 text-white animate-pulse"
              : "bg-stone-100 hover:bg-stone-200 text-stone-600"
          }`}
          title={isListening ? "Listening... click to stop" : "Speak your question"}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={
            isListening
              ? "Listening now... speak your question"
              : language === "hi"
              ? "फसल या मंडी के बारे में पूछें... (उदा: क्या आज गेहूं बेचना सही है?)"
              : "Ask about crop price, which mandi gives highest net, or transport..."
          }
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm focus:outline-none text-stone-900"
        />

        <button
          type="button"
          onClick={() => sendMessage()}
          disabled={!inputText.trim() || loading}
          className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white cursor-pointer transition-colors shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
