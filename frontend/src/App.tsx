/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Heart, Search, ArrowRight, Star, Check, Trash2, 
  ChevronRight, Sparkles, Filter, Award, ShieldAlert, Sliders,
  Clock, MapPin, Smile, MessageSquare, ChevronDown, CheckCircle, 
  CreditCard, Loader2, Sparkle, UserCheck, Shield, Camera, User
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import DesignerMarketplace from './components/DesignerMarketplace';
import ChatAtelier from './components/ChatAtelier';
import TrackingDocketModal from './components/TrackingDocketModal';
import { Product, Designer, CartItem, Order, Consultation, Review } from './types';
import AuthScreen from './components/AuthScreen';
import CollectionsCatalog from './components/CollectionsCatalog';


const ANIMAL_TEMPLATES = {
  peacock: {
    name: 'Majestic Peacock',
    emoji: '🦚',
    bg: 'bg-emerald-50/70',
    border: 'border-emerald-200/60',
    text: 'text-emerald-950',
    accent: 'text-emerald-800',
    accentBorder: 'border-emerald-300'
  },
  swan: {
    name: 'Graceful Swan',
    emoji: '🦢',
    bg: 'bg-blue-50/60',
    border: 'border-blue-200/50',
    text: 'text-slate-900',
    accent: 'text-slate-700',
    accentBorder: 'border-slate-300'
  },
  leopard: {
    name: 'Silk Leopard',
    emoji: '🐆',
    bg: 'bg-amber-50/60',
    border: 'border-amber-200/50',
    text: 'text-amber-950',
    accent: 'text-amber-800',
    accentBorder: 'border-amber-300'
  },
  lion: {
    name: 'Royal Lion',
    emoji: '🦁',
    bg: 'bg-orange-50/60',
    border: 'border-orange-200/50',
    text: 'text-amber-900',
    accent: 'text-orange-855',
    accentBorder: 'border-orange-300'
  },
  fox: {
    name: 'Crafty Fox',
    emoji: '🦊',
    bg: 'bg-orange-50/40',
    border: 'border-orange-200/40',
    text: 'text-orange-950',
    accent: 'text-orange-800',
    accentBorder: 'border-orange-300'
  },
  tiger: {
    name: 'Fierce Tiger',
    emoji: '🐯',
    bg: 'bg-[#FFF9E6]/70',
    border: 'border-amber-350/40',
    text: 'text-amber-950',
    accent: 'text-amber-900',
    accentBorder: 'border-amber-300'
  },
  panda: {
    name: 'Gentle Panda',
    emoji: '🐼',
    bg: 'bg-neutral-50/70',
    border: 'border-neutral-200/60',
    text: 'text-neutral-950',
    accent: 'text-neutral-700',
    accentBorder: 'border-neutral-300'
  },
  wolf: {
    name: 'Noble Wolf',
    emoji: '🐺',
    bg: 'bg-slate-50/50',
    border: 'border-slate-200/50',
    text: 'text-slate-950',
    accent: 'text-slate-800',
    accentBorder: 'border-slate-350'
  }
};


