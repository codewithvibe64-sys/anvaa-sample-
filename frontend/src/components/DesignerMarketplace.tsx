/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Award, MapPin, Calendar, Clock, Star, MessageSquare, 
  Sparkles, ShieldCheck, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { Designer, Product } from '../types';

interface DesignerMarketplaceProps {
  designers: Designer[];
  products: Product[];
  currentUser: any;
  onBookConsultation: (data: any) => Promise<boolean>;
  onContactDesigner: (d: Designer) => void;
  setActiveTab: (tab: string) => void;
  theme: {
    bg: string;
    text: string;
    accentText: string;
    textMuted: string;
    buttonPrimary: string;
    cardBg: string;
    borderAccent: string;
    borderColor: string;
  };
}

export default function DesignerMarketplace({
  designers,
  products,
  currentUser,
  onBookConsultation,
  onContactDesigner,
  setActiveTab,
  theme
}: DesignerMarketplaceProps) {
  const [selectedDesigner, setSelectedDesigner] = useState<Designer | null>(null);
  
  // Booking Form State
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 12:30 PM');
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (designers.length === 0) {
    return (
      <div className={`text-center py-20 ${theme.bg} ${theme.text}`}>
        <p className={`italic ${theme.textMuted} font-serif`}>No elite designers are currently online. Please check back later.</p>
      </div>
    );
  }

  const activeDesigner = selectedDesigner || designers[0];

  const designerProducts = products.filter(p => p.designerId === activeDesigner?.id);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please login first to confirm your virtual bespoke consultation slot.");
      setActiveTab('auth');
      return;
    }
    if (!date) {
      alert("Please select a target booking date.");
      return;
    }

    setSubmitting(true);
    const result = await onBookConsultation({
      userId: currentUser.id,
      userName: currentUser.name,
      designerId: activeDesigner.id,
      designerName: activeDesigner.name,
      date,
      timeSlot,
      notes,
      amount: activeDesigner.consultationFee
    });

    setSubmitting(false);
    if (result) {
      setBookingSuccess(true);
      setDate('');
      setNotes('');
      setTimeout(() => {
        setBookingSuccess(false);
      }, 5000);
    }
  };

  return (
    <div className={`${theme.bg} ${theme.text} min-h-screen py-10 lg:py-16`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header Title Storyteller */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className={`text-[10px] uppercase tracking-[0.3em] font-black ${theme.accentText} block mb-3`}>ATELIER DIRECTORY & SERVICES</span>
          <h1 className="text-4xl md:text-5xl font-serif italic mb-4 leading-tight">Master Couturiers of ANVAA</h1>
          <p className={`text-xs ${theme.textMuted} italic font-sans`}>
            Directly communicate with India’s leading luxury visionaries. Customize sizing adjustments, secure bespoke colors, and build your bridal or high-executive dream silhouette.
          </p>
        </div>

        {/* Master layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Elite Selector List (cols-12 to cols-4) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className={`text-xs uppercase tracking-[0.2em] ${theme.accentText} font-black border-b ${theme.borderColor} pb-3 mb-2`}>Select Your Designer</h3>
            {designers.map((d) => (
              <button
                key={d.id}
                onClick={() => { setSelectedDesigner(d); setBookingSuccess(false); }}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-300 flex gap-4 cursor-pointer relative overflow-hidden group ${
                  activeDesigner.id === d.id 
                    ? `${theme.cardBg} ${theme.borderAccent} shadow-md` 
                    : `${theme.bg} ${theme.borderColor} hover:bg-neutral-50/50`
                }`}
              >
                {activeDesigner.id === d.id && (
                  <div className="absolute top-0 right-0 bg-[#D4AF37] text-white text-[9px] font-black tracking-widest px-2.5 py-1 uppercase rounded-bl">
                    SELECTED
                  </div>
                )}
                <img 
                  src={d.avatar} 
                  alt={d.name} 
                  className="w-14 h-14 rounded-full object-cover border border-[#D4AF37]/40 self-center" 
                />
                <div>
                  <h4 className={`font-serif italic text-base font-bold ${theme.text}`}>{d.name}</h4>
                  <p className="text-[11px] text-[#B76E79] font-medium mt-0.5">{d.specialty}</p>
                  <div className={`flex items-center gap-1.5 mt-1.5 text-[10px] ${theme.textMuted}`}>
                    <MapPin size={10} className="text-[#D4AF37]" />
                    <span>{d.city}</span>
                    <span className="opacity-40">|</span>
                    <Star size={10} className="fill-[#D4AF37] text-[#D4AF37]" />
                    <span className={`font-semibold ${theme.text}`}>{d.rating} ({d.reviewsCount})</span>
                  </div>
                </div>
              </button>
            ))}
            
            <div className={`bg-[#FAF9F6]/40 ${theme.text} p-6 rounded-lg text-center border ${theme.borderColor} mt-6`}>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#AA771C] block font-black mb-1">CRAFT GUARANTEE</span>
              <p className={`text-[11px] font-serif leading-relaxed italic ${theme.textMuted}`}>
                " Every yarn and pure silk weave is hand-block printed, customized to size, and authenticated by central weavers guild certificate inside ANVAA. "
              </p>
            </div>
          </div>

          {/* RIGHT: Detailed Profiler (cols-8) */}
          <div className={`lg:col-span-8 bg-white border ${theme.borderColor} rounded-xl overflow-hidden p-6 md:p-10 shadow-sm animate-luxury-reveal`}>
            
            {/* Cover and header details */}
            <div className="relative h-48 md:h-64 rounded-lg overflow-hidden bg-neutral-100 mb-8 border border-neutral-200/50">
              <div className="absolute inset-0 bg-cover bg-center opacity-65" style={{ backgroundImage: `url(${activeDesigner.coverImage})` }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#3C2A1E]/80 via-transparent to-transparent flex items-end p-6 md:p-8">
                <div className="flex gap-4 items-center">
                  <img src={activeDesigner.avatar} className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-white shadow-lg" />
                  <div>
                    <h2 className="text-2xl md:text-3xl font-serif italic text-white font-bold">{activeDesigner.name}</h2>
                    <p className="text-xs md:text-sm text-[#D4AF37] tracking-widest uppercase font-semibold">{activeDesigner.specialty}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Bio */}
            <div className="mb-8">
              <h3 className={`text-xs uppercase tracking-[0.2em] ${theme.accentText} font-black border-b ${theme.borderColor} pb-2 mb-3`}>Atelier Narrative</h3>
              <p className={`text-sm ${theme.text} leading-relaxed font-light italic font-serif`}>
                "{activeDesigner.bio}"
              </p>
            </div>

            {/* Core Achievements & timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className={`text-xs uppercase tracking-[0.2em] ${theme.accentText} font-black border-b ${theme.borderColor} pb-2 mb-4 flex items-center gap-1.5`}>
                  <Award size={13} className="text-[#D4AF37]" /> Key Credentials
                </h3>
                <ul className="space-y-2.5">
                  {activeDesigner.achievements?.map((ach, i) => (
                    <li key={i} className={`text-[11px] ${theme.text} flex gap-2 items-start font-sans`}>
                      <span className="text-[#D4AF37] font-bold">✦</span>
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className={`text-xs uppercase tracking-[0.2em] ${theme.accentText} font-black border-b ${theme.borderColor} pb-2 mb-4 flex items-center gap-1.5`}>
                  Timeline History
                </h3>
                <div className={`relative border-l ${theme.borderColor} pl-4 space-y-4`}>
                  {activeDesigner.history?.map((hist, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></div>
                      <span className="text-[10px] font-mono text-[#B76E79] font-bold">{hist.year}</span>
                      <p className={`text-[11px] ${theme.textMuted} mt-0.5 leading-relaxed`}>{hist.event}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Curated Products by Designer */}
            {designerProducts.length > 0 && (
              <div className="mb-10">
                <h3 className={`text-xs uppercase tracking-[0.2em] ${theme.accentText} font-black border-b ${theme.borderColor} pb-2 mb-4`}>Curated Atelier Capsule Collection</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {designerProducts.map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => setActiveTab('collections')}
                      className="cursor-pointer group flex flex-col hover:opacity-90"
                    >
                      <div className="h-44 w-full rounded overflow-hidden bg-neutral-100 mb-2">
                        <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                      </div>
                      <p className={`text-[11px] font-semibold ${theme.text} truncate font-serif italic`}>{p.name}</p>
                      <p className={`text-[10px] ${theme.textMuted}`}>₹{p.price.toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONSULTATION SCHEDULER & REAL TIME CHAT TRIGGERS */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-neutral-100 bg-[#FAF9F6]/20 p-6 rounded-lg border ${theme.borderColor}`}>
              
              {/* Virtual Consultation Booking Form */}
              <div>
                <h4 className={`text-xs uppercase tracking-[0.25em] ${theme.text} font-bold mb-3 flex items-center gap-1.5`}>
                  <Calendar size={13} className="text-[#D4AF37]" />
                  BOOK BESPOKE FIT SESSION
                </h4>
                <p className={`text-[10px] ${theme.textMuted} mb-4 leading-relaxed font-light font-sans`}>
                  Reserve a 1-on-1 video design suite session. Direct consultation fee is <strong className={theme.text}>₹{activeDesigner.consultationFee}</strong> (credited toward purchase).
                </p>

                {bookingSuccess ? (
                  <div className="bg-emerald-50 text-emerald-800 p-4 rounded text-xs border border-emerald-200 flex gap-2">
                    <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Consultation Slot Requested!</p>
                      <p className="font-light mt-0.5">We will initialize an instant direct message from ${activeDesigner.name} inside your inbox thread to coordinate the secure fit assessment.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-3.5 text-xs">
                    <div>
                      <label className={`block ${theme.textMuted} font-bold uppercase text-[9px] mb-1`}>Select Target Date</label>
                      <input
                        type="date"
                        required
                        className={`w-full bg-white border ${theme.borderColor} p-2.5 outline-none focus:border-[#D4AF37]`}
                        value={date}
                        min={new Date().toISOString().substring(0, 10)}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className={`block ${theme.textMuted} font-bold uppercase text-[9px] mb-1`}>Preferred Time Zone Slot</label>
                      <select
                        className={`w-full bg-white border ${theme.borderColor} p-2.5 outline-none focus:border-[#D4AF37]`}
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                      >
                        <option value="11:00 AM - 12:30 PM">Morning Slate (11:00 AM - 12:30 PM)</option>
                        <option value="02:30 PM - 04:00 PM">Afternoon Fit (02:30 PM - 4:00 PM)</option>
                        <option value="05:30 PM - 07:00 PM">Sunset Curated (05:30 PM - 7:00 PM)</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block ${theme.textMuted} font-bold uppercase text-[9px] mb-1`}>Drape specifications or body shape indicators</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. customized sleeve adjustment, custom fabric requirement, wedding color match..."
                        className={`w-full bg-white border ${theme.borderColor} p-2.5 outline-none focus:border-[#D4AF37]`}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className={`w-full ${theme.buttonPrimary} py-3 text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer rounded-lg`}
                    >
                      {submitting ? 'RESERVING ATELIER...' : `REQUEST FIT APPOINTMENT`}
                    </button>
                  </form>
                )}
              </div>

              {/* Direct message stylist */}
              <div className={`flex flex-col justify-between p-4 bg-white border ${theme.borderColor} rounded`}>
                <div>
                  <h4 className={`text-xs uppercase tracking-[0.25em] ${theme.text} font-bold mb-2 flex items-center gap-1.5`}>
                    <MessageSquare size={13} className="text-[#B76E79]" />
                    DIRECT CHAT STYLIST
                  </h4>
                  <p className={`text-[11px] ${theme.textMuted} leading-relaxed font-light italic mb-4`}>
                    Instantly message {activeDesigner.name} inside our boutique platform. Request general advice on which silk works best for summer weddings, or ask about fit lengths.
                  </p>
                  <div className="space-y-2 mb-4 bg-[#FAF9F6]/40 p-3 rounded text-[10px] md:text-xs">
                    <div className={`flex gap-2 ${theme.textMuted}`}>
                      <span className="text-[#D4AF37]">✦</span>
                      <span>Generative custom drape responses empowered by AI</span>
                    </div>
                    <div className={`flex gap-2 ${theme.textMuted}`}>
                      <span className="text-[#D4AF37]">✦</span>
                      <span>Free general assistance on layout style & matching accessories</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => onContactDesigner(activeDesigner)}
                  className={`w-full border ${theme.borderColor} ${theme.text} bg-transparent hover:bg-[#FAF9F6]/60 py-3 text-[10px] uppercase font-bold tracking-widest cursor-pointer mt-auto`}
                >
                  Enter Atelier Chat Suite
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
