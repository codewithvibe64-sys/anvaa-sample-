import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Sparkles, LogOut, MessageSquare, Bell, Volume2, 
  AlertTriangle, RefreshCw, FileText, Image, Film, Compass, Link2
} from 'lucide-react';
import { Designer, ChatThread, ChatMessage } from './types';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || '';

// Web Audio API Dual-Tone Chime Synthesizer
const playBellChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Play primary clear note (A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    gain1.gain.setValueAtTime(0.12, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 1.2);
    
    // Play harmonizing high note (E6) with a micro delay for premium ring
    setTimeout(() => {
      if (ctx.state === 'closed') return;
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.51, ctx.currentTime);
      gain2.gain.setValueAtTime(0.09, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.9);
    }, 110);
  } catch (e) {
    console.warn("Chime playback was blocked by browser autoplay policy.", e);
  }
};

// Rich Media Link Parser Helper
const renderMessageContent = (content: string) => {
  // Regex to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  
  if (!urlRegex.test(content)) {
    return <p className="font-light whitespace-pre-line text-sm">{content}</p>;
  }

  // Split content by URLs
  const parts = content.split(urlRegex);
  return (
    <div className="space-y-3">
      <p className="font-light whitespace-pre-line text-sm">
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
                <Link2 size={12} className="inline" />
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
            <div key={index} className="mt-2 rounded-xl overflow-hidden border border-white/10 max-w-sm shadow-md">
              <img src={url} alt="Shared asset preview" className="w-full h-48 object-cover hover:scale-102 transition-transform duration-300" />
            </div>
          );
        } else if (isVideo) {
          return (
            <div key={index} className="mt-2 rounded-xl overflow-hidden border border-white/10 max-w-sm shadow-md bg-black">
              <video src={url} controls className="w-full max-h-56 object-contain" />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default function DesignerApp() {
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [currentDesigner, setCurrentDesigner] = useState<Designer | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Registration States
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerSpecialty, setRegisterSpecialty] = useState('');
  const [registerCity, setRegisterCity] = useState('');

  // Workspace View Toggle State
  const [activeView, setActiveView] = useState<'home' | 'chats' | 'profile'>('home');

  // Profile Editor Form States
  const [profileName, setProfileName] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [profileSpecialty, setProfileSpecialty] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [profileCover, setProfileCover] = useState('');
  const [profileFee, setProfileFee] = useState(3000);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [portfolio, setPortfolio] = useState<string[]>([]);
  
  // Inputs helpers
  const [newAchievement, setNewAchievement] = useState('');
  const [newPortfolioUrl, setNewPortfolioUrl] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Sync editing fields when designer profile is loaded
  useEffect(() => {
    if (currentDesigner) {
      setProfileName(currentDesigner.name || '');
      setProfileCity(currentDesigner.city || '');
      setProfileSpecialty(currentDesigner.specialty || '');
      setProfileBio(currentDesigner.bio || '');
      setProfileAvatar(currentDesigner.avatar || '');
      setProfileCover(currentDesigner.coverImage || '');
      setProfileFee(currentDesigner.consultationFee || 3000);
      setAchievements(currentDesigner.achievements || []);
      setPortfolio(currentDesigner.portfolio || []);
    }
  }, [currentDesigner]);
  
  // App State
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string>('');
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);
  
  // Notification States
  const [bellRinging, setBellRinging] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const lastMessageCounts = useRef<{ [threadId: string]: number }>({});
  
  // Refs
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<any>(null);
  const prevMsgCountRef = useRef(0);
  const prevThreadIdRef = useRef('');

  // Load Designers
  useEffect(() => {
    const loadDesigners = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/designers`);
        if (res.ok) {
          const data = await res.json();
          setDesigners(data);
        }
      } catch (e) {
        console.error("Failed to load designers", e);
        setOffline(true);
      }
    };
    loadDesigners();

    // Check localStorage session
    const saved = localStorage.getItem('anvaa_designer');
    if (saved) {
      setCurrentDesigner(JSON.parse(saved));
    }
  }, []);

  // Poll Threads for logged-in Designer
  const fetchDesignerThreads = async (silent = false) => {
    if (!currentDesigner) return;
    if (!silent) setLoading(true);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/chats/designer/${currentDesigner.id}?cb=${Date.now()}`);
      if (res.ok) {
        const data: ChatThread[] = await res.json();
        setThreads(data);
        setOffline(false);
        
        // Detect new client messages for alerts
        let hasNewInbound = false;
        data.forEach(thread => {
          const prevCount = lastMessageCounts.current[thread.id] || 0;
          const currentCount = thread.messages.length;
          
          if (currentCount > prevCount) {
            // Check if last message was from customer
            const lastMsg = thread.messages[currentCount - 1];
            if (lastMsg && lastMsg.sender === 'customer' && prevCount > 0) {
              hasNewInbound = true;
            }
            lastMessageCounts.current[thread.id] = currentCount;
          }
        });

        if (hasNewInbound) {
          setBellRinging(true);
          if (soundEnabled) playBellChime();
          setTimeout(() => setBellRinging(false), 1500);
        }

        // Set default selected thread
        if (data.length > 0 && !selectedThreadId) {
          setSelectedThreadId(data[0].id);
        }
      } else {
        setOffline(true);
      }
    } catch (e) {
      console.error("Failed to sync designer channels", e);
      setOffline(true);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Setup/Tear-down polling
  useEffect(() => {
    if (currentDesigner) {
      fetchDesignerThreads();
      
      // Poll every 1 second
      pollIntervalRef.current = setInterval(() => {
        fetchDesignerThreads(true);
      }, 1000);
    } else {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [currentDesigner, selectedThreadId, soundEnabled]);

  const activeThread = threads.find(t => t.id === selectedThreadId);

  // Scroll active chat container to bottom when messages update (Scrolls only when initial loading, user sends a message, or is already at the bottom)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const currentMsgCount = activeThread?.messages.length || 0;
    const isNewThread = prevThreadIdRef.current !== selectedThreadId;
    const isNewMessage = currentMsgCount > prevMsgCountRef.current;

    // Check if the user is already scrolled close to the bottom (within 100px threshold)
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    // Check if the last message was sent by the designer (me)
    const lastMsg = activeThread?.messages[currentMsgCount - 1];
    const sentByMe = lastMsg && lastMsg.sender === 'designer';

    if (isNewThread || (isNewMessage && (isAtBottom || sentByMe))) {
      container.scrollTop = container.scrollHeight;
    }

    // Save current states to refs for the next poll comparison
    prevMsgCountRef.current = currentMsgCount;
    prevThreadIdRef.current = selectedThreadId;
  }, [threads, selectedThreadId, activeThread]);

  // Authentication Flow via Backend Secure Endpoint
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      alert("Please enter both your designer email and access password.");
      return;
    }
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/designer/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const contentType = res.headers.get("content-type");
      let data: any = {};
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (res.ok && data.success) {
        setCurrentDesigner(data.designer);
        localStorage.setItem('anvaa_designer', JSON.stringify(data.designer));
        lastMessageCounts.current = {};
      } else {
        alert(data.error || `Authentication failed (Status ${res.status}). Please restart your server if you just saved code changes.`);
      }
    } catch (err) {
      console.error("Login request failed", err);
      alert("Failed to reach server. Please check your internet connection.");
    }
  };

  // Registration Flow via Backend
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName || !registerEmail || !registerPassword || !registerSpecialty || !registerCity) {
      alert("Please fill in all registration fields.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/designer/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
          specialty: registerSpecialty,
          city: registerCity
        })
      });

      const contentType = res.headers.get("content-type");
      let data: any = {};
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (res.ok && data.success) {
        setCurrentDesigner(data.designer);
        localStorage.setItem('anvaa_designer', JSON.stringify(data.designer));
        lastMessageCounts.current = {};
        // Clear fields
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPassword('');
        setRegisterSpecialty('');
        setRegisterCity('');
        setIsRegistering(false);
      } else {
        alert(data.error || `Registration failed (Status ${res.status}). Please restart your server if you just saved code changes.`);
      }
    } catch (err) {
      console.error("Registration request failed", err);
      alert("Failed to reach server. Please check your internet connection.");
    }
  };

  const handleLogout = () => {
    setCurrentDesigner(null);
    localStorage.removeItem('anvaa_designer');
    setThreads([]);
    setSelectedThreadId('');
  };

  // Profile Save Flow
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDesigner) return;

    setSavingProfile(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/designers/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentDesigner.id,
          name: profileName,
          city: profileCity,
          specialty: profileSpecialty,
          bio: profileBio,
          avatar: profileAvatar,
          coverImage: profileCover,
          achievements: achievements,
          portfolio: portfolio,
          consultationFee: profileFee
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentDesigner(data.designer);
        localStorage.setItem('anvaa_designer', JSON.stringify(data.designer));
        alert("Atelier Studio profile successfully updated in the database!");
      } else {
        alert(data.error || "Failed to save profile updates.");
      }
    } catch (err) {
      console.error("Save profile request failed", err);
      alert("Failed to reach server. Please check your network connection.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Send Message Logic
  const handleSendMessage = async (mediaLink?: string) => {
    const textToSend = mediaLink || inputText;
    if (!currentDesigner || !activeThread) return;
    if (!textToSend.trim()) return;

    setSending(true);
    if (!mediaLink) setInputText('');

    try {
      const payload = {
        customerId: activeThread.customerId,
        customerName: activeThread.customerName,
        designerId: currentDesigner.id,
        designerName: currentDesigner.name,
        content: textToSend,
        sender: 'designer'
      };

      const res = await fetch(`${API_BASE_URL}/api/chats/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        // Fast UI sync
        fetchDesignerThreads(true);
      }
    } catch (e) {
      console.error("Failed to post designer reply", e);
      setOffline(true);
    } finally {
      setSending(false);
    }
  };

  // Quick media suggestions for designers
  const mediaQuickPicks = [
    { label: "Fabric Details", url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600" },
    { label: "Design Blueprint", url: "https://images.unsplash.com/photo-1548624149-f7b3e6432b42?q=80&w=600" },
    { label: "Sizing Guide Video", url: "https://www.w3schools.com/html/mov_bbb.mp4" }
  ];

  // 1. RENDER LOGIN SCREEN (Secret Designer Login with distinct dark professional aesthetic)
  if (!currentDesigner) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans p-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(183,110,121,0.15),rgba(255,255,255,0))] z-0"></div>
        
        <div className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative z-10 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[9px] tracking-[0.4em] uppercase text-[#D4AF37] font-black font-mono">
              ANVAA ATELIER INTERNAL SUITE
            </span>
            <h1 className="text-3xl font-serif italic text-white font-medium">Designer Workspace</h1>
            <p className="text-xs text-slate-400 font-light">
              Secure client messaging, lookup registers, and live Gemini measurements coordination.
            </p>
          </div>

          {isRegistering ? (
            // Registration Form
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Full Name</label>
                <input 
                  type="text"
                  placeholder="Designer Name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded-xl p-2.5 text-xs text-slate-200 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Email Address</label>
                <input 
                  type="email"
                  placeholder="designer@anvaa.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded-xl p-2.5 text-xs text-slate-200 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Secure Password</label>
                <input 
                  type="password"
                  placeholder="••••••••"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded-xl p-2.5 text-xs text-slate-200 outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Specialty</label>
                  <input 
                    type="text"
                    placeholder="e.g. Silk Weaving"
                    value={registerSpecialty}
                    onChange={(e) => setRegisterSpecialty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded-xl p-2.5 text-xs text-slate-200 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">City</label>
                  <input 
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={registerCity}
                    onChange={(e) => setRegisterCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded-xl p-2.5 text-xs text-slate-200 outline-none transition-colors"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-[#BF953F] to-[#AA771C] hover:brightness-110 text-slate-950 text-xs font-black uppercase tracking-widest p-3.5 rounded-xl shadow-lg cursor-pointer transition-all duration-300 mt-2"
              >
                Register & Enter Workspace
              </button>

              <div className="text-center pt-2">
                <button 
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="text-[#D4AF37] hover:underline text-[11px] font-light"
                >
                  Already registered? Sign In
                </button>
              </div>
            </form>
          ) : (
            // Login Form
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Atelier Email Address</label>
                <input 
                  type="email"
                  placeholder="designer@anvaa.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded-xl p-3 text-sm text-slate-200 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Access Password</label>
                <input 
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded-xl p-3 text-sm text-slate-200 outline-none transition-colors"
                />
                <span className="text-[9px] text-slate-500 font-mono italic block pt-1">Enter your registered email and secure key.</span>
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-[#BF953F] to-[#AA771C] hover:brightness-110 text-slate-950 text-xs font-black uppercase tracking-widest p-4 rounded-xl shadow-lg cursor-pointer transition-all duration-300 mt-2"
              >
                Sign In to Atelier Workspace
              </button>

              <div className="text-center pt-2">
                <button 
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="text-[#D4AF37] hover:underline text-[11px] font-light"
                >
                  New Atelier Designer? Register here
                </button>
              </div>
            </form>
          )}

          <div className="text-center pt-2">
            <a href="/" className="text-slate-500 hover:text-slate-300 text-[10px] font-mono tracking-widest uppercase transition-colors">
              &larr; Exit to Customer Site
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 2. RENDER WORKSPACE DASHBOARD
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans relative">
      
      {/* Offline / Reconnect Banner */}
      {offline && (
        <div className="bg-amber-500/10 border-b border-amber-500/25 text-amber-300 text-xs p-3 text-center flex items-center justify-center gap-2 relative z-50 animate-pulse font-mono">
          <AlertTriangle size={14} />
          <span>Atelier Offline Mode — Attempting to re-establish connection...</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 z-10 select-none">
        <div className="flex items-center gap-3">
          <img src={currentDesigner.avatar} alt={currentDesigner.name} className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/50" />
          <div>
            <h2 className="font-serif italic text-base font-bold text-white flex items-center gap-2">
              <span>{currentDesigner.name}</span>
              <span className="text-[9px] bg-emerald-950 border border-emerald-800 text-emerald-300 px-2 rounded-full uppercase font-mono">Active</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-light">{currentDesigner.specialty} • {currentDesigner.city} Studio</p>
          </div>
        </div>

        {/* Workspace View Switcher Tabs */}
        <div className="flex bg-slate-950 border border-slate-800/80 rounded-xl p-1 shadow-inner select-none">
          <button
            onClick={() => setActiveView('home')}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
              activeView === 'home'
                ? 'bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Atelier Home
          </button>
          <button
            onClick={() => setActiveView('chats')}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
              activeView === 'chats'
                ? 'bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Client Chats
          </button>
          <button
            onClick={() => setActiveView('profile')}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
              activeView === 'profile'
                ? 'bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Studio Profile
          </button>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-4">
          {/* Sound toggle */}
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              soundEnabled 
                ? 'bg-slate-800 border-slate-700 text-[#D4AF37] hover:text-[#AA771C]' 
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
            title={soundEnabled ? "Audio Alerts Enabled" : "Audio Alerts Silenced"}
          >
            <Volume2 size={16} />
          </button>

          {/* Real-time Bell */}
          <div className="relative">
            <button 
              onClick={() => {
                // Manually trigger chime testing
                playBellChime();
                setBellRinging(true);
                setTimeout(() => setBellRinging(false), 1200);
              }}
              className={`p-2 rounded-full border cursor-pointer transition-all ${
                bellRinging 
                  ? 'bg-[#4A1525] border-[#D4AF37] text-[#D4AF37] animate-shake' 
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
              title="Alert Ring Trigger"
            >
              <Bell size={16} />
            </button>
            {threads.some(t => t.messages[t.messages.length - 1]?.sender === 'customer') && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-rose-500 border border-slate-900 animate-ping"></span>
            )}
          </div>

          <button 
            onClick={handleLogout}
            className="bg-slate-800 hover:bg-[#4A1525] hover:text-rose-400 border border-slate-700 hover:border-rose-900 p-2.5 rounded-xl text-slate-300 cursor-pointer transition-all flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      {activeView === 'home' ? (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 h-auto overflow-y-auto space-y-6">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-[#BF953F]/10 via-[#AA771C]/5 to-transparent border border-[#D4AF37]/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden shadow-xl select-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -z-10"></div>
            <div className="space-y-2 max-w-xl">
              <span className="text-[9px] tracking-[0.4em] uppercase text-[#D4AF37] font-black font-mono">ANVAA COUTURE MAISON</span>
              <h2 className="text-3xl font-serif italic text-white font-medium">Welcome back to your Atelier, {currentDesigner.name}</h2>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Here is your design studio dashboard. Review active client communications, coordinate couture specifications, manage milestones, and display your premium lookbook creations.
              </p>
            </div>
          </div>

          {/* Metrics snapshots */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl shadow-md select-none">
              <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">Active inquiries</span>
              <h3 className="text-2xl font-bold font-mono text-white">{threads.length}</h3>
              <p className="text-[10px] text-slate-500 font-light mt-1">Live customer channels</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl shadow-md select-none">
              <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">Studio Rating</span>
              <h3 className="text-2xl font-bold font-mono text-white">{currentDesigner.rating?.toFixed(1) || "5.0"} ★</h3>
              <p className="text-[10px] text-slate-500 font-light mt-1">From {currentDesigner.reviewsCount || 0} reviews</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl shadow-md select-none">
              <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">Consultation Rate</span>
              <h3 className="text-2xl font-bold font-mono text-white">₹{currentDesigner.consultationFee?.toLocaleString() || "3,000"}</h3>
              <p className="text-[10px] text-slate-500 font-light mt-1">Per bespoke session</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl shadow-md select-none">
              <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">Lookbook Assets</span>
              <h3 className="text-2xl font-bold font-mono text-white">{portfolio.length}</h3>
              <p className="text-[10px] text-slate-500 font-light mt-1">Uploaded portfolio works</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recent Client feeds list */}
            <div className="lg:col-span-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl flex flex-col h-[320px]">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800 select-none">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Recent client inquiries</span>
                <span className="text-[10px] text-slate-400 font-mono">Live Sync</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {threads.slice(0, 3).map((t) => {
                  const lastMsg = t.messages[t.messages.length - 1];
                  return (
                    <div key={t.id} className="flex justify-between items-center bg-slate-950/40 border border-slate-800/50 p-3 rounded-xl">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-serif italic text-sm font-bold text-white truncate">{t.customerName}</h4>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{lastMsg ? lastMsg.content : "Inquiry thread opened"}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedThreadId(t.id);
                          setActiveView('chats');
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-[10px] px-3.5 py-1.5 rounded-lg border border-slate-700 hover:border-[#D4AF37] text-[#D4AF37] hover:text-white transition-all cursor-pointer font-bold uppercase tracking-wider ml-3"
                      >
                        Reply
                      </button>
                    </div>
                  );
                })}
                {threads.length === 0 && (
                  <div className="text-center py-12 text-slate-500 italic text-xs select-none">
                    No client communication active.
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Appointments schedule */}
            <div className="lg:col-span-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl flex flex-col h-[320px] select-none">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Weekly studio appointments</span>
                <span className="text-[10px] text-[#B76E79] font-mono font-bold uppercase tracking-wider bg-rose-950/30 px-2 rounded-full">Schedule</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-800/50 p-3 rounded-xl">
                  <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-center min-w-[50px]">
                    <span className="block text-[10px] text-slate-400 uppercase font-mono font-bold">MON</span>
                    <span className="block text-sm font-bold text-white">13</span>
                  </div>
                  <div>
                    <h4 className="font-serif italic text-xs font-bold text-white">Sanjay Malhotra • Fitting Session</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">04:00 PM • Velvet Couture fitting and details check</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-800/50 p-3 rounded-xl">
                  <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-center min-w-[50px]">
                    <span className="block text-[10px] text-slate-400 uppercase font-mono font-bold">WED</span>
                    <span className="block text-sm font-bold text-white">15</span>
                  </div>
                  <div>
                    <h4 className="font-serif italic text-xs font-bold text-white">Priya Sharma • Design Consultation</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">11:30 AM • Bridal lehenga fabric inspection</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-800/50 p-3 rounded-xl">
                  <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-center min-w-[50px]">
                    <span className="block text-[10px] text-slate-400 uppercase font-mono font-bold">FRI</span>
                    <span className="block text-sm font-bold text-white">17</span>
                  </div>
                  <div>
                    <h4 className="font-serif italic text-xs font-bold text-white">Kunal Sen • Material Dispatch</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">02:00 PM • Pure Banarasi silk roll delivery check</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Studio Actions shortcuts card */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl select-none">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] mb-4 pb-2 border-b border-slate-800/50">Studio shortcuts & diagnostics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => setActiveView('chats')}
                className="bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-[#D4AF37] p-4 rounded-xl text-left transition-all cursor-pointer group"
              >
                <h5 className="text-xs font-bold text-white group-hover:text-[#D4AF37]">Open Client Inbox &rarr;</h5>
                <p className="text-[10px] text-slate-400 font-light mt-1">Read and reply to inquiries</p>
              </button>
              <button 
                onClick={() => setActiveView('profile')}
                className="bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-[#D4AF37] p-4 rounded-xl text-left transition-all cursor-pointer group"
              >
                <h5 className="text-xs font-bold text-white group-hover:text-[#D4AF37]">Manage Lookbook &rarr;</h5>
                <p className="text-[10px] text-slate-400 font-light mt-1">Edit profile achievements & photos</p>
              </button>
              <a 
                href="/" 
                className="bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-[#D4AF37] p-4 rounded-xl text-left transition-all cursor-pointer group block"
              >
                <h5 className="text-xs font-bold text-white group-hover:text-[#D4AF37]">View Storefront &rarr;</h5>
                <p className="text-[10px] text-slate-400 font-light mt-1">Browse products and designers</p>
              </a>
              <button 
                onClick={() => fetchDesignerThreads(false)}
                className="bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-[#D4AF37] p-4 rounded-xl text-left transition-all cursor-pointer group"
              >
                <h5 className="text-xs font-bold text-white group-hover:text-[#D4AF37]">Diagnose Network &rarr;</h5>
                <p className="text-[10px] text-slate-400 font-light mt-1">Test latency and alert ringers</p>
              </button>
            </div>
          </div>
        </main>
      ) : activeView === 'chats' ? (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[650px] overflow-hidden">
          
          {/* Left Columns: Client Threads */}
          <section className="lg:col-span-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex flex-col overflow-hidden h-[300px] lg:h-[600px]">
            <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex justify-between items-center select-none">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Active Client Channels</span>
              <button 
                onClick={() => fetchDesignerThreads(false)}
                className="text-[10px] text-slate-400 hover:text-white transition-all font-mono flex items-center gap-1"
              >
                <RefreshCw size={10} className={loading ? "animate-spin" : ""} /> Sync
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {threads.map((t) => {
                const lastMsg = t.messages[t.messages.length - 1];
                const isUnreadInbound = lastMsg && lastMsg.sender === 'customer';
                
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedThreadId(t.id)}
                    className={`w-full text-left p-3.5 rounded-xl border cursor-pointer transition-all duration-300 flex gap-3 relative ${
                      selectedThreadId === t.id 
                        ? 'bg-slate-900 border-[#D4AF37] shadow-lg' 
                        : 'border-transparent hover:bg-slate-900/30'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-serif border border-slate-700">
                      {t.customerName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="font-serif italic text-sm font-bold text-white truncate">{t.customerName}</h4>
                        {isUnreadInbound && (
                          <span className="bg-rose-500 text-[8px] text-white px-2 py-0.5 rounded-full font-mono font-black uppercase tracking-wider animate-pulse">New Message</span>
                        )}
                      </div>
                      <p className={`text-xs truncate mt-1 ${isUnreadInbound ? 'text-slate-200 font-semibold' : 'text-slate-400 font-light'}`}>
                        {lastMsg ? lastMsg.content : "Inquiry thread opened"}
                      </p>
                    </div>
                  </button>
                );
              })}

              {threads.length === 0 && (
                <div className="text-center py-16 text-slate-500 space-y-2 select-none">
                  <MessageSquare className="mx-auto text-slate-700" size={24} />
                  <p className="text-xs italic">No active customer inquiries registered in your feed.</p>
                </div>
              )}
            </div>
          </section>

          {/* Right Columns: Active Chat conversation */}
          <section className="lg:col-span-8 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex flex-col overflow-hidden h-auto lg:h-[600px]">
            
            {activeThread ? (
              <div className="flex-1 flex flex-col justify-between h-full bg-slate-900/20">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/40 select-none">
                  <div>
                    <h4 className="font-serif italic text-base font-bold text-white">Client: {activeThread.customerName}</h4>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-0.5">Thread ID: {activeThread.id}</p>
                  </div>
                </div>

                {/* Message Feed Area */}
                <div 
                  ref={messagesContainerRef}
                  className="h-[350px] lg:h-[380px] overflow-y-auto p-6 space-y-4"
                >
                  {activeThread.messages.map((msg, i) => {
                    const isDesigner = msg.sender === 'designer';
                    return (
                      <div key={msg.id || i} className={`flex ${isDesigner ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md rounded-2xl p-4 text-xs leading-relaxed transition-all shadow-md ${
                          isDesigner 
                            ? 'bg-gradient-to-r from-[#BF953F]/15 to-[#AA771C]/15 border border-[#D4AF37]/20 text-slate-100 rounded-tr-none' 
                            : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none font-serif italic'
                        }`}>
                          {renderMessageContent(msg.content)}
                          <span className="block text-[8px] mt-1 text-right text-slate-500 font-mono">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {activeThread.messages.length === 0 && (
                    <p className="text-center py-10 text-slate-600 text-xs italic">Start your communication with the client.</p>
                  )}
                </div>

                {/* Quick Media Send Suggestions */}
                <div className="px-6 py-2 border-t border-slate-800 bg-slate-950/20 flex flex-wrap gap-2 items-center select-none">
                  <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold font-mono mr-1">Share Asset:</span>
                  {mediaQuickPicks.map((pick, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(pick.url)}
                      disabled={sending}
                      className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-[#D4AF37] text-[10px] px-3 py-1 rounded-full text-slate-300 hover:text-white transition-all cursor-pointer font-light inline-flex items-center gap-1"
                    >
                      {idx === 0 && <Image size={10} />}
                      {idx === 1 && <FileText size={10} />}
                      {idx === 2 && <Film size={10} />}
                      {pick.label}
                    </button>
                  ))}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-800 flex gap-2">
                  <input 
                    type="text"
                    placeholder={`Reply to ${activeThread.customerName}... (paste links for images/videos)`}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMessage();
                    }}
                    disabled={sending}
                    className="flex-1 bg-slate-950 border border-slate-800 p-3 text-xs outline-none focus:border-[#D4AF37] text-slate-200 rounded-xl disabled:opacity-50 font-light"
                  />
                  <button 
                    onClick={() => handleSendMessage()}
                    disabled={sending || !inputText.trim()}
                    className="bg-gradient-to-r from-[#BF953F] to-[#AA771C] hover:brightness-110 p-3.5 rounded-xl disabled:opacity-30 transition-all cursor-pointer shadow-md"
                  >
                    <Send size={15} className="text-slate-950" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-12 text-slate-500 select-none">
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-2 text-[#D4AF37]">
                    <Compass size={22} className="animate-spin-slow" />
                  </div>
                  <h4 className="font-serif italic text-lg text-slate-300">No Selected Workspace</h4>
                  <p className="text-xs text-slate-400 font-light max-w-xs mx-auto">Pick a customer inquiry channel on the left sidebar to coordinate couture details.</p>
                </div>
              </div>
            )}

          </section>

        </main>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 h-auto overflow-y-auto">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-8">
            <div className="border-b border-slate-800 pb-4 flex justify-between items-center select-none">
              <div>
                <h3 className="font-serif italic text-xl font-bold text-white">Studio Profile Settings</h3>
                <p className="text-xs text-slate-400 font-light mt-0.5">Customize your personal brand, specialties, city workspace, achievements, and showcase portfolio.</p>
              </div>
              <button 
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="bg-gradient-to-r from-[#BF953F] to-[#AA771C] hover:brightness-110 text-slate-950 text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl shadow-md transition-all duration-300 inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 font-bold"
              >
                <RefreshCw size={12} className={savingProfile ? "animate-spin" : ""} />
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Basic Information */}
              <div className="lg:col-span-6 space-y-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37] select-none border-b border-slate-800/50 pb-2">Basic Credentials</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Designer Name</label>
                    <input 
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded-xl p-3 text-xs text-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">City Workspace</label>
                    <input 
                      type="text"
                      value={profileCity}
                      onChange={(e) => setProfileCity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded-xl p-3 text-xs text-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Design Specialty</label>
                    <input 
                      type="text"
                      value={profileSpecialty}
                      onChange={(e) => setProfileSpecialty(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded-xl p-3 text-xs text-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Consultation Fee (INR)</label>
                    <input 
                      type="number"
                      value={profileFee}
                      onChange={(e) => setProfileFee(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded-xl p-3 text-xs text-slate-200 outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Personal Avatar Image Link</label>
                  <input 
                    type="text"
                    value={profileAvatar}
                    onChange={(e) => setProfileAvatar(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded-xl p-3 text-xs text-slate-200 outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Studio Cover Banner Image Link</label>
                  <input 
                    type="text"
                    value={profileCover}
                    onChange={(e) => setProfileCover(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded-xl p-3 text-xs text-slate-200 outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Biography / Creative Philosophy</label>
                  <textarea 
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded-xl p-3 text-xs text-slate-200 outline-none resize-none font-light leading-relaxed"
                  />
                </div>
              </div>

              {/* Right Column: Achievements & Portfolio */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Achievements section */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37] select-none border-b border-slate-800/50 pb-2">Atelier Achievements</h4>
                  
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Add a new milestone/award..."
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded-xl p-3 text-xs text-slate-200 outline-none"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (newAchievement.trim()) {
                          setAchievements([...achievements, newAchievement.trim()]);
                          setNewAchievement('');
                        }
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-xs px-4 py-2.5 rounded-xl border border-slate-700 text-white font-bold uppercase tracking-widest cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  <ul className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                    {achievements.map((ach, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-slate-950/60 border border-slate-800/40 p-3 rounded-xl text-xs font-light text-slate-300">
                        <span>{ach}</span>
                        <button 
                          type="button"
                          onClick={() => setAchievements(achievements.filter((_, i) => i !== idx))}
                          className="text-rose-500 hover:text-rose-400 cursor-pointer font-bold px-1"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                    {achievements.length === 0 && (
                      <p className="text-slate-600 text-xs italic select-none">No achievements added yet.</p>
                    )}
                  </ul>
                </div>

                {/* Portfolio section */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37] select-none border-b border-slate-800/50 pb-2">Showcase Portfolio</h4>
                  
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Paste sketch/lookbook photo URL..."
                      value={newPortfolioUrl}
                      onChange={(e) => setNewPortfolioUrl(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded-xl p-3 text-xs text-slate-200 outline-none font-mono"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (newPortfolioUrl.trim()) {
                          setPortfolio([...portfolio, newPortfolioUrl.trim()]);
                          setNewPortfolioUrl('');
                        }
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-xs px-4 py-2.5 rounded-xl border border-slate-700 text-white font-bold uppercase tracking-widest cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 max-h-[220px] overflow-y-auto pr-1">
                    {portfolio.map((imgUrl, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden aspect-video border border-slate-800 group shadow-md">
                        <img src={imgUrl} alt="Portfolio item" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <button 
                          type="button"
                          onClick={() => setPortfolio(portfolio.filter((_, i) => i !== idx))}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 font-bold transition-opacity cursor-pointer text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    {portfolio.length === 0 && (
                      <div className="col-span-3 text-slate-600 text-xs italic select-none py-4">No portfolio images added yet. Add image URLs above to populate your lookbook.</div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="bg-slate-900/60 border-t border-slate-900/80 px-6 py-3 text-center select-none text-[10px] text-slate-600 font-mono tracking-widest uppercase">
        ANVAA Couture atelier suite © 2026. all rights reserved.
      </footer>

      {/* Bell Ring Ring CSS Styling injects */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          15%, 45%, 75% { transform: rotate(-15deg); }
          30%, 60%, 90% { transform: rotate(15deg); }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
