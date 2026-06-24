/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, Phone, MapPin, ArrowUpRight, Sparkles } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Welcome to the Elite inner circle of ANVAA. A digital heritage letter will reach your mailbox soon.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <footer className="bg-gradient-to-b from-[#FAF5EF] to-[#FFFDFB] text-[#4A1525] pt-16 pb-8 border-t border-[#D4AF37]/35">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand & Narrative */}
        <div className="md:col-span-1 flex flex-col justify-between">
          <div>
            <span className="text-3xl font-serif tracking-[0.4em] font-black italic gold-text-gradient block mb-4">ANVAA</span>
            <p className="text-xs text-[#82525E] font-serif leading-relaxed italic mb-6">
              Embodying the grand spirit of Indian handlooms, custom zardozi, and contemporary office tailoring for the modern Gen-Z leaders. Fashion that translates emotion, structure, and prestige.
            </p>
          </div>
          <div className="text-xs text-[#82525E]/80 font-light font-sans">
            Atelier No. 44, Colaba Art District, Mumbai, MS, India.
          </div>
        </div>

        {/* Navigation Categories */}
        <div>
          <h4 className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF37] font-black mb-6">EXPLORE HERITAGE</h4>
          <ul className="space-y-3.5 text-xs text-[#82525E] font-medium">
            <li>
              <button onClick={() => setActiveTab('collections')} className="hover:text-[#B76E79] transition-colors flex items-center gap-1 group cursor-pointer">
                Wedding Collection <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('collections')} className="hover:text-[#B76E79] transition-colors flex items-center gap-1 group cursor-pointer">
                Office Power Wear <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('collections')} className="hover:text-[#B76E79] transition-colors flex items-center gap-1 group cursor-pointer">
                Sustainable Casuals <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('collections')} className="hover:text-[#B76E79] transition-colors flex items-center gap-1 group cursor-pointer">
                Limited Masterpieces <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]" />
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('designers')} className="hover:text-[#B76E79] transition-colors flex items-center gap-1 group cursor-pointer">
                Elite Designer Marketplace <ArrowUpRight size={10} className="text-[#B76E79]" />
              </button>
            </li>
          </ul>
        </div>

        {/* Boutiques */}
        <div>
          <h4 className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF37] font-black mb-6">OUR SALON ATELIERS</h4>
          <div className="space-y-4 text-xs font-light text-[#82525E]">
            <div>
              <p className="font-bold text-[#4A1525] mb-1 font-serif italic">The Taj Mahal Palace, Mumbai</p>
              <p className="text-[#82525E]/90">Shop No. 7, Heritage Arcade, Apollo Bandar</p>
              <p className="text-[#82525E]/70 font-mono text-[10px] mt-0.5">Ph: +91 22 4912 3000</p>
            </div>
            <div>
              <p className="font-bold text-[#4A1525] mb-1 font-serif italic">Chanakyapuri, New Delhi</p>
              <p className="text-[#82525E]/90">The Santushti Complex, Shop 14-B</p>
              <p className="text-[#82525E]/70 font-mono text-[10px] mt-0.5">Ph: +91 11 3912 4000</p>
            </div>
          </div>
        </div>

        {/* Newsletter Signup with Luxury Styling */}
        <div className="bg-white p-6 rounded-2xl border border-[#D4AF37]/25 shadow-sm">
          <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#B76E79] font-black mb-2 flex items-center gap-1.5">
            <Sparkles size={11} className="text-[#B76E79] fill-[#B76E79]/20" />
            THE INNER ATELIER CLUB
          </h4>
          <p className="text-[11px] text-[#82525E] mb-4 leading-relaxed font-light italic">
            Receive invitation dockets to seasonal private Trunk Shows, priority designer edits, and luxury custom tailoring consultations.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="space-y-2">
            <input
              type="email"
              placeholder="Enter your personal email"
              required
              className="w-full bg-[#FFFDFB] text-[#4A1525] text-xs px-4 py-3 border border-rose-100 rounded-xl focus:border-[#D4AF37] outline-none transition-all placeholder:text-neutral-400 font-light"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D4AF37] via-[#E5A4B4] to-[#B76E79] text-white font-bold text-[10px] uppercase tracking-[0.2em] py-3 transition-all duration-300 shadow-md cursor-pointer rounded-xl"
            >
              Request Invitation
            </button>
          </form>
        </div>

      </div>

      {/* Under-Footer bar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 border-t border-[#D4AF37]/15 flex flex-col md:flex-row justify-between items-center text-[10px] text-[#82525E]/80 tracking-wider">
        <p>© 2026 ANVAA Luxury Apparel Private Limited. All Rights Reserved. Crafted exclusively for elite Indian lifestyles.</p>
        <div className="flex gap-6 mt-4 md:mt-0 font-light">
          <a href="#" className="hover:text-[#D4AF37] transition-colors">Privacy Charter</a>
          <a href="#" className="hover:text-[#D4AF37] transition-colors">Apparel Sizing Protocol</a>
          <a href="#" className="hover:text-[#D4AF37] transition-colors">Heritage Craft Guarantee</a>
        </div>
      </div>
    </footer>
  );
}