const getThemeClasses = (tab: string, customColorMood: string = 'rose') => {
  let baseTheme = {
    bg: 'bg-white',
    text: 'text-[#3C2A1E]',
    selection: 'selection:bg-[#EAD6C0]/40',
    borderColor: 'border-[#D4AF37]/30',
    accentText: 'text-[#AA771C]',
    textMuted: 'text-[#8E7868]',
    buttonPrimary: 'bg-gradient-to-r from-[#AA771C] via-[#D4AF37] to-[#BF953F] text-white hover:opacity-90 shadow-[0_4px_15px_rgba(170,119,28,0.2)]',
    cardBg: 'bg-white shadow-[0_8px_32px_rgba(212,175,55,0.04)]',
    borderAccent: 'border-[#D4AF37]'
  };

  switch (tab) {
    case 'home':
      baseTheme = {
        bg: 'bg-white',
        text: 'text-[#3C2A1E]',
        selection: 'selection:bg-[#EAD6C0]/40',
        borderColor: 'border-[#D4AF37]/30',
        accentText: 'text-[#AA771C]',
        textMuted: 'text-[#8E7868]',
        buttonPrimary: 'bg-gradient-to-r from-[#AA771C] via-[#D4AF37] to-[#BF953F] text-white hover:opacity-90 shadow-[0_4px_15px_rgba(170,119,28,0.2)]',
        cardBg: 'bg-white shadow-[0_8px_32px_rgba(212,175,55,0.04)]',
        borderAccent: 'border-[#D4AF37]'
      };
      break;
    case 'collections':
      baseTheme = {
        bg: 'bg-white',
        text: 'text-[#4A1F25]',
        selection: 'selection:bg-[#EAAED4]/40',
        borderColor: 'border-[#B76E79]/45',
        accentText: 'text-[#B76E79]',
        textMuted: 'text-[#84575C]',
        buttonPrimary: 'bg-gradient-to-r from-[#B76E79] to-[#C37D6E] text-white hover:opacity-95 shadow-[0_4px_12px_rgba(183,110,121,0.2)]',
        cardBg: 'bg-white shadow-[0_8px_32px_rgba(183,110,121,0.03)]',
        borderAccent: 'border-[#B76E79]'
      };
      break;
    case 'designers':
      baseTheme = {
        bg: 'bg-white',
        text: 'text-[#1B4D3E]',
        selection: 'selection:bg-[#D4AF37]/40',
        borderColor: 'border-[#1B4D3E]/20',
        accentText: 'text-[#D4AF37]',
        textMuted: 'text-[#5E7A6E]',
        buttonPrimary: 'bg-gradient-to-r from-[#1B4D3E] to-[#2E7D63] text-white hover:opacity-95 shadow-[0_4px_15px_rgba(27,77,62,0.2)]',
        cardBg: 'bg-white shadow-[0_8px_32px_rgba(27,77,62,0.03)]',
        borderAccent: 'border-[#D4AF37]'
      };
      break;
    case 'chat':
      baseTheme = {
        bg: 'bg-white',
        text: 'text-[#2E1E3C]',
        selection: 'selection:bg-[#A3A1F7]/30',
        borderColor: 'border-[#8A2BE2]/20',
        accentText: 'text-[#8A2BE2]',
        textMuted: 'text-[#745E8C]',
        buttonPrimary: 'bg-gradient-to-r from-[#8A2BE2] to-[#B06AB3] text-white hover:opacity-95 shadow-[0_4px_12px_rgba(138,43,226,0.2)]',
        cardBg: 'bg-white shadow-[0_8px_32px_rgba(138,43,226,0.03)]',
        borderAccent: 'border-[#8A2BE2]'
      };
      break;
    case 'dashboard':
      baseTheme = {
        bg: 'bg-white',
        text: 'text-[#51182B]',
        selection: 'selection:bg-[#F3C5D0]/40',
        borderColor: 'border-[#E597A8]/35',
        accentText: 'text-[#E597A8]',
        textMuted: 'text-[#8E636F]',
        buttonPrimary: 'bg-gradient-to-r from-[#D4AF37] to-[#E597A8] text-white hover:opacity-90 shadow-[0_4px_15px_rgba(229,151,168,0.25)]',
        cardBg: 'bg-white shadow-[0_8px_32px_rgba(229,151,168,0.03)]',
        borderAccent: 'border-[#E597A8]'
      };
      break;
    case 'tracking':
      baseTheme = {
        bg: 'bg-white',
        text: 'text-[#4C2F1C]',
        selection: 'selection:bg-[#F39C12]/40',
        borderColor: 'border-[#F39C12]/40',
        accentText: 'text-[#F39C12]',
        textMuted: 'text-[#83634E]',
        buttonPrimary: 'bg-gradient-to-r from-[#F39C12] to-[#D35400] text-white hover:opacity-95 shadow-[0_4px_12px_rgba(243,156,18,0.2)]',
        cardBg: 'bg-white shadow-[0_8px_32px_rgba(243,156,18,0.03)]',
        borderAccent: 'border-[#F39C12]'
      };
      break;
    default:
      break;
  }

  // Inject user selected customized high-fashion luxury overrides
  if (customColorMood === 'gold') {
    return {
      ...baseTheme,
      bg: 'bg-white',
      text: 'text-[#3C2A1E]',
      accentText: 'text-[#AA771C]',
      borderColor: 'border-[#D4AF37]/35',
      textMuted: 'text-[#8E7868]',
      buttonPrimary: 'bg-gradient-to-r from-[#AA771C] via-[#D4AF37] to-[#BF953F] text-white hover:opacity-90 shadow-[0_4px_15px_rgba(170,119,28,0.2)]',
      cardBg: 'bg-white shadow-[0_8px_32px_rgba(212,175,55,0.04)]',
      borderAccent: 'border-[#D4AF37]'
    };
  } else if (customColorMood === 'rose') {
    return {
      ...baseTheme,
      bg: 'bg-white',
      text: 'text-[#6A162B]',
      accentText: 'text-[#B76E79]',
      borderColor: 'border-[#B76E79]/35',
      textMuted: 'text-[#84575C]',
      buttonPrimary: 'bg-gradient-to-r from-[#B76E79] via-[#E5A4B4] to-[#D4AF37] text-white hover:opacity-90 shadow-[0_4px_15px_rgba(183,110,121,0.25)]',
      cardBg: 'bg-white shadow-[0_8px_32px_rgba(183,110,121,0.03)]',
      borderAccent: 'border-[#B76E79]'
    };
  } else if (customColorMood === 'emerald') {
    return {
      ...baseTheme,
      bg: 'bg-white',
      text: 'text-[#1B4D3E]',
      accentText: 'text-[#D4AF37]',
      borderColor: 'border-[#1B4D3E]/25',
      textMuted: 'text-[#5E7A6E]',
      buttonPrimary: 'bg-gradient-to-r from-[#1B4D3E] via-[#2E7D63] to-[#D4AF37] text-white hover:opacity-90 shadow-[0_4px_15px_rgba(27,77,62,0.25)]',
      cardBg: 'bg-white shadow-[0_8px_32px_rgba(27,77,62,0.03)]',
      borderAccent: 'border-[#1B4D3E]'
    };
  } else if (customColorMood === 'violet') {
    return {
      ...baseTheme,
      bg: 'bg-white',
      text: 'text-[#2E1E3C]',
      accentText: 'text-[#8A2BE2]',
      borderColor: 'border-[#8A2BE2]/25',
      textMuted: 'text-[#745E8C]',
      buttonPrimary: 'bg-gradient-to-r from-[#8A2BE2] via-[#A3A1F7] to-[#B06AB3] text-white hover:opacity-90 shadow-[0_4px_15px_rgba(138,43,226,0.25)]',
      cardBg: 'bg-white shadow-[0_8px_32px_rgba(138,43,226,0.03)]',
      borderAccent: 'border-[#8A2BE2]'
    };
  } else if (customColorMood === 'wine') {
    return {
      ...baseTheme,
      bg: 'bg-white',
      text: 'text-[#4A1525]',
      accentText: 'text-[#D4AF37]',
      borderColor: 'border-[#D4AF37]/35',
      textMuted: 'text-[#82525E]',
      buttonPrimary: 'bg-gradient-to-r from-[#D4AF37] via-[#E5A4B4] to-[#B76E79] text-white hover:opacity-90 shadow-[0_4px_15px_rgba(183,110,121,0.25)]',
      cardBg: 'bg-white shadow-[0_8px_32px_rgba(183,110,121,0.04)]',
      borderAccent: 'border-[#D4AF37]'
    };
  }

  return baseTheme;
};

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || '';

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [activeTab, rawSetActiveTab] = useState<string>(() => {
    const isNewSession = !sessionStorage.getItem('anvaa_session_active');
    if (isNewSession) {
      sessionStorage.setItem('anvaa_session_active', 'true');
      localStorage.setItem('anvaa_active_tab', 'home');
      return 'home';
    }

    const savedTab = localStorage.getItem('anvaa_active_tab');
    if (savedTab) {
      const savedUser = localStorage.getItem('anvaa_user');
      if (!savedUser && (savedTab === 'dashboard' || savedTab === 'admin')) {
        return 'auth';
      }
      return savedTab;
    }
    return 'home';
  });

  const [isTransitioning, setIsTransitioning] = useState<boolean>(() => {
    const recentlySwitched = sessionStorage.getItem('anvaa_just_switched');
    return recentlySwitched === 'true';
  });
  const [transitionTab, setTransitionTab] = useState<string>(() => {
    const savedTab = localStorage.getItem('anvaa_active_tab');
    return savedTab || 'home';
  });

  useEffect(() => {
    if (isTransitioning) {
      sessionStorage.removeItem('anvaa_just_switched');
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const setActiveTab = (tab: string) => {
    if (tab === activeTab) return;
    localStorage.setItem('anvaa_active_tab', tab);
    sessionStorage.setItem('anvaa_just_switched', 'true');
    setTransitionTab(tab);
    setIsTransitioning(true);

    setTimeout(() => {
      window.location.reload();
    }, 850);
  };
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Video Atelier Showcase States
  const [videoSelectedSize, setVideoSelectedSize] = useState<string>('M');
  const [videoCustomNotes, setVideoCustomNotes] = useState<string>('');
  const [videoCarouselIdx, setVideoCarouselIdx] = useState<number>(0);
  const videoImageParallaxRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress: videoImageScrollProgress } = useScroll({
    target: videoImageParallaxRef,
    offset: ["start end", "end start"]
  });

  const yLeftCol = useTransform(videoImageScrollProgress, [0, 1], ["-40px", "40px"]);
  const yRightCol = useTransform(videoImageScrollProgress, [0, 1], ["40px", "-40px"]);
  const scaleCenter = useTransform(videoImageScrollProgress, [0, 1], [0.98, 1.12]);
  const rotateCenter = useTransform(videoImageScrollProgress, [0, 1], [-2, 2]);

  // Parallax Scroll Refs & Hooks
  const weddingSpotlightRef = React.useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 800], ["0px", "200px"]);

  const { scrollYProgress: weddingScrollProgress } = useScroll({
    target: weddingSpotlightRef,
    offset: ["start end", "end start"]
  });

  const yParallaxImage1 = useTransform(weddingScrollProgress, [0, 1], ["-60px", "60px"]);
  const yParallaxImage2 = useTransform(weddingScrollProgress, [0, 1], ["60px", "-60px"]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    localStorage.setItem('anvaa_active_tab', activeTab);
  }, [activeTab]);
  const [customColorMood, setCustomColorMood] = useState<string>('gold');
  const [products, setProducts] = useState<Product[]>([]);
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('anvaa_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('anvaa_cart', JSON.stringify(cart));
  }, [cart]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const savedUser = localStorage.getItem('anvaa_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  // Modals & Active Selections
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailedProduct, setDetailedProduct] = useState<(Product & { reviews?: any[] }) | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [isTrackingDocketModalOpen, setIsTrackingDocketModalOpen] = useState(false);
  const [docketModalOrder, setDocketModalOrder] = useState<Order | null>(null);
  const [activeAdPhoto, setActiveAdPhoto] = useState<number>(0);
  
  // Search & Filter
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Checkout Form States
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [addressName, setAddressName] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('Delhi');
  const [addressPincode, setAddressPincode] = useState('');
  const [addressPhone, setAddressPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI Block');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [ordersHistory, setOrdersHistory] = useState<Order[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);

  
  // Product Detail Selection
  const [detailSize, setDetailSize] = useState('M');
  const [detailImageIdx, setDetailImageIdx] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState<'peacock' | 'swan' | 'leopard' | 'lion' | 'fox' | 'tiger' | 'panda' | 'wolf'>('peacock');
  const [selectionSparkles, setSelectionSparkles] = useState<{ id: number; x: number; y: number; emoji: string; angle: number; speed: number; scale: number }[]>([]);

  const triggerMascotSparkles = (emoji: string, event: React.MouseEvent<HTMLButtonElement>, count: number = 6) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const newSparkles = Array.from({ length: count }).map((_, i) => ({
      id: Math.random() + i + Date.now(),
      x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 30,
      y: rect.top + rect.height / 2 + (Math.random() - 0.5) * 10,
      emoji: Math.random() > 0.45 ? emoji : '✨',
      angle: (Math.random() * Math.PI * 0.7) - Math.PI * 0.85,
      speed: Math.random() * 1.5 + 1.0,
      scale: Math.random() * 0.35 + 0.65
    }));
    setSelectionSparkles(prev => [...prev, ...newSparkles]);
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = (x - xc) / xc;
    const dy = (y - yc) / yc;

    // Upright position + cursor follow
    const rotateY = (dx * 15).toFixed(1);
    const rotateX = (-dy * 15).toFixed(1);

    card.style.setProperty('--card-rotate-x', `${rotateX}deg`);
    card.style.setProperty('--card-rotate-y', `${rotateY}deg`);
    card.style.setProperty('--card-rotate-z', '0deg');
    card.style.setProperty('--card-translate-z', '50px');
    card.style.setProperty('--card-scale', '1.05');

    // Details drawer open
    card.style.setProperty('--details-rotate-x', '0deg');
    card.style.setProperty('--details-translate-z', '0px');
    card.style.setProperty('--details-opacity', '1');

    card.style.transition = 'transform 0.1s ease-out, box-shadow 0.15s ease-out';
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    // Settle back to default isometric tilt
    card.style.setProperty('--card-rotate-x', '12deg');
    card.style.setProperty('--card-rotate-y', '-12deg');
    card.style.setProperty('--card-rotate-z', '2deg');
    card.style.setProperty('--card-translate-z', '0px');
    card.style.setProperty('--card-scale', '1');

    // Details drawer close
    card.style.setProperty('--details-rotate-x', '-30deg');
    card.style.setProperty('--details-translate-z', '-20px');
    card.style.setProperty('--details-opacity', '0.7');

    card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s ease-out';
  };

  const [isZoomed, setIsZoomed] = useState(false);
  const [showProfileGuide, setShowProfileGuide] = useState(false);

  // Profile Editing States

  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileConfirmPassword, setProfileConfirmPassword] = useState('');
  const [profileStreet, setProfileStreet] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [profileState, setProfileState] = useState('Delhi');
  const [profilePincode, setProfilePincode] = useState('');

  // Handle Avatar profile picture file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || '');
      setProfilePhone(currentUser.phone || '');
      setProfileAvatar(currentUser.avatar || '');
      if (currentUser.savedAddresses && currentUser.savedAddresses.length > 0) {
        const addr = currentUser.savedAddresses[0];
        setProfileStreet(addr.street || '');
        setProfileCity(addr.city || '');
        setProfileState(addr.state || 'Delhi');
        setProfilePincode(addr.pincode || '');
      } else {
        setProfileStreet('');
        setProfileCity('');
        setProfileState('Delhi');
        setProfilePincode('');
      }
      fetchWishlist();
    } else {
      const local = localStorage.getItem('anvaa_wishlist');
      setWishlist(local ? JSON.parse(local) : []);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('anvaa_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('anvaa_user');
    }
  }, [currentUser]);

  // Load Initial Data
  const fetchProducts = async () => {
    setIsProductsLoading(true);
    try {
      // Intentional subtle delay for elite shimmering feel
      await new Promise((resolve) => setTimeout(resolve, 750));
      const res = await fetch(`${API_BASE_URL}/api/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error("Failed to load products", e);
    } finally {
      setIsProductsLoading(false);
    }
  };

  const fetchDesigners = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/designers`);
      if (res.ok) {
        const data = await res.json();
        setDesigners(data);
      }
    } catch (e) {
      console.error("Failed to load designers", e);
    }
  };

  const fetchWishlist = async () => {
    try {
      if (currentUser) {
        const res = await fetch(`${API_BASE_URL}/api/wishlist?userId=${currentUser._id || currentUser.id}`);
        if (res.ok) {
          const data = await res.json();
          setWishlist(data);
          return;
        }
      }
      const local = localStorage.getItem('anvaa_wishlist');
      if (local) {
        setWishlist(JSON.parse(local));
      } else {
        setWishlist([]);
      }
    } catch (e) {
      console.error("Failed to load wishlist", e);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchDesigners();
    fetchWishlist();

    // Auto-login with test VIP account for delightful instant UX disabled on mount
    // handleAutoLogin();
  }, []);

  // Load selectedProduct and detailedProduct from localStorage on mount/products load if activeTab is 'product-detail'
  useEffect(() => {
    const fetchDetailedProduct = async () => {
      const savedProductId = localStorage.getItem('anvaa_selected_product_id');
      if (savedProductId) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/products/${savedProductId}`);
          if (res.ok) {
            const data = await res.json();
            setDetailedProduct(data);
            setSelectedProduct(data);
            const savedSize = localStorage.getItem('anvaa_detail_size') || data.sizes?.[0] || 'M';
            setDetailSize(savedSize);
            const savedImgIdx = Number(localStorage.getItem('anvaa_detail_image_idx') || '0');
            setDetailImageIdx(savedImgIdx);
          } else {
            const prod = products.find(p => p.id === savedProductId || p._id === savedProductId);
            if (prod) {
              setDetailedProduct(prod);
              setSelectedProduct(prod);
              const savedSize = localStorage.getItem('anvaa_detail_size') || prod.sizes?.[0] || 'M';
              setDetailSize(savedSize);
              const savedImgIdx = Number(localStorage.getItem('anvaa_detail_image_idx') || '0');
              setDetailImageIdx(savedImgIdx);
            }
          }
        } catch (e) {
          console.error("Failed to load detailed product", e);
          const prod = products.find(p => p.id === savedProductId || p._id === savedProductId);
          if (prod) {
            setDetailedProduct(prod);
            setSelectedProduct(prod);
            const savedSize = localStorage.getItem('anvaa_detail_size') || prod.sizes?.[0] || 'M';
            setDetailSize(savedSize);
            const savedImgIdx = Number(localStorage.getItem('anvaa_detail_image_idx') || '0');
            setDetailImageIdx(savedImgIdx);
          }
        }
      }
    };

    if (activeTab === 'product-detail') {
      fetchDetailedProduct();
    } else {
      setDetailedProduct(null);
    }
  }, [activeTab, products]);

  // GSAP and Scroll animations on activeTab transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (activeTab === 'dashboard') {
      setShowProfileGuide(false);
    }
    
    // Auto-refresh states and video when moving to video-detail page
    if (activeTab === 'video-detail') {
      setVideoSelectedSize('M');
      setVideoCustomNotes('');
      setTimeout(() => {
        const videoEl = document.querySelector('video') as HTMLVideoElement;
        if (videoEl) {
          videoEl.currentTime = 0;
          videoEl.play().catch(() => {});
        }
      }, 50);
    }

    if (activeTab === 'home') {
      // Small delay to ensure the elements are mounted in the DOM after tab transition
      setTimeout(() => {
        if (document.querySelector('.gsap-hero-title')) {
          gsap.fromTo('.gsap-hero-title', 
            { opacity: 0, y: 70, skewY: 5 }, 
            { opacity: 1, y: 0, skewY: 0, duration: 1.2, ease: "power4.out", delay: 0.1 }
          );
        }
        if (document.querySelector('.gsap-hero-fade')) {
          gsap.fromTo('.gsap-hero-fade', 
            { opacity: 0, y: 30 }, 
            { opacity: 1, y: 0, duration: 1.0, stagger: 0.15, ease: "power3.out", delay: 0.4 }
          );
        }
        if (document.querySelector('.gsap-floating-card')) {
          gsap.fromTo('.gsap-floating-card',
            { y: 15 },
            { y: -15, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" }
          );
        }
      }, 100);
    }
  }, [activeTab]);

  // GSAP 3D Entrance reveal animations for Collections catalog page
  useEffect(() => {
    if (activeTab === 'collections' && products.length > 0) {
      const timer = setTimeout(() => {
        // Staggered reveal of collections card deck in 3D
        if (document.querySelectorAll('.gsap-collections-card').length > 0) {
          const cards = document.querySelectorAll('.gsap-collections-card');
          cards.forEach(card => {
            const el = card as HTMLElement;
            el.style.setProperty('--card-rotate-x', '12deg');
            el.style.setProperty('--card-rotate-y', '-12deg');
            el.style.setProperty('--card-rotate-z', '2deg');
            el.style.setProperty('--card-translate-z', '0px');
            el.style.setProperty('--card-scale', '1');
            el.style.setProperty('--details-rotate-x', '-30deg');
            el.style.setProperty('--details-translate-z', '-20px');
            el.style.setProperty('--details-opacity', '0.7');
          });

          gsap.fromTo('.gsap-collections-card', 
            { 
              opacity: 0, 
              y: 80, 
              rotateX: 30, 
              rotateY: -20, 
              z: -150 
            }, 
            { 
              opacity: 1, 
              y: 0, 
              rotateX: 12, 
              rotateY: -12, 
              z: 0, 
              duration: 1.0, 
              stagger: 0.08, 
              ease: "power3.out",
              clearProps: "transform"
            }
          );
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [activeTab, products]);

  // Elegant GSAP Scroll-Reveal animations for Product Details page
  useEffect(() => {
    if (activeTab === 'product-detail' && detailedProduct) {
      const timer = setTimeout(() => {
        // 1. Reveal header
        if (document.querySelector('.gsap-reveal-header')) {
          gsap.fromTo('.gsap-reveal-header', 
            { opacity: 0, y: -25 }, 
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
          );
        }

        // 2. Reveal image gallery (fade-in, gentle rise, skew)
        if (document.querySelector('.gsap-reveal-gallery')) {
          gsap.fromTo('.gsap-reveal-gallery', 
            { opacity: 0, y: 50, skewY: 2 }, 
            { opacity: 1, y: 0, skewY: 0, duration: 1.0, ease: "power4.out" }
          );
        }

        // 3. Reveal details configuration & text (staggered fade-in, gentle rise, skew)
        if (document.querySelectorAll('.gsap-reveal-text').length > 0) {
          gsap.fromTo('.gsap-reveal-text', 
            { opacity: 0, y: 35, skewX: -2 }, 
            { opacity: 1, y: 0, skewX: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" }
          );
        }

        // 4. Scroll reveal for critique submission form & live preview
        if (document.querySelector('.gsap-reveal-critique-form')) {
          ScrollTrigger.create({
            trigger: '.gsap-reveal-critique-form',
            start: 'top 85%',
            onEnter: () => {
              gsap.fromTo('.gsap-reveal-critique-form', 
                { opacity: 0, y: 40, skewY: 1.5 }, 
                { opacity: 1, y: 0, skewY: 0, duration: 1.0, ease: "power3.out" }
              );
            },
            once: true
          });
        }

        // 5. Scroll reveal for review list & individual cards (staggered)
        if (document.querySelector('.gsap-reveal-reviews-list') && document.querySelectorAll('.gsap-reveal-review-card').length > 0) {
          ScrollTrigger.create({
            trigger: '.gsap-reveal-reviews-list',
            start: 'top 85%',
            onEnter: () => {
              gsap.fromTo('.gsap-reveal-review-card', 
                { opacity: 0, y: 45, skewY: 3 }, 
                { opacity: 1, y: 0, skewY: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" }
              );
            },
            once: true
          });
        }

      }, 100);

      return () => {
        clearTimeout(timer);
        // Clean up ScrollTrigger instances to prevent leaks
        ScrollTrigger.getAll().forEach(t => t.kill());
      };
    }
  }, [activeTab, detailedProduct]);

  // Programmatically force autoplay and muting of all video elements on tab or carousel index change
  useEffect(() => {
    const forceAutoplay = () => {
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        video.muted = true;
        video.playsInline = true;
        
        // Force play
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Autoplay was prevented by browser, waiting for user click.", error);
          });
        }
      });
    };

    // Run immediately and after a short timeout to let transitions complete
    forceAutoplay();
    const timer = setTimeout(forceAutoplay, 150);
    return () => clearTimeout(timer);
  }, [activeTab, videoCarouselIdx]);

  const handleAutoLogin = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'codewithvibe64@gmail.com' }) // VIP Member
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        
        // Populate Checkout Form fields automatically for smooth order test
        if (data.user.savedAddresses && data.user.savedAddresses.length > 0) {
          const addr = data.user.savedAddresses[0];
          setAddressName(addr.name);
          setAddressStreet(addr.street);
          setAddressCity(addr.city);
          setAddressState(addr.state);
          setAddressPincode(addr.pincode);
          setAddressPhone(addr.phone);
        }
      }
    } catch (err) {
      console.error("Auto login error", err);
    }
  };

  const fetchOrdersHistory = async () => {
    if (!currentUser) return;
    setIsOrdersLoading(true);
    try {
      // Intentional subtle delay for elite shimmering feel
      await new Promise((resolve) => setTimeout(resolve, 600));
      const res = await fetch(`${API_BASE_URL}/api/orders/user/${currentUser._id || currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        const sorted = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrdersHistory(sorted);
      }
    } catch (err) {
      console.error("Order history fetch error", err);
    } finally {
      setIsOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchOrdersHistory();
    } else {
      setOrdersHistory([]);
    }
  }, [currentUser, placedOrder]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (profilePassword && profilePassword !== profileConfirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser._id || currentUser.id,
          name: profileName,
          phone: profilePhone,
          avatar: profileAvatar,
          password: profilePassword || undefined,
          address: {
            name: profileName,
            street: profileStreet,
            city: profileCity,
            state: profileState,
            pincode: profilePincode,
            phone: profilePhone
          }
        })
      });

      const data = await response.json();
      if (response.ok) {
        setCurrentUser(data.user);
        setProfilePassword('');
        setProfileConfirmPassword('');
        showToast("Profile details updated successfully in the MongoDB Atlas registry.", "success");
      } else {
        showToast(data.error || "Failed to update profile.", "error");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      showToast("Connection to update profile failed.", "error");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast("Logged out from the ANVAA VIP studio session.", 'info');
    setActiveTab('home');
  };

  // Wishlist Actions
  const handleToggleWishlist = async (productId: string) => {
    try {
      if (currentUser) {
        const res = await fetch(`${API_BASE_URL}/api/wishlist/toggle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, userId: currentUser._id || currentUser.id })
        });
        if (res.ok) {
          const data = await res.json();
          setWishlist(data.wishlist);
        }
      } else {
        const local = localStorage.getItem('anvaa_wishlist');
        let currentWishlist: string[] = local ? JSON.parse(local) : [];
        const idx = currentWishlist.indexOf(productId);
        if (idx !== -1) {
          currentWishlist.splice(idx, 1);
        } else {
          currentWishlist.push(productId);
        }
        localStorage.setItem('anvaa_wishlist', JSON.stringify(currentWishlist));
        setWishlist(currentWishlist);
        showToast("Added item to your temporary favorites. Sign in to save permanently.", "info");
      }
    } catch (err) {
      console.error("Wishlist action failed", err);
    }
  };

  // Cart Actions
  const handleAddToCart = (product: Product, size: string, customMeasurements?: string) => {
    const existing = cart.find(item => item.product.id === product.id && item.selectedSize === size && item.customMeasurements === customMeasurements);
    if (existing) {
      setCart(cart.map(item => 
        (item.product.id === product.id && item.selectedSize === size && item.customMeasurements === customMeasurements)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1, selectedSize: size, customMeasurements }]);
    }
    // Animated trigger effect
    setIsCartOpen(true);
  };

  const handleReorderItem = (product: Product, size: string) => {
    handleAddToCart(product, size || 'M');
  };

  const handleUpdateCartQty = (productId: string, size: string, qty: number, customMeasurements?: string) => {
    if (qty <= 0) {
      setCart(cart.filter(item => !(item.product.id === productId && item.selectedSize === size && item.customMeasurements === customMeasurements)));
    } else {
      setCart(cart.map(item => 
        (item.product.id === productId && item.selectedSize === size && item.customMeasurements === customMeasurements)
          ? { ...item, quantity: qty }
          : item
      ));
    }
  };

  const handleRemoveCartItem = (productId: string, size: string, customMeasurements?: string) => {
    setCart(cart.filter(item => !(item.product.id === productId && item.selectedSize === size && item.customMeasurements === customMeasurements)));
  };

  // Checkout Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const promoAppliedText = couponDiscount > 0 ? "10% VIP DISCOUNT APPLIED" : "";
  const calculatedDiscount = cartSubtotal * couponDiscount;
  const deliveryFreight = cartSubtotal > 50000 ? 0 : 450;
  const cartTotal = Math.max(0, cartSubtotal - calculatedDiscount + deliveryFreight);

  const applyPromo = () => {
    if (couponCode.toUpperCase() === 'ANVAANEW') {
      setCouponDiscount(0.10);
      showToast("✦ 10% First Order Heritage discount code accepted!", 'success');
    } else {
      showToast("Invalid or expired elite invitation code.", 'error');
    }
  };

  // Complete Order
  const handleCompleteOrder = async () => {
    if (!currentUser) {
      showToast("Bespoke orders require VIP account registration.", 'error');
      setIsAuthOpen(true);
      return;
    }
    if (!addressName || !addressStreet || !addressCity || !addressPincode || !addressPhone) {
      showToast("Standard couture shipments need complete delivery address information.", 'error');
      return;
    }

    const payload = {
      userId: currentUser._id || currentUser.id,
      items: cart,
      subtotal: cartSubtotal,
      discount: calculatedDiscount,
      shipping: deliveryFreight,
      total: cartTotal,
      address: {
        id: "addr_checkout",
        name: addressName,
        street: addressStreet,
        city: addressCity,
        state: addressState,
        pincode: addressPincode,
        phone: addressPhone
      },
      paymentMethod
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setPlacedOrder(data.order);
        setCart([]); // Reset
        setIsCheckoutMode(false);
        setIsCartOpen(false);
        setTrackingOrder(data.order);
        setActiveTab('tracking');
        showToast(`Congratulations! Premium Order ${data.order.id} is recorded with ANVAA Ateliers.`, 'success');
      }
    } catch (err) {
      console.error("Checkout process failed", err);
    }
  };

  // Book physical or virtual consultation
  const handleBookConsultation = async (consultData: any): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/consultations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultData)
      });
      if (res.ok) {
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Product reviews
  const handleSubmitReview = async (productId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
          userName: `${reviewName || currentUser?.name || "Premium Client"} ${ANIMAL_TEMPLATES[selectedAnimal].emoji}`
        })
      });

      if (res.ok) {
        showToast("Your refined critique has been recorded with the design salon.", 'success');
        setReviewComment('');
        setReviewRating(5);
        setReviewName('');
        setSelectedAnimal('peacock');
        if (activeTab === 'product-detail') {
          // Re-fetch detailed product
          const detailRes = await fetch(`${API_BASE_URL}/api/products/${productId}`);
          if (detailRes.ok) {
            const data = await detailRes.json();
            setDetailedProduct(data);
            setSelectedProduct(data);
          }
        } else {
          setSelectedProduct(null); // Close modal
        }
        fetchProducts(); // Refresh
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setDetailSize(product.sizes?.[0] || 'M');
    setDetailImageIdx(0);
  };

  const handleOpenProductDetailsPage = (product: Product) => {
    localStorage.setItem('anvaa_selected_product_id', product.id || product._id || '');
    localStorage.setItem('anvaa_detail_size', product.sizes?.[0] || 'M');
    localStorage.setItem('anvaa_detail_image_idx', '0');
    setActiveTab('product-detail');
  };

  const handleContactDesigner = (d: Designer) => {
    // Navigate straight to atelier chat and coordinate channels
    setActiveTab('chat');
  };

  // Render trending products
  const trendingProducts = products.filter(p => p.isTrending);

  // Categorized products for collection screen
  const filteredProducts = products.filter(p => {
    const matchCat = filterCategory === 'All' || p.category === filterCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const theme = getThemeClasses(activeTab, customColorMood);

  return (
    <div className={`min-h-screen ${theme.bg} font-sans ${theme.text} ${theme.selection} flex flex-col justify-between transition-all duration-[800ms] ease-in-out`}>
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#AA771C] via-[#D4AF37] to-[#BF953F] origin-left z-[9999] shadow-[0_1px_6px_rgba(212,175,55,0.3)]"
        style={{ scaleX }}
      />
      {/* Dynamic Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenCart={() => setIsCartOpen(true)}
        customColorMood={customColorMood}
        setCustomColorMood={setCustomColorMood}
        showProfileGuide={showProfileGuide}
      />

      {/* RENDER ACTIVE TAB BODY */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {/* 1. HOME VIEW */}
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.995 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-20"
            >
            
            {/* FULLSCREEN HERO METROPOLIS */}
            <section className="relative h-[90vh] bg-[#FFFBFB] text-[#4A1525] flex items-center overflow-hidden border-b border-[#D4AF37]/25">
              <motion.div 
                style={{ 
                  backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600')",
                  y: yHero
                }}
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 mix-blend-multiply scale-110 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFFBFB] via-[#FFFBFB]/90 to-transparent"></div>
              
              <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full z-10 relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-8">
                  
                  <div className="inline-flex items-center gap-3 text-[#B76E79]">
                    <div className="w-8 h-px bg-[#B76E79]"></div>
                    <span className="text-[11px] uppercase tracking-[0.3em] font-black">ANVAA Spring Atelier 2026</span>
                  </div>

                  {/* Bold Typography Title with GSAP animation classes */}
                  <h1 className="gsap-hero-title text-6xl md:text-[100px] leading-[0.85] font-serif italic mb-6 tracking-tighter text-[#4A1525] font-extrabold uppercase select-none">
                    Modern <br/>
                    <span className="gold-text-gradient">Heritage</span>
                  </h1>

                  <p className="gsap-hero-fade max-w-lg text-[#82525E] text-sm md:text-base leading-relaxed font-light italic font-serif">
                    "Reimagining pure Indian handlooms, Royal Banarasi weaves, and structural boardroom suits tailored for ambitious young professional women in India."
                  </p>

                  <div className="gsap-hero-fade flex flex-wrap gap-4 pt-4">
                    <button 
                      onClick={() => { setActiveTab('collections'); setFilterCategory('All'); }}
                      className="bg-gradient-to-r from-[#D4AF37] to-[#B76E79] hover:opacity-90 text-white px-10 py-4 text-xs font-black uppercase tracking-widest transition-all shadow-xl cursor-pointer rounded-full"
                    >
                      Explore Capsule
                    </button>
                    <button 
                      onClick={() => setActiveTab('designers')}
                      className="border border-[#D4AF37] hover:bg-[#D4AF37]/5 text-[#D4AF37] bg-white px-10 py-4 text-xs font-black uppercase tracking-widest transition-all cursor-pointer rounded-full"
                    >
                      Atelier Consultations
                    </button>
                  </div>

                </div>

                <div className="lg:col-span-5 hidden lg:block relative gsap-floating-card">
                  <div className="bg-[#FFFDFB]/95 backdrop-blur-md p-10 rounded-3xl border border-[#D4AF37]/20 shadow-[0_15px_45px_rgba(212,175,55,0.12)] space-y-6">
                    <span className="text-[10px] uppercase tracking-widest font-black text-[#B76E79]">LIMITED MASTERPIECE PREVIEW</span>
                    <h3 className="text-2xl font-serif italic text-[#4A1525]">The Banarasi Gold Thread Saree</h3>
                    <p className="text-xs text-[#82525E] font-light italic font-serif">
                      Pure 24k gold-plated thread alignments certified by legendary weavers guild. Fully customized blouse measurements inside direct message atelier.
                    </p>
                    <div className="h-0.5 w-full bg-[#D4AF37]/20 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-gradient-to-r from-[#D4AF37] to-[#B76E79]"></div>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-[#82525E]">
                      <span>Limited Issue: No. 07 of 15</span>
                      <span className="text-[#D4AF37] font-bold">₹2,45,000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky bottom indicator */}
              <div className="absolute right-12 bottom-12 hidden md:flex flex-col gap-3 items-center">
                <div className="w-px h-16 bg-[#D4AF37]/50"></div>
                <div className="rotate-90 origin-center translate-y-8 text-[9px] uppercase tracking-[0.4em] font-black text-[#D4AF37]">Scroll down</div>
              </div>
            </section>
            <section className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
              <motion.div 
                className="text-center md:text-left mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#D4AF37] block mb-2">SHOP THE VISION</span>
                <h2 className={`text-3xl lg:text-4xl font-serif italic ${theme.text}`}>Curated Capsules</h2>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: 0.15
                    }
                  }
                }}
              >
                {[
                  { cat: 'Wedding Collection', title: 'Wedding Luxe', desc: 'Sangeet, lehengas & heavy zardozi.', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600' },
                  { cat: 'Office Wear', title: 'Office Chic', desc: 'Structured crepe suits & crisp drapes.', img: 'https://images.unsplash.com/photo-1548624149-f7b3e6432b42?q=80&w=600' },
                  { cat: 'Casual Wear', title: 'Resort Flow', desc: 'Effortless blocked silks & cotton midis.', img: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=600' }
                ].map((capsule, i) => (
                  <motion.div 
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
                    }}
                    onClick={() => { setFilterCategory(capsule.cat); setActiveTab('collections'); }}
                    className="group cursor-pointer relative h-96 overflow-hidden rounded-xl bg-neutral-900 border border-[#D4AF37]/15 shadow-sm scroll-zoom-container"
                  >
                    <img 
                      src={capsule.img} 
                      alt={capsule.title} 
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 scroll-zoom-img" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-8">
                      <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-black mb-1">CAPSULE COLLECTION</span>
                      <h3 className="text-2xl font-serif italic text-white font-bold">{capsule.title}</h3>
                      <p className="text-xs text-neutral-200 italic font-serif leading-relaxed mt-1 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {capsule.desc}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest">
                        <span>Enter Salon</span>
                        <ArrowRight size={12} className="text-[#D4AF37]" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </section>

            {/* Curated Dress Sections by Category */}
            {products.length > 0 && (
              <>
                {/* 1. Wedding Dress Collection */}
                <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 border-t border-[#D4AF37]/15">
                  <motion.div 
                    className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6 }}
                  >
                    <div>
                      <span className="text-[10px] id-section uppercase tracking-[0.3em] font-black text-[#D4AF37] block">THE BRIDAL SALON</span>
                      <h2 className={`text-3xl lg:text-4xl font-serif italic ${theme.text}`}>Wedding Dress Collection</h2>
                    </div>
                    <button 
                      onClick={() => { setFilterCategory('Wedding Collection'); setActiveTab('collections'); }}
                      className="text-xs uppercase tracking-widest font-bold underline underline-offset-4 hover:text-[#D4AF37] transition-all cursor-pointer text-[#B76E79]"
                    >
                      View All Bridal Pieces
                    </button>
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.filter(p => p.category === 'Wedding Collection').slice(0, 4).map((p) => (
                      <div 
                        key={p.id} 
                        className="group relative w-full h-[470px] [perspective:1200px] cursor-pointer"
                        onClick={() => handleOpenProductDetailsPage(p)}
                      >
                        <div className="relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateX(60deg)_rotateY(-10deg)_translateY(-30px)]">
                          <div className="absolute inset-0 bg-white rounded-2xl border border-neutral-100 shadow-sm transition-all duration-700 ease-out origin-bottom [transform-style:preserve-3d] group-hover:[transform:rotateX(90deg)] group-hover:shadow-xl z-10">
                            <div className="absolute inset-0 bg-[#FAF5EF]/95 rounded-2xl border border-[#D4AF37]/20 [transform:rotateX(0deg)] [backface-visibility:hidden] flex items-center justify-center p-6">
                              <div className="border border-[#D4AF37]/15 m-2 inset-0 absolute rounded-xl pointer-events-none"></div>
                            </div>
                          </div>

                          <div className="absolute top-4 left-4 right-4 h-64 rounded-xl bg-neutral-100 transition-all duration-700 ease-out origin-bottom group-hover:[transform:rotateX(90deg)_translateZ(2px)] z-15">
                            <div className="absolute inset-0 bg-[#4A1525]/5 rounded-xl"></div>
                          </div>

                          <div 
                            onClick={(e) => { e.stopPropagation(); handleOpenProductDetailsPage(p); }}
                            className="absolute top-4 left-4 right-4 h-64 rounded-xl overflow-hidden transition-all duration-700 ease-out origin-bottom [transform-style:preserve-3d] group-hover:[transform:rotateY(10deg)_rotateX(-60deg)_translateZ(35px)_translateY(-40px)] z-25"
                          >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl p-[2px] bg-black overflow-hidden z-0">
                              <div className="absolute inset-[-200%] bg-[conic-gradient(from_0deg,#ff0000,#ff7700,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)] animate-[spin_4s_linear_infinite]" />
                            </div>

                            <div className="absolute inset-[2px] bg-neutral-100 rounded-xl overflow-hidden z-10">
                              <img 
                                src={p.images[0]} 
                                alt={p.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 rounded-xl" 
                              />
                              {p.stock <= 3 && (
                                <div className="absolute bottom-3 left-3 bg-[#4A1525] text-white text-[8px] font-mono tracking-widest px-2.5 py-1 uppercase rounded-md font-bold shadow-md">
                                  ONLY {p.stock} ATELIER PIECES LEFT
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="absolute bottom-4 left-4 right-4 h-32 bg-neutral-50 rounded-xl border border-neutral-100 transition-all duration-700 ease-out origin-bottom group-hover:[transform:rotateX(90deg)_translateZ(4px)] z-15"></div>

                          <div className="absolute bottom-4 left-4 right-4 p-5 bg-white border border-neutral-100 rounded-xl shadow-sm transition-all duration-700 ease-out origin-bottom [transform-style:preserve-3d] group-hover:[transform:rotateY(10deg)_rotateX(-60deg)_translateZ(65px)_translateY(-15px)] group-hover:bg-[#FAF5EF] group-hover:border-[#D4AF37]/35 group-hover:shadow-xl z-30">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <span className="text-[9px] uppercase font-bold tracking-widest text-[#B76E79] font-mono">{p.category}</span>
                                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                                  <Star size={11} className="fill-[#D4AF37] text-[#D4AF37]" />
                                  <span className={`text-[10px] font-mono ${theme.text} font-semibold`}>{p.rating}</span>
                                </div>
                              </div>
                              
                              <h4 
                                onClick={(e) => { e.stopPropagation(); handleOpenProductDetailsPage(p); }}
                                className={`font-serif italic text-base font-bold ${theme.text} cursor-pointer hover:text-[#D4AF37] transition-all truncate`}
                              >
                                {p.name}
                              </h4>

                              {p.designerName && (
                                <p className="text-[11px] text-[#8E7868] font-serif italic">Curated by {p.designerName}</p>
                              )}

                              <div className="flex justify-between items-center pt-3 border-t border-neutral-100">
                                <p className={`text-sm font-bold ${theme.text} font-mono`}>₹{p.price.toLocaleString('en-IN')}</p>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleAddToCart(p, p.sizes?.[0] || 'M'); }}
                                  className="text-[10px] uppercase font-bold text-[#D4AF37] hover:text-[#B76E79] transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <span>Enlist Bag</span>
                                  <ArrowRight size={11} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <motion.button 
                          onClick={(e) => { e.stopPropagation(); handleToggleWishlist(p.id); }}
                          className="absolute top-8 right-8 z-40 bg-white/80 hover:bg-white backdrop-blur-md p-2 rounded-full cursor-pointer border shadow-sm text-neutral-400 hover:text-[#B76E79]"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.85 }}
                          animate={wishlist.includes(p.id) ? { scale: [1, 1.45, 0.9, 1.25, 0.95, 1] } : { scale: 1 }}
                        >
                          <Heart size={13} className={wishlist.includes(p.id) ? "fill-[#B76E79] text-[#B76E79]" : ""} />
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 2. Office Wear Collection */}
                <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 border-t border-[#D4AF37]/15">
                  <motion.div 
                    className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6 }}
                  >
                    <div>
                      <span className="text-[10px] id-section uppercase tracking-[0.3em] font-black text-[#D4AF37] block">STRUCTURED CREPES</span>
                      <h2 className={`text-3xl lg:text-4xl font-serif italic ${theme.text}`}>Office Wear Collection</h2>
                    </div>
                    <button 
                      onClick={() => { setFilterCategory('Office Wear'); setActiveTab('collections'); }}
                      className="text-xs uppercase tracking-widest font-bold underline underline-offset-4 hover:text-[#D4AF37] transition-all cursor-pointer text-[#B76E79]"
                    >
                      View All Office Wear
                    </button>
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.filter(p => p.category === 'Office Wear').slice(0, 4).map((p) => (
                      <div 
                        key={p.id} 
                        className="group relative w-full h-[470px] [perspective:1200px] cursor-pointer"
                        onClick={() => handleOpenProductDetailsPage(p)}
                      >
                        <div className="relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateX(60deg)_rotateY(-10deg)_translateY(-30px)]">
                          <div className="absolute inset-0 bg-white rounded-2xl border border-neutral-100 shadow-sm transition-all duration-700 ease-out origin-bottom [transform-style:preserve-3d] group-hover:[transform:rotateX(90deg)] group-hover:shadow-xl z-10">
                            <div className="absolute inset-0 bg-[#FAF5EF]/95 rounded-2xl border border-[#D4AF37]/20 [transform:rotateX(0deg)] [backface-visibility:hidden] flex items-center justify-center p-6">
                              <div className="border border-[#D4AF37]/15 m-2 inset-0 absolute rounded-xl pointer-events-none"></div>
                            </div>
                          </div>

                          <div className="absolute top-4 left-4 right-4 h-64 rounded-xl bg-neutral-100 transition-all duration-700 ease-out origin-bottom group-hover:[transform:rotateX(90deg)_translateZ(2px)] z-15">
                            <div className="absolute inset-0 bg-[#4A1525]/5 rounded-xl"></div>
                          </div>

                          <div 
                            onClick={(e) => { e.stopPropagation(); handleOpenProductDetailsPage(p); }}
                            className="absolute top-4 left-4 right-4 h-64 rounded-xl overflow-hidden transition-all duration-700 ease-out origin-bottom [transform-style:preserve-3d] group-hover:[transform:rotateY(10deg)_rotateX(-60deg)_translateZ(35px)_translateY(-40px)] z-25"
                          >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl p-[2px] bg-black overflow-hidden z-0">
                              <div className="absolute inset-[-200%] bg-[conic-gradient(from_0deg,#ff0000,#ff7700,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)] animate-[spin_4s_linear_infinite]" />
                            </div>

                            <div className="absolute inset-[2px] bg-neutral-100 rounded-xl overflow-hidden z-10">
                              <img 
                                src={p.images[0]} 
                                alt={p.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 rounded-xl" 
                              />
                              {p.stock <= 3 && (
                                <div className="absolute bottom-3 left-3 bg-[#4A1525] text-white text-[8px] font-mono tracking-widest px-2.5 py-1 uppercase rounded-md font-bold shadow-md">
                                  ONLY {p.stock} ATELIER PIECES LEFT
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="absolute bottom-4 left-4 right-4 h-32 bg-neutral-50 rounded-xl border border-neutral-100 transition-all duration-700 ease-out origin-bottom group-hover:[transform:rotateX(90deg)_translateZ(4px)] z-15"></div>

                          <div className="absolute bottom-4 left-4 right-4 p-5 bg-white border border-neutral-100 rounded-xl shadow-sm transition-all duration-700 ease-out origin-bottom [transform-style:preserve-3d] group-hover:[transform:rotateY(10deg)_rotateX(-60deg)_translateZ(65px)_translateY(-15px)] group-hover:bg-[#FAF5EF] group-hover:border-[#D4AF37]/35 group-hover:shadow-xl z-30">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <span className="text-[9px] uppercase font-bold tracking-widest text-[#B76E79] font-mono">{p.category}</span>
                                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                                  <Star size={11} className="fill-[#D4AF37] text-[#D4AF37]" />
                                  <span className={`text-[10px] font-mono ${theme.text} font-semibold`}>{p.rating}</span>
                                </div>
                              </div>
                              
                              <h4 
                                onClick={(e) => { e.stopPropagation(); handleOpenProductDetailsPage(p); }}
                                className={`font-serif italic text-base font-bold ${theme.text} cursor-pointer hover:text-[#D4AF37] transition-all truncate`}
                              >
                                {p.name}
                              </h4>

                              {p.designerName && (
                                <p className="text-[11px] text-[#8E7868] font-serif italic">Curated by {p.designerName}</p>
                              )}

                              <div className="flex justify-between items-center pt-3 border-t border-neutral-100">
                                <p className={`text-sm font-bold ${theme.text} font-mono`}>₹{p.price.toLocaleString('en-IN')}</p>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleAddToCart(p, p.sizes?.[0] || 'M'); }}
                                  className="text-[10px] uppercase font-bold text-[#D4AF37] hover:text-[#B76E79] transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <span>Enlist Bag</span>
                                  <ArrowRight size={11} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <motion.button 
                          onClick={(e) => { e.stopPropagation(); handleToggleWishlist(p.id); }}
                          className="absolute top-8 right-8 z-40 bg-white/80 hover:bg-white backdrop-blur-md p-2 rounded-full cursor-pointer border shadow-sm text-neutral-400 hover:text-[#B76E79]"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.85 }}
                          animate={wishlist.includes(p.id) ? { scale: [1, 1.45, 0.9, 1.25, 0.95, 1] } : { scale: 1 }}
                        >
                          <Heart size={13} className={wishlist.includes(p.id) ? "fill-[#B76E79] text-[#B76E79]" : ""} />
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 3. Classic & Casual Wear Collection */}
                <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 border-t border-[#D4AF37]/15">
                  <motion.div 
                    className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6 }}
                  >
                    <div>
                      <span className="text-[10px] id-section uppercase tracking-[0.3em] font-black text-[#D4AF37] block">EFFORTLESS CASUALS</span>
                      <h2 className={`text-3xl lg:text-4xl font-serif italic ${theme.text}`}>Classic & Casual Collection</h2>
                    </div>
                    <button 
                      onClick={() => { setFilterCategory('Casual Wear'); setActiveTab('collections'); }}
                      className="text-xs uppercase tracking-widest font-bold underline underline-offset-4 hover:text-[#D4AF37] transition-all cursor-pointer text-[#B76E79]"
                    >
                      View All Classic Wear
                    </button>
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.filter(p => p.category === 'Casual Wear').slice(0, 4).map((p) => (
                      <div 
                        key={p.id} 
                        className="group relative w-full h-[470px] [perspective:1200px] cursor-pointer"
                        onClick={() => handleOpenProductDetailsPage(p)}
                      >
                        <div className="relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateX(60deg)_rotateY(-10deg)_translateY(-30px)]">
                          <div className="absolute inset-0 bg-white rounded-2xl border border-neutral-100 shadow-sm transition-all duration-700 ease-out origin-bottom [transform-style:preserve-3d] group-hover:[transform:rotateX(90deg)] group-hover:shadow-xl z-10">
                            <div className="absolute inset-0 bg-[#FAF5EF]/95 rounded-2xl border border-[#D4AF37]/20 [transform:rotateX(0deg)] [backface-visibility:hidden] flex items-center justify-center p-6">
                              <div className="border border-[#D4AF37]/15 m-2 inset-0 absolute rounded-xl pointer-events-none"></div>
                            </div>
                          </div>

                          <div className="absolute top-4 left-4 right-4 h-64 rounded-xl bg-neutral-100 transition-all duration-700 ease-out origin-bottom group-hover:[transform:rotateX(90deg)_translateZ(2px)] z-15">
                            <div className="absolute inset-0 bg-[#4A1525]/5 rounded-xl"></div>
                          </div>

                          <div 
                            onClick={(e) => { e.stopPropagation(); handleOpenProductDetailsPage(p); }}
                            className="absolute top-4 left-4 right-4 h-64 rounded-xl overflow-hidden transition-all duration-700 ease-out origin-bottom [transform-style:preserve-3d] group-hover:[transform:rotateY(10deg)_rotateX(-60deg)_translateZ(35px)_translateY(-40px)] z-25"
                          >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl p-[2px] bg-black overflow-hidden z-0">
                              <div className="absolute inset-[-200%] bg-[conic-gradient(from_0deg,#ff0000,#ff7700,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)] animate-[spin_4s_linear_infinite]" />
                            </div>

                            <div className="absolute inset-[2px] bg-neutral-100 rounded-xl overflow-hidden z-10">
                              <img 
                                src={p.images[0]} 
                                alt={p.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 rounded-xl" 
                              />
                              {p.stock <= 3 && (
                                <div className="absolute bottom-3 left-3 bg-[#4A1525] text-white text-[8px] font-mono tracking-widest px-2.5 py-1 uppercase rounded-md font-bold shadow-md">
                                  ONLY {p.stock} ATELIER PIECES LEFT
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="absolute bottom-4 left-4 right-4 h-32 bg-neutral-50 rounded-xl border border-neutral-100 transition-all duration-700 ease-out origin-bottom group-hover:[transform:rotateX(90deg)_translateZ(4px)] z-15"></div>

                          <div className="absolute bottom-4 left-4 right-4 p-5 bg-white border border-neutral-100 rounded-xl shadow-sm transition-all duration-700 ease-out origin-bottom [transform-style:preserve-3d] group-hover:[transform:rotateY(10deg)_rotateX(-60deg)_translateZ(65px)_translateY(-15px)] group-hover:bg-[#FAF5EF] group-hover:border-[#D4AF37]/35 group-hover:shadow-xl z-30">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <span className="text-[9px] uppercase font-bold tracking-widest text-[#B76E79] font-mono">{p.category}</span>
                                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                                  <Star size={11} className="fill-[#D4AF37] text-[#D4AF37]" />
                                  <span className={`text-[10px] font-mono ${theme.text} font-semibold`}>{p.rating}</span>
                                </div>
                              </div>
                              
                              <h4 
                                onClick={(e) => { e.stopPropagation(); handleOpenProductDetailsPage(p); }}
                                className={`font-serif italic text-base font-bold ${theme.text} cursor-pointer hover:text-[#D4AF37] transition-all truncate`}
                              >
                                {p.name}
                              </h4>

                              {p.designerName && (
                                <p className="text-[11px] text-[#8E7868] font-serif italic">Curated by {p.designerName}</p>
                              )}

                              <div className="flex justify-between items-center pt-3 border-t border-neutral-100">
                                <p className={`text-sm font-bold ${theme.text} font-mono`}>₹{p.price.toLocaleString('en-IN')}</p>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleAddToCart(p, p.sizes?.[0] || 'M'); }}
                                  className="text-[10px] uppercase font-bold text-[#D4AF37] hover:text-[#B76E79] transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <span>Enlist Bag</span>
                                  <ArrowRight size={11} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <motion.button 
                          onClick={(e) => { e.stopPropagation(); handleToggleWishlist(p.id); }}
                          className="absolute top-8 right-8 z-40 bg-white/80 hover:bg-white backdrop-blur-md p-2 rounded-full cursor-pointer border shadow-sm text-neutral-400 hover:text-[#B76E79]"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.85 }}
                          animate={wishlist.includes(p.id) ? { scale: [1, 1.45, 0.9, 1.25, 0.95, 1] } : { scale: 1 }}
                        >
                          <Heart size={13} className={wishlist.includes(p.id) ? "fill-[#B76E79] text-[#B76E79]" : ""} />
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* PRIVILEGE WARDROBE REDUCTIONS OFFERS */}
            <section className="max-w-7xl mx-auto px-6 lg:px-12 py-10 border-t border-[#D4AF37]/15">
              <motion.div 
                className="text-center md:text-left mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#D4AF37] block mb-2">PRIVILEGE ATELIER</span>
                <h2 className={`text-3xl lg:text-4xl font-serif italic ${theme.text}`}>Wardrobe Reductions</h2>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { id: 'prod_wedding_01', offerPrice: 148000, discountLabel: '20% OFF' },
                  { id: 'prod_wedding_02', offerPrice: 100000, discountLabel: '20% OFF' },
                  { id: 'prod_office_01', offerPrice: 33600, discountLabel: '20% OFF' },
                  { id: 'prod_designer_01', offerPrice: 128000, discountLabel: '20% OFF' }
                ].map((item) => {
                  const prod = products.find(p => p.id === item.id);
                  if (!prod) return null;
                  return (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="group relative w-full h-[410px] [perspective:1000px] cursor-pointer"
                    >
                      {/* Front Face: Image and Basic Details */}
                      <div className="absolute inset-0 flex flex-col justify-between bg-white border border-[#D4AF37]/15 rounded-xl overflow-hidden shadow-sm transition-all duration-700 ease-out origin-center group-hover:[transform:rotateY(90deg)] group-hover:opacity-0 [backface-visibility:hidden] z-10">
                        {/* Discount tag */}
                        <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-[#4A1525] text-[8px] font-black tracking-widest px-2.5 py-1 uppercase rounded shadow">
                          {item.discountLabel}
                        </div>

                        <div className="h-64 w-full overflow-hidden bg-neutral-100 relative">
                          <img 
                            src={prod.images?.[0]} 
                            alt={prod.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" 
                          />
                          <div className="absolute inset-0 bg-[#4A1525]/5"></div>
                        </div>

                        <div className="p-4 flex-grow flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-mono text-[#B76E79] uppercase tracking-wider block mb-1">{prod.category}</span>
                            <h3 className="font-serif italic text-sm font-bold text-[#4A1525] line-clamp-1">{prod.name}</h3>
                          </div>
                          
                          <div className="flex justify-between items-center pt-2 border-t border-neutral-100">
                            <div>
                              <span className="text-[9px] text-neutral-400 line-through block font-mono">₹{prod.price.toLocaleString('en-IN')}</span>
                              <span className="text-xs font-extrabold text-[#D4AF37] font-mono">₹{item.offerPrice.toLocaleString('en-IN')}</span>
                            </div>
                            <span className="text-[9px] text-[#4A1525] font-black uppercase tracking-widest group-hover:text-[#D4AF37] transition-all">
                              Hover to Customize →
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Back Face: Detailed Customization Options */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-between bg-[#FAF5EF] border border-[#D4AF37]/35 rounded-xl shadow-lg transition-all duration-700 ease-out origin-center [transform:rotateY(-90deg)] opacity-0 group-hover:[transform:rotateY(0deg)] group-hover:opacity-100 [backface-visibility:hidden] z-20">
                        <div className="space-y-4">
                          <div className="border-b border-[#D4AF37]/35 pb-2">
                            <span className="text-[8px] font-mono text-[#B76E79] uppercase tracking-widest block">{prod.category} • ATELIER OFFERS</span>
                            <h3 className="font-serif italic text-base font-bold text-[#4A1525] mt-1">{prod.name}</h3>
                          </div>
                          
                          <p className="text-[11px] text-neutral-600 leading-relaxed font-light font-serif italic">
                            {prod.description}
                          </p>

                          <div className="space-y-1.5">
                            <span className="block text-[8px] uppercase tracking-widest text-[#B76E79] font-bold">Standard Sizing Available</span>
                            <div className="flex gap-1.5">
                              {['XS', 'S', 'M', 'L', 'XL'].map(sz => (
                                <span key={sz} className="text-[9px] font-mono border border-neutral-300 text-neutral-700 px-2 py-0.5 rounded bg-white/50">
                                  {sz}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 pt-3 border-t border-[#D4AF37]/35">
                          <div className="flex justify-between items-end">
                            <div>
                              <span className="text-[9px] text-neutral-400 line-through block font-mono">Catalog: ₹{prod.price.toLocaleString('en-IN')}</span>
                              <span className="text-base font-extrabold text-[#4A1525] font-mono">Promo: ₹{item.offerPrice.toLocaleString('en-IN')}</span>
                            </div>
                            <span className="text-[9px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                              SAVE 20%
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              const discountedProd = { ...prod, price: item.offerPrice };
                              handleAddToCart(discountedProd, prod.sizes?.[0] || 'M');
                              showToast(`${prod.name} (Promo Offer) added to your selection bag.`, 'success');
                            }}
                            className={`${theme.buttonPrimary} w-full py-2.5 text-[9px] font-bold uppercase tracking-widest rounded transition-all duration-300`}
                          >
                            Add to Bag
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* HOVER PARALLAX STYLE ACCENT SPLIT: WEDDING FEATURE */}
            <motion.section 
              ref={weddingSpotlightRef}
              className="bg-[#FAF9F6] border-y border-[#D4AF37]/20 py-20 px-6 lg:px-12"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.85, ease: "easeOut" }}
            >
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 space-y-6">
                  <span className="text-[10px] id-section uppercase tracking-[0.3em] text-[#B76E79] font-black block">EXQUISITE SPOTLIGHT</span>
                  <h2 className={`text-4xl md:text-5xl font-serif italic ${theme.text} font-extrabold leading-tight`}>
                    The Marigold Bridal Lehenga
                  </h2>
                  <p className="text-sm font-serif italic text-neutral-600 leading-relaxed font-light">
                    “Woven over 45 craft days using pure Banarasi silk. Designed specifically for elite Indian spring weddings, detailed with heavy zardozi alignments and gold thread stitches along the dual dupatta edges.”
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="border-l-2 border-[#D4AF37] pl-3 py-1">
                      <span className={`text-sm font-semibold block ${theme.text}`}>45 Craft Days</span>
                      <span className="text-[11px] text-neutral-400">Authentic Hand-loom</span>
                    </div>
                    <div className="border-l-2 border-[#D4AF37] pl-3 py-1">
                      <span className={`text-sm font-semibold block ${theme.text}`}>24k Gold Thread</span>
                      <span className="text-[11px] text-[#B76E79]">Certified Pure</span>
                    </div>
                  </div>
                  <div className="pt-6">
                    {products.length > 0 && (
                      <button 
                        onClick={() => handleOpenProductDetails(products[0])}
                        className={`${theme.buttonPrimary} px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer rounded-full`}
                      >
                        Request Virtual Fit Inspection
                      </button>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                  <div className="w-full h-[400px] overflow-hidden rounded-xl shadow-lg border border-[#F5E6D3] relative bg-neutral-100">
                    <motion.img 
                      style={{ y: yParallaxImage1 }}
                      src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600" 
                      className="w-full h-[130%] object-cover absolute inset-x-0 -top-[15%] pointer-events-none" 
                    />
                  </div>
                  <div className="w-full h-[400px] overflow-hidden rounded-xl mt-8 shadow-lg border border-[#F5E6D3] relative bg-neutral-100">
                    <motion.img 
                      style={{ y: yParallaxImage2 }}
                      src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600" 
                      className="w-full h-[130%] object-cover absolute inset-x-0 -top-[15%] pointer-events-none" 
                    />
                  </div>
                </div>
              </div>
            </motion.section>

            {/* MAISON MOTION ATELIER: VIDEO CAROUSEL SHOWCASE */}
            <motion.section 
              className="max-w-7xl mx-auto px-6 lg:px-12 py-16 border-y border-[#D4AF37]/15 bg-[#FAF9F6]/50"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left Side: Video Player with Slider Buttons */}
                <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-[#D4AF37]/25 shadow-xl aspect-[4/5] bg-black group">
                  <AnimatePresence mode="wait">
                    <motion.video 
                      key={videoCarouselIdx}
                      src={[
                        'https://assets.mixkit.co/videos/805/805-360.mp4',
                        'https://assets.mixkit.co/videos/809/809-360.mp4',
                        'https://assets.mixkit.co/videos/50641/50641-360.mp4'
                      ][videoCarouselIdx]}
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  </AnimatePresence>

                  {/* Left & Right slider buttons */}
                  <button 
                    onClick={() => setVideoCarouselIdx(prev => (prev === 0 ? 2 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#4A1525]/90 text-white border border-white/20 p-3 rounded-full cursor-pointer transition-all duration-300 z-10 hover:scale-110"
                    title="Previous Video"
                  >
                    ←
                  </button>
                  <button 
                    onClick={() => setVideoCarouselIdx(prev => (prev === 2 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#4A1525]/90 text-white border border-white/20 p-3 rounded-full cursor-pointer transition-all duration-300 z-10 hover:scale-110"
                    title="Next Video"
                  >
                    →
                  </button>

                  {/* Floating badges overlay */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center pointer-events-none z-10">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-mono tracking-widest px-3 py-1.5 uppercase rounded-full border border-white/10">
                      Showcase Video {videoCarouselIdx + 1} of 3
                    </span>
                    <span className="bg-[#4A1525]/95 text-white text-[9px] font-bold tracking-wider px-3.5 py-1.5 uppercase rounded-full border border-[#D4AF37]/35 shadow">
                      Live Motion
                    </span>
                  </div>
                </div>

                {/* Right Side: Details without sizes */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] id-section uppercase tracking-[0.3em] font-black text-[#B76E79] block">MAISON MOTION ATELIER</span>
                    <h2 className="text-3xl font-serif italic text-[#4A1525] font-extrabold tracking-tight">
                      {[
                        'The Crimson Empress Cape Gown',
                        'The Gilded Marigold Lehenga',
                        'The Ivory Power Crepe Blazer Suit'
                      ][videoCarouselIdx]}
                    </h2>
                    <p className="text-xs text-[#D4AF37] font-serif italic">
                      Designed by Master {[
                        'Aditi Deshmukh',
                        'Aditi Deshmukh',
                        'Meera Khanna'
                      ][videoCarouselIdx]}
                    </p>
                  </div>

                  <p className="text-xs font-light leading-relaxed text-neutral-600 font-serif italic">
                    {[
                      'Woven from pure heavy hand-loomed mulberry silk, and featuring an over-the-shoulder Crimson Silk organza cape decorated with hand-embroidered motif beads.',
                      'A breathtaking bridal lehenga woven in rich Banarasi silk, featuring meticulous hand-embroidered zardozi work, gold plated threads, and hand-stitched sequin borders.',
                      'A tailored double-breasted power blazer paired with matching straight-leg trousers. Crafted with Italian luxury crepe, structured shoulder pads, and gold accents.'
                    ][videoCarouselIdx]}
                  </p>

                  <div className="flex items-center gap-4 py-2 border-y border-neutral-100">
                    <div>
                      <span className="text-[10px] text-neutral-400 line-through block font-mono">
                        Original Price: ₹{[
                          '1,60,000',
                          '1,85,000',
                          '42,000'
                        ][videoCarouselIdx]}
                      </span>
                      <span className="text-xl font-extrabold text-[#D4AF37] font-mono">
                        Atelier Offer: ₹{[
                          '1,28,000',
                          '1,48,000',
                          '33,600'
                        ][videoCarouselIdx]}
                      </span>
                    </div>
                    <span className="bg-emerald-50 text-emerald-800 text-[9px] font-black tracking-widest px-2.5 py-1 uppercase rounded border border-emerald-200">
                      20% Saving
                    </span>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => setActiveTab('video-detail')}
                      className={`${theme.buttonPrimary} w-full py-4 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer rounded-lg flex items-center justify-center gap-2`}
                    >
                      <span>Explore & Custom Fit Gown</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>



            {/* TRENDING ITEMS CAROUSEL */}
            <motion.section 
              className="max-w-7xl mx-auto px-6 lg:px-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-3">
                <div>
                  <span className="text-[10px] id-section uppercase tracking-[0.3em] font-black text-[#D4AF37] block">LIVE ATELIER FAVOURITES</span>
                  <h2 className={`text-3xl lg:text-4xl font-serif italic ${theme.text}`}>Trending Masterpieces</h2>
                </div>
                <button 
                  onClick={() => { setFilterCategory('All'); setActiveTab('collections'); }}
                  className="text-xs uppercase tracking-widest font-bold underline underline-offset-4 hover:text-[#D4AF37] transition-all cursor-pointer text-[#B76E79]"
                >
                  View All Pieces ({products.length})
                </button>
              </div>

              {/* Product grid with beautiful animations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {trendingProducts.slice(0, 4).map((p) => (
                  <div 
                    key={p.id} 
                    className="group relative w-full h-[470px] [perspective:1200px] cursor-pointer"
                    onClick={() => handleOpenProductDetailsPage(p)}
                  >
                    {/* 3D Scene Wrapper */}
                    <div className="relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateX(60deg)_rotateY(-10deg)_translateY(-30px)]">
                      
                      {/* 1. Base Card Background (Falls completely flat) */}
                      <div className="absolute inset-0 bg-white rounded-2xl border border-neutral-100 shadow-sm transition-all duration-700 ease-out origin-bottom [transform-style:preserve-3d] group-hover:[transform:rotateX(90deg)] group-hover:shadow-xl z-10">
                        {/* Back decoration that becomes visible on horizontal plane */}
                        <div className="absolute inset-0 bg-[#FAF5EF]/95 rounded-2xl border border-[#D4AF37]/20 [transform:rotateX(0deg)] [backface-visibility:hidden] flex items-center justify-center p-6">
                          <div className="border border-[#D4AF37]/15 m-2 inset-0 absolute rounded-xl pointer-events-none"></div>
                        </div>
                      </div>

                      {/* 2. Image Background Box (Falls flat along with base card) */}
                      <div className="absolute top-4 left-4 right-4 h-64 rounded-xl bg-neutral-100 transition-all duration-700 ease-out origin-bottom group-hover:[transform:rotateX(90deg)_translateZ(2px)] z-15">
                        <div className="absolute inset-0 bg-[#4A1525]/5 rounded-xl"></div>
                      </div>

                      {/* 3. Image Foreground (Stands up straight, popping out of the card with traveling RGB glow border) */}
                      <div 
                        onClick={(e) => { e.stopPropagation(); handleOpenProductDetailsPage(p); }}
                        className="absolute top-4 left-4 right-4 h-64 rounded-xl overflow-hidden transition-all duration-700 ease-out origin-bottom [transform-style:preserve-3d] group-hover:[transform:rotateY(10deg)_rotateX(-60deg)_translateZ(35px)_translateY(-40px)] z-25"
                      >
                        {/* Traveling RGB border background */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl p-[2px] bg-black overflow-hidden z-0">
                          <div className="absolute inset-[-200%] bg-[conic-gradient(from_0deg,#ff0000,#ff7700,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)] animate-[spin_4s_linear_infinite]" />
                        </div>

                        {/* Inner content wrapper (holds image, stock) */}
                        <div className="absolute inset-[2px] bg-neutral-100 rounded-xl overflow-hidden z-10">
                          <img 
                            src={p.images[0]} 
                            alt={p.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 rounded-xl" 
                          />
                          {p.stock <= 3 && (
                            <div className="absolute bottom-3 left-3 bg-[#4A1525] text-white text-[8px] font-mono tracking-widest px-2.5 py-1 uppercase rounded-md font-bold shadow-md">
                              ONLY {p.stock} ATELIER PIECES LEFT
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 4. Details Background Box (Falls flat along with base card) */}
                      <div className="absolute bottom-4 left-4 right-4 h-32 bg-neutral-50 rounded-xl border border-neutral-100 transition-all duration-700 ease-out origin-bottom group-hover:[transform:rotateX(90deg)_translateZ(4px)] z-15"></div>

                      {/* 5. Details Content Card (Stands up straight, popping forward) */}
                      <div className="absolute bottom-4 left-4 right-4 p-5 bg-white border border-neutral-100 rounded-xl shadow-sm transition-all duration-700 ease-out origin-bottom [transform-style:preserve-3d] group-hover:[transform:rotateY(10deg)_rotateX(-60deg)_translateZ(65px)_translateY(-15px)] group-hover:bg-[#FAF5EF] group-hover:border-[#D4AF37]/35 group-hover:shadow-xl z-30">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] uppercase font-bold tracking-widest text-[#B76E79] font-mono">{p.category}</span>
                            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                              <Star size={11} className="fill-[#D4AF37] text-[#D4AF37]" />
                              <span className={`text-[10px] font-mono ${theme.text} font-semibold`}>{p.rating}</span>
                            </div>
                          </div>
                          
                          <h4 
                            onClick={(e) => { e.stopPropagation(); handleOpenProductDetailsPage(p); }}
                            className={`font-serif italic text-base font-bold ${theme.text} cursor-pointer hover:text-[#D4AF37] transition-all truncate`}
                          >
                            {p.name}
                          </h4>

                          {p.designerName && (
                            <p className="text-[11px] text-[#8E7868] font-serif italic">Curated by {p.designerName}</p>
                          )}

                          <div className="flex justify-between items-center pt-3 border-t border-neutral-100">
                            <p className={`text-sm font-bold ${theme.text} font-mono`}>₹{p.price.toLocaleString('en-IN')}</p>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleAddToCart(p, p.sizes?.[0] || 'M'); }}
                              className="text-[10px] uppercase font-bold text-[#D4AF37] hover:text-[#B76E79] transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <span>Enlist Bag</span>
                              <ArrowRight size={11} />
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Wishlist toggle button (positioned absolutely outside 3D rotation for flawless interactivity) */}
                    <motion.button 
                      onClick={(e) => { e.stopPropagation(); handleToggleWishlist(p.id); }}
                      className="absolute top-8 right-8 z-40 bg-white/80 hover:bg-white backdrop-blur-md p-2 rounded-full cursor-pointer border shadow-sm text-neutral-400 hover:text-[#B76E79]"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      animate={wishlist.includes(p.id) ? {
                        scale: [1, 1.45, 0.9, 1.25, 0.95, 1],
                      } : { scale: 1 }}
                      transition={{ duration: 0.55, ease: "easeInOut" }}
                    >
                      <Heart size={14} className={wishlist.includes(p.id) ? "fill-[#B76E79] text-[#B76E79]" : ""} />
                    </motion.button>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* THE SPONSORSHIP SPOTLIGHT INTRO: ANVAA BRANDING */}
            <section className="bg-gradient-to-r from-[#FFF9FA] via-[#FCF7F8] to-[#FAF5EF] text-[#4A1525] py-24 border-y border-[#D4AF37]/35 relative overflow-hidden">
              <div className="max-w-4xl mx-auto px-6 text-center space-y-8 z-10 relative">
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#B76E79] block">THE MAISON CHARTER OF ANVAA</span>
                <h2 className="text-4xl md:text-5xl font-serif italic text-[#4A1525] font-bold leading-tight">
                  “Fashion that feels personal. Imbued with Indian soul.”
                </h2>
                <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto"></div>
                <p className="max-w-2xl mx-auto text-xs md:text-sm text-[#82525E] font-light leading-relaxed italic font-serif">
                  ANVAA is built on a direct connection with award-winning local cluster weavers of Maharashtra, Varanasi, and Gujarat. We eliminate middlemen layers to offer certified sustainable luxury, while allowing direct atelier chats to tailor every sleeve, shoulder, and draping length to the centimeter.
                </p>
                <div className="flex gap-4 justify-center flex-wrap pt-4">
                  <div className="flex items-center gap-2 bg-[#FFFDFB]/90 border border-[#D4AF37]/25 px-4 py-2.5 rounded-full text-xs shadow-sm">
                    <span className="text-[#D4AF37]">✦</span>
                    <span className="font-light text-neutral-700">Certified Indian Artisanal Weavers</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FFFDFB]/90 border border-[#D4AF37]/25 px-4 py-2.5 rounded-full text-xs shadow-sm">
                    <span className="text-[#D4AF37]">✦</span>
                    <span className="font-light text-neutral-700">Stateful Bespoke Tailoring Sizing</span>
                  </div>
                </div>
              </div>
            </section>

            {/* TESTIMONIAL STORIES */}
            <section className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
              <div className="text-center mb-16">
                <span className="text-[11px] uppercase tracking-[0.3em] font-black text-[#B76E79]">REFINED FEEDBACK</span>
                <h2 className={`text-3xl font-serif italic mt-2 ${theme.text}`}>Laudations from the Inner Circle</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { name: "Sanya Malhotra", role: "Venture Partner, Mumbai", quote: "The Ivory Power Crepe Blazer fitted my shoulders perfectly. Receiving real-time draping advice from Meera Khanna changed my full expectation of Indian premium labels." },
                  { name: "Riddhima Sen", role: "Elite Lifestyle Architect", quote: "Wore the Gold Thread legacy saree during our family wedding. The structure holds gorgeously and the serial number certificate is a collector’s dream." },
                  { name: "Aria Roy Chowdhury", role: "Architectural Lead, Bengaluru", quote: "Pooja Nair's Resort Kaftans are pure elegance. Feels highly premium yet completely relaxed during long consulting site sessions." }
                ].map((test, i) => (
                  <div key={i} className="bg-white p-8 rounded-xl border border-[#D4AF37]/15 relative shadow-sm">
                    <div className="flex gap-1 mb-4 text-[#D4AF37]">
                      {[...Array(5)].map((_, idx) => <Star key={idx} size={12} className="fill-[#D4AF37] text-[#D4AF37]" />)}
                    </div>
                    <p className="text-xs text-neutral-600 font-serif leading-relaxed italic mb-6">
                      "{test.quote}"
                    </p>
                    <div>
                      <p className={`text-xs font-bold ${theme.text} font-sans`}>{test.name}</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">{test.role}</p>
                    </div>
                    <div className="absolute bottom-6 right-6 opacity-5 font-serif text-6xl select-none">“</div>
                  </div>
                ))}
              </div>
            </section>

            {/* INSTAGRAM GALLERIES */}
            <section className="max-w-7xl mx-auto px-6 lg:px-12">
              <div className="text-center mb-10">
                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#D4AF37] block">INSTAGRAM EDITORIALS</span>
                <h2 className={`text-3xl font-serif italic mt-1 ${theme.text}`}>Atelier Chronicles #ANVAALUXE</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600",
                  "https://images.unsplash.com/photo-1548624149-f7b3e6432b42?q=80&w=600",
                  "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600",
                  "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=600"
                ].map((img, i) => (
                  <div key={i} className="group relative h-72 rounded-lg overflow-hidden bg-neutral-100 border">
                    <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute inset-0 bg-[#4A1525]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs uppercase letter font-bold font-mono">@ANVAA_ATELIER</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            </motion.div>
          )}

        {/* VIDEO DETAIL PAGE */}
        {activeTab === 'video-detail' && (
          <motion.div
            key="video-detail"
            initial={{ opacity: 0, y: 15, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.995 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-16"
          >
            {/* Elegant Header with Back Button */}
            <div className="flex items-center gap-4 mb-10 border-b border-[#D4AF37]/25 pb-4">
              <button 
                onClick={() => setActiveTab('home')}
                className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#B76E79] hover:text-[#4A1525] transition-all cursor-pointer bg-white px-4 py-2 border rounded-full hover:bg-neutral-50 shadow-sm"
              >
                ← Back to Home
              </button>
              <span className="text-xs font-mono text-neutral-400">|</span>
              <span className="text-xs uppercase tracking-widest font-black text-[#D4AF37]">
                Maison Fitting Room
              </span>
            </div>

            {/* Video Detail Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Side: Loop Video */}
              <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-[#D4AF37]/25 shadow-xl aspect-[4/5] bg-black">
                <video 
                  src={[
                    'https://assets.mixkit.co/videos/805/805-360.mp4',
                    'https://assets.mixkit.co/videos/809/809-360.mp4',
                    'https://assets.mixkit.co/videos/50641/50641-360.mp4'
                  ][videoCarouselIdx]}
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md text-white text-[9px] font-mono tracking-widest px-3 py-1.5 uppercase rounded-full border border-white/10">
                  Interactive Fitting Feed • Active Motion Loop
                </div>
              </div>

              {/* Right Side: Configuration & Sizing Details */}
              <div className="lg:col-span-6 space-y-6 bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#B76E79] block">
                    COUTURE CUSTOMIZATION
                  </span>
                  <h2 className="text-3xl font-serif italic text-[#4A1525] font-extrabold tracking-tight">
                    {[
                      'The Crimson Empress Cape Gown',
                      'The Gilded Marigold Lehenga',
                      'The Ivory Power Crepe Blazer Suit'
                    ][videoCarouselIdx]}
                  </h2>
                  <p className="text-xs text-[#D4AF37] font-serif italic">
                    Live-Motion Atelier Fit • Masterfully Designed
                  </p>
                </div>

                <p className="text-xs font-light leading-relaxed text-neutral-600 font-serif italic">
                  {[
                    'Woven from pure heavy hand-loomed mulberry silk, and featuring an over-the-shoulder Crimson Silk organza cape decorated with hand-embroinded motif beads.',
                    'A breathtaking bridal lehenga woven in rich Banarasi silk, featuring meticulous hand-embroidered zardozi work, gold plated threads, and hand-stitched sequin borders.',
                    'A tailored double-breasted power blazer paired with matching straight-leg trousers. Crafted with Italian luxury crepe, structured shoulder pads, and gold accents.'
                  ][videoCarouselIdx]}
                </p>

                <div className="flex items-center gap-4 py-2 border-y border-neutral-100">
                  <div>
                    <span className="text-[10px] text-neutral-400 line-through block font-mono">
                      Original Catalog Price: ₹{[
                        '1,60,000',
                        '1,85,000',
                        '42,000'
                      ][videoCarouselIdx]}
                    </span>
                    <span className="text-xl font-extrabold text-[#D4AF37] font-mono">
                      Atelier Promo Price: ₹{[
                        '1,28,000',
                        '1,48,000',
                        '33,600'
                      ][videoCarouselIdx]}
                    </span>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 text-[9px] font-black tracking-widest px-2.5 py-1 uppercase rounded border border-emerald-200">
                    20% Saving
                  </span>
                </div>

                {/* XS to XL Sizing Selectors */}
                <div className="space-y-2">
                  <span className="block text-[10px] uppercase tracking-wider font-bold text-neutral-400">Atelier Sizing Selection</span>
                  <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setVideoSelectedSize(sz)}
                        className={`px-4 py-2 rounded text-xs tracking-widest font-mono font-bold border transition-all cursor-pointer ${
                          videoSelectedSize === sz 
                            ? 'bg-[#4A1525] text-white border-[#4A1525]' 
                            : 'bg-white text-neutral-600 border-neutral-300 hover:border-[#D4AF37]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Sizing Notes Input */}
                <div className="space-y-2">
                  <span className="block text-[10px] uppercase tracking-wider font-bold text-neutral-400">Bespoke Fit Custom Measurements (Optional)</span>
                  <textarea
                    placeholder="Specify your custom bust, waist, hips, and height measurements for a perfect master fit tailorship."
                    className="w-full bg-white border border-neutral-300 rounded-lg p-3 text-xs outline-none focus:border-[#D4AF37] h-20 resize-none font-sans"
                    value={videoCustomNotes}
                    onChange={(e) => setVideoCustomNotes(e.target.value)}
                  />
                </div>

                <button
                  onClick={() => {
                    const activeId = [
                      'prod_designer_01',
                      'prod_wedding_01',
                      'prod_office_01'
                    ][videoCarouselIdx];
                    const baseGown = products.find(p => p.id === activeId);
                    const activePromoPrice = [
                      128000,
                      148000,
                      33600
                    ][videoCarouselIdx];
                    if (baseGown) {
                      const customGown = { 
                        ...baseGown, 
                        price: activePromoPrice
                      };
                      handleAddToCart(customGown, videoSelectedSize, videoCustomNotes || undefined);
                      showToast(`${customGown.name} added to selection bag with custom fit specifications.`, "success");
                    } else {
                      showToast("Featured gown is currently unavailable.", "error");
                    }
                  }}
                  className={`${theme.buttonPrimary} w-full py-4 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer rounded-lg`}
                >
                  Purchase Gown Now
                </button>
              </div>
            </div>

            {/* EDITORIAL LOOKBOOK GALLERY: 3-COLUMN PARALLAX COLLAGE */}
            <section ref={videoImageParallaxRef} className="max-w-7xl mx-auto py-16 overflow-hidden mt-16 border-t border-[#D4AF37]/15">
              <div className="text-center mb-16 pt-10">
                <span className="text-[10px] id-section uppercase tracking-[0.3em] font-black text-[#D4AF37] block mb-2">ATELIER STUDIO LOOKBOOK</span>
                <h3 className="text-3xl font-serif italic text-[#4A1525] font-extrabold tracking-tight">Atelier Editorial Spread</h3>
                <p className="text-xs text-neutral-400 font-light mt-2 font-serif italic">Scroll to observe three-dimensional parallax layout shifts</p>
              </div>

              {/* Staggered Collage Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-stretch min-h-[500px]">
                {/* 1. Left Card: Silhouette Frame (Vertical Parallax) */}
                <motion.div 
                  style={{ y: yLeftCol }}
                  className="rounded-2xl overflow-hidden border border-[#D4AF37]/20 shadow-lg relative bg-neutral-50 h-[380px] md:h-[480px] self-start"
                >
                  <img 
                    src={[
                      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800',
                      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800',
                      'https://images.unsplash.com/photo-1548624149-f7b3e6432b42?q=80&w=800'
                    ][videoCarouselIdx]}
                    className="w-full h-full object-cover"
                    alt="Couture Silhouette"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-[8px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">Look 01 • Silhouette</span>
                    <h4 className="text-base font-serif italic font-bold mt-1">
                      {[
                        'Crimson Empress Silhouette Frame',
                        'Gilded Marigold Lehenga Frame',
                        'Ivory Blazer Silhouette Frame'
                      ][videoCarouselIdx]}
                    </h4>
                  </div>
                </motion.div>

                {/* 2. Center Card: Backstage / Mood Capture (Zoom & Rotate Parallax) */}
                <div className="rounded-2xl overflow-hidden border border-[#D4AF37]/20 shadow-xl relative bg-neutral-100 h-[380px] md:h-[520px] -mt-4 z-10">
                  <motion.img 
                    style={{ 
                      scale: scaleCenter,
                      rotate: rotateCenter
                    }}
                    src={[
                      'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=800',
                      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800',
                      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800'
                    ][videoCarouselIdx]}
                    className="w-full h-full object-cover origin-center"
                    alt="Atelier Mood"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-[8px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">Look 02 • Backstage Capture</span>
                    <h4 className="text-base font-serif italic font-bold mt-1">
                      {[
                        'Motion Atelier Backstage Feed',
                        'Couture Fitting Studio Mood',
                        'Maison Crepe Material Detail'
                      ][videoCarouselIdx]}
                    </h4>
                  </div>
                </div>

                {/* 3. Right Card: Details & Textures (Counter-Parallax) */}
                <motion.div 
                  style={{ y: yRightCol }}
                  className="rounded-2xl overflow-hidden border border-[#D4AF37]/20 shadow-lg relative bg-neutral-50 h-[380px] md:h-[450px] self-end md:-mt-8"
                >
                  <img 
                    src={[
                      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800',
                      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800',
                      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800'
                    ][videoCarouselIdx]}
                    className="w-full h-full object-cover"
                    alt="Couture Weave Details"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-[8px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">Look 03 • Material Details</span>
                    <h4 className="text-base font-serif italic font-bold mt-1">
                      {[
                        'Crimson Cape Drape Detail',
                        'Gilded Banarasi Silk Weave',
                        'Bespoke Gold Button Detail'
                      ][videoCarouselIdx]}
                    </h4>
                  </div>
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}

        {/* 2. COLLECTIONS GRIDS */}
        {activeTab === 'collections' && (
          <CollectionsCatalog
            products={filteredProducts}
            wishlist={wishlist}
            handleToggleWishlist={handleToggleWishlist}
            handleAddToCart={handleAddToCart}
            theme={theme}
            setActiveTab={setActiveTab}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
          />
        )}

        {/* 3. DESIGNER MARKETPLACE TAB CONTAINER */}
        {activeTab === 'designers' && (
          <motion.div
            key="designers"
            initial={{ opacity: 0, y: 15, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.995 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <DesignerMarketplace
              designers={designers}
              products={products}
              currentUser={currentUser}
              onBookConsultation={handleBookConsultation}
              onContactDesigner={handleContactDesigner}
              setActiveTab={setActiveTab}
              theme={theme}
            />
          </motion.div>
        )}

        {/* 4. BESPOKE CHAt TAB CONTAINER */}
        {activeTab === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 15, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.995 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <ChatAtelier
              designers={designers}
              currentUser={currentUser}
              setActiveTab={setActiveTab}
            />
          </motion.div>
        )}

        {activeTab === 'dashboard' && currentUser && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 15, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.995 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className={`max-w-7xl mx-auto px-6 lg:px-12 py-12 ${theme.text} ${theme.bg} min-h-[80vh]`}
          >
            
            {/* Header info */}
            <div className={`border-b ${theme.borderColor} pb-6 mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-3`}>
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#B76E79]">PERSONAL ACCOUNT ATELIER</span>
                <h1 className="text-4xl font-serif italic text-rose-950 leading-tight">Member Dashboard</h1>
              </div>
              <div className="text-right">
                <p className="text-sm font-serif italic text-neutral-600">
                  Welcome back, <strong className="font-bold text-rose-900">{currentUser.name}</strong>
                </p>
                <span className="inline-block mt-1 bg-gradient-to-r from-[#D4AF37] to-[#E597A8] text-white text-[10px] px-3 py-1 uppercase tracking-widest font-black rounded-full shadow-sm">
                  VIP Luminous Member
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Profile card left (cols-4) */}
              <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm space-y-6 h-fit">
                {/* Avatar Section */}
                <div className="flex flex-col items-center space-y-4 pb-6 border-b border-neutral-100">
                  <div className="relative group w-32 h-32 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-lg cursor-pointer">
                    {profileAvatar ? (
                      <img src={profileAvatar} className="w-full h-full object-cover animate-fade-in" />
                    ) : (
                      <div className="w-full h-full bg-[#FAF9F6] flex flex-col items-center justify-center text-neutral-400">
                        <User size={32} />
                        <span className="text-[9px] uppercase tracking-wider mt-1">No Image</span>
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] uppercase font-bold tracking-wider transition-opacity duration-300 cursor-pointer">
                      <Camera size={18} className="mb-1" />
                      Upload Portrait
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarChange} 
                      />
                    </label>
                  </div>
                  <div className="text-center">
                    <h4 className="font-serif italic font-bold text-rose-950 text-lg">{currentUser.name}</h4>
                    <p className="text-[10px] font-mono text-neutral-500 font-semibold">{currentUser.email}</p>
                    <span className="inline-block mt-2 bg-[#FFF0F2] text-[#B76E79] text-[9px] px-3 py-1 uppercase tracking-widest font-black rounded-full border border-[#B76E79]/20">
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 text-xs text-neutral-700 font-light">
                  <div>
                    <span className="block font-semibold text-neutral-400">PHONE DIRECT</span>
                    <span className="font-bold text-gray-800 font-mono">{currentUser.phone || "Not recorded"}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-xl border border-red-200 text-[#B76E79] hover:bg-red-50 text-xs font-bold uppercase tracking-widest cursor-pointer transition-all text-center"
                  >
                    Logout Session
                  </button>
                </div>
              </div>

              {/* Saved actions right (cols-8) */}
              <div className="lg:col-span-8 space-y-8">

                {/* 1. Account Summary & Analytics */}
                <div className="bg-[#FFFDFB] border border-[#D4AF37]/35 p-5 rounded-2xl flex items-center justify-between gap-6 shadow-sm flex-wrap">
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#B76E79]">Atelier Activity Summary</h4>
                    <p className="text-xs text-neutral-600 font-light">
                      Total Orders Placed: <strong className="font-bold text-gray-800">{ordersHistory.length}</strong>
                    </p>
                    <p className="text-xs text-neutral-600 font-light">
                      Total Spent: <strong className="font-mono font-bold text-[#D4AF37]">₹{ordersHistory.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString('en-IN')}</strong>
                    </p>
                  </div>
                  {ordersHistory.length > 0 && (
                    <div className="text-left md:text-right md:border-l md:border-neutral-100 md:pl-6 space-y-1">
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Most Recent Order</h4>
                      <p className="text-xs font-mono font-bold text-gray-800">{ordersHistory[0].id}</p>
                      <p className="text-[10px] text-[#B76E79] font-bold">₹{ordersHistory[0].total?.toLocaleString('en-IN')}</p>
                    </div>
                  )}
                </div>

                {/* 2. Profile Details Form */}
                <div className="bg-white p-6 border border-neutral-100 rounded-2xl shadow-sm">
                  <h3 className="font-serif italic text-lg text-[#4A1525] mb-5 border-b pb-2 flex items-center gap-2">
                    <Sliders className="text-[#D4AF37]" size={18} />
                    Profile Customization Atelier
                  </h3>
                  
                  <form onSubmit={handleUpdateProfile} className="space-y-6 text-xs">
                    {/* Name & Phone Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-400 font-bold uppercase text-[9px] mb-1">Legal Name</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-[#FAF9F6] border border-neutral-200 p-3 outline-none focus:border-[#D4AF37] font-medium text-zinc-800 luxury-input rounded"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 font-bold uppercase text-[9px] mb-1">Direct Phone Number</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-[#FAF9F6] border border-neutral-200 p-3 outline-none focus:border-[#D4AF37] font-mono text-zinc-800 luxury-input rounded"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Shipping Address Section */}
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#B76E79] border-b pb-1.5 mb-3">Shipping Logistics Coordinates</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-neutral-400 font-bold uppercase text-[9px] mb-1">Street Address</label>
                          <input
                            type="text"
                            placeholder="e.g. Flat 402, Royal Residency, Juhu Tara Road"
                            className="w-full bg-[#FAF9F6] border border-neutral-200 p-3 outline-none focus:border-[#D4AF37] text-zinc-800 luxury-input rounded"
                            value={profileStreet}
                            onChange={(e) => setProfileStreet(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-400 font-bold uppercase text-[9px] mb-1">City</label>
                          <input
                            type="text"
                            placeholder="e.g. Mumbai"
                            className="w-full bg-[#FAF9F6] border border-neutral-200 p-3 outline-none focus:border-[#D4AF37] text-zinc-800 luxury-input rounded"
                            value={profileCity}
                            onChange={(e) => setProfileCity(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-400 font-bold uppercase text-[9px] mb-1">Pincode</label>
                          <input
                            type="text"
                            placeholder="e.g. 400049"
                            className="w-full bg-[#FAF9F6] border border-neutral-200 p-3 outline-none focus:border-[#D4AF37] font-mono text-zinc-800 luxury-input rounded"
                            value={profilePincode}
                            onChange={(e) => setProfilePincode(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Change Password Section */}
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#B76E79] border-b pb-1.5 mb-3">Secret Security Credentials</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-neutral-400 font-bold uppercase text-[9px] mb-1">New Password (leave empty to keep current)</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-[#FAF9F6] border border-neutral-200 p-3 outline-none focus:border-[#D4AF37] font-mono text-zinc-800 luxury-input rounded"
                            value={profilePassword}
                            onChange={(e) => setProfilePassword(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-400 font-bold uppercase text-[9px] mb-1">Confirm New Password</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-[#FAF9F6] border border-neutral-200 p-3 outline-none focus:border-[#D4AF37] font-mono text-zinc-800 luxury-input rounded"
                            value={profileConfirmPassword}
                            onChange={(e) => setProfileConfirmPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(212, 175, 55, 0.25)" }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gradient-to-r from-[#AA771C] via-[#D4AF37] to-[#BF953F] text-white hover:opacity-90 shadow-lg px-6 py-3 uppercase tracking-widest font-black rounded-lg cursor-pointer transition-all inline-block"
                      >
                        SAVE PROFILE ATELIER UPDATES
                      </motion.button>
                    </div>
                  </form>
                </div>

                {/* Dashboard active wishlist */}
                <div className="bg-white p-6 border border-neutral-100 rounded-2xl shadow-sm">
                  <h3 className="font-serif italic text-lg text-[#4A1525] mb-5 border-b pb-2 flex items-center gap-2">
                    <Heart className="text-[#B76E79] fill-[#B76E79]" size={18} />
                    My Curated Favorites ({wishlist.length})
                  </h3>
                  {wishlist.length === 0 ? (
                    <p className="text-xs text-neutral-400 italic py-4">No curations saved yet. Exploit our elite catalog to bookmark designs!</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {products.filter(p => wishlist.includes(p.id)).map(p => (
                        <div key={p.id} className="relative flex flex-col justify-between p-3 border border-neutral-100 rounded-xl bg-[#FFFDFB] h-80 shadow-sm hover:shadow-md transition-all">
                          <img src={p.images[0]} className="w-full h-40 object-cover rounded-lg mb-2" />
                          <div className="px-1">
                            <h4 className="font-serif italic text-xs font-bold leading-tight line-clamp-1 text-gray-800">{p.name}</h4>
                            <p className="text-[11px] text-[#D4AF37] font-mono mt-0.5 font-bold">₹{p.price.toLocaleString('en-IN')}</p>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleOpenProductDetails(p)}
                              className={`flex-1 ${theme.buttonPrimary} text-[9px] uppercase font-bold tracking-widest py-2 transition-all cursor-pointer rounded-lg`}
                            >
                              Explore
                            </button>
                            <button
                              onClick={() => handleToggleWishlist(p.id)}
                              className="p-2 border border-red-100 text-red-500 hover:bg-neutral-50 rounded-lg cursor-pointer transition-colors"
                              title="Delete curation"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Detailed Stateful Order History Section */}
                <div className="bg-white p-6 border border-neutral-100 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-center mb-5 border-b pb-2 flex-wrap gap-2">
                    <h3 className="font-serif italic text-lg text-[#4A1525] flex items-center gap-2">
                      <ShoppingBag className="text-[#D4AF37]" size={18} />
                      Chronological Order Archives
                    </h3>
                    <span className="text-[9px] uppercase font-mono tracking-[0.2em] bg-yellow-50 text-yellow-700 font-bold px-2 rounded border border-yellow-200 py-0.5">
                      Elite Direct Delivery guaranteed
                    </span>
                  </div>

                  <div className="space-y-6">
                    {placedOrder && (
                      <div className="p-5 border border-[#D4AF37] rounded-2xl bg-amber-50/50 mb-4 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#D4AF37]/5 to-[#B76E79]/5 rounded-bl-full pointer-events-none" />
                        <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                          <span className="text-xs font-bold text-amber-900 tracking-wider uppercase flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                            Live Active Transaction
                          </span>
                          <button 
                            onClick={() => { setDocketModalOrder(placedOrder); setIsTrackingDocketModalOpen(true); }}
                            className="text-xs text-[#D4AF37] font-bold underline underline-offset-2 flex items-center gap-1 cursor-pointer hover:text-[#B76E79]"
                          >
                            Live Progress Map <ChevronRight size={12} />
                          </button>
                        </div>
                        <p className="text-xs text-[#4A1525] font-semibold">{placedOrder.id} — ₹{placedOrder.total?.toLocaleString('en-IN')}</p>
                        <p className="text-[11px] text-neutral-500 mt-1">Status: <strong className="text-[#B76E79] font-bold">{placedOrder.status}</strong></p>
                        
                        <div className="mt-3 flex gap-2">
                          {placedOrder.items?.map((item: any, iIdx: number) => (
                            <div key={iIdx} className="flex items-center gap-2 bg-white/70 px-2 py-1.5 rounded-lg border border-amber-200 text-[10px]">
                              <span className="font-semibold">{item.product?.name}</span>
                              <span className="text-neutral-400">({item.selectedSize})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {isOrdersLoading ? (
                      <div className="space-y-6">
                        {[1, 2].map((idx) => (
                          <div key={`skeleton-order-${idx}`} className="border border-neutral-100 rounded-2xl p-5 bg-[#FFFDFB] space-y-4 shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-rose-50/50 gap-2">
                              <div className="space-y-1.5 w-full sm:w-1/3">
                                <div className="luxury-shimmer-bg h-2 w-1/2 rounded"></div>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="luxury-shimmer-bg h-4 w-28 rounded"></div>
                                  <div className="luxury-shimmer-bg h-3.5 w-16 rounded-full"></div>
                                </div>
                              </div>
                              <div className="space-y-1.5 w-full sm:w-1/4 sm:text-right">
                                <div className="luxury-shimmer-bg h-2 w-1/3 sm:ml-auto rounded"></div>
                                <div className="luxury-shimmer-bg h-3.5 w-1/2 sm:ml-auto rounded mt-1"></div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-xl border border-rose-50/30">
                              <div className="flex items-center gap-4 w-full">
                                <div className="luxury-shimmer-bg w-16 h-16 rounded-lg shrink-0"></div>
                                <div className="space-y-2 flex-grow">
                                  <div className="luxury-shimmer-bg h-3.5 w-1/2 rounded"></div>
                                  <div className="luxury-shimmer-bg h-2.5 w-1/4 rounded"></div>
                                  <div className="luxury-shimmer-bg h-3 w-1/6 rounded"></div>
                                </div>
                              </div>
                              <div className="luxury-shimmer-bg h-8 w-24 rounded-lg shrink-0"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : ordersHistory && ordersHistory.length > 0 ? (
                      ordersHistory.map((order) => (
                        <div key={order.id} className="border border-[#D4AF37]/20 rounded-2xl p-5 bg-[#FFFDFB] space-y-4 hover:border-[#D4AF37]/50 transition-all shadow-sm">
                          
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-rose-50 gap-2">
                            <div>
                              <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Atelier Order Reference</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-serif italic font-bold text-gray-800 text-sm">{order.id}</span>
                                {order.status === 'Delivered' ? (
                                  <span className="bg-green-50 text-green-700 border border-green-200 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                                    {order.status}
                                  </span>
                                ) : (
                                  <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest animate-pulse">
                                    {order.status}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Date Sealed</p>
                              <p className="text-xs text-neutral-700 font-medium mt-0.5">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {order.items?.map((item, itemIdx) => (
                              <div key={itemIdx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FFF9FA]/40 p-3 rounded-xl border border-rose-50 hover:bg-[#FFF9FA]/90 transition-all">
                                <div className="flex items-center gap-4">
                                  <img 
                                    src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=200'} 
                                    alt={item.product?.name} 
                                    className="w-16 h-16 object-cover rounded-lg border border-neutral-100 shadow-sm shrink-0" 
                                  />
                                  <div>
                                    <h4 className="font-serif italic text-xs font-bold text-gray-800 hover:text-[#B76E79] transition-all cursor-pointer" onClick={() => handleOpenProductDetails(item.product)}>
                                      {item.product?.name}
                                    </h4>
                                    <p className="text-[10px] text-neutral-400 mt-1 font-semibold uppercase tracking-wider">
                                      Size: <span className="text-[#B76E79] font-bold">{item.selectedSize}</span> • Qty: <span className="font-bold text-gray-700">{item.quantity}</span>
                                    </p>
                                    <p className="text-xs font-mono text-[#D4AF37] font-semibold mt-0.5">₹{item.product?.price?.toLocaleString('en-IN')}</p>
                                  </div>
                                </div>
                                
                                <button
                                  onClick={() => handleReorderItem(item.product, item.selectedSize)}
                                  className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#D4AF37] via-[#E5A4B4] to-[#B76E79] text-white hover:opacity-90 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer shadow-sm text-center"
                                >
                                  ✦ Re-order Item
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="pt-3 border-t border-rose-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs leading-relaxed text-neutral-600">
                            <div>
                              <p className="text-[9px] font-semibold text-neutral-400 uppercase tracking-widest">Courier Coordinates</p>
                              <p className="text-neutral-500 text-[11px] font-light mt-0.5">{order.address?.street}, {order.address?.city} ({order.address?.pincode})</p>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="text-[9px] font-semibold text-neutral-400 uppercase tracking-widest">Total Valuation (Tax Inc.)</p>
                              <p className="text-sm font-semibold text-rose-900 font-mono mt-0.5">₹{order.total?.toLocaleString('en-IN')}</p>
                              <button 
                                onClick={() => { setDocketModalOrder(order); setIsTrackingDocketModalOpen(true); }}
                                className="text-[10px] text-[#D4AF37] hover:text-[#B76E79] font-bold underline mt-1 block cursor-pointer transition-colors"
                              >
                                View Interactive Tracking Docket →
                              </button>
                            </div>
                          </div>

                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 border border-dashed rounded-xl bg-orange-50/20 p-6">
                        <Heart className="mx-auto text-rose-300 animate-pulse mb-3" size={24} />
                        <p className="text-xs text-neutral-500 italic">No past chronological order records registered physically yet.</p>
                        <p className="text-[11px] text-neutral-400 font-light mt-1 max-w-sm mx-auto">
                          Place a sample checkout purchase using the Bag to see mock shipping timelines dynamically populate!
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </motion.div>
        )}

        {/* 6. ORDER TRACKING VIEW */}
        {activeTab === 'tracking' && (
          <motion.div
            key="tracking"
            initial={{ opacity: 0, y: 15, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.995 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto px-6 py-12 lg:py-16 text-[#4A1525] bg-[#FAF9F6] min-h-[85vh]"
          >
            
            <div className="text-center mb-12">
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#D4AF37] block mb-2">MAISON LOGISTICS AND CRAFTS</span>
              <h1 className="text-4xl font-serif italic mb-4 leading-tight">Live Handover Progress and Tracking</h1>
              <p className="text-xs text-neutral-600 max-w-md mx-auto italic font-light">
                Monitor the exact tailoring, quality checks, premium boxing, and physical elite courier handover steps.
              </p>
            </div>

            {trackingOrder ? (
              <div className="bg-white border border-[#D4AF37]/25 rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
                
                {/* Order Meta details banner */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-100 pb-5 gap-3">
                  <div>
                    <p className="text-[10px] font-mono text-neutral-400">VIP TRANSACTION HANDOVER DOCKET</p>
                    <h3 className="text-lg font-serif italic text-[#4A1525] font-extrabold mt-0.5">{trackingOrder.id}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">Draped for: {trackingOrder.address?.name}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-[10px] text-neutral-400 uppercase font-black">Shipment Valuation</p>
                    <p className="text-lg font-mono font-bold text-[#D4AF37]">₹{trackingOrder.total?.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] font-mono text-neutral-500 mt-0.5">{trackingOrder.paymentMethod || 'UPI Secure Key'}</p>
                  </div>
                </div>

                {/* Progress bars / timeline */}
                <div className="space-y-6">
                  {trackingOrder.trackingTimeline?.map((evt: any, idx: number) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                          evt.done 
                            ? 'bg-[#4A1525] border-[#D4AF37] text-[#D4AF37]' 
                            : 'bg-white border-neutral-200 text-neutral-300'
                        }`}>
                          <Check size={14} />
                        </div>
                        {idx !== trackingOrder.trackingTimeline.length - 1 && (
                          <div className={`w-0.5 h-12 ${evt.done ? 'bg-[#4A1525]/80' : 'bg-neutral-200'}`}></div>
                        )}
                      </div>
                      <div className="pt-1 select-none">
                        <h4 className={`text-xs uppercase tracking-wider font-bold ${evt.done ? 'text-[#4A1525]' : 'text-neutral-400'}`}>
                          {evt.status}
                        </h4>
                        <p className="text-xs text-neutral-500 mt-0.5 font-light">{evt.description}</p>
                        <p className="text-[9px] text-[#B76E79] font-mono font-bold mt-1">LOGGED ON: {evt.date}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#FAF9F6] border border-[#D4AF37]/15 p-5 rounded-xl text-center space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-black block">ATELIER ASSISTANCE HOTLINE</span>
                  <p className="text-[11px] text-neutral-600 font-light italic">
                    "Have sizing alterations after placing? Simply ping your designer direct inside our platform or coordinate with VIP salon help desk at +91 22 4912 3000"
                  </p>
                </div>

              </div>
            ) : (
              <div className="text-center py-16 bg-white border border-dashed rounded-xl max-w-xl mx-auto p-6">
                <p className="italic text-neutral-400 font-serif">No active tracking docket found. To demonstrate this feature, add a gorgeous Banarasi dress, complete sample checkout with UPI, and check this page immediately!</p>
                <div className="mt-8 flex justify-center gap-3">
                  <button 
                    onClick={() => setActiveTab('collections')}
                    className="bg-[#4A1525] hover:bg-[#6A162B] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest cursor-pointer rounded-lg transition-colors shadow-sm"
                  >
                    Go To Catalog
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* 7. AUTH LOGIN PAGE AND SECURITY */}
        {activeTab === 'auth' && (
          <AuthScreen
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            setActiveTab={setActiveTab}
            showToast={showToast}
            handleAutoLogin={handleAutoLogin}
            setShowProfileGuide={setShowProfileGuide}
          />
        )}

        {/* 8. DETAILED PRODUCT PAGE */}
        {activeTab === 'product-detail' && detailedProduct && (
          <motion.div
            key="product-detail"
            initial={{ opacity: 0, y: 15, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.995 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-16"
          >
            {/* Elegant Header with Back Button */}
            <div className="gsap-reveal-header opacity-0 flex items-center justify-between mb-10 border-b border-[#D4AF37]/25 pb-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveTab('home')}
                  className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#B76E79] hover:text-[#4A1525] transition-all cursor-pointer bg-white px-5 py-2.5 border rounded-full hover:bg-neutral-50 shadow-sm animate-luxury-reveal"
                >
                  ← Back to Home
                </button>
                <span className="text-xs font-mono text-neutral-300">|</span>
                <span className="text-xs uppercase tracking-wider font-mono text-neutral-500">
                  Maison Salon / {detailedProduct.category} / {detailedProduct.name}
                </span>
              </div>
            </div>

            {/* Product Details Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
              
              {/* Left Column: Product Image Gallery & Zoom */}
              <div className="lg:col-span-6 space-y-6 gsap-reveal-gallery opacity-0">
                <div 
                  className="h-96 md:h-[550px] w-full bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-150 relative cursor-zoom-in shadow-md"
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <img 
                    src={detailedProduct.images?.[detailImageIdx] || detailedProduct.images?.[0]} 
                    alt={detailedProduct.name}
                    className={`w-full h-full object-cover transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`} 
                  />
                  {detailedProduct.category === 'Premium Limited Editions' && (
                    <div className="absolute top-6 left-6 bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-[#4A1525] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-md shadow-md">
                      CERTIFIED EXCLUSIVE
                    </div>
                  )}
                </div>

                {/* Thumbnails list */}
                <div className="flex gap-4">
                  {detailedProduct.images?.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setDetailImageIdx(idx); setIsZoomed(false); localStorage.setItem('anvaa_detail_image_idx', String(idx)); }}
                      className={`h-20 w-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${detailImageIdx === idx ? 'border-[#D4AF37] scale-105 shadow' : 'border-neutral-200 hover:border-neutral-300'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Configuration & Sizing Details */}
              <div className="lg:col-span-6 space-y-6 bg-white p-8 md:p-10 rounded-2xl border border-neutral-100 shadow-md">
                <div className="space-y-3">
                  <span className="gsap-reveal-text opacity-0 text-[10px] uppercase font-bold tracking-widest text-[#B76E79] font-mono block">
                    {detailedProduct.category}
                  </span>
                  <h2 className="gsap-reveal-text opacity-0 text-3xl lg:text-4xl font-serif italic text-[#4A1525] font-extrabold tracking-tight">
                    {detailedProduct.name}
                  </h2>
                  
                  {detailedProduct.designerName && (
                    <p className="gsap-reveal-text opacity-0 text-xs text-[#D4AF37] font-serif italic">
                      Designed in atelier by master {detailedProduct.designerName}
                    </p>
                  )}

                  <div className="gsap-reveal-text opacity-0 flex items-center gap-2 text-sm text-neutral-500 font-mono pt-1">
                    <Star size={14} className="fill-[#D4AF37] text-[#D4AF37]" />
                    <span className="text-[#4A1525] font-bold text-xs">{detailedProduct.rating} Stars average rating</span>
                  </div>

                  <p className="gsap-reveal-text opacity-0 text-2xl font-extrabold text-[#4A1525] font-mono pt-2">₹{detailedProduct.price.toLocaleString('en-IN')}</p>
                  
                  <div className="gsap-reveal-text opacity-0 h-[1px] bg-neutral-100 my-4" />

                  <p className="gsap-reveal-text opacity-0 text-sm font-light leading-relaxed text-neutral-600 font-serif italic">
                    {detailedProduct.description}
                  </p>
                </div>

                <div className="gsap-reveal-text opacity-0 h-[1px] bg-neutral-100" />

                {/* Sizing list */}
                <div className="gsap-reveal-text opacity-0 space-y-3">
                  <span className="block text-[10px] uppercase tracking-wider font-bold text-neutral-400">Atelier Sizing (In Millimeters)</span>
                  <div className="flex flex-wrap gap-2.5">
                    {detailedProduct.sizes?.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => { setDetailSize(sz); localStorage.setItem('anvaa_detail_size', sz); }}
                        className={`px-4 py-2 rounded-lg text-xs tracking-widest font-bold border transition-all cursor-pointer ${
                          detailSize === sz 
                            ? 'bg-[#4A1525] text-white border-[#4A1525] shadow-sm' 
                            : 'bg-white text-neutral-600 border-neutral-200 hover:border-[#D4AF37]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                    <button 
                      onClick={() => { setActiveTab('designers'); }}
                      className="border border-dashed border-[#D4AF37] text-[#D4AF37] px-4 py-2 rounded-lg text-xs tracking-widest uppercase font-bold hover:bg-neutral-50 cursor-pointer transition-colors"
                    >
                      Bespoke Fit Service
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="gsap-reveal-text opacity-0 pt-6 border-t border-neutral-100 flex gap-4">
                  <button
                    onClick={() => {
                      handleAddToCart(detailedProduct, detailSize);
                    }}
                    className="flex-1 bg-gradient-to-r from-[#4A1525] to-[#6A162B] hover:opacity-95 text-[#FAF9F6] py-4 text-xs uppercase font-bold tracking-widest transition-all cursor-pointer shadow-md rounded-xl relative group overflow-hidden"
                  >
                    {/* Gold shimmer effect on hover */}
                    <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent skew-x-[-25deg] translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-[1200ms] ease-out pointer-events-none" />
                    ADD TO MY BAG
                  </button>
                  <motion.button
                    onClick={() => handleToggleWishlist(detailedProduct.id)}
                    className="p-4 border border-neutral-200 rounded-xl text-neutral-600 hover:text-[#B76E79] cursor-pointer bg-neutral-50/50 hover:bg-white transition-all shadow-sm"
                    title="Toggle Favorite"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={wishlist.includes(detailedProduct.id) ? {
                      scale: [1, 1.25, 0.95, 1.15, 0.98, 1],
                    } : { scale: 1 }}
                    transition={{ duration: 0.55, ease: "easeInOut" }}
                  >
                    <Heart size={18} className={wishlist.includes(detailedProduct.id) ? "fill-[#B76E79] text-[#B76E79]" : ""} />
                  </motion.button>
                </div>
              </div>

            </div>

            {/* Bottom Section: Review Submission & Critique Feed */}
            <div className="bg-gradient-to-br from-[#FAF8F5] via-[#FFFDFB] to-[#F5EFE6] border border-[#D4AF37]/35 rounded-3xl p-8 md:p-12 space-y-12 shadow-md">
              <div className="gsap-reveal-critique-form opacity-0 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Form column */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h3 className="text-xl font-serif italic text-[#4A1525] font-bold mb-2">Refined Critique Submission</h3>
                    <p className="text-xs text-neutral-500">Share your feedback regarding fabric weave, stitching, drape, and custom fit to help our design salon.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-neutral-400 uppercase font-black tracking-wider block">Star Score</label>
                        <select 
                          className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all"
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                        >
                          <option value="5">★★★★★ Exceptional (5)</option>
                          <option value="4">★★★★ Very Fine (4)</option>
                          <option value="3">★★★ Acceptable (3)</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-neutral-400 uppercase font-black tracking-wider block">Your Name / Title</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Premium Client (optional)"
                          className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all"
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Animal spirit guide selector with springy 3D effects */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-neutral-400 uppercase font-black tracking-wider block">Select Atelier Spirit Animal</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {(['peacock', 'swan', 'leopard', 'lion', 'fox', 'tiger', 'panda', 'wolf'] as const).map((animal) => {
                          const temp = ANIMAL_TEMPLATES[animal];
                          const isSelected = selectedAnimal === animal;
                          return (
                            <motion.button
                              key={animal}
                              type="button"
                              onClick={(e) => {
                                setSelectedAnimal(animal);
                                triggerMascotSparkles(temp.emoji, e, 7);
                              }}
                              onMouseEnter={(e) => {
                                triggerMascotSparkles(temp.emoji, e, 2);
                              }}
                              whileHover={{ 
                                scale: 1.06, 
                                rotateY: 12, 
                                rotateX: -8,
                                z: 15,
                                boxShadow: "0 10px 20px rgba(212,175,55,0.12)"
                              }}
                              whileTap={{ scale: 0.96, rotateY: 0, rotateX: 0 }}
                              transition={{ type: "spring", stiffness: 350, damping: 15 }}
                              style={{ transformStyle: 'preserve-3d', perspective: 400 }}
                              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                                isSelected
                                  ? `${temp.bg} ${temp.border} ${temp.text} ring-2 ring-[#D4AF37] shadow-sm`
                                  : 'bg-white/80 border-neutral-200 text-neutral-600'
                              }`}
                            >
                              <span className="select-none">{temp.name.split(' ')[1]}</span>
                              <span 
                                className="text-base select-none pointer-events-none" 
                                style={{ transform: 'translateZ(18px)', display: 'inline-block' }}
                              >
                                {temp.emoji}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-400 uppercase font-black tracking-wider block">Critique Comments</label>
                      <textarea
                        placeholder="Write your comments regarding fabric weave, stitches, and drape..."
                        className="w-full bg-white border border-neutral-200 rounded-xl p-4 text-xs outline-none min-h-[100px] resize-y focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={() => handleSubmitReview(detailedProduct.id)}
                      className="bg-[#D4AF37] hover:bg-[#C29E30] text-[#4A1525] px-6 py-3.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer shadow-sm gold-glow-button hover:scale-[1.02]"
                    >
                      Enlist Critique
                    </button>
                  </div>
                </div>

                {/* Live Preview column */}
                <div className="lg:col-span-5 space-y-3 lg:border-l lg:border-[#D4AF37]/15 lg:pl-8 h-full flex flex-col justify-center">
                  <span className="text-[10px] text-neutral-400 uppercase font-black tracking-wider block">Critique Card Live Preview</span>
                  <div className={`p-6 pr-32 rounded-2xl border transition-all duration-300 relative shadow-md w-full min-h-[180px] flex flex-col justify-between overflow-hidden ${ANIMAL_TEMPLATES[selectedAnimal].bg} ${ANIMAL_TEMPLATES[selectedAnimal].border} ${ANIMAL_TEMPLATES[selectedAnimal].text}`}>
                    {/* Large Static Mascot in the right half */}
                    <div className="absolute -right-2 bottom-1 text-[100px] md:text-[120px] opacity-100 select-none pointer-events-none">
                      {ANIMAL_TEMPLATES[selectedAnimal].emoji}
                    </div>
                    <div className="space-y-3 z-10">
                      <div className="flex justify-between items-start pr-4">
                        <div>
                          <h5 className="text-xs font-bold font-mono">{reviewName || currentUser?.name || "Premium Client"}</h5>
                          <span className="text-[9px] opacity-60 font-mono block mt-0.5">Today (Live Preview)</span>
                        </div>
                        <div className="flex text-[#D4AF37] text-xs">
                          {Array.from({ length: reviewRating }).map((_, i) => (
                            <Star key={i} size={10} className="fill-[#D4AF37] text-[#D4AF37]" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs font-serif italic leading-relaxed min-h-[50px] whitespace-pre-wrap pr-2">
                        {reviewComment || "Write comments regarding fabric weave, stitches, and drape to preview here..."}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              <div className="h-[1px] bg-[#D4AF37]/15" />

              {/* Reviews List */}
              <div className="gsap-reveal-reviews-list space-y-6">
                <h3 className="text-lg font-serif italic text-[#4A1525] font-bold">Client Testimonials & Critiques</h3>
                {detailedProduct.reviews && detailedProduct.reviews.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {detailedProduct.reviews.map((rev: any) => {
                      const getAnimal = (userName: string, id: string) => {
                        if (userName.includes('🦚')) return 'peacock';
                        if (userName.includes('🦢')) return 'swan';
                        if (userName.includes('🐆')) return 'leopard';
                        if (userName.includes('🦁')) return 'lion';
                        if (userName.includes('🦊')) return 'fox';
                        if (userName.includes('🐯')) return 'tiger';
                        if (userName.includes('🐼')) return 'panda';
                        if (userName.includes('🐺')) return 'wolf';
                        const hash = (id || userName).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                        return (['peacock', 'swan', 'leopard', 'lion', 'fox', 'tiger', 'panda', 'wolf'] as const)[hash % 8];
                      };

                      const animalKey = getAnimal(rev.userName, rev.id || rev._id);
                      const template = ANIMAL_TEMPLATES[animalKey];

                      return (
                        <div 
                          key={rev.id || rev._id} 
                          className={`gsap-reveal-review-card opacity-0 p-6 pr-32 rounded-2xl border transition-all duration-300 relative shadow-sm hover:shadow-md space-y-3 overflow-hidden min-h-[150px] ${template.bg} ${template.border} ${template.text}`}
                        >
                          {/* Large Static Mascot in the right half */}
                          <div className="absolute -right-2 bottom-1 text-[100px] md:text-[120px] opacity-100 select-none pointer-events-none" title={template.name}>
                            {template.emoji}
                          </div>
                          
                          <div className="flex justify-between items-start pr-4 z-10 relative">
                            <div>
                              <h5 className="text-xs font-bold font-mono">{rev.userName}</h5>
                              <span className="text-[9px] opacity-60 font-mono block mt-0.5">{rev.date}</span>
                            </div>
                            <div className="flex text-[#D4AF37] text-xs">
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <Star key={i} size={10} className="fill-[#D4AF37] text-[#D4AF37]" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs font-serif italic leading-relaxed z-10 relative pr-2 whitespace-pre-wrap">{rev.comment}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400 font-serif italic">No critiques have been submitted for this masterwork yet. Be the first to submit a critique.</p>
                )}
              </div>
            </div>

          </motion.div>
        )}

        </AnimatePresence>

      </main>

      {/* FOOTER */}
      <Footer setActiveTab={setActiveTab} />

      {/* LUXURY PRODUCT DETAIL MODAL OVERLAY */}
      {selectedProduct && activeTab !== 'product-detail' && (
        <div className="fixed inset-0 bg-[#4A1525]/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF9F6] text-[#4A1525] rounded-2xl overflow-hidden max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-[#D4AF37]/35 shadow-2xl relative grid grid-cols-1 md:grid-cols-12 animate-luxury-reveal">
            
            {/* Close button */}
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-40 bg-white/80 hover:bg-white text-[#4A1525] p-2 rounded-full cursor-pointer shadow border"
            >
              ✕
            </button>

            {/* PRODUCT IMAGES ZOOM GALLERY */}
            <div className="md:col-span-6 p-6 space-y-4">
              <div 
                className="h-80 md:h-[450px] w-full bg-neutral-100 rounded-xl overflow-hidden border relative cursor-zoom-in"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img 
                  src={selectedProduct.images?.[detailImageIdx] || selectedProduct.images?.[0]} 
                  className={`w-full h-full object-cover transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`} 
                />
                
                {selectedProduct.category === 'Premium Limited Editions' && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-[#4A1525] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded">
                    CERTIFIED EXCLUSIVE
                  </div>
                )}
              </div>

              {/* Thumbnails list */}
              <div className="flex gap-3">
                {selectedProduct.images?.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setDetailImageIdx(idx); setIsZoomed(false); }}
                    className={`h-16 w-14 rounded overflow-hidden border-2 cursor-pointer transition-all ${detailImageIdx === idx ? 'border-[#D4AF37] scale-105' : 'border-neutral-200'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* DETAILS AND SIZE selection */}
            <div className="md:col-span-6 p-6 md:p-10 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B76E79] font-mono">{selectedProduct.category}</span>
                <h2 className="text-3xl font-serif italic text-[#4A1525] font-extrabold tracking-tight">{selectedProduct.name}</h2>
                
                {selectedProduct.designerName && (
                  <p className="text-xs text-[#D4AF37] font-serif italic">
                    Designed in atelier by master {selectedProduct.designerName}
                  </p>
                )}

                <div className="flex items-center gap-2 text-sm text-neutral-500 font-mono">
                  <Star size={14} className="fill-[#D4AF37] text-[#D4AF37]" />
                  <span className="text-[#4A1525] font-bold text-xs">{selectedProduct.rating} Stars average rating</span>
                </div>

                <p className="text-base font-extrabold text-[#4A1525] font-mono">₹{selectedProduct.price.toLocaleString('en-IN')}</p>
                
                <p className="text-xs font-light leading-relaxed text-neutral-600 font-serif italic">
                  {selectedProduct.description}
                </p>

                {/* Sizing list */}
                <div className="space-y-2">
                  <span className="block text-[10px] uppercase tracking-wider font-bold text-neutral-400">Atelier Sizing (In Millimeters)</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes?.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setDetailSize(sz)}
                        className={`px-3.5 py-1.5 rounded text-xs tracking-widest font-bold border transition-all cursor-pointer ${
                          detailSize === sz 
                            ? 'bg-[#4A1525] text-white border-[#4A1525]' 
                            : 'bg-white text-neutral-600 border-neutral-300 hover:border-[#D4AF37]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                    <button 
                      onClick={() => { setSelectedProduct(null); setActiveTab('designers'); }}
                      className="border border-dashed border-[#D4AF37] text-[#D4AF37] px-3.5 py-1.5 rounded text-xs tracking-widest uppercase font-bold hover:bg-neutral-50 cursor-pointer"
                    >
                      Bespoke Fit Service
                    </button>
                  </div>
                </div>
              </div>

              {/* Action and feedback summary */}
              <div className="pt-6 border-t mt-6 space-y-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      handleAddToCart(selectedProduct, detailSize);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 bg-[#4A1525] hover:bg-[#6A162B] text-[#FAF9F6] py-3 text-xs uppercase font-bold tracking-widest transition-all cursor-pointer shadow-sm rounded-lg"
                  >
                    ADD TO MY BAG
                  </button>
                  <motion.button
                    onClick={() => handleToggleWishlist(selectedProduct.id)}
                    className="p-3 border rounded-lg text-neutral-600 hover:text-[#B76E79] cursor-pointer"
                    title="Toggle Favorite"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    animate={wishlist.includes(selectedProduct.id) ? {
                      scale: [1, 1.45, 0.9, 1.25, 0.95, 1],
                    } : { scale: 1 }}
                    transition={{ duration: 0.55, ease: "easeInOut" }}
                  >
                    <Heart size={16} className={wishlist.includes(selectedProduct.id) ? "fill-[#B76E79] text-[#B76E79]" : ""} />
                  </motion.button>
                </div>

                {/* Critique and review submission */}
                <div className="pt-4 border-t mt-4">
                  <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#4A1525] font-black mb-2 flex items-center gap-1.5">
                    REFINED CRITIQUE SUBMISSION
                  </h4>
                  <div className="space-y-2">
                    <div className="flex gap-3 items-center">
                      <span className="text-[10px] text-neutral-400 uppercase font-black">Star Score:</span>
                      <select 
                        className="bg-white border rounded p-1 text-[11px]"
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                      >
                        <option value="5">★★★★★ Exceptional (5)</option>
                        <option value="4">★★★★ Very Fine (4)</option>
                        <option value="3">★★★ Acceptable (3)</option>
                      </select>
                      <input 
                        type="text" 
                        placeholder="Your title/name (optional)"
                        className="bg-white border rounded px-2 py-1 text-[11px] flex-1"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Write comments regarding fabric weave, stitches, and drape..."
                        className="flex-1 bg-white border rounded px-3 py-2 text-[11px] outline-none"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                      />
                      <button 
                        onClick={() => handleSubmitReview(selectedProduct.id)}
                        className="bg-[#D4AF37] hover:bg-amber-600 text-[#4A1525] px-4 py-2 rounded text-[10px] font-bold uppercase transition-all cursor-pointer"
                      >
                        Enlist Review
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* LUXURY ORDER TRACKING INTERACTIVE DOCKET MODAL */}
      <TrackingDocketModal 
        isOpen={isTrackingDocketModalOpen} 
        onClose={() => setIsTrackingDocketModalOpen(false)} 
        order={docketModalOrder} 
        theme={theme}
      />

      {/* LUXURY CART BAG CENTURED 3D MODAL OVERLAY */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 bg-[#051C18]/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0" 
              onClick={() => { setIsCartOpen(false); setIsCheckoutMode(false); }}
            ></div>

            {/* Cartier Emerald Centered Modal Box */}
            <motion.div 
              initial={{ opacity: 0, x: 250, rotateY: -45, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, x: 250, rotateY: 45, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className={`bg-[#F4F8F7] text-[#0B2B25] w-full h-[85vh] max-h-[750px] flex flex-col md:flex-row justify-between border border-[#D4AF37]/35 shadow-2xl relative rounded-3xl overflow-hidden z-10 [perspective:1200px] [transform-style:preserve-3d] ${
                isCheckoutMode ? 'max-w-5xl' : 'max-w-4xl'
              }`}
            >
              
              {/* Left Editorial Panel - Visible on Desktop, Hidden in Checkout mode or mobile */}
              {!isCheckoutMode && (
                <div className="hidden md:flex md:w-[42%] bg-gradient-to-br from-[#0A2E28] via-[#0D483E] to-[#051C18] text-[#FAF5EF] p-8 flex-col justify-between relative overflow-hidden border-r border-[#D4AF37]/25">
                  {/* Sparkle animations background */}
                  <div className="absolute top-10 left-10 w-2 h-2 bg-[#D4AF37] rounded-full opacity-60 animate-float-sparkle-1"></div>
                  <div className="absolute bottom-20 right-10 w-3.5 h-3.5 bg-[#D4AF37] rounded-full opacity-40 animate-float-sparkle-2"></div>
                  <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-[#D4AF37] rounded-full opacity-50 animate-float-sparkle-3"></div>

                  {/* Gold brand border frame */}
                  <div className="border border-[#D4AF37]/20 absolute inset-4 rounded-2xl pointer-events-none"></div>

                  <div className="z-10 mt-10 space-y-4">
                    <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#D4AF37] block">ANVAA ATELIER</span>
                    <h4 className="text-3xl font-serif italic font-extrabold text-white leading-tight">
                      Your Curated Selection
                    </h4>
                    <p className="text-xs text-[#FAF5EF]/75 font-serif italic leading-relaxed">
                      "Real luxury is custom-made. Sourced directly from our award-winning weavers."
                    </p>
                  </div>

                  <div className="z-10 space-y-4">
                    <div className="h-px bg-[#D4AF37]/25 w-12"></div>
                    <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                      Bespoke Sizing & Tailoring
                    </p>
                    <p className="text-[9px] text-[#FAF5EF]/60 leading-relaxed max-w-xs">
                      Every piece in your selection bag can be customized to your exact measurements via our real-time Atelier Chat.
                    </p>
                  </div>
                </div>
              )}

              {/* Right Panel (Content Panel) */}
              <div className="flex-1 h-full flex flex-col justify-between p-6 overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-[#0D483E]/20 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={18} className="text-[#0D483E]" />
                    <h3 className="font-serif italic text-2xl text-[#0B2B25] font-extrabold">My Selection Bag</h3>
                  </div>
                  <button 
                    onClick={() => { setIsCartOpen(false); setIsCheckoutMode(false); }}
                    className="px-3 py-1.5 border border-[#0D483E]/15 hover:bg-neutral-100 rounded-full cursor-pointer text-[10px] font-bold tracking-widest uppercase text-[#0B2B25] hover:text-[#0D483E] hover:border-[#0D483E] transition-all"
                  >
                    ✕ CLOSE
                  </button>
                </div>

                {/* Content Body */}
                {cart.length === 0 && !isCheckoutMode ? (
                  <div className="text-center py-24 select-none space-y-4 flex-1 flex flex-col justify-center">
                    <div className="w-12 h-12 rounded-full border border-[#0D483E]/25 flex items-center justify-center mx-auto text-neutral-400">
                      <ShoppingBag size={20} className="text-[#0D483E]/50" />
                    </div>
                    <p className="italic text-neutral-400 text-xs font-serif">Your bespoke luxury collection bag is currently empty.</p>
                  </div>
                ) : (
                  !isCheckoutMode ? (
                    // Standard Cart View (Single Column layout)
                    <div className="flex-1 flex flex-col justify-between overflow-hidden">
                      <div className="space-y-4 overflow-y-auto pr-1 flex-1 max-h-[42vh]">
                        <AnimatePresence mode="popLayout">
                          {cart.map((item, idx) => (
                            <motion.div 
                              key={`${item.product.id}-${item.selectedSize}-${idx}`}
                              layout
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, x: -35 }}
                              transition={{ type: "spring", stiffness: 350, damping: 25 }}
                              className="flex gap-4 p-3 bg-white border border-[#0D483E]/10 rounded-xl hover:shadow-md transition-all items-center"
                            >
                              <img src={item.product?.images?.[0]} className="w-14 h-16 object-cover rounded-lg" />
                              <div className="flex-1 min-w-0">
                                <p className="font-serif italic text-xs font-bold text-[#0B2B25] truncate">{item?.product?.name}</p>
                                <p className="text-[10px] text-neutral-500 mt-0.5">Size Selected: <strong className="text-[#0D483E]">{item.selectedSize}</strong></p>
                                {item.customMeasurements && (
                                  <p className="text-[9px] text-[#0D483E]/70 font-mono mt-0.5 truncate" title={item.customMeasurements}>
                                    Bespoke: {item.customMeasurements}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-1">
                                  <button 
                                    onClick={() => handleUpdateCartQty(item.product.id, item.selectedSize, item.quantity - 1, item.customMeasurements)}
                                    className="w-5 h-5 border border-neutral-200 rounded flex items-center justify-center font-bold text-xs hover:bg-[#0D483E]/10 cursor-pointer transition-all"
                                  >
                                    -
                                  </button>
                                  <span className="text-xs font-mono font-bold text-zinc-800">{item.quantity}</span>
                                  <button 
                                    onClick={() => handleUpdateCartQty(item.product.id, item.selectedSize, item.quantity + 1, item.customMeasurements)}
                                    className="w-5 h-5 border border-neutral-200 rounded flex items-center justify-center font-bold text-xs hover:bg-[#0D483E]/10 cursor-pointer transition-all"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-bold text-[#0D483E] font-mono">₹{(item.product?.price * item.quantity).toLocaleString()}</p>
                                <button
                                  onClick={() => handleRemoveCartItem(item.product.id, item.selectedSize, item.customMeasurements)}
                                  className="text-red-700 hover:text-red-900 mt-1 pointer text-[10px] uppercase font-bold"
                                >
                                  Remove
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>

                      {/* Calculations and Actions footer for Cart View */}
                      <div className="border-t border-[#0D483E]/20 pt-4 space-y-3 mt-4">
                        <div className="flex gap-2 text-xs">
                          <input
                            type="text"
                            placeholder="Elite Invite Code (try ANVAANEW)"
                            className="flex-1 bg-white border border-[#0D483E]/20 rounded-lg p-2 outline-none focus:border-[#0D483E] transition-all"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                          />
                          <button
                            onClick={applyPromo}
                            className="bg-[#0D483E] hover:bg-[#0A2E28] border border-[#D4AF37]/35 text-white px-4 py-2 text-[10px] font-bold uppercase transition-all tracking-wider cursor-pointer rounded-lg shadow-sm gold-glow-button"
                          >
                            Apply
                          </button>
                        </div>

                        <div className="text-xs space-y-1.5">
                          <div className="flex justify-between">
                            <span>Atelier Base Price:</span>
                            <span className="font-mono">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                          </div>
                          {couponDiscount > 0 && (
                            <div className="flex justify-between text-emerald-700 font-semibold">
                              <span>Invitation Promo Code:</span>
                              <span className="font-mono">- ₹{calculatedDiscount.toLocaleString('en-IN')}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Premium Insured Carrier:</span>
                            <span className="font-mono">{deliveryFreight === 0 ? 'FREE DELIVERY' : `₹${deliveryFreight}`}</span>
                          </div>
                          <div className="flex justify-between text-base font-extrabold text-[#0B2B25] pt-2 border-t border-[#0D483E]/10">
                            <span>Total Valuation:</span>
                            <span className="font-mono text-[#0D483E] text-lg">₹{cartTotal.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (!currentUser) {
                              showToast("Please login first to enter checkout.", 'error');
                              setIsCartOpen(false);
                              setActiveTab('auth');
                            } else {
                              setIsCheckoutMode(true);
                            }
                          }}
                          className="w-full bg-[#0D483E] hover:bg-[#0A2E28] border border-[#D4AF37]/35 text-white py-3.5 text-xs font-black uppercase tracking-widest transition-all cursor-pointer rounded-xl text-center shadow-lg hover:shadow-xl gold-glow-button"
                        >
                          PROCEED TO COUTURE CHECKOUT
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Checkout Mode: Two-Column layout on laptops (md:grid-cols-12), Single-Column on mobile
                    <div className="flex-1 flex flex-col justify-between overflow-hidden">
                      
                      {/* Moving Ticker banner at the top of checkout */}
                      <div className="luxury-marquee-container bg-[#FFFDF9] border border-[#D4AF37]/20 py-2 rounded-md mb-4 select-none">
                        <div className="luxury-marquee-content text-[#AA771C] text-[10px] uppercase tracking-[0.15em] font-semibold inline-flex items-center gap-8">
                          <span>✦ ENJOY 10% COMPLIMENTARY OFF FOR FIRST ORDER — CODE: <strong className="text-[#0D483E] font-bold">ANVAANEW</strong> ✦</span>
                          <span className="text-[#D4AF37]">✦ ATELIER CUSTOM MEASUREMENTS AVAILABLE ON ALL DESIGNS ✦</span>
                          <span className="opacity-80">✦ MUMBAI & NEW DELHI FLAGSHIPS CHIC LOUNGE Launching June 2026 ✦</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 overflow-y-auto pr-1">
                        
                        {/* Left Column: Delivery coordinates */}
                        <div className="md:col-span-7 space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] border-b border-[#0D483E]/10 pb-1">DELIVERY COORDINATES</h4>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-[9px] uppercase font-bold mb-1">Couture Recipient Name</label>
                              <input
                                type="text"
                                required
                                className="w-full bg-white border border-[#0D483E]/20 p-2 text-xs rounded-lg outline-none focus:border-[#0D483E]"
                                value={addressName}
                                onChange={(e) => setAddressName(e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase font-bold mb-1">Street Address, Flat / Villa No.</label>
                              <input
                                type="text"
                                required
                                className="w-full bg-white border border-[#0D483E]/20 p-2 text-xs rounded-lg outline-none focus:border-[#0D483E]"
                                value={addressStreet}
                                onChange={(e) => setAddressStreet(e.target.value)}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[9px] uppercase font-bold mb-1">City</label>
                                <input
                                  type="text"
                                  required
                                  className="w-full bg-white border border-[#0D483E]/20 p-2 text-xs rounded-lg outline-none focus:border-[#0D483E]"
                                  value={addressCity}
                                  onChange={(e) => setAddressCity(e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase font-bold mb-1">Pincode Coordinate</label>
                                <input
                                  type="text"
                                  required
                                  className="w-full bg-white border border-[#0D483E]/20 p-2 text-xs font-mono rounded-lg outline-none focus:border-[#0D483E]"
                                  value={addressPincode}
                                  onChange={(e) => setAddressPincode(e.target.value)}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase font-bold mb-1">Contact Phone</label>
                              <input
                                type="text"
                                required
                                className="w-full bg-white border border-[#0D483E]/20 p-2 text-xs font-mono rounded-lg outline-none focus:border-[#0D483E]"
                                value={addressPhone}
                                onChange={(e) => setAddressPhone(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Payment Gateway & Settlement summary */}
                        <div className="md:col-span-5 flex flex-col justify-between space-y-4 md:border-l md:border-[#0D483E]/10 md:pl-6">
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] border-b border-[#0D483E]/10 pb-1">SETTLEMENT & GATEWAY</h4>
                            
                            {/* Payment selections */}
                            <div className="space-y-2">
                              <label className="block text-[9px] uppercase font-bold mb-1">Select Solder-Secure Payment Gateway</label>
                              <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-[#0B2B25] uppercase tracking-wider">
                                {[
                                  'Secure UPI Direct',
                                  'Mastercard / Visa VIP',
                                  'RuPay Corporate',
                                  'Net-Banking Gold'
                                ].map(pay => (
                                  <button
                                    key={pay}
                                    type="button"
                                    onClick={() => setPaymentMethod(pay)}
                                    className={`cursor-pointer py-2 border rounded-lg text-center transition-all ${paymentMethod === pay ? 'bg-[#0D483E] text-white border-[#0D483E]' : 'bg-white text-neutral-600 border-neutral-300'}`}
                                  >
                                    {pay}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Calculations & Action Buttons */}
                          <div className="border-t border-[#0D483E]/10 pt-4 space-y-4">
                            {/* Subtotals */}
                            <div className="text-xs space-y-1.5">
                              <div className="flex justify-between">
                                <span>Atelier Base Price:</span>
                                <span className="font-mono">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                              </div>
                              {couponDiscount > 0 && (
                                <div className="flex justify-between text-emerald-700 font-semibold">
                                  <span>Invitation Promo Code:</span>
                                  <span className="font-mono">- ₹{calculatedDiscount.toLocaleString('en-IN')}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span>Premium Insured Carrier:</span>
                                <span className="font-mono">{deliveryFreight === 0 ? 'FREE DELIVERY' : `₹${deliveryFreight}`}</span>
                              </div>
                              <div className="flex justify-between text-base font-extrabold text-[#0B2B25] pt-2 border-t border-[#0D483E]/10">
                                <span>Total Valuation:</span>
                                <span className="font-mono text-[#0D483E]">₹{cartTotal.toLocaleString('en-IN')}</span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => setIsCheckoutMode(false)}
                                className="flex-1 border border-neutral-300 text-[#0B2B25] hover:bg-neutral-100 py-3 text-[10px] uppercase font-bold tracking-widest cursor-pointer rounded-lg"
                              >
                                Back to Bag
                              </button>
                              <button
                                onClick={handleCompleteOrder}
                                className="flex-1 bg-[#0D483E] hover:bg-[#0A2E28] border border-[#D4AF37]/35 text-white py-3 text-[10px] uppercase font-bold tracking-widest transition-all cursor-pointer shadow-md rounded-lg gold-glow-button"
                              >
                                SECURE AUTHORIZATION
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom luxury toast notification system */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: -20, x: "-50%", scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[99999] max-w-sm w-full bg-white/95 backdrop-blur-md border border-[#D4AF37]/35 rounded-2xl shadow-2xl p-5 flex items-start gap-4"
          >
            <div className={`p-2.5 rounded-xl ${
              toast.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
              toast.type === 'error' ? 'bg-rose-50 text-rose-600' :
              'bg-amber-50 text-amber-600'
            }`}>
              {toast.type === 'success' ? <Check size={18} /> :
               toast.type === 'error' ? <ShieldAlert size={18} /> :
               <Sparkle size={18} />}
            </div>
            <div className="flex-1 space-y-0.5">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4A1525] font-sans">
                {toast.type === 'success' ? 'Maison Success' :
                 toast.type === 'error' ? 'Maison Alert' :
                 'Maison Update'}
              </h4>
              <p className="text-[11px] text-neutral-600 leading-relaxed font-light italic font-serif">
                {toast.message}
              </p>
            </div>
            <button 
              onClick={() => setToast(null)}
              className="text-neutral-400 hover:text-neutral-600 transition-colors text-[10px] uppercase font-bold cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page transition overlay */}
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <PageTransition key="transition-overlay" isVisible={isTransitioning} destinationTab={transitionTab} customColorMood={customColorMood} />
        )}
      </AnimatePresence>

      {/* Critique Mascot Selector Floating Sparkles */}
      <AnimatePresence>
        {selectionSparkles.map((sp) => (
          <motion.div
            key={sp.id}
            initial={{ opacity: 1, scale: sp.scale, x: sp.x, y: sp.y }}
            animate={{ 
              opacity: 0, 
              scale: 0.2, 
              x: sp.x + Math.cos(sp.angle) * 50, 
              y: sp.y - 85 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            onAnimationComplete={() => {
              setSelectionSparkles(prev => prev.filter(item => item.id !== sp.id));
            }}
            className="fixed pointer-events-none text-xs z-[99999] select-none"
          >
            {sp.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

    </div>
  );
}


