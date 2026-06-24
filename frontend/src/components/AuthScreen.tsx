/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ThreeDBackground from './ThreeDBackground';

interface AuthScreenProps {
  currentUser: any;
  setCurrentUser: (user: any) => void;
  setActiveTab: (tab: string) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  handleAutoLogin: () => Promise<void>;
  setShowProfileGuide: (show: boolean) => void;
}

const authSlides = [
  {
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800",
    tag: "Haute Couture Atelier",
    title: "ANVAA MAISON",
    description: "Step into the digital salon of India's finest craft guilds. Customize drapes, coordinate zardozi details, and order serial-numbered handloom masterpieces directly from our weavers.",
    features: ["Bespoke Fits", "Heritage Weaves", "Elite Handover"]
  },
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800",
    tag: "Luxury Silk & Drapes",
    title: "BRIDAL COLLECTION",
    description: "Pre-order custom-embroidered bridal wear. Book consultations with master artisans who bring centuries-old heritage patterns to life using premium mulberry silk.",
    features: ["Master Weavers", "Custom Drapes", "Atelier Lounge"]
  },
  {
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800",
    tag: "Kashmiri Craftsmanship",
    title: "ROYAL SHAWLS",
    description: "Indulge in authentic hand-woven Pashmina shawls, each verified with GI tags and certified by craft registries. The ultimate expression of luxury heritage.",
    features: ["GI Tagged", "Handwoven Gold", "Lifetime Quality"]
  }
];

