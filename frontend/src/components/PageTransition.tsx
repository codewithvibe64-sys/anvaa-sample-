/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface PageTransitionProps {
  isVisible: boolean;
  destinationTab: string;
  customColorMood?: string;
}

const DRESS_IMAGES: Record<string, string> = {
  home: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600", // Pink designer dress
  collections: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600", // Elegant gold dress
  designers: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600", // Luxury haute couture model
  chat: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600", // Royal silk drape
  dashboard: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=600" // Structured gown
};

const TAB_TITLES: Record<string, string> = {
  home: "ANVAA MAISON",
  collections: "HERITAGE COUTURE",
  designers: "GUILD CRAFTSMEN",
  chat: "ATELIER SALON",
  dashboard: "VIP COCKPIT"
};

const MOOD_BG_COLORS: Record<string, string> = {
  emerald: 'bg-gradient-to-br from-[#051C18] via-[#0A2E28] to-[#031310]', // Cartier Emerald
  gold: 'bg-gradient-to-br from-[#1C160F] via-[#2A2118] to-[#120D08]', // Antique Gold
  rose: 'bg-gradient-to-br from-[#2D0B14] via-[#4A1525] to-[#1E060C]', // Velvet Maroon Rose
  wine: 'bg-gradient-to-br from-[#280A15] via-[#380E1C] to-[#18040A]', // Royal Burgundy Wine
  violet: 'bg-gradient-to-br from-[#12091C] via-[#1C0E2B] to-[#0B0412]', // Amethyst Purple
};

