/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Heart, Search, ArrowRight, Star, Check, Trash2, 
  ChevronRight, Sparkles, Filter, Award, ShieldAlert, Sliders,
  Clock, MapPin, Smile, MessageSquare, ChevronDown, CheckCircle, 
  CreditCard, Loader2, Sparkle, UserCheck, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import DesignerMarketplace from './components/DesignerMarketplace';
import ChatAtelier from './components/ChatAtelier';
import TrackingDocketModal from './components/TrackingDocketModal';
import { Product, Designer, CartItem, Order, Consultation, Review } from './types';

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

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [customColorMood, setCustomColorMood] = useState<string>('gold');
  const [products, setProducts] = useState<Product[]>([]);
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Modals & Active Selections
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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
  const [isZoomed, setIsZoomed] = useState(false);

  // Auth Form
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Load Initial Data
  const fetchProducts = async () => {
    setIsProductsLoading(true);
    try {
      // Intentional subtle delay for elite shimmering feel
      await new Promise((resolve) => setTimeout(resolve, 750));
      const res = await fetch('/api/products');
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
      const res = await fetch('/api/designers');
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
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        setWishlist(data);
      }
    } catch (e) {
      console.error("Failed to load wishlist", e);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchDesigners();
    fetchWishlist();

    // Auto-login with test VIP account for delightful instant UX
    handleAutoLogin();
  }, []);

  // GSAP and Scroll animations on activeTab transition
  useEffect(() => {
    if (activeTab === 'home') {
      // Elegant staggering reveal of the title header
      gsap.fromTo('.gsap-hero-title', 
        { opacity: 0, y: 70, skewY: 5 }, 
        { opacity: 1, y: 0, skewY: 0, duration: 1.2, ease: "power4.out", delay: 0.1 }
      );
      // Fade in staggers for remaining text / buttons
      gsap.fromTo('.gsap-hero-fade', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 1.0, stagger: 0.15, ease: "power3.out", delay: 0.4 }
      );
      // Floating card effect
      gsap.fromTo('.gsap-floating-card',
        { y: 15 },
        { y: -15, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" }
      );
    }
  }, [activeTab]);

  const handleAutoLogin = async () => {
    try {
      const res = await fetch('/api/auth/login', {
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
      const res = await fetch(`/api/orders/user/${currentUser.id}`);
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

  // Auth Functions
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;

    try {
      const url = isRegisterMode ? '/api/auth/register' : '/api/auth/login';
      const body = isRegisterMode 
        ? { email: authEmail, name: authName, phone: authPhone }
        : { email: authEmail };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        alert(`Successfully authenticated as ${data.user.name}. Welcome to ANVAA.`);
        setIsAuthOpen(false);
        setActiveTab('home');
      } else {
        alert(data.error || "Authentication failed. Please verify credentials.");
      }
    } catch (err) {
      console.error("Auth error", err);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    alert("Logged out from the ANVAA VIP studio session.");
    setActiveTab('home');
  };

  // Wishlist Actions
  const handleToggleWishlist = async (productId: string) => {
    try {
      const res = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      if (res.ok) {
        const data = await res.json();
        setWishlist(data.wishlist);
      }
    } catch (err) {
      console.error("Wishlist action failed", err);
    }
  };

  // Cart Actions
  const handleAddToCart = (product: Product, size: string) => {
    const existing = cart.find(item => item.product.id === product.id && item.selectedSize === size);
    if (existing) {
      setCart(cart.map(item => 
        (item.product.id === product.id && item.selectedSize === size)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1, selectedSize: size }]);
    }
    // Animated trigger effect
    setIsCartOpen(true);
  };

  const handleReorderItem = (product: Product, size: string) => {
    handleAddToCart(product, size || 'M');
  };

  const handleUpdateCartQty = (productId: string, size: string, qty: number) => {
    if (qty <= 0) {
      setCart(cart.filter(item => !(item.product.id === productId && item.selectedSize === size)));
    } else {
      setCart(cart.map(item => 
        (item.product.id === productId && item.selectedSize === size)
          ? { ...item, quantity: qty }
          : item
      ));
    }
  };

  const handleRemoveCartItem = (productId: string, size: string) => {
    setCart(cart.filter(item => !(item.product.id === productId && item.selectedSize === size)));
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
      alert("✦ 10% First Order Heritage discount code accepted!");
    } else {
      alert("Invalid or expired elite invitation code.");
    }
  };

  // Complete Order
  const handleCompleteOrder = async () => {
    if (!currentUser) {
      alert("Bespoke orders require VIP account registration.");
      setIsAuthOpen(true);
      return;
    }
    if (!addressName || !addressStreet || !addressCity || !addressPincode || !addressPhone) {
      alert("Standard couture shipments need complete delivery address information.");
      return;
    }

    const payload = {
      userId: currentUser.id,
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
      const res = await fetch('/api/orders', {
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
        alert(`Congratulations! Premium Order ${data.order.id} is recorded with ANVAA Ateliers.`);
      }
    } catch (err) {
      console.error("Checkout process failed", err);
    }
  };

  // Book physical or virtual consultation
  const handleBookConsultation = async (consultData: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/consultations', {
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
      const res = await fetch(`/api/products/${productId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
          userName: reviewName || currentUser?.name || "Premium Client"
        })
      });

      if (res.ok) {
        alert("Your refined critique has been recorded with the design salon.");
        setSelectedProduct(null); // Close modal
        setReviewComment('');
        setReviewRating(5);
        setReviewName('');
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
      />

      {/* RENDER ACTIVE TAB BODY */}
      <main className="flex-1">

        {/* 1. HOME VIEW */}
        {activeTab === 'home' && (
          <div className="space-y-20 animate-luxury-reveal">
            
            {/* FULLSCREEN HERO METROPOLIS */}
            <section className="relative h-[90vh] bg-[#FFFBFB] text-[#4A1525] flex items-center overflow-hidden border-b border-[#D4AF37]/25">
              <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 mix-blend-multiply scale-105 transition-all duration-[10s]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600')" }}></div>
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

            {/* THREE BLOCK CATEGORY CARDS SHOWCASE */}
            <motion.section 
              className="max-w-7xl mx-auto px-6 lg:px-12 py-10"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="text-center md:text-left mb-12">
                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#D4AF37] block mb-2">SHOP THE VISION</span>
                <h2 className={`text-3xl lg:text-4xl font-serif italic ${theme.text}`}>Curated Capsules</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { cat: 'Wedding Collection', title: 'Wedding Luxe', desc: 'Sangeet, lehengas & heavy zardozi.', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600' },
                  { cat: 'Office Wear', title: 'Office Chic', desc: 'Structured crepe suits & crisp drapes.', img: 'https://images.unsplash.com/photo-1548624149-f7b3e6432b42?q=80&w=600' },
                  { cat: 'Casual Wear', title: 'Resort Flow', desc: 'Effortless blocked silks & cotton midis.', img: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=600' }
                ].map((capsule, i) => (
                  <div 
                    key={i}
                    onClick={() => { setFilterCategory(capsule.cat); setActiveTab('collections'); }}
                    className="group cursor-pointer relative h-96 overflow-hidden rounded-xl bg-[#4A1525]/10 border border-[#D4AF37]/15 shadow-sm"
                  >
                    <img 
                      src={capsule.img} 
                      alt={capsule.title} 
                      className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity hover:mix-blend-normal" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#4A1525]/95 via-[#4A1525]/45 to-transparent flex flex-col justify-end p-8">
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
                  </div>
                ))}
              </div>
            </motion.section>

            {/* HOVER PARALLAX STYLE ACCENT SPLIT: WEDDING FEATURE */}
            <motion.section 
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
                  <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600" className="w-full h-[400px] object-cover rounded-xl shadow-lg border border-[#F5E6D3]" />
                  <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600" className="w-full h-[400px] object-cover rounded-xl mt-8 shadow-lg border border-[#F5E6D3]" />
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
                    className="group bg-white rounded-2xl border border-neutral-100 overflow-hidden relative shadow-sm hover:shadow-lg transition-all duration-500 flex flex-col justify-between"
                  >
                    
                    {/* wishlist toggle */}
                    <motion.button 
                      onClick={() => handleToggleWishlist(p.id)}
                      className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white backdrop-blur-md p-2 rounded-full cursor-pointer border shadow-sm text-neutral-400 hover:text-[#B76E79]"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      animate={wishlist.includes(p.id) ? {
                        scale: [1, 1.45, 0.9, 1.25, 0.95, 1],
                      } : { scale: 1 }}
                      transition={{ duration: 0.55, ease: "easeInOut" }}
                    >
                      <Heart size={14} className={wishlist.includes(p.id) ? "fill-[#B76E79] text-[#B76E79]" : ""} />
                    </motion.button>

                    <div 
                      onClick={() => handleOpenProductDetails(p)}
                      className="cursor-pointer overflow-hidden bg-neutral-100 h-96 relative"
                    >
                      <img 
                        src={p.images[0]} 
                        alt={p.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" 
                      />
                      {p.stock <= 3 && (
                        <div className="absolute bottom-3 left-3 bg-[#4A1525] text-white text-[8px] font-mono tracking-widest px-2.5 py-1 uppercase rounded-md font-bold shadow-md">
                          ONLY {p.stock} ATELIER PIECES LEFT
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] uppercase font-bold tracking-widest text-[#B76E79] font-mono">{p.category}</span>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                          <Star size={11} className="fill-[#D4AF37] text-[#D4AF37]" />
                          <span className={`text-[10px] font-mono ${theme.text} font-semibold`}>{p.rating}</span>
                        </div>
                      </div>
                      
                      <h4 
                        onClick={() => handleOpenProductDetails(p)}
                        className={`font-serif italic text-base font-bold ${theme.text} cursor-pointer hover:text-[#D4AF37] transition-all truncate`}
                      >
                        {p.name}
                      </h4>

                      {p.designerName && (
                        <p className="text-[11px] text-neutral-400 font-serif italic">Curated by {p.designerName}</p>
                      )}

                      <div className="flex justify-between items-center pt-3 border-t border-neutral-100">
                        <p className={`text-sm font-bold ${theme.text} font-mono`}>₹{p.price.toLocaleString('en-IN')}</p>
                        <button
                          onClick={() => handleAddToCart(p, p.sizes?.[0] || 'M')}
                          className="text-[10px] uppercase font-bold text-[#D4AF37] hover:text-[#B76E79] transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>Enlist Bag</span>
                          <ArrowRight size={11} />
                        </button>
                      </div>
                    </div>

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

          </div>
        )}

        {/* 2. COLLECTIONS GRIDS */}
        {activeTab === 'collections' && (
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-16 animate-luxury-reveal">
            
            {/* Search + Category Controls */}
            <div className={`border-b ${theme.borderColor} pb-8 mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6`}>
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#B76E79] font-black block mb-2">ANVAA MAISON CATALOG</span>
                <h1 className={`text-4xl lg:text-5xl font-serif italic ${theme.text}`}>
                  The Premium Collections
                </h1>
              </div>

              {/* Dynamic search bar */}
              <div className="w-full lg:w-96 relative">
                <input
                  type="text"
                  placeholder="Inquire after specific fabrics or style names..."
                  className={`w-full bg-white border ${theme.borderColor} pr-10 focus:border-[#D4AF37] px-4 py-3 text-xs outline-none transition-all placeholder:text-neutral-400 font-light`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search size={14} className="absolute right-3.5 top-3.5 text-neutral-400" />
              </div>
            </div>

            {/* Filter buttons with beautiful color themes */}
            <div className="flex flex-wrap gap-2 md:gap-3 mb-10 border-b border-neutral-100 pb-5">
              {[
                { tag: 'All', label: 'All Capsule Collections' },
                { tag: 'Wedding Collection', label: 'Wedding Collection' },
                { tag: 'Office Wear', label: 'Office Wear' },
                { tag: 'Casual Wear', label: 'Casual Wear' },
                { tag: 'Designer Collections', label: 'Designer Collections' },
                { tag: 'Premium Limited Editions', label: 'Premium Limited Editions' }
              ].map((item) => (
                <button
                  key={item.tag}
                  onClick={() => setFilterCategory(item.tag)}
                  className={`cursor-pointer px-4 lg:px-5 py-2.5 rounded-full text-[10px] lg:text-xs uppercase tracking-widest font-bold border transition-all duration-300 ${
                    filterCategory === item.tag 
                      ? `${theme.buttonPrimary} shadow-md` 
                      : `bg-white ${theme.text} border-neutral-200 hover:border-[#D4AF37]`
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Main grid */}
            {isProductsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div 
                    key={`skeleton-prod-${idx}`} 
                    className={`${theme.cardBg} rounded-xl border ${theme.borderColor} overflow-hidden relative shadow-sm flex flex-col justify-between`}
                  >
                    <div className="luxury-shimmer-bg h-[450px] relative w-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent"></div>
                    </div>
                    <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px]">
                          <div className="luxury-shimmer-bg h-3 w-1/4 rounded"></div>
                          <div className="luxury-shimmer-bg h-3 w-1/5 rounded"></div>
                        </div>
                        <div className="luxury-shimmer-bg h-6 w-3/4 rounded-md"></div>
                        <div className="luxury-shimmer-bg h-3 w-1/2 rounded"></div>
                        <div className="space-y-1.5 pt-2">
                          <div className="luxury-shimmer-bg h-2.5 w-full rounded"></div>
                          <div className="luxury-shimmer-bg h-2.5 w-5/6 rounded"></div>
                          <div className="luxury-shimmer-bg h-2.5 w-4/5 rounded"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-neutral-100/50 mt-4">
                        <div className="luxury-shimmer-bg h-5 w-1/4 rounded"></div>
                        <div className="luxury-shimmer-bg h-8 w-1/3 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="italic text-neutral-400 font-serif">No styles match your search criteria. Please review tags or enter another drape query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredProducts.map((p) => (
                  <div 
                    key={p.id} 
                    className={`group ${theme.cardBg} rounded-xl border ${theme.borderColor} overflow-hidden relative shadow-sm hover:shadow-xl transition-all duration-[500ms] flex flex-col justify-between`}
                  >
                    
                    {/* wishlist */}
                    <motion.button 
                      onClick={() => handleToggleWishlist(p.id)}
                      className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white backdrop-blur-md p-2 rounded-full cursor-pointer border shadow-sm text-neutral-400 hover:text-[#B76E79]"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      animate={wishlist.includes(p.id) ? {
                        scale: [1, 1.45, 0.9, 1.25, 0.95, 1],
                      } : { scale: 1 }}
                      transition={{ duration: 0.55, ease: "easeInOut" }}
                    >
                      <Heart size={14} className={wishlist.includes(p.id) ? "fill-[#B76E79] text-[#B76E79]" : ""} />
                    </motion.button>

                    <div 
                      onClick={() => handleOpenProductDetails(p)}
                      className="cursor-pointer overflow-hidden bg-neutral-100 h-[450px] relative"
                    >
                      <img 
                        src={p.images[0]} 
                        alt={p.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" 
                      />
                      <div className="absolute inset-0 bg-[#4A1525]/10 group-hover:bg-transparent transition-colors"></div>
                      
                      {p.category === 'Premium Limited Editions' && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-[#4A1525] text-[8px] font-black tracking-widest px-2.5 py-1 uppercase rounded shadow">
                          LIMITED HERITAGE SERIAL
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-2 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1 text-[10px] font-mono font-bold">
                          <span className="text-[#B76E79] uppercase">{p.category}</span>
                          <span className="text-neutral-400">RATING: {p.rating} / 5</span>
                        </div>
                        
                        <h3 
                          onClick={() => handleOpenProductDetails(p)}
                          className={`font-serif italic text-lg font-bold ${theme.text} cursor-pointer hover:${theme.accentText} transition-all`}
                        >
                          {p.name}
                        </h3>

                        {p.designerName && (
                          <p onClick={() => setActiveTab('designers')} className={`text-xs ${theme.accentText} font-serif italic mt-0.5 hover:underline cursor-pointer`}>
                            by designer {p.designerName}
                          </p>
                        )}

                        <p className={`text-xs ${theme.textMuted} font-light leading-relaxed mt-2 line-clamp-3`}>
                          {p.description}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-neutral-100 mt-4">
                        <p className={`text-base font-extrabold ${theme.text} font-mono`}>₹{p.price.toLocaleString('en-IN')}</p>
                        <button
                          onClick={() => handleAddToCart(p, p.sizes?.[0] || 'M')}
                          className={`${theme.buttonPrimary} text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded cursor-pointer transition-all duration-300`}
                        >
                          Enlist Bag
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* 3. DESIGNER MARKETPLACE TAB CONTAINER */}
        {activeTab === 'designers' && (
          <DesignerMarketplace
            designers={designers}
            products={products}
            currentUser={currentUser}
            onBookConsultation={handleBookConsultation}
            onContactDesigner={handleContactDesigner}
            setActiveTab={setActiveTab}
            theme={theme}
          />
        )}

        {/* 4. BESPOKE CHAt TAB CONTAINER */}
        {activeTab === 'chat' && (
          <ChatAtelier
            designers={designers}
            currentUser={currentUser}
            setActiveTab={setActiveTab}
          />
        )}

        {/* 5. USER DASHBOARD VIEW */}
        {activeTab === 'dashboard' && currentUser && (
          <div className={`max-w-7xl mx-auto px-6 lg:px-12 py-12 ${theme.text} ${theme.bg} min-h-[80vh] animate-luxury-reveal`}>
            
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
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-[#D4AF37] font-black border-b pb-2 mb-4">Credentials & Logistics</h3>
                  <div className="space-y-4 text-xs text-neutral-700 font-light">
                    <div>
                      <span className="block font-semibold text-neutral-400">VIP GUEST</span>
                      <span className="font-bold text-gray-800">{currentUser.name}</span>
                    </div>
                    <div>
                      <span className="block font-semibold text-neutral-400">EMAIL ENCRYPTED</span>
                      <span className="font-bold text-gray-800">{currentUser.email}</span>
                    </div>
                    <div>
                      <span className="block font-semibold text-neutral-400">PHONE DIRECT</span>
                      <span className="font-bold text-gray-800 font-mono">{currentUser.phone || "Not recorded"}</span>
                    </div>
                    <div>
                      <span className="block font-semibold text-neutral-400">CRAFT ROSTER ROLE</span>
                      <span className="inline-block bg-[#FFF0F2] text-[#B76E79] text-[9px] px-3 py-1 uppercase tracking-widest font-black rounded-full border border-[#B76E79]/20">
                        {currentUser.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs uppercase tracking-widest text-[#D4AF37] font-black border-b pb-2 mb-3">Saved Shipping Coordinates</h3>
                  {currentUser.savedAddresses && currentUser.savedAddresses.length > 0 ? (
                    currentUser.savedAddresses.map((addr: any, idx: number) => (
                      <div key={idx} className="bg-[#FFFDFB] p-4 rounded-xl border border-rose-100 text-xs leading-relaxed space-y-1 mt-2 shadow-inner">
                        <p className="font-bold text-gray-800">{addr.name}</p>
                        <p className="text-neutral-500 font-light">{addr.street}, {addr.city}</p>
                        <p className="text-neutral-400 font-mono text-[11px]">{addr.pincode} | PH: {addr.phone}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-neutral-400 italic">No saved addresses coordinates yet. Captured on initial checkout.</p>
                  )}
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
                            {/* Header Meta Row */}
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
                            
                            {/* Order item row */}
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

                            {/* Footer */}
                            <div className="pt-3 border-t border-rose-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                              <div className="space-y-1 w-full sm:w-1/3">
                                <div className="luxury-shimmer-bg h-2 w-1/4 rounded"></div>
                                <div className="luxury-shimmer-bg h-2.5 w-full rounded mt-1"></div>
                              </div>
                              <div className="space-y-1 w-full sm:w-1/4 sm:text-right">
                                <div className="luxury-shimmer-bg h-2 w-1/3 sm:ml-auto rounded"></div>
                                <div className="luxury-shimmer-bg h-4 w-1/2 sm:ml-auto rounded mt-1"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : ordersHistory && ordersHistory.length > 0 ? (
                      ordersHistory.map((order) => (
                        <div key={order.id} className="border border-[#D4AF37]/20 rounded-2xl p-5 bg-[#FFFDFB] space-y-4 hover:border-[#D4AF37]/50 transition-all shadow-sm">
                          
                          {/* Order Header / Meta Row */}
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

                          {/* Order Items List */}
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
                                
                                {/* Buy Again/Re-order trigger button */}
                                <button
                                  onClick={() => handleReorderItem(item.product, item.selectedSize)}
                                  className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#D4AF37] via-[#E5A4B4] to-[#B76E79] text-white hover:opacity-90 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer shadow-sm text-center"
                                >
                                  ✦ Re-order Item
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Order Shipping / Tracking / Pricing Summary Foot */}
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

          </div>
        )}

        {/* 6. ORDER TRACKING VIEW */}
        {activeTab === 'tracking' && (
          <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16 text-[#4A1525] bg-[#FAF9F6] min-h-[85vh] animate-luxury-reveal">
            
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
          </div>
        )}

        {/* 7. AUTH LOGIN PAGE AND SECURITY */}
        {activeTab === 'auth' && (
          <div className="max-w-md mx-auto px-6 py-16 text-[#4A1525] bg-[#FAF9F6] min-h-[75vh] flex flex-col justify-center animate-luxury-reveal">
            <div className="bg-white border border-[#D4AF37]/25 p-8 rounded-2xl shadow-sm space-y-6">
              
              <div className="text-center">
                <span className="text-2xl font-serif italic tracking-widest gold-text-gradient block font-extrabold mb-1">ANVAA MAISON</span>
                <h3 className="text-lg font-serif italic text-[#4A1525] font-semibold uppercase tracking-widest">
                  {isRegisterMode ? 'VIP Atelier Signup' : 'VIP Studio Entry'}
                </h3>
                <p className="text-[11px] text-neutral-500 mt-2 italic">
                  Enjoy custom handloom adjustments, coordinate seasonal lookbooks, and save billing info securely.
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs font-light">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase text-[9px] mb-1">Elite VIP Account Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. codewithvibe64@gmail.com"
                    className="w-full bg-[#FAF9F6] border border-neutral-300 p-3 outline-none focus:border-[#D4AF37] font-mono text-zinc-800"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                  />
                </div>

                {isRegisterMode && (
                  <>
                    <div>
                      <label className="block text-neutral-400 font-bold uppercase text-[9px] mb-1">Complete Legal Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vasantika Sen"
                        className="w-full bg-[#FAF9F6] border border-neutral-300 p-3 outline-none focus:border-[#D4AF37]"
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
                        className="w-full bg-[#FAF9F6] border border-neutral-300 p-3 outline-none focus:border-[#D4AF37] font-mono text-zinc-800"
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#4A1525] text-[#FAF9F6] py-3.5 text-xs font-black uppercase tracking-widest hover:bg-[#6A162B] transition-all cursor-pointer shadow-sm rounded-lg"
                >
                  {isRegisterMode ? 'REQUEST VIP ACCOUNT' : 'ENTER ATELIER'}
                </button>
              </form>

              {/* Social login integration UI block */}
              <div className="space-y-3.5 pt-4 border-t text-center">
                <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Social Federated Access</p>
                <div className="grid grid-cols-2 gap-3 text-[10px] uppercase tracking-widest font-black">
                  <button 
                    onClick={() => {
                      setCurrentUser({ id: 'f_google', email: 'vibe_federated@gmail.com', name: 'Google Studio Client', role: 'customer' });
                      alert("Authenticated via federated Google Account.");
                      setActiveTab('home');
                    }}
                    className="border border-neutral-200 py-2.5 rounded hover:bg-neutral-50 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    ✦ Google
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentUser({ id: 'f_apple', email: 'vibe_apple@apple.com', name: 'Apple VIP Client', role: 'customer' });
                      alert("Authenticated via federated Apple Secure Account.");
                      setActiveTab('home');
                    }}
                    className="border border-neutral-200 py-2.5 rounded hover:bg-neutral-50 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    ✦ Apple VIP
                  </button>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
                  className="text-[11px] text-[#D4AF37] hover:underline font-serif italic"
                >
                  {isRegisterMode ? 'Already registered with ANVAA? Login instead' : 'New to ANVAA? Request custom VIP account credentials'}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* 8. ADMIN MODE INTERFACES */}
        {activeTab === 'admin' && currentUser && currentUser.role === 'admin' && (
          <AdminPanel 
            onRefreshProducts={fetchProducts}
            products={products}
            designers={designers}
          />
        )}

      </main>

      {/* FOOTER */}
      <Footer setActiveTab={setActiveTab} />

      {/* LUXURY PRODUCT DETAIL MODAL OVERLAY */}
      {selectedProduct && (
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

      {/* LUXURY CART BAG SIDEBAR OVERLAY */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-[#4A1525]/30 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-[#FAF9F6] text-[#4A1525] w-full max-w-md h-full flex flex-col justify-between border-l border-[#D4AF37]/35 shadow-2xl p-6 relative animate-luxury-reveal">
            
            {/* Header */}
            <div>
              <div className="flex justify-between items-center border-b border-[#D4AF37]/25 pb-4 mb-4">
                <h3 className="font-serif italic text-2xl text-[#4A1525] font-extrabold">My Selection Bag</h3>
                <button 
                  onClick={() => { setIsCartOpen(false); setIsCheckoutMode(false); }}
                  className="p-1.5 border hover:bg-neutral-50 rounded-full cursor-pointer text-xs"
                >
                  ✕ CLOSE
                </button>
              </div>

              {/* Items List */}
              {cart.length === 0 && !isCheckoutMode ? (
                <div className="text-center py-24 select-none space-y-4">
                  <div className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center mx-auto text-neutral-400">
                    <ShoppingBag size={20} />
                  </div>
                  <p className="italic text-neutral-400 text-xs font-serif">Your bespoke luxury collection bag is currently empty.</p>
                </div>
              ) : (
                !isCheckoutMode ? (
                  <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex gap-4 p-3 bg-white border border-neutral-100 rounded-lg hover:shadow-sm transition-all items-center">
                        <img src={item.product?.images?.[0]} className="w-14 h-16 object-cover rounded" />
                        <div className="flex-1 min-w-0">
                          <p className="font-serif italic text-xs font-bold text-[#4A1525] truncate">{item?.product?.name}</p>
                          <p className="text-[10px] text-neutral-500 mt-0.5">Size Selected: <strong className="text-[#4A1525]">{item.selectedSize}</strong></p>
                          <div className="flex items-center gap-2 mt-1">
                            <button 
                              onClick={() => handleUpdateCartQty(item.product.id, item.selectedSize, item.quantity - 1)}
                              className="w-5 h-5 border rounded flex items-center justify-center font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="text-xs font-mono font-bold text-zinc-800">{item.quantity}</span>
                            <button 
                              onClick={() => handleUpdateCartQty(item.product.id, item.selectedSize, item.quantity + 1)}
                              className="w-5 h-5 border rounded flex items-center justify-center font-bold text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-[#4A1525] font-mono">₹{(item.product?.price * item.quantity).toLocaleString()}</p>
                          <button
                            onClick={() => handleRemoveCartItem(item.product.id, item.selectedSize)}
                            className="text-red-700 hover:text-red-900 mt-1 pointer text-[10px] uppercase font-bold"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* CHECKOUT WORKFLOW VIEW inside cart shell to conserve DOM token count and prevent overflow */
                  <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1 text-xs text-neutral-700 font-light">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] border-b pb-1">DELIVERY COORDINATES & SETTLEMENT</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[9px] uppercase font-bold mb-1">Couture Recipient Name</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-white border p-2 text-xs outline-none focus:border-[#D4AF37]"
                          value={addressName}
                          onChange={(e) => setAddressName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-bold mb-1">Street Address, Flat / Villa No.</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-white border p-2 text-xs outline-none focus:border-[#D4AF37]"
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
                            className="w-full bg-white border p-2 text-xs"
                            value={addressCity}
                            onChange={(e) => setAddressCity(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase font-bold mb-1">Pincode Coordinate</label>
                          <input
                            type="text"
                            required
                            className="w-full bg-white border p-2 text-xs font-mono"
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
                          className="w-full bg-white border p-2 text-xs font-mono"
                          value={addressPhone}
                          onChange={(e) => setAddressPhone(e.target.value)}
                        />
                      </div>

                      {/* Payment selections */}
                      <div>
                        <label className="block text-[9px] uppercase font-bold mb-2">Select Solder-Secure Payment Gateway</label>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-[#4A1525] uppercase tracking-wider">
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
                              className={`cursor-pointer py-2 border rounded text-center transition-all ${paymentMethod === pay ? 'bg-[#4A1525] text-white border-[#4A1525]' : 'bg-white text-neutral-600 border-neutral-300'}`}
                            >
                              {pay}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Calculations and Actions footer */}
            {cart.length > 0 && (
              <div className="border-t border-[#D4AF37]/30 pt-4 space-y-3">
                
                {/* Coupon alignment panel */}
                {!isCheckoutMode && (
                  <div className="flex gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Elite Invite Code (try ANVAANEW)"
                      className="flex-1 bg-white border p-2 outline-none focus:border-[#D4AF37]"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button
                      onClick={applyPromo}
                      className="bg-[#4A1525] hover:bg-[#6A162B] text-white px-4 py-2 text-[10px] font-bold uppercase transition-all tracking-wider cursor-pointer rounded-lg"
                    >
                      Apply
                    </button>
                  </div>
                )}

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
                  <div className="flex justify-between text-base font-extrabold text-[#4A1525] pt-2 border-t">
                    <span>Total Valuation:</span>
                    <span className="font-mono text-[#D4AF37]">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Submit trigger button */}
                {!isCheckoutMode ? (
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        alert("Please login first to enter checkout.");
                        setIsCartOpen(false);
                        setActiveTab('auth');
                      } else {
                        setIsCheckoutMode(true);
                      }
                    }}
                    className="w-full bg-[#4A1525] hover:bg-[#6A162B] text-[#FAF9F6] py-3.5 text-xs font-black uppercase tracking-widest transition-all cursor-pointer rounded-lg text-center shadow-lg"
                  >
                    PROCEED TO COUTURE CHECKOUT
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsCheckoutMode(false)}
                      className="flex-1 border text-[#4A1525] hover:bg-neutral-100 py-3 text-[10px] uppercase font-bold tracking-widest cursor-pointer rounded-lg"
                    >
                      Back to Bag
                    </button>
                    <button
                      onClick={handleCompleteOrder}
                      className="flex-1 bg-[#D4AF37] hover:bg-amber-600 text-[#4A1525] py-3 text-[10px] uppercase font-bold tracking-widest transition-all cursor-pointer shadow-md"
                    >
                      SECURE AUTHORIZATION
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
