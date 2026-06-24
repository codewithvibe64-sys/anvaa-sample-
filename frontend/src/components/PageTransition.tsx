/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface PageTransitionProps {
  isVisible: boolean;
  destinationTab: string;
}

const DRESS_IMAGES: Record<string, string> = {
  home: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600", // Pink floral designer dress
  collections: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600", // Elegant gold zardozi drape dress
  designers: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600", // Luxury haute couture model
  chat: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600", // Royal silk drape
  dashboard: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=600" // Structured fashion gown
};

const TAB_TITLES: Record<string, string> = {
  home: "ANVAA MAISON",
  collections: "HERITAGE COUTURE",
  designers: "GUILD CRAFTSMEN",
  chat: "ATELIER SALON",
  dashboard: "VIP COCKPIT"
};

export default function PageTransition({ isVisible, destinationTab }: PageTransitionProps) {
  const dressImage = DRESS_IMAGES[destinationTab] || DRESS_IMAGES.home;
  const tabTitle = TAB_TITLES[destinationTab] || "ANVAA MAISON";

  // Create repeating text array for marquee feel
  const repeatingAnvaa = Array(35).fill("ANVAA").join("   ✦   ");

  return (
    <div className={`fixed inset-0 z-[9999] pointer-events-none transition-all duration-500`}>
      {isVisible && (
        <motion.div
          initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" }}
          animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
          exit={{ clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-0 bg-[#4A1525] flex flex-col items-center justify-center pointer-events-auto overflow-hidden"
        >
          {/* Background subtle glowing radial gradient for luxury depth */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />

          {/* Diagonal sliding bands (White formatted background with black ANVAA text) */}
          <div className="absolute inset-0 flex flex-col justify-center gap-12 rotate-[-22deg] scale-125 select-none pointer-events-none">
            
            {/* Band 1 - Left to Right */}
            <motion.div
              initial={{ x: "-120%", opacity: 0 }}
              animate={{ x: "0%", opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.65, ease: "easeOut" }}
              className="bg-white/95 border-y border-[#D4AF37]/35 py-3 w-[200%] flex items-center shadow-lg"
            >
              <motion.div
                animate={{ x: [0, -400] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 18 }}
                className="whitespace-nowrap text-black font-serif font-black tracking-[0.4em] text-[15px] uppercase"
              >
                {repeatingAnvaa}
              </motion.div>
            </motion.div>

            {/* Band 2 - Right to Left */}
            <motion.div
              initial={{ x: "120%", opacity: 0 }}
              animate={{ x: "0%", opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.65, ease: "easeOut" }}
              className="bg-white/95 border-y border-[#D4AF37]/35 py-3 w-[200%] flex items-center shadow-lg self-end"
            >
              <motion.div
                animate={{ x: [-400, 0] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 18 }}
                className="whitespace-nowrap text-black font-serif font-black tracking-[0.4em] text-[15px] uppercase"
              >
                {repeatingAnvaa}
              </motion.div>
            </motion.div>

            {/* Band 3 - Left to Right */}
            <motion.div
              initial={{ x: "-120%", opacity: 0 }}
              animate={{ x: "0%", opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.65, ease: "easeOut" }}
              className="bg-white/95 border-y border-[#D4AF37]/35 py-3 w-[200%] flex items-center shadow-lg"
            >
              <motion.div
                animate={{ x: [0, -400] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 18 }}
                className="whitespace-nowrap text-black font-serif font-black tracking-[0.4em] text-[15px] uppercase"
              >
                {repeatingAnvaa}
              </motion.div>
            </motion.div>

          </div>

          {/* Centered Luxury Card with Parallax Dress Reveal */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.75, ease: [0.34, 1.56, 0.64, 1] }}
            className="z-20 flex flex-col items-center gap-4 bg-white p-5 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.4)] border border-[#D4AF37]/40 w-[290px] md:w-[320px]"
          >
            {/* Parallax Dress Crop Container */}
            <div className="w-full h-[280px] md:h-[320px] overflow-hidden rounded-lg relative bg-neutral-100 border border-neutral-100">
              <motion.div
                initial={{ y: "25%", scale: 1.15 }}
                animate={{ y: "0%", scale: 1.0 }}
                transition={{ delay: 0.65, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 bg-cover bg-center filter saturate-[0.9]"
                style={{ backgroundImage: `url(${dressImage})` }}
              />
            </div>

            {/* Premium Gold Typography details */}
            <div className="text-center mt-1">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-[9.5px] tracking-[0.4em] uppercase text-[#D4AF37] font-bold block"
              >
                Entering
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="text-lg font-serif italic text-[#4A1525] uppercase tracking-wider font-extrabold"
              >
                {tabTitle}
              </motion.h2>
            </div>
          </motion.div>

        </motion.div>
      )}
    </div>
  );
}