export default function PageTransition({ isVisible, destinationTab, customColorMood = 'gold' }: PageTransitionProps) {
  const dressImage = DRESS_IMAGES[destinationTab] || DRESS_IMAGES.home;
  const tabTitle = TAB_TITLES[destinationTab] || "ANVAA MAISON";

  const bgGradient = MOOD_BG_COLORS[customColorMood] || MOOD_BG_COLORS.gold;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none transition-all duration-500 [perspective:1400px]">
      {isVisible && (
        <div className="absolute inset-0 flex pointer-events-auto [transform-style:preserve-3d] overflow-hidden">
          
          {/* 1. LEFT CURTAIN GATE (3D Swing Open to the Left) */}
          <motion.div
            initial={{ x: "-100%", rotateY: -80, opacity: 0.3 }}
            animate={{ x: "0%", rotateY: 0, opacity: 1 }}
            exit={{ x: "-100%", rotateY: -80, opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            className={`absolute top-0 left-0 w-1/2 h-full ${bgGradient} border-r border-[#D4AF37]/35 shadow-[15px_0_40px_rgba(0,0,0,0.5)] flex flex-col justify-center items-end overflow-hidden`}
            style={{ transformOrigin: "left center", backfaceVisibility: "hidden" }}
          >
            {/* Background subtle glowing radial gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />
            
            {/* Left side decorative border line */}
            <div className="absolute top-0 right-4 w-[1px] h-full bg-gradient-to-b from-transparent via-[#D4AF37]/25 to-transparent pointer-events-none" />

            {/* Sparkle particles on left curtain */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={`left-sp-${i}`}
                  initial={{ y: "110vh", opacity: 0, scale: 0.5 }}
                  animate={{ 
                    y: "-10vh", 
                    opacity: [0, 0.7, 0.7, 0],
                    scale: [0.5, 1.1, 0.75, 0.5],
                  }}
                  transition={{
                    duration: 7 + i * 1.5,
                    repeat: Infinity,
                    delay: i * 1.2,
                    ease: "easeInOut"
                  }}
                  className="absolute text-[#D4AF37] pointer-events-none"
                  style={{ left: `${15 + i * 16}%` }}
                >
                  <Sparkles size={16} className="fill-[#D4AF37]/5" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 2. RIGHT CURTAIN GATE (3D Swing Open to the Right) */}
          <motion.div
            initial={{ x: "100%", rotateY: 80, opacity: 0.3 }}
            animate={{ x: "0%", rotateY: 0, opacity: 1 }}
            exit={{ x: "100%", rotateY: 80, opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            className={`absolute top-0 right-0 w-1/2 h-full ${bgGradient} border-l border-[#D4AF37]/35 shadow-[-15px_0_40px_rgba(0,0,0,0.5)] flex flex-col justify-center items-start overflow-hidden`}
            style={{ transformOrigin: "right center", backfaceVisibility: "hidden" }}
          >
            {/* Background subtle glowing radial gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />

            {/* Right side decorative border line */}
            <div className="absolute top-0 left-4 w-[1px] h-full bg-gradient-to-b from-transparent via-[#D4AF37]/25 to-transparent pointer-events-none" />

            {/* Sparkle particles on right curtain */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={`right-sp-${i}`}
                  initial={{ y: "110vh", opacity: 0, scale: 0.5 }}
                  animate={{ 
                    y: "-10vh", 
                    opacity: [0, 0.7, 0.7, 0],
                    scale: [0.5, 1.1, 0.75, 0.5],
                  }}
                  transition={{
                    duration: 8 + i * 1.2,
                    repeat: Infinity,
                    delay: i * 1.5,
                    ease: "easeInOut"
                  }}
                  className="absolute text-[#D4AF37] pointer-events-none"
                  style={{ left: `${10 + i * 18}%` }}
                >
                  <Sparkles size={16} className="fill-[#D4AF37]/5" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 3. CENTRAL ROTATING GOLDEN FASHION EMBLEM/CREST */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 180, opacity: 0 }}
              transition={{ 
                scale: { delay: 0.15, duration: 0.75, ease: [0.34, 1.56, 0.64, 1] },
                rotate: { delay: 0.15, duration: 0.95, ease: "easeOut" },
                opacity: { delay: 0.15, duration: 0.6 }
              }}
              className="relative flex items-center justify-center"
            >
              {/* Spinning emblem frame */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                className="w-40 h-40 md:w-48 md:h-48 rounded-full border border-[#D4AF37] flex items-center justify-center bg-neutral-950/80 backdrop-blur-lg shadow-[0_0_40px_rgba(212,175,55,0.4)] relative"
              >
                {/* Internal circles */}
                <div className="absolute inset-2.5 rounded-full border border-dashed border-[#D4AF37]/45" />
                <div className="absolute inset-5 rounded-full border border-[#D4AF37]/20" />
                
                {/* Floating diamonds ornamentation on emblem corners */}
                <div className="absolute -top-1 w-2 h-2 bg-[#D4AF37] rotate-45 shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                <div className="absolute -bottom-1 w-2 h-2 bg-[#D4AF37] rotate-45 shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                <div className="absolute -left-1 w-2 h-2 bg-[#D4AF37] rotate-45 shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                <div className="absolute -right-1 w-2 h-2 bg-[#D4AF37] rotate-45 shadow-[0_0_8px_rgba(212,175,55,0.8)]" />

                {/* Star sparkle decoration overlay */}
                <Sparkles size={18} className="absolute top-8 left-8 text-[#D4AF37]/20 fill-[#D4AF37]/5" />

                {/* Monogram A */}
                <div className="text-center font-serif text-[#D4AF37] select-none relative z-10">
                  <span className="text-3xl md:text-4xl font-extrabold tracking-[0.2em] block font-serif leading-none">A</span>
                  <span className="text-[8px] tracking-[0.45em] uppercase font-bold block mt-1.5 font-sans">Maison</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* 4. CENTERED LUXURY COUTURE CARD WITH PULSING GOLD AURA (Fades & Scales out on exit) */}
          <div className="absolute inset-0 flex flex-col justify-end items-center pb-12 pointer-events-none z-20">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0,
                boxShadow: [
                  "0 15px 35px rgba(0,0,0,0.4), 0 0 0px rgba(212,175,55,0)",
                  "0 15px 35px rgba(0,0,0,0.4), 0 0 25px rgba(212,175,55,0.35)",
                  "0 15px 35px rgba(0,0,0,0.4), 0 0 0px rgba(212,175,55,0)"
                ]
              }}
              exit={{ scale: 0.7, opacity: 0, y: -20 }}
              transition={{ 
                scale: { delay: 0.35, duration: 0.75, ease: [0.34, 1.3, 0.64, 1] },
                opacity: { delay: 0.35, duration: 0.65 },
                y: { delay: 0.35, duration: 0.75, ease: [0.34, 1.3, 0.64, 1] },
                boxShadow: { repeat: Infinity, duration: 3.5, ease: "easeInOut" }
              }}
              className="flex flex-col items-center gap-3.5 bg-[#FAF9F6] p-4 rounded-xl border border-[#D4AF37]/35 w-[250px] md:w-[280px]"
            >
              {/* Parallax Dress Crop Container */}
              <div className="w-full h-[180px] md:h-[210px] overflow-hidden rounded-lg relative bg-neutral-100 border border-neutral-100">
                <motion.div
                  initial={{ y: "15%", scale: 1.1 }}
                  animate={{ y: "0%", scale: 1.0 }}
                  transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 bg-cover bg-center filter saturate-[0.85]"
                  style={{ backgroundImage: `url(${dressImage})` }}
                />
              </div>

              {/* Gold Typography details */}
              <div className="text-center mt-0.5">
                <span className="text-[8px] tracking-[0.35em] uppercase text-[#D4AF37] font-bold block">
                  Entering
                </span>
                <h2 className="text-sm font-serif italic text-[#4A1525] uppercase tracking-wider font-black">
                  {tabTitle}
                </h2>
              </div>
            </motion.div>
          </div>

        </div>
      )}
    </div>
  );
}
