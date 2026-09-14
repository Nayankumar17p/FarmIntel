// src/components/farmer/ChatModal.tsx
import React, { useState, useEffect, useRef } from "react";
import { Send, X, ShieldCheck, CheckCircle2, MessageSquare, Phone } from "lucide-react";
import { ChatMessage, User } from "../../types";

interface ChatModalProps {
  currentUser: User | null;
  targetBuyerId: string;
  targetBuyerName: string;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  currentUser,
  targetBuyerId,
  targetBuyerName,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchChat = () => {
    fetch(`/api/chat/farmer-1/${targetBuyerId}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setMessages(data);
      })
      .catch((e) => console.error("Failed to fetch chat:", e));
  };

  useEffect(() => {
    fetchChat();
  }, [targetBuyerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    fetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId: currentUser?.id || "farmer-1",
        senderName: currentUser?.name || "Ramesh Kumar",
        senderRole: currentUser?.role || "farmer",
        receiverId: targetBuyerId,
        text: inputText,
      }),
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((newMsg) => {
        if (newMsg && newMsg.id) {
          setMessages((prev) => [...prev, newMsg]);
        }
        setInputText("");
      })
      .catch((e) => console.error("Failed to send message:", e));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full h-[560px] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              🏭
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm font-bold text-white">{targetBuyerName}</h3>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-[11px] text-stone-400">Direct Procurement Negotiation Channel</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50">
          {messages.map((m) => {
            const isMe = m.senderId === (currentUser?.id || "farmer-1");
            return (
              <div
                key={m.id}
                className={`flex flex-col max-w-[80%] ${
                  isMe ? "ml-auto items-end" : "mr-auto items-start"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? "bg-emerald-600 text-white rounded-tr-xs"
                      : "bg-white text-stone-800 border border-stone-200/80 rounded-tl-xs shadow-2xs"
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <span className="text-[10px] text-stone-400 mt-0.5 px-1">
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type message, negotiate payment terms or pickup date..."
            className="flex-1 text-xs px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
