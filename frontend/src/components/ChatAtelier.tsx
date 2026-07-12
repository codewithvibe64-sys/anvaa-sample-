/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Sparkles, User, RefreshCw, Volume2, ShieldCheck, 
  CornerDownRight, Check, MessageSquare, Link2
} from 'lucide-react';
import { Designer, ChatThread, ChatMessage } from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || '';

// Rich Media Link Parser Helper
const renderMessageContent = (content: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  
  if (!urlRegex.test(content)) {
    return <p className="font-medium whitespace-pre-line text-xs">{content}</p>;
  }

  const parts = content.split(urlRegex);
  return (
    <div className="space-y-3">
      <p className="font-medium whitespace-pre-line text-xs">
        {parts.map((part, index) => {
          if (part.match(urlRegex)) {
            return (
              <a 
                key={index} 
                href={part} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#D4AF37] hover:underline font-mono inline-flex items-center gap-1 break-all"
              >
                <Link2 size={10} className="inline" />
                {part}
              </a>
            );
          }
          return part;
        })}
      </p>

      {/* Render previews for found media */}
      {content.match(urlRegex)?.map((url, index) => {
        const cleanUrl = url.split('?')[0].toLowerCase();
        const isImage = cleanUrl.match(/\.(jpeg|jpg|gif|png|webp)/) || url.includes('unsplash.com/photo-');
        const isVideo = cleanUrl.match(/\.(mp4|mov|webm)/);

        if (isImage) {
          return (
            <div key={index} className="mt-2 rounded-xl overflow-hidden border border-black/10 max-w-sm shadow-md">
              <img src={url} alt="Shared asset preview" className="w-full h-48 object-cover" />
            </div>
          );
        } else if (isVideo) {
          return (
            <div key={index} className="mt-2 rounded-xl overflow-hidden border border-black/10 max-w-sm shadow-md bg-black">
              <video src={url} controls className="w-full max-h-56 object-contain" />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

interface ChatAtelierProps {
  designers: Designer[];
  currentUser: any;
  setActiveTab: (tab: string) => void;
}

export default function ChatAtelier({ designers, currentUser, setActiveTab }: ChatAtelierProps) {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedDesignerId, setSelectedDesignerId] = useState<string>('');
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevMsgCountRef = useRef(0);
  const prevThreadIdRef = useRef('');

  const activeDesigner = designers.find(d => d.id === selectedDesignerId) || designers[0];

  // Fetch threads for this user
  const fetchThreads = async (silent = false) => {
    if (!currentUser) return;
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/chats/${currentUser.id}?cb=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setThreads(data);
        if (data.length > 0 && !selectedDesignerId) {
          setSelectedDesignerId(data[0].designerId);
        }
      }
    } catch (e) {
      console.error("Failed to load customer atelier chats", e);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Setup auto-polling for customer messages
  useEffect(() => {
    if (currentUser) {
      if (!selectedDesignerId && designers.length > 0) {
        setSelectedDesignerId(designers[0].id);
      }
      
      fetchThreads();

      // Poll every 1 second to fetch designer replies in real-time
      const interval = setInterval(() => {
        fetchThreads(true);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentUser, selectedDesignerId]);

  const activeThread = threads.find(t => t.designerId === selectedDesignerId);

  // Scroll to bottom helper (Scrolls only when initial loading, user sends a message, or is already at the bottom)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const currentMsgCount = activeThread?.messages.length || 0;
    const isNewThread = prevThreadIdRef.current !== selectedDesignerId;
    const isNewMessage = currentMsgCount > prevMsgCountRef.current;

    // Check if the user is already scrolled close to the bottom (within 100px threshold)
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    // Check if the last message was sent by the customer (me)
    const lastMsg = activeThread?.messages[currentMsgCount - 1];
    const sentByMe = lastMsg && lastMsg.sender === 'customer';

    if (isNewThread || (isNewMessage && (isAtBottom || sentByMe))) {
      container.scrollTop = container.scrollHeight;
    }

    // Save current states to refs for the next poll comparison
    prevMsgCountRef.current = currentMsgCount;
    prevThreadIdRef.current = selectedDesignerId;
  }, [threads, selectedDesignerId, activeThread]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!currentUser) {
      alert("Please login to experience the real-time bespoke designer chat.");
      setActiveTab('auth');
      return;
    }
    if (!textToSend.trim()) return;

    setSending(true);
    if (!customText) setInputText('');

    try {
      const payload = {
        customerId: currentUser.id,
        customerName: currentUser.name,
        designerId: activeDesigner.id,
        designerName: activeDesigner.name,
        content: textToSend,
        sender: 'customer'
      };

      const res = await fetch(`${API_BASE_URL}/api/chats/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        // Fetch updated threads
        const updatedThreadRes = await fetch(`${API_BASE_URL}/api/chats/${currentUser.id}`);
        if (updatedThreadRes.ok) {
          const freshThreads = await updatedThreadRes.json();
          setThreads(freshThreads);
        }
      }
    } catch (err) {
      console.error("Failed to submit client message", err);
    } finally {
      setSending(false);
    }
  };

  // Luxury quick suggestion vectors
  const suggestions = [
    { label: "Wedding Sizing", prompt: `I’m looking to customize the sleeve drapes and body fitting of a wedding Lehenga. Can we arrange custom measurements?` },
    { label: "Fabric Sourcing", prompt: `Which pure silk weaves do you recommend for an outdoor summer sangeet ceremony in Jaipur?` },
    { label: "Crepe Trousers", prompt: `I’m in between sizes S and M for the Ivory Power Crepe Blazer. How structured and tight is the shoulder pad alignment?` },
    { label: "Limited Serials", prompt: `Are there any serial numbers remaining for the Banarasi Gold Thread Heirloom saree? Can I customize the blouse drapes?` }
  ];

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center text-[#4A1525] bg-[#FAF9F6]">
        <div className="w-16 h-16 bg-[#F5E6D3] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#D4AF37]">
          <MessageSquare className="text-[#D4AF37]" size={24} />
        </div>
        <h2 className="text-3xl font-serif italic mb-4">The Atelier Communication Suite</h2>
        <p className="text-xs text-neutral-500 max-w-md mx-auto mb-8 font-light">
          Unlock stateful real-time chat with Elite fashion designers Aditi, Meera, and Pooja. Save sizing records and coordinate wedding lookbooks.
        </p>
        <button
          onClick={() => setActiveTab('auth')}
          className="bg-[#4A1525] text-[#FAF9F6] px-10 py-4 text-xs font-bold uppercase tracking-widest border border-[#4A1525] hover:bg-transparent hover:text-[#4A1525] hover:border-[#4A1525] transition-all cursor-pointer rounded-xl"
        >
          Authenticate & Enter Atelier
        </button>
      </div>
    );
  }

  if (!activeDesigner) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-16 text-[#4A1525] bg-[#FAF9F6] min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw size={24} className="animate-spin mx-auto text-[#D4AF37]" />
          <p className="text-xs uppercase tracking-widest text-[#B76E79] font-mono">Initializing Atelier Channels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-16 text-[#4A1525] bg-[#FAF9F6] min-h-[80vh]">
      
      {/* Title */}
      <div className="border-b border-[#D4AF37]/30 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#B76E79]">ANVAA CONNECT DIRECT</span>
          <h1 className="text-4xl font-serif italic text-[#4A1525]">Bespoke Atelier Chats</h1>
        </div>
        <p className="text-xs text-neutral-500 font-light italic font-serif">
          Stateful conversations powered by actual Gemini model stylist intelligence.
        </p>
      </div>

      {/* Main chat box container */}
      <div className="bg-white border border-[#D4AF37]/25 rounded-2xl lg:overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-auto lg:h-[650px] shadow-sm">
        
        {/* Left Side: Designer Channels */}
        <div className="lg:col-span-4 lg:border-r border-[#D4AF37]/20 flex flex-col bg-[#FAF9F6]/30 border-b lg:border-b-0">
          <div className="p-4 border-b border-neutral-100 bg-white">
            <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Atelier Channels Available</p>
          </div>
          
          <div className="h-[220px] lg:h-[520px] overflow-y-auto p-4 space-y-3">
            {designers.map((d) => {
              const hasThread = threads.find(t => t.designerId === d.id);
              const lastMsg = hasThread?.messages[hasThread.messages.length - 1];
              
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDesignerId(d.id)}
                  className={`cursor-pointer w-full text-left p-3.5 rounded-xl border transition-all duration-300 flex gap-3 relative ${
                    selectedDesignerId === d.id 
                      ? 'bg-white border-[#D4AF37] shadow-sm' 
                      : 'border-transparent hover:bg-neutral-50/50'
                  }`}
                >
                  <img src={d.avatar} alt={d.name} className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/30" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="font-serif italic text-sm font-bold truncate text-[#4A1525]">{d.name}</h4>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
                    </div>
                    <p className="text-[10px] text-[#B76E79] font-semibold truncate uppercase tracking-widest mt-0.5">{d.city} Atelier</p>
                    <p className="text-xs text-neutral-400 truncate mt-1">
                      {lastMsg ? lastMsg.content : d.specialty}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t bg-white flex items-center justify-between">
            <span className="text-[10px] text-neutral-400 font-mono">CLIENT: {currentUser.name}</span>
            <button 
              onClick={() => fetchThreads()}
              className="text-xs text-[#D4AF37] hover:text-[#B76E79] transition-all font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Sync Logs
            </button>
          </div>
        </div>

        {/* Right Side: Active Thread Messages */}
        <div className="lg:col-span-8 flex flex-col bg-white">
          
          {/* Active Header */}
          <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-[#FAF9F6]/40">
            <div className="flex items-center gap-3">
              <img src={activeDesigner.avatar} alt={activeDesigner.name} className="w-11 h-11 rounded-full object-cover border border-[#D4AF37]/40" />
              <div>
                <h4 className="font-serif italic text-sm md:text-base font-bold text-[#4A1525] flex items-center gap-1.5">
                  <span>{activeDesigner.name}</span>
                  <span className="text-[10px] bg-amber-100 border border-amber-300 text-amber-800 px-2 rounded-full uppercase tracking-widest font-black text-center pt-0.5">Atelier Studio</span>
                </h4>
                <p className="text-[11px] text-neutral-500 font-light italic">{activeDesigner.specialty} • {activeDesigner.city}</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div ref={messagesContainerRef} className="h-[400px] lg:h-[450px] overflow-y-auto p-6 space-y-4">
            
            {/* AI Disclaimer / Intro */}
            <div className="bg-[#FAF9F6] border border-[#D4AF37]/25 p-4 rounded-xl text-xs space-y-2 max-w-xl mx-auto text-neutral-600 leading-relaxed font-light mb-6">
              <p className="font-serif italic font-medium text-[#4A1525] flex items-center gap-1.5 justify-center text-center">
                <Sparkles size={13} className="text-[#D4AF37] fill-[#D4AF37]/25" />
                Stateful AI Stylist Integration Enabled
              </p>
              <p className="text-center text-[11px]">
                Welcome to ANVAA's conversational trunk suite. Send any style or fabric inquiries. If the developer's Gemini API key is configured, your designer will respond instantly utilizing live AI. Otherwise, elite standard luxury responses are generated automatically.
              </p>
            </div>

            {/* Chat message bubbles */}
            {activeThread && activeThread.messages.map((msg, i) => {
              const isCust = msg.sender === 'customer';
              return (
                <div key={msg.id || i} className={`flex ${isCust ? 'justify-end animate-luxury-reveal' : 'justify-start'}`}>
                  <div className={`max-w-md rounded-2xl p-4 text-xs leading-relaxed transition-all shadow-sm ${
                    isCust 
                      ? 'bg-[#4A1525] text-[#FAF9F6] rounded-tr-none' 
                      : 'bg-[#FAF9F6] text-[#4A1525] border border-[#D4AF37]/20 rounded-tl-none font-serif italic'
                  }`}>
                    {renderMessageContent(msg.content)}
                    <span className="block text-[8px] mt-1 text-right text-neutral-400 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {!activeThread && (
              <div className="text-center py-12">
                <div className="w-10 h-10 rounded-full bg-[#FAF9F6] flex items-center justify-center mx-auto mb-2 text-[#D4AF37]">
                  <MessageSquare size={18} />
                </div>
                <p className="text-xs text-neutral-400 italic">No historical messages with this designer. Send an inquiry below to begin your communication.</p>
              </div>
            )}

            {sending && (
              <div className="flex justify-start">
                <div className="bg-[#FAF9F6] border border-[#D4AF37]/15 p-4 rounded-xl text-xs flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="text-[11px] text-neutral-400 italic font-mono uppercase tracking-widest">{activeDesigner.name} is writing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Vectors */}
          <div className="px-6 py-2 border-t border-neutral-100 bg-[#FAF9F6]/20 flex flex-wrap gap-2">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s.prompt)}
                disabled={sending}
                className="bg-white hover:bg-[#F5E6D3]/30 border border-neutral-200 hover:border-[#D4AF37] text-[10px] px-3 py-1 rounded-full text-neutral-600 hover:text-[#4A1525] transition-all cursor-pointer font-light"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Send Input Panel */}
          <div className="p-4 border-t border-neutral-100 flex gap-2">
            <input
              type="text"
              placeholder={`Write to ${activeDesigner.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              disabled={sending}
              className="flex-1 bg-[#FAF9F6] border border-neutral-300 p-3 text-xs outline-none focus:border-[#D4AF37] text-neutral-800 disabled:opacity-50 font-light"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={sending || !inputText.trim()}
              className="bg-[#4A1525] text-[#FAF9F6] hover:bg-[#6A162B] p-3.5 rounded-lg disabled:opacity-30 transition-all cursor-pointer"
            >
              <Send size={15} className="text-[#D4AF37]" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}


