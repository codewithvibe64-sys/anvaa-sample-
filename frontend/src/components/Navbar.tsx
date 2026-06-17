/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, Heart, Search, User, Shield, Sparkles, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  wishlistCount: number;
  currentUser: any;
  onLogout: () => void;
  onOpenCart: () => void;
  customColorMood: string;
  setCustomColorMood: (mood: string) => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  cartCount,
  wishlistCount,
  currentUser,
  onLogout,
  onOpenCart,
  customColorMood,
  setCustomColorMood
}: NavbarProps) {
  return (
    <nav className="w-full bg-white/95 backdrop-blur-md border-b border-[#D4AF37]/20 sticky top-0 z-50 transition-all duration-300">
      {/* Upper ticker bar with elegant solid design and gold text */}
      <div className="bg-[#FFFDF9] border-b border-[#D4AF37]/15 text-[#AA771C] text-[10px] uppercase tracking-[0.25em] py-2.5 px-4 flex justify-between items-center text-center font-semibold shadow-xs">
        <span className="hidden md:inline font-bold">✦ ENJOY 10% COMPLIMENTARY OFF FOR FIRST ORDER — CODE: ANVAANEW ✦</span>
        <span className="mx-auto md:mx-0 font-extrabold tracking-[0.3em] text-[#D4AF37]">ATELIER CUSTOM MEASUREMENTS AVAILABLE ON ALL DESIGNS</span>
        <span className="hidden md:inline font-bold opacity-80">MUMBAI & NEW DELHI FLAGSHIPS CHIC LOUNGE Launching June 2026</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between relative">
        {/* Navigation links - Inspired by Bold Typography style */}
        <motion.div 
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex gap-6 lg:gap-8 items-center text-[11px] uppercase tracking-[0.2em] font-semibold text-[#4A1525]/80"
        >
          {[
            { id: 'home', label: 'Home' },
            { id: 'collections', label: 'Collections' },
            { id: 'designers', label: 'Designers' },
            { id: 'chat', label: 'Atelier Chat', pulse: true }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`cursor-pointer hover:text-[#4A1525] transition-colors relative py-2.5 flex items-center gap-1.5 group text-[#4A1525]/75 ${
                  isActive ? 'text-[#4A1525] font-extrabold' : ''
                }`}
              >
                {tab.pulse && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>}
                <span>{tab.label}</span>
                
                {/* Active Link Underline */}
                {isActive && (
                  <motion.span
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                
                {/* Inactive Hover Underline Effect */}
                {!isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#D4AF37]/45 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Brand identity logo - Centered, Lora italic serif typeface with expanding letter-spacing and left shift on hover */}
        <motion.div 
          onClick={() => setActiveTab('home')}
          initial={{ opacity: 0, y: -10, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          whileHover={{ scale: 1.05, x: "-62%" }}
          className="absolute left-[46%] cursor-pointer text-xl md:text-2xl font-serif tracking-[0.4em] font-black italic text-[#4A1525] select-none text-center transition-[letter-spacing] duration-500 hover:tracking-[0.55em]"
        >
          ANVAA
        </motion.div>

        {/* Action icons */}
        <motion.div 
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-4 lg:gap-6 text-[11px] uppercase tracking-[0.2em] font-bold text-[#4A1525]/80"
        >
          {currentUser ? (
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setActiveTab('dashboard')}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`py-2 px-3 border border-[#D4AF37]/25 rounded-xl hover:bg-[#FAF6EE] transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'dashboard' ? 'bg-[#FAF6EE] text-[#4A1525]' : ''
                }`}
              >
                <User size={13} className="text-[#D4AF37]" />
                <span className="hidden md:inline">Dashboard</span>
              </motion.button>
              
              {currentUser.role === 'admin' && (
                <motion.button
                  onClick={() => setActiveTab('admin')}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`py-2 px-3 bg-[#4A1525] text-white border border-[#4A1525] rounded-xl hover:opacity-90 transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'admin' ? 'ring-2 ring-[#D4AF37]' : ''
                  }`}
                >
                  <Shield size={13} className="text-[#D4AF37]" />
                  <span className="hidden md:inline">Admin Mode</span>
                </motion.button>
              )}
              
              <button 
                onClick={onLogout}
                className="text-[10px] text-red-700 hover:text-red-800 transition-colors hidden md:inline ml-1 uppercase letter tracking-widest cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <motion.button
              onClick={() => setActiveTab('auth')}
              whileHover={{ scale: 1.04 }}
              className="py-2 px-4 hover:border-b hover:border-[#D4AF37] transition-all flex items-center gap-1.5 text-[#4A1525] cursor-pointer"
            >
              <User size={13} />
              <span>Login</span>
            </motion.button>
          )}


          {/* Favorites/Wishlist */}
          <motion.button
            onClick={() => setActiveTab('dashboard')}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-[#4A1525]/85 hover:text-[#B76E79] transition-colors relative cursor-pointer"
            title="Wishlist"
            animate={wishlistCount > 0 ? {
              scale: [1, 1.25, 0.9, 1.15, 0.95, 1],
            } : { scale: 1 }}
            key={`wishlist-nav-${wishlistCount}`}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Heart size={18} className={wishlistCount > 0 ? "fill-[#B76E79] text-[#B76E79]" : ""} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#B76E79] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </motion.button>

          {/* Cart Bag - Clean Luxury Outline with Gold Fill on Hover */}
          <motion.button
            onClick={onOpenCart}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="border border-[#D4AF37] bg-white hover:bg-[#D4AF37] text-[#AA771C] hover:text-white px-5 py-2.5 rounded-full flex items-center gap-2.5 shadow-xs transition-all duration-300 text-[11px] font-bold uppercase tracking-wider cursor-pointer group"
          >
            <ShoppingBag size={14} className="text-[#AA771C] group-hover:text-white transition-colors duration-300" />
            <span>Bag</span>
            <span className="bg-[#FAF9F6] text-[#4A1525] text-[9.5px] font-black rounded-full px-2 py-0.5 shadow-inner transition-colors duration-300 group-hover:bg-[#FAF9F6]/20 group-hover:text-white">
              {cartCount}
            </span>
          </motion.button>
        </motion.div>
      </div>
    </nav>
  );
}
