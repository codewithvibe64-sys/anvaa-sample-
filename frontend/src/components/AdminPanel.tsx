/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, ShoppingBag, Users, Calendar, Plus, Edit, Trash2, 
  Check, ArrowRight, TrendingUp, Sparkles, User, RefreshCw
} from 'lucide-react';
import { Product, Designer, Order, Consultation } from '../types';

interface AdminPanelProps {
  onRefreshProducts: () => void;
  products: Product[];
  designers: Designer[];
}

export default function AdminPanel({ onRefreshProducts, products, designers }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'designers' | 'orders' | 'consultations'>('overview');
  const [analytics, setAnalytics] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(false);

  // New product form state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodForm, setProdForm] = useState({
    name: '',
    price: 0,
    category: 'Wedding Collection' as any,
    description: '',
    designerId: '',
    designerName: '',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 10,
    isTrending: false
  });

  // New designer form state
  const [editingDesignerId, setEditingDesignerId] = useState<string | null>(null);
  const [desForm, setDesForm] = useState({
    id: '',
    name: '',
    city: '',
    specialty: '',
    bio: '',
    consultationFee: 2500,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
    coverImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800',
    achievements: ['Vogue Award Nominee'],
    history: [{ year: '2026', event: 'Atelier design launch.' }]
  });

  // Fetch admin stats
  const fetchAnalyticsAndOrders = async () => {
    setLoading(true);
    try {
      const analyticsRes = await fetch('/api/admin/analytics');
      const analyticsData = await analyticsRes.json();
      setAnalytics(analyticsData);

      const ordersRes = await fetch('/api/admin/orders');
      const ordersData = await ordersRes.json();
      setOrders(ordersData);

      const consultsRes = await fetch('/api/admin/consultations');
      const consultsData = await consultsRes.json();
      setConsultations(consultsData);
    } catch (e) {
      console.error('Failed to load admin context', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsAndOrders();
  }, [products, designers]);

  // Product actions
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pData = {
        ...prodForm,
        id: editingProductId || "prod_" + Date.now(),
        price: Number(prodForm.price),
        stock: Number(prodForm.stock),
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pData)
      });

      if (res.ok) {
        alert("Product saved successfully in the ANVAA inventory database.");
        // Reset
        setEditingProductId(null);
        setProdForm({
          name: '',
          price: 0,
          category: 'Wedding Collection',
          description: '',
          designerId: '',
          designerName: '',
          images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600'],
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          stock: 10,
          isTrending: false
        });
        onRefreshProducts();
        fetchAnalyticsAndOrders();
      }
    } catch (err) {
      console.error("Error saving product", err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you absolutely sure you wish to decommission this product from ANVAA catalog?")) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      onRefreshProducts();
      fetchAnalyticsAndOrders();
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  const handleEditProductClick = (p: Product) => {
    setEditingProductId(p.id);
    setProdForm({
      name: p.name,
      price: p.price,
      category: p.category,
      description: p.description,
      designerId: p.designerId || '',
      designerName: p.designerName || '',
      images: p.images || ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600'],
      sizes: p.sizes || ['XS', 'S', 'M', 'L', 'XL'],
      stock: p.stock,
      isTrending: !!p.isTrending
    });
  };

  // Designer actions
  const handleSaveDesigner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desForm.id) {
      alert("Please specify a distinct designer handle id (e.g. 'masaba_gupta')");
      return;
    }
    try {
      const res = await fetch('/api/admin/designers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...desForm,
          consultationFee: Number(desForm.consultationFee)
        })
      });
      if (res.ok) {
        alert("Designer credentials recorded securely.");
        setEditingDesignerId(null);
        setDesForm({
          id: '',
          name: '',
          city: '',
          specialty: '',
          bio: '',
          consultationFee: 2500,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
          coverImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800',
          achievements: ['Vogue Award Nominee'],
          history: [{ year: '2026', event: 'Atelier design launch.' }]
        });
        onRefreshProducts();
        fetchAnalyticsAndOrders();
      }
    } catch (err) {
      console.error("Error saving designer", err);
    }
  };

  const handleDeleteDesigner = async (id: string) => {
    if (!confirm("Remove designer from platform? This is irreversible.")) return;
    try {
      await fetch(`/api/admin/designers/${id}`, { method: 'DELETE' });
      onRefreshProducts();
      fetchAnalyticsAndOrders();
    } catch (err) {
      console.error("Error deleting designer", err);
    }
  };

  const handleEditDesignerClick = (d: Designer) => {
    setEditingDesignerId(d.id);
    setDesForm({
      id: d.id,
      name: d.name,
      city: d.city,
      specialty: d.specialty,
      bio: d.bio,
      consultationFee: d.consultationFee,
      avatar: d.avatar,
      coverImage: d.coverImage,
      achievements: d.achievements || [],
      history: d.history || []
    });
  };

  // Order workflow status transitions
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/orders/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status })
      });
      if (res.ok) {
        fetchAnalyticsAndOrders();
      }
    } catch (err) {
      console.error("Status update error", err);
    }
  };

  // Consultation workflow status transitions
  const handleUpdateConsultationStatus = async (consultationId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/consultations/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consultationId, status })
      });
      if (res.ok) {
        fetchAnalyticsAndOrders();
      }
    } catch (err) {
      console.error("Consultation update error", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 text-[#4A1525] bg-[#FAF9F6] min-h-[80vh]">
      
      {/* Title & Core Header with Bold Typography specs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#D4AF37]/35 pb-8 mb-10">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-[#B76E79]">
            <span className="w-6 h-px bg-[#B76E79]"></span>
            <span className="text-[10px] uppercase tracking-[0.25em] font-black">ANVAA INTERNAL ATELIER CONSOLE</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif italic tracking-tight text-[#4A1525]">
            Administration Panel
          </h1>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <button 
            onClick={fetchAnalyticsAndOrders}
            className="p-3 border border-[#D4AF37]/30 text-neutral-800 hover:bg-amber-50 rounded-full transition-all flex items-center gap-1 cursor-pointer"
            title="Refresh Database"
          >
            <RefreshCw size={15} className={loading ? "animate-spin text-[#D4AF37]" : "text-[#D4AF37]"} />
            <span className="text-xs uppercase tracking-widest font-semibold px-1">Sync</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 md:gap-4 border-b border-neutral-200 mb-8 pb-3">
        {[
          { tab: 'overview', label: 'ANVAA Insights' },
          { tab: 'products', label: 'Immersive Catalog' },
          { tab: 'designers', label: 'Master Designers' },
          { tab: 'orders', label: 'Luxury Delivery Orders' },
          { tab: 'consultations', label: 'Atelier Bookings' }
        ].map((item) => (
          <button
            key={item.tab}
            onClick={() => setActiveTab(item.tab as any)}
            className={`cursor-pointer px-5 py-2.5 text-xs uppercase tracking-widest font-bold border-b-2 transition-all ${
              activeTab === item.tab 
                ? 'border-[#D4AF37] text-[#4A1525] bg-[#FAF9F6]' 
                : 'border-transparent text-neutral-500 hover:text-[#4A1525]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW INSIGHTS */}
      {activeTab === 'overview' && analytics && (
        <div className="space-y-10 animate-luxury-reveal">
          {/* Bento aggregate stats GRID */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-[#FAF5EF] text-[#4A1525] p-6 rounded-lg border border-[#D4AF37]/30 relative overflow-hidden">
              {/* Decorative background zardozi details */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-bl-full pointer-events-none"></div>
              <div className="text-3xl font-serif italic text-[#4A1525] flex items-baseline">
                <span className="text-[#D4AF37] text-lg font-sans mr-1">₹</span>
                {analytics.totalSales?.toLocaleString('en-IN') || '0'}
              </div>
              <p className="text-[10px] text-neutral-400 mt-2 font-mono">excluding tax & freight adjustments</p>
              <div className="absolute right-3 bottom-3 opacity-10">
                <DollarSign size={80} className="text-[#D4AF37]" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-[#D4AF37]/20 relative overflow-hidden shadow-sm">
              <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 block mb-2 font-black">MEMBERSHIP ACCOUNTS</span>
              <div className="text-3xl font-serif italic text-[#4A1525]">{analytics.usersCount} VIP</div>
              <p className="text-[10px] text-emerald-700 mt-2 font-semibold">✦ High-net-worth customer profile</p>
              <div className="absolute right-3 bottom-3 opacity-10">
                <Users size={80} className="text-[#B76E79]" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-[#D4AF37]/20 relative overflow-hidden shadow-sm">
              <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 block mb-2 font-black">HAUTE ITEMS IN CATALOG</span>
              <div className="text-3xl font-serif italic text-[#4A1525]">{analytics.productsCount} Styles</div>
              <p className="text-[10px] text-[#B76E79] mt-2 italic font-serif">5 exclusive categories active</p>
              <div className="absolute right-3 bottom-3 opacity-10">
                <ShoppingBag size={80} className="text-[#D4AF37]" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-[#D4AF37]/20 relative overflow-hidden shadow-sm">
              <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 block mb-2 font-black">SOLICITED CONSULTATIONS</span>
              <div className="text-3xl font-serif italic text-[#4A1525]">{analytics.consultationsCount} Booked</div>
              <p className="text-[10px] text-[#D4AF37] mt-2 font-semibold">Atelier stylist queue</p>
              <div className="absolute right-3 bottom-3 opacity-10">
                <Calendar size={80} className="text-[#4A1525]" />
              </div>
            </div>

          </div>

          {/* Revenue By Category distribution & order chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 border border-[#D4AF37]/25 rounded-lg">
              <h3 className="font-serif italic text-lg text-[#4A1525] mb-6 border-b border-neutral-100 pb-3 flex items-center justify-between">
                <span>Revenue by Category Distribution</span>
                <TrendingUp size={16} className="text-[#D4AF37]" />
              </h3>
              <div className="space-y-4">
                {analytics.revenueByCategory && Object.entries(analytics.revenueByCategory).map(([cat, rev]: any) => (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-neutral-800">{cat}</span>
                      <span className="font-semibold text-[#4A1525]">₹{rev?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B76E79]" 
                        style={{ width: `${Math.min(100, Math.max(8, (rev / (analytics.totalSales || 1)) * 100))}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                {!analytics.revenueByCategory || Object.keys(analytics.revenueByCategory).length === 0 && (
                  <p className="text-xs text-neutral-400 italic text-center py-6">No completed order value currently recorded.</p>
                )}
              </div>
            </div>

            <div className="bg-white p-8 border border-[#D4AF37]/25 rounded-lg flex flex-col justify-between">
              <div>
                <h3 className="font-serif italic text-lg text-[#4A1525] mb-6 border-b border-neutral-100 pb-3">
                  Atelier Logistics Registry
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {analytics.orderCountByStatus && Object.entries(analytics.orderCountByStatus).map(([status, count]: any) => (
                    <div key={status} className="p-4 bg-[#FAF9F6] border border-neutral-200 rounded-md">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">{status}</p>
                      <p className="text-2xl font-serif text-[#4A1525] mt-1 font-semibold">{count} Orders</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 p-4 rounded bg-amber-50 text-amber-900 border border-amber-200 text-xs leading-relaxed italic">
                ✦ Every order triggers real-time physical crafting of local Indian handloom weaves within 24 hours. Keep client portfolios updated.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IMMERSIVE PRODUCT CATALOG SECTION */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-luxury-reveal">
          
          {/* Left Column Form */}
          <div className="lg:col-span-1 bg-white p-6 border border-[#D4AF37]/30 rounded-lg h-fit">
            <h3 className="font-serif italic text-lg text-[#4A1525] mb-5 border-b pb-3 flex items-center justify-between">
              <span>{editingProductId ? 'Edit Atelier Style' : 'Introduce New Style'}</span>
              <Sparkles size={15} className="text-[#D4AF37]" />
            </h3>
            
            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-600 mb-1 uppercase font-bold tracking-wider">Garment Master Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Banarasi Crimson Sari"
                  className="w-full bg-[#FAF9F6] border border-neutral-300 p-2.5 outline-none focus:border-[#D4AF37]"
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 mb-1 uppercase font-bold tracking-wider">Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    className="w-full bg-[#FAF9F6] border border-neutral-300 p-2.5 outline-none focus:border-[#D4AF37]"
                    value={prodForm.price || ''}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1 uppercase font-bold tracking-wider">Stock Level</label>
                  <input
                    type="number"
                    required
                    className="w-full bg-[#FAF9F6] border border-neutral-300 p-2.5 outline-none focus:border-[#D4AF37]"
                    value={prodForm.stock || ''}
                    onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 mb-1 uppercase font-bold tracking-wider">Heritage Collection Category</label>
                <select
                  className="w-full bg-[#FAF9F6] border border-neutral-300 p-2.5 outline-none focus:border-[#D4AF37]"
                  value={prodForm.category}
                  onChange={(e) => setProdForm({ ...prodForm, category: e.target.value as any })}
                >
                  <option value="Wedding Collection">Wedding Collection</option>
                  <option value="Office Wear">Office Wear</option>
                  <option value="Casual Wear">Casual Wear</option>
                  <option value="Designer Collections">Designer Collections</option>
                  <option value="Premium Limited Editions">Premium Limited Editions</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 mb-1 uppercase font-bold tracking-wider">Designer Affiliation</label>
                <select
                  className="w-full bg-[#FAF9F6] border border-neutral-300 p-2.5 outline-none focus:border-[#D4AF37]"
                  value={prodForm.designerId}
                  onChange={(e) => {
                    const dObj = designers.find(d => d.id === e.target.value);
                    setProdForm({ 
                      ...prodForm, 
                      designerId: e.target.value,
                      designerName: dObj ? dObj.name : ''
                    });
                  }}
                >
                  <option value="">-- No Specific Designer --</option>
                  {designers.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 mb-1 uppercase font-bold tracking-wider font-sans">Visual Image URL</label>
                <input
                  type="text"
                  required
                  className="w-full bg-[#FAF9F6] border border-neutral-300 p-2.5 outline-none focus:border-[#D4AF37] font-mono text-[10px]"
                  value={prodForm.images[0]}
                  onChange={(e) => setProdForm({ ...prodForm, images: [e.target.value] })}
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1 uppercase font-bold tracking-wider">Fine Narrative Storytelling</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail the fabric history, stitch duration, and drape characteristics..."
                  className="w-full bg-[#FAF9F6] border border-neutral-300 p-2.5 outline-none focus:border-[#D4AF37]"
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="isTrending"
                  checked={prodForm.isTrending}
                  onChange={(e) => setProdForm({ ...prodForm, isTrending: e.target.checked })}
                  className="w-4 h-4 accent-[#D4AF37]"
                />
                <label htmlFor="isTrending" className="font-medium text-neutral-700 cursor-pointer">Highlight in Trending Carousel</label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#4A1525] text-white hover:bg-[#6A162B] py-3 font-bold uppercase tracking-widest cursor-pointer rounded-lg"
                >
                  {editingProductId ? 'Apply Edits' : 'Enlist Garment'}
                </button>
                {editingProductId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProductId(null);
                      setProdForm({ name: '', price: 0, category: 'Wedding Collection', description: '', designerId: '', designerName: '', images: [], sizes: ['S'], stock: 10, isTrending: false });
                    }}
                    className="p-3 border text-neutral-500 hover:text-[#4A1525] cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Column List */}
          <div className="lg:col-span-2 bg-white p-6 border border-[#D4AF37]/20 rounded-lg">
            <h3 className="font-serif italic text-lg text-[#4A1525] mb-5 border-b pb-3">Active Luxury Inventory ({products.length})</h3>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {products.map((p) => (
                <div key={p.id} className="flex gap-4 p-4 border border-neutral-100 rounded-md hover:shadow-sm transition-all items-center">
                  <img src={p.images[0]} alt={p.name} className="w-16 h-20 object-cover rounded shadow-sm bg-neutral-100" />
                  <div className="flex-1 min-w-0">
                    <p className="font-serif italic text-sm font-semibold text-[#4A1525] truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-[#FAF9F6] border border-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold">
                        {p.category}
                      </span>
                      {p.designerName && (
                        <span className="text-[10px] text-neutral-500 font-light font-serif">
                          by {p.designerName}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 mt-1 lines-2 truncate">{p.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs font-bold text-[#4A1525] font-sans">₹{p.price.toLocaleString('en-IN')}</span>
                      <span className={`text-[10px] font-mono ${p.stock <= 3 ? 'text-red-700 font-bold' : 'text-neutral-500'}`}>
                        {p.stock} units left
                      </span>
                      {p.isTrending && <span className="text-[10px] text-amber-700 font-bold">★ Trending</span>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditProductClick(p)}
                      className="p-2 text-neutral-600 hover:text-[#D4AF37]"
                      title="Edit Product Details"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="p-2 text-neutral-600 hover:text-red-700"
                      title="Decomission Style"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* MASTER DESIGNER DIRECTORY */}
      {activeTab === 'designers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-luxury-reveal">
          
          {/* Left Form */}
          <div className="bg-white p-6 border border-[#D4AF37]/35 rounded-lg h-fit">
            <h3 className="font-serif italic text-lg text-[#4A1525] mb-5 border-b pb-3">
              {editingDesignerId ? 'Modify Designer Profile' : 'Affiliate Master Designer'}
            </h3>
            <form onSubmit={handleSaveDesigner} className="space-y-4 text-xs font-light">
              <div>
                <label className="block text-neutral-600 mb-1 uppercase font-bold tracking-wider">Atelier ID Handle</label>
                <input
                  type="text"
                  required
                  disabled={!!editingDesignerId}
                  placeholder="e.g. sabyasachi_mukherjee (no spaces)"
                  className="w-full bg-[#FAF9F6] border border-neutral-300 p-2.5 outline-none focus:border-[#D4AF37] text-neutral-800 disabled:opacity-50"
                  value={desForm.id}
                  onChange={(e) => setDesForm({ ...desForm, id: e.target.value.toLowerCase().replace(/ /g, '_') })}
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1 uppercase font-bold tracking-wider">Designer Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-[#FAF9F6] border border-neutral-300 p-2.5 outline-none focus:border-[#D4AF37]"
                  value={desForm.name}
                  onChange={(e) => setDesForm({ ...desForm, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 mb-1 uppercase font-bold tracking-wider">Origin City</label>
                  <input
                    type="text"
                    placeholder="Mumbai / Delhi"
                    className="w-full bg-[#FAF9F6] border border-neutral-300 p-2.5 outline-none"
                    value={desForm.city}
                    onChange={(e) => setDesForm({ ...desForm, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1 uppercase font-bold tracking-wider">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    className="w-full bg-[#FAF9F6] border border-neutral-300 p-2.5 outline-none"
                    value={desForm.consultationFee}
                    onChange={(e) => setDesForm({ ...desForm, consultationFee: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 mb-1 uppercase font-bold tracking-wider">Atelier Craft Specialty</label>
                <input
                  type="text"
                  placeholder="Bridal couture, linen drapery"
                  className="w-full bg-[#FAF9F6] border border-neutral-300 p-2.5 outline-none"
                  value={desForm.specialty}
                  onChange={(e) => setDesForm({ ...desForm, specialty: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1 uppercase font-bold tracking-wider">Avatar Portrait Image URL</label>
                <input
                  type="text"
                  className="w-full bg-[#FAF9F6] border border-neutral-300 p-2 text-neutral-500 font-mono text-[9px]"
                  value={desForm.avatar}
                  onChange={(e) => setDesForm({ ...desForm, avatar: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1 uppercase font-bold tracking-wider">Biography Narrative</label>
                <textarea
                  required
                  rows={3}
                  className="w-full bg-[#FAF9F6] border border-neutral-300 p-2"
                  value={desForm.bio}
                  onChange={(e) => setDesForm({ ...desForm, bio: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#4A1525] text-white hover:bg-[#6A162B] py-3 font-bold uppercase tracking-widest cursor-pointer text-[10px] rounded-lg"
                >
                  Save Profile
                </button>
                {editingDesignerId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDesignerId(null);
                      setDesForm({ id: '', name: '', city: '', specialty: '', bio: '', consultationFee: 2500, avatar: '', coverImage: '', achievements: [], history: [] });
                    }}
                    className="p-2 border text-neutral-500"
                  >
                    Reset
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right list */}
          <div className="lg:col-span-2 bg-white p-6 border border-neutral-200 rounded-lg">
            <h3 className="font-serif italic text-lg text-[#4A1525] mb-5 border-b pb-3">Affiliated Designers Directory ({designers.length})</h3>
            <div className="space-y-4">
              {designers.map(d => (
                <div key={d.id} className="flex gap-4 p-4 border rounded-md">
                  <img src={d.avatar} alt={d.name} className="w-16 h-16 rounded-full object-cover border border-[#D4AF37]/50" />
                  <div className="flex-1">
                    <span className="text-[10px] text-neutral-400 font-mono block">ID: @{d.id}</span>
                    <h4 className="font-serif italic text-base font-bold text-[#4A1525]">{d.name}</h4>
                    <p className="text-xs text-neutral-600 italic font-medium">{d.specialty} — {d.city}</p>
                    <p className="text-xs text-neutral-400 lines-2 mt-1 truncate">{d.bio}</p>
                    <p className="text-xs font-semibold text-[#D4AF37] mt-1">Consultation fee: ₹{d.consultationFee}</p>
                  </div>
                  <div className="flex flex-col gap-1 justify-center">
                    <button onClick={() => handleEditDesignerClick(d)} className="p-2 text-neutral-500 hover:text-[#4A1525]">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDeleteDesigner(d.id)} className="p-2 text-neutral-400 hover:text-red-700">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* LUXURY DELIVERY ORDERS REGISTRY */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 border border-[#D4AF37]/20 rounded-lg animate-luxury-reveal">
          <h3 className="font-serif italic text-xl text-[#4A1525] mb-6 pb-2 border-b">Active Customer Orders ({orders.length})</h3>
          
          {orders.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 italic">No customer transactions registered yet. Try checking out an item first.</div>
          ) : (
            <div className="space-y-6">
              {orders.map((o) => (
                <div key={o.id} className="border border-neutral-200 p-6 rounded-lg shadow-sm space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-100 pb-3 gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400">{o.id}</span>
                      <h4 className="text-sm font-semibold text-[#4A1525] mt-0.5">{o.address?.name}</h4>
                      <p className="text-xs text-neutral-500 font-light mt-0.5">Placed on: {new Date(o.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-light text-neutral-500">Logistics Flow Stage:</span>
                      <select
                        className="bg-white text-[#4A1525] text-xs px-3 py-1.5 rounded-full border border-[#D4AF37]/30 focus:outline-none"
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="In Crafting">In Crafting</option>
                        <option value="Quality Check">Quality Check</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Line Items</p>
                      {o.items?.map((item: any, i: number) => (
                        <div key={i} className="flex gap-3 text-xs">
                          <img src={item.product?.images?.[0]} className="w-10 h-12 object-cover rounded" />
                          <div>
                            <p className="font-semibold text-neutral-800">{item.product?.name}</p>
                            <p className="text-neutral-500 text-[11px]">Size: <span className="font-bold text-[#D4AF37]">{item.selectedSize}</span> | Qty: {item.quantity}</p>
                            <p className="text-[#D4AF37] font-semibold mt-0.5">₹{item.product?.price?.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-xs space-y-1.5 bg-[#FAF9F6] p-4 rounded border">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Handover Coordinates & Valuation</p>
                      <p className="font-semibold text-neutral-800">{o.address?.street}, {o.address?.city}, {o.address?.pincode}</p>
                      <p className="text-neutral-500">Contact: {o.address?.phone}</p>
                      <div className="pt-2 border-t mt-2 flex justify-between text-sm">
                        <span className="font-bold text-[#D4AF37]">Premium Aggregate:</span>
                        <span className="font-black text-[#4A1525]">₹{o.total?.toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-[10px] text-neutral-400">Settled via {o.paymentMethod || 'UPI Protocol'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CONSULTATIONS LIST TAB */}
      {activeTab === 'consultations' && (
        <div className="bg-white p-6 border border-[#D4AF37]/20 rounded-lg animate-luxury-reveal">
          <h3 className="font-serif italic text-xl text-[#4A1525] mb-6 pb-2 border-b">Atelier Design Consultation Bookings ({consultations.length})</h3>
          
          {consultations.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 italic">No virtual atelier or drape consultations booked yet.</div>
          ) : (
            <div className="space-y-4">
              {consultations.map((c) => (
                <div key={c.id} className="p-5 border rounded-lg hover:shadow-sm transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#FAF9F6]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#FAF5EF] text-[#4A1525] border border-[#D4AF37]/30 text-[9px] font-mono px-2 py-0.5 rounded">ID: #{c.id.substring(c.id.length - 6)}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        c.status === 'Confirmed' ? 'bg-emerald-150 text-emerald-800' :
                        c.status === 'Completed' ? 'bg-blue-150 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <h4 className="font-serif italic text-base font-bold text-[#4A1525] mt-2">
                      Customer: {c.userName} & Designer: {c.designerName}
                    </h4>
                    <p className="text-xs text-neutral-600 mt-1">
                      Target slot: <strong className="text-neutral-800">{c.date}</strong> at <strong className="text-neutral-800">{c.timeSlot}</strong>
                    </p>
                    {c.notes && (
                      <p className="text-xs text-neutral-400 italic mt-2 bg-white p-2 rounded border border-neutral-100">
                        " {c.notes} "
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col md:items-end gap-3 self-stretch md:self-auto justify-between border-t md:border-t-0 pt-3 md:pt-0 border-neutral-200">
                    <p className="text-xs font-bold text-[#4A1525] font-sans">Retained value: ₹{c.amount}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleUpdateConsultationStatus(c.id, 'Confirmed')}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs rounded uppercase font-semibold cursor-pointer"
                      >
                        Confirm Slot
                      </button>
                      <button 
                        onClick={() => handleUpdateConsultationStatus(c.id, 'Completed')}
                        className="px-3 py-1.5 bg-[#4A1525] hover:bg-[#6A162B] text-white text-xs rounded uppercase font-semibold cursor-pointer"
                      >
                        Complete Session
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