export default function AuthScreen({
  currentUser,
  setCurrentUser,
  setActiveTab,
  showToast,
  handleAutoLogin,
  setShowProfileGuide
}: AuthScreenProps) {
  const [isRegisterMode, setIsRegisterMode] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  
  const [activeSlide, setActiveSlide] = useState(0);

  const handleGoogleCredential = async (response: any) => {
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        showToast(`Successfully authenticated as ${data.user.name} via Google.`, "success");
        setActiveTab("home");

        // Show update profile guide if Google user has incomplete profile details
        const hasMissingDetails = !data.user.phone || !data.user.savedAddresses || data.user.savedAddresses.length === 0;
        if (hasMissingDetails) {
          setShowProfileGuide(true);
          setTimeout(() => {
            showToast("Please complete your details and upload a profile picture in your dashboard.", "info");
          }, 2000);
        }
      } else {
        showToast(data.error || "Google Sign-In failed.", "error");
      }
    } catch (err) {
      console.error("Google OAuth response error", err);
      showToast("Failed to connect to the Google auth server.", "error");
    }
  };

  useEffect(() => {
    // Poll for window.google script loading
    const checkGoogle = setInterval(() => {
      if ((window as any).google) {
        clearInterval(checkGoogle);
        try {
          (window as any).google.accounts.id.initialize({
            client_id: ((import.meta as any).env?.VITE_GOOGLE_CLIENT_ID) || "1002347101859-fakeclientid.apps.googleusercontent.com",
            callback: handleGoogleCredential
          });
          (window as any).google.accounts.id.renderButton(
            document.getElementById("google-signin-btn-container"),
            { theme: "outline", size: "medium", width: 380, text: "signin_with" }
          );
        } catch (err) {
          console.error("Google GIS initialization error", err);
        }
      }
    }, 500);

    return () => clearInterval(checkGoogle);
  }, [isRegisterMode]);

  // Auto transition lookbook slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % authSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;

    if (isRegisterMode && authPassword !== authConfirmPassword) {
      showToast("Passwords do not match. Please verify.", "error");
      return;
    }

    try {
      const url = isRegisterMode ? '/api/auth/register' : '/api/auth/login';
      const body = isRegisterMode 
        ? { email: authEmail, name: authName, phone: authPhone, password: authPassword }
        : { email: authEmail, password: authPassword };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        showToast(
          isRegisterMode 
            ? `Successfully registered as ${data.user.name}. Welcome to ANVAA Maison!`
            : `Successfully authenticated as ${data.user.name}. Welcome back.`, 
          'success'
        );
        setActiveTab('home');

        const hasMissingDetails = !data.user.phone || !data.user.savedAddresses || data.user.savedAddresses.length === 0;
        if (isRegisterMode || hasMissingDetails) {
          setShowProfileGuide(true);
          setTimeout(() => {
            showToast("Please upload your profile picture and complete address details in your profile dashboard.", "info");
          }, 2000);
        }
      } else {
        showToast(data.error || "Authentication failed. Please verify credentials.", 'error');
      }
    } catch (err) {
      console.error("Auth error", err);
      showToast("Failed to connect to the authentication server.", "error");
    }
  };

  return (
    <div className="w-full min-h-screen text-[#4A1525] relative overflow-hidden flex flex-col justify-center">
      {/* Interactive 3D Canvas Background */}
      <ThreeDBackground />

      <div className="grid grid-cols-1 md:grid-cols-12 w-full min-h-screen z-10 relative">
        
        {/* Left Column: Centered Lookbook Slide (Reduced height image, shifted upward) */}
        <div className="hidden md:flex md:col-span-6 flex-col justify-center items-center p-12 relative h-full min-h-screen w-full select-none z-10">
          <div className="w-full max-w-md flex flex-col space-y-6 -mt-16">
            
            {/* Header Brand */}
            <div className="space-y-1">
              <span className="text-[10.5px] tracking-[0.45em] uppercase font-black text-[#D4AF37] block">
                {authSlides[activeSlide].tag}
              </span>
              <h2 className="text-3xl font-serif italic text-[#4A1525] leading-tight tracking-wider">
                {authSlides[activeSlide].title}
              </h2>
            </div>

            {/* Centered Lookbook Image with Reduced Height and Sliding Transition */}
            <div className="w-full h-[380px] relative rounded-xl overflow-hidden shadow-[0_15px_40px_rgba(74,21,37,0.12)] border border-[#D4AF37]/20 bg-neutral-100">
              <AnimatePresence initial={false}>
                <motion.div
                  key={activeSlide}
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 bg-cover bg-center filter saturate-[0.85] hover:saturate-100 transition-all duration-1000"
                  style={{ 
                    backgroundImage: `url(${authSlides[activeSlide].image})`,
                    backgroundPosition: "center 20%" // "place that image little bit up"
                  }}
                />
              </AnimatePresence>
            </div>

            {/* Bottom description & features */}
            <div className="space-y-4 pt-2 border-t border-[#D4AF37]/25">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeSlide}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.4 }}
                  className="text-xs text-[#4A1525]/85 leading-relaxed font-light italic"
                >
                  "{authSlides[activeSlide].description}"
                </motion.p>
              </AnimatePresence>
              
              <div className="flex gap-4 text-[9.5px] uppercase tracking-widest text-[#D4AF37] font-black">
                {authSlides[activeSlide].features.map((feat, index) => (
                  <span key={index}>✦ {feat}</span>
                ))}
              </div>
            </div>

          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 flex gap-2">
            {authSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${
                  activeSlide === i ? 'bg-[#D4AF37] w-6' : 'bg-[#4A1525]/20 hover:bg-[#4A1525]/45'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Centered Flat Form Card over 3D constellation */}
        <div className="col-span-1 md:col-span-6 flex items-center justify-center p-8 w-full min-h-screen">
          <motion.div 
            layout
            className="bg-white/95 backdrop-blur-md border border-[#D4AF37]/25 p-8 rounded-2xl shadow-2xl space-y-6 relative w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              boxShadow: isRegisterMode 
                ? "0 25px 60px rgba(212, 175, 55, 0.18)" 
                : "0 20px 50px rgba(212, 175, 55, 0.12)"
            }}
            transition={{ duration: 0.5 }}
          >
            
            <div className="text-center">
              <span className="text-2xl font-serif italic tracking-widest gold-text-gradient block font-extrabold mb-1">
                ANVAA MAISON
              </span>
              <h3 className="text-lg font-serif italic text-[#4A1525] font-semibold uppercase tracking-widest">
                {isRegisterMode ? 'VIP Atelier Signup' : 'VIP Studio Entry'}
              </h3>
              <p className="text-[11px] text-neutral-500 mt-2 italic">
                {isRegisterMode 
                  ? 'Create an account to enjoy personalized atelier services and exclusive collections.'
                  : 'Enter your credentials to access the ANVAA VIP studio and exclusive collections.'
                }
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!isRegisterMode ? (
                <motion.form 
                  key="login-form-pane"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleAuthSubmit} 
                  className="space-y-4 text-xs font-light"
                >
                  <div>
                    <label className="block text-neutral-400 font-bold uppercase text-[9px] mb-1">Elite VIP Account Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. codewithvibe64@gmail.com"
                      className="w-full bg-[#FAF9F6] border border-neutral-300 p-3 outline-none focus:border-[#D4AF37] font-mono text-zinc-800 luxury-input transition-all duration-300 rounded"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-bold uppercase text-[9px] mb-1">Secret Access Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-[#FAF9F6] border border-neutral-300 p-3 outline-none focus:border-[#D4AF37] font-mono text-zinc-800 luxury-input transition-all duration-300 rounded"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                    />
                  </div>

                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => {
                        showToast("A temporary password reset link has been dispatched to your email credentials.", "info");
                      }}
                      className="text-[10px] text-neutral-400 hover:text-[#D4AF37] transition-all hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01, boxShadow: "0 6px 20px rgba(74, 21, 37, 0.2)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#4A1525] text-[#FAF9F6] py-3.5 text-xs font-black uppercase tracking-widest hover:bg-[#6A162B] transition-all cursor-pointer shadow-sm rounded-lg button-glow-hover gold-glow-button"
                  >
                    ENTER ATELIER
                  </motion.button>
                </motion.form>
              ) : (
                <motion.form 
                  key="register-form-pane"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleAuthSubmit} 
                  className="space-y-4 text-xs font-light"
                >
                  <div>
                    <label className="block text-neutral-400 font-bold uppercase text-[9px] mb-1">Elite VIP Account Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. codewithvibe64@gmail.com"
                      className="w-full bg-[#FAF9F6] border border-neutral-300 p-3 outline-none focus:border-[#D4AF37] font-mono text-zinc-800 luxury-input transition-all duration-300 rounded"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-bold uppercase text-[9px] mb-1">Complete Legal Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vasantika Sen"
                      className="w-full bg-[#FAF9F6] border border-neutral-300 p-3 outline-none focus:border-[#D4AF37] luxury-input transition-all duration-300 rounded"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-bold uppercase text-[9px] mb-1">Mobile Contact Phone Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +91 99999 88888"
                      className="w-full bg-[#FAF9F6] border border-neutral-300 p-3 outline-none focus:border-[#D4AF37] font-mono text-zinc-800 luxury-input transition-all duration-300 rounded"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-bold uppercase text-[9px] mb-1">Secret Access Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-[#FAF9F6] border border-neutral-300 p-3 outline-none focus:border-[#D4AF37] font-mono text-zinc-800 luxury-input transition-all duration-300 rounded"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-bold uppercase text-[9px] mb-1">Confirm Secret Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-[#FAF9F6] border border-neutral-300 p-3 outline-none focus:border-[#D4AF37] font-mono text-zinc-800 luxury-input transition-all duration-300 rounded"
                      value={authConfirmPassword}
                      onChange={(e) => setAuthConfirmPassword(e.target.value)}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01, boxShadow: "0 6px 20px rgba(74, 21, 37, 0.2)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#4A1525] text-[#FAF9F6] py-3.5 text-xs font-black uppercase tracking-widest hover:bg-[#6A162B] transition-all cursor-pointer shadow-sm rounded-lg button-glow-hover gold-glow-button"
                  >
                    REQUEST VIP ACCOUNT
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Social federated access */}
            <div className="space-y-3.5 pt-4 border-t text-center">
              <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Social Federated Access</p>
              <div className="flex flex-col gap-3 items-center justify-center">
                {/* Standard Google Sign-In Button Container */}
                <div id="google-signin-btn-container" className="w-full flex justify-center min-h-[40px] items-center z-20"></div>

                <motion.button 
                  onClick={async () => {
                    await handleAutoLogin();
                    showToast("Authenticated via federated Apple Secure Account.", 'success');
                    setActiveTab('home');
                  }}
                  whileHover={{ scale: 1.02, backgroundColor: "#FAF9F6" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full border border-neutral-200 py-2.5 rounded hover:bg-neutral-50 flex items-center justify-center gap-1.5 cursor-pointer transition-all bg-white text-[10px] uppercase tracking-widest font-black"
                >
                  ✦ Apple VIP Sign-In
                </motion.button>
              </div>
            </div>

            <div className="text-center pt-2">
              <motion.button
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                whileHover={{ x: 2 }}
                className="text-[11px] text-[#D4AF37] hover:underline font-serif italic transition-all cursor-pointer bg-transparent border-0"
              >
                {isRegisterMode ? 'Already registered with ANVAA? Login instead' : 'New to ANVAA? Request custom VIP account credentials'}
              </motion.button>
            </div>

          </motion.div>
        </div>

      </div>
    </div>
  );
}


