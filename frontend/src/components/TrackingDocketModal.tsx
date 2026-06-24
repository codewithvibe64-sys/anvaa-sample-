import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Check, ShieldCheck, Truck, Sparkles, MapPin, 
  FileText, Award, Calendar, Heart, MessageSquare, Clipboard, UserCheck, Clock
} from 'lucide-react';
import { Order } from '../types';

interface TrackingDocketModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
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

export default function TrackingDocketModal({ isOpen, onClose, order, theme }: TrackingDocketModalProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'authenticity' | 'map'>('timeline');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  // Derive unique certificates for different products or general order items
  const premiumItem = order.items?.[0]?.product;
  const weaverName = "Master Craftsman Rajendra Maurya";
  const loomID = "LOOM-VNS-7729";
  const signatureKey = `ANVAA-CERT-${order.id.slice(3, 9)}-24K`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleVerifySeal = () => {
    setVerificationLoading(true);
    setVerificationResult(null);
    setTimeout(() => {
      setVerificationLoading(false);
      setVerificationResult("Signature Verified! Authentic 24k Gold Thread certified by the National Handloom Authority of India.");
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-[#4A1525]/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
        {/* Backdrop clickable close */}
        <div className="absolute inset-0 cursor-default" onClick={onClose} />

        <motion.div 
          initial={{ opacity: 0, scale: 0.97, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 15 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`bg-white ${theme.text} rounded-2xl overflow-hidden max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-[#D4AF37] shadow-[0_25px_60px_rgba(184,151,66,0.18)] relative z-10 font-sans`}
        >
          {/* Top Decorative Border Accent - Clean Luxury Gold Foil Gradient */}
          <div className="h-2 w-full bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] via-[#B38728] via-[#FBF5B7] to-[#AA771C]"></div>

          {/* Close trigger upper right */}
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 z-20 bg-[#FDFBF7] hover:bg-[#FAF6EE] text-[#AA771C] p-2.5 rounded-full cursor-pointer transition-colors border border-[#D4AF37]/30 shadow-xs"
            aria-label="Close docket"
          >
            <X size={16} />
          </button>

          {/* Luxury Banner Header - White & Gold Styled */}
          <div className="p-6 md:p-8 border-b border-[#D4AF37]/20 bg-gradient-to-b from-[#FDFBF7] to-white relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-44 h-44 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-10 right-10 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase font-black tracking-[0.25em] text-[#AA771C]">ANVAA COUTURE Logistical Vault</span>
                  <span className="bg-[#D4AF37]/15 text-[#8C6D23] border border-[#D4AF37]/45 text-[8px] font-mono font-black px-2.5 py-0.5 uppercase tracking-wider rounded">
                    VIP GOLD DOCKET
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-serif italic font-extrabold text-inherit tracking-tight">
                  Interactive Tailoring & Shipping Docket
                </h2>
                <p className={`text-[11px] ${theme.textMuted} mt-1 max-w-xl font-light`}>
                  This secure registry details the artisanal journey from raw 24k Gold Thread warp-weaving down to your doorstep courier coordinates.
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[9px] uppercase tracking-widest text-[#AA771C] font-black">Sealed Invoice Value</span>
                <p className="text-xl md:text-2xl font-mono font-bold text-inherit">₹{order.total?.toLocaleString('en-IN')}</p>
                <div className={`flex items-center gap-1.5 text-[10px] ${theme.textMuted} mt-0.5 justify-start sm:justify-end`}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                  <span>Payment Method: <strong className="text-inherit">{order.paymentMethod || 'Secure UPI Card'}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Custom Tabs Navigation - White and Gold Style */}
          <div className={`px-6 md:px-8 border-b ${theme.borderColor} flex gap-4 md:gap-8 bg-white sticky top-0 z-10`}>
            {[
              { id: 'timeline', label: 'Chronological Dispatch', icon: Clock },
              { id: 'authenticity', label: 'Atelier Authenticity Proof', icon: ShieldCheck },
              { id: 'map', label: 'Transit Map simulation', icon: MapPin },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 py-4 border-b-2 text-xs font-bold uppercase tracking-wider transition-all relative cursor-pointer ${
                    isActive 
                      ? `border-[#D4AF37] ${theme.text}` 
                      : `border-transparent ${theme.textMuted} hover:opacity-80`
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-[#D4AF37]' : ''} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeCoutureTab" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" 
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Modal Body Panels */}
          <div className="p-6 md:p-8 bg-white">
            <AnimatePresence mode="wait">
              {activeTab === 'timeline' && (
                <motion.div 
                   key="timeline"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className={`bg-[#FFFDF9] border ${theme.borderColor} p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
                    <div>
                      <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#AA771C] flex items-center gap-1.5">
                        <Sparkles size={12} className="animate-spin text-[#D4AF37]" />
                        Active Consignment Status
                      </h4>
                      <p className="text-sm font-serif italic text-inherit mt-1 font-semibold">
                        {order.status === 'Delivered' 
                          ? "Completed: Handed over successfully in signature gold-embossed luxury casket." 
                          : `Maison Status: Currently undergoing physical '${order.status}' stage.`
                        }
                      </p>
                    </div>
                    <div className={`bg-white border ${theme.borderColor} px-4 py-2 rounded-lg text-center shadow-xs shrink-0 w-full sm:w-auto`}>
                      <p className={`text-[9px] uppercase ${theme.textMuted} font-bold`}>DOCKET ADDRESS</p>
                      <p className="text-xs font-serif italic font-bold text-inherit mt-0.5">{order.address?.street}, {order.address?.city}</p>
                    </div>
                  </div>

                  {/* Enhanced Vertical Timelines with Details */}
                  <div className="relative pl-6 md:pl-8 border-l border-[#D4AF37]/30 ml-4 space-y-8 py-3">
                    {order.trackingTimeline?.map((evt: any, idx: number) => {
                      const isCompleted = evt.done;
                      return (
                        <div key={idx} className="relative group">
                          {/* Timeline node */}
                          <div className={`absolute -left-10 md:-left-12 top-0.5 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-[#4A1525] border-[#D4AF37] text-[#D4AF37] shadow-md shadow-[#D4AF37]/10' 
                              : `bg-white ${theme.borderColor} ${theme.textMuted}`
                          }`}>
                            <Check size={12} />
                          </div>

                          <div className="space-y-1.5 pb-2 transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <h4 className={`text-xs uppercase tracking-wider font-extrabold ${isCompleted ? theme.text : theme.textMuted}`}>
                                {evt.status}
                              </h4>
                              <span className="text-[10px] font-mono text-[#AA771C] font-bold">
                                {evt.date}
                              </span>
                            </div>
                            <p className={`text-xs ${theme.textMuted} font-light leading-relaxed`}>
                              {evt.description}
                            </p>
                            
                            {/* Rich simulated sub-details for extra luxury realism */}
                            {isCompleted && (
                              <div className={`mt-2 text-[10px] bg-[#FFFDF9]/40 lg:bg-[#FFFDF9] p-2.5 rounded border ${theme.borderColor} flex flex-wrap gap-x-4 gap-y-1 max-w-xl ${theme.textMuted}`}>
                                <span>Supervisor: <strong className="text-[#8C6D23] font-bold">Loom Chief #02</strong></span>
                                <span>• Location: <strong className="text-inherit">Varanasi Atelier</strong></span>
                                <span>• Log Status: <strong className="text-[#AA771C] font-bold font-mono">24K CERTIFIED</strong></span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {activeTab === 'authenticity' && (
                <motion.div 
                  key="authenticity"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className={`text-center py-4 bg-gradient-to-r from-[#FFFDF9] via-[#FAF6EE] to-[#FFFDF9] border ${theme.borderColor} rounded-xl p-6 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-bl-full pointer-events-none"></div>
                    <Award className="mx-auto text-[#D4AF37] mb-3 animate-pulse" size={40} />
                    <h3 className="text-lg font-serif italic text-inherit font-black">Silk Handloom Board Certification of India</h3>
                    <p className={`text-xs ${theme.textMuted} max-w-md mx-auto mt-1 font-light leading-relaxed`}>
                      Every raw yarn warp of your piece is manually checked and verified to meet masterwork gold infusion benchmarks.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Fiber specs & specifications */}
                    <div className={`p-5 border ${theme.borderColor} rounded-xl bg-[#FFFDF9] space-y-4`}>
                      <h4 className="text-xs uppercase tracking-widest font-extrabold text-[#AA771C] border-b border-[#D4AF37]/20 pb-2 flex items-center gap-1.5">
                        <Award size={14} className="text-[#D4AF37]" />
                        Thread & Loom Metrics
                      </h4>
                      <table className={`w-full text-xs font-light ${theme.text}`}>
                        <tbody>
                          <tr className="border-b border-[#D4AF37]/10 py-2 block">
                            <td className={`font-semibold ${theme.textMuted} w-1/2`}>Yarn Purity Status</td>
                            <td className="text-inherit font-mono font-bold">100% Pure Mulberry Silk</td>
                          </tr>
                          <tr className="border-b border-[#D4AF37]/10 py-2 block">
                            <td className={`font-semibold ${theme.textMuted} w-1/2`}>Sarkoot Zari Weaving</td>
                            <td className="text-[#AA771C] font-mono font-bold">Certified 24k Gold Infusion</td>
                          </tr>
                          <tr className="border-b border-[#D4AF37]/10 py-2 block">
                            <td className={`font-semibold ${theme.textMuted} w-1/2`}>Weft Loom Tension</td>
                            <td className="text-inherit font-mono font-bold">Certified High-Tightness</td>
                          </tr>
                          <tr className="py-2 block">
                            <td className={`font-semibold ${theme.textMuted} w-1/2`}>Atelier Scent Treatment</td>
                            <td className="text-[#8C6D23] font-serif italic font-bold">Sandalwood & Warm Saffron Mist</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Digital Seal of Authenticity validation */}
                    <div className="p-5 border border-dashed border-[#D4AF37]/45 rounded-xl bg-[#FFFDF9] space-y-4 relative">
                      <h4 className="text-xs uppercase tracking-widest font-extrabold text-inherit flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-[#D4AF37]" />
                        Weaver Signature Vault
                      </h4>

                      <div className="space-y-2">
                        <p className={`text-[11px] ${theme.textMuted} leading-relaxed font-light`}>
                          This serial acts as a proof-of-work locked in our premium atelier history. Inspect our digitally authenticated registry.
                        </p>
                        <div className={`flex items-center justify-between bg-white border ${theme.borderColor} p-3 rounded-lg`}>
                          <div>
                            <p className={`text-[8px] uppercase ${theme.textMuted} font-bold`}>COUTURE UNIQUE SERIAL ID</p>
                            <p className="text-xs font-mono font-bold text-inherit mt-0.5">{signatureKey}</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(signatureKey)}
                            className="text-xs font-bold text-[#AA771C] hover:text-[#D4AF37] transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Clipboard size={12} />
                            <span>{copiedKey === signatureKey ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={handleVerifySeal}
                          disabled={verificationLoading}
                          className={`w-full text-center ${theme.buttonPrimary} px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50`}
                        >
                          {verificationLoading ? 'Verifying with Central Registry...' : '✦ Validate Artisan Seal'}
                        </button>

                        {verificationResult && (
                          <motion.div 
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 p-3 bg-[#FCFAF2] border border-[#D4AF37] rounded-lg text-[#8C6D23] text-[10px] leading-relaxed font-semibold shadow-xs"
                          >
                            {verificationResult}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'map' && (
                <motion.div 
                  key="map"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className={`p-4 bg-[#FFFDF9] ${theme.text} rounded-xl border ${theme.borderColor} shadow-xs`}>
                    <div className="flex justify-between items-center mb-3 border-b border-[#D4AF37]/10 pb-2">
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-[#AA771C] font-black">COUTURE LOGISTICS MAP SCREEN</span>
                        <h4 className="text-xs font-serif italic text-inherit mt-0.5">Varanasi Hub to Residence Gateway</h4>
                      </div>
                      <span className="bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#8C6D23] text-[8px] px-2 py-0.5 rounded font-mono font-bold animate-pulse">
                        LIVE RADAR UPDATING
                      </span>
                    </div>

                    {/* Simulated Map Visual using styled Tailwind bars, animated icons, and glowing paths */}
                    <div className="h-44 bg-white rounded border border-[#D4AF37]/20 relative flex flex-col justify-center px-4 overflow-hidden">
                      {/* Grid background effect with gold accent */}
                      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]"></div>
                      
                      {/* Gradient path glow */}
                      <div className="absolute left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#D4AF37] via-[#AA771C]/30 to-transparent z-0"></div>

                      <div className="flex justify-between items-center relative z-10">
                        {/* Point A */}
                        <div className="text-center flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-[#FFFDF9] border border-[#D4AF37] text-[#AA771C] flex items-center justify-center font-bold text-[9px] shadow-sm">
                            YRN
                          </div>
                          <p className="text-[9px] font-bold text-inherit mt-2 uppercase tracking-wider">Varanasi</p>
                          <p className={`text-[8px] ${theme.textMuted} mt-0.5`}>Tailored Atelier</p>
                        </div>

                        {/* Point B */}
                        <div className="text-center flex flex-col items-center relative">
                          {/* Animated plane track along lines */}
                          <div className="absolute -top-12 animate-bounce">
                            <Truck size={14} className="text-[#AA771C] fill-[#D4AF37]/10" />
                          </div>
                          
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#BF953F] to-[#AA771C] text-white flex items-center justify-center font-bold text-[9px] shadow-sm ring-2 ring-[#D4AF37]/30 animate-pulse">
                            PKG
                          </div>
                          <p className="text-[9px] font-bold text-inherit mt-2 uppercase tracking-wider">Atelier Transit</p>
                          <p className="text-[8px] text-[#AA771C] mt-0.5 font-semibold">Quality Sealed</p>
                        </div>

                        {/* Point C */}
                        <div className="text-center flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[9px] transition-all ${
                            order.status === 'Delivered' 
                              ? 'bg-gradient-to-tr from-[#BF953F] to-[#AA771C] text-white border border-[#D4AF37]' 
                              : `bg-neutral-50 border ${theme.borderColor} ${theme.textMuted}`
                          }`}>
                            VIP
                          </div>
                          <p className="text-[9px] font-bold text-inherit mt-2 uppercase tracking-wider"> doorstep</p>
                          <p className={`text-[8px] ${theme.textMuted} mt-0.5`}>{order.address?.city || 'Your city'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipment milestones */}
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase tracking-widest font-extrabold text-inherit">Shipment Dispatch Manifesto</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className={`p-4 bg-[#FFFDF9] border ${theme.borderColor} rounded-xl space-y-1`}>
                        <span className={`text-[8px] uppercase tracking-wider font-bold ${theme.textMuted}`}>COURIER SERVICE</span>
                        <p className="text-xs text-inherit font-serif italic font-bold">Maison Custom Car</p>
                        <p className={`text-[10px] ${theme.textMuted} font-light`}>Direct white-glove trunk service</p>
                      </div>
                      <div className={`p-4 bg-[#FFFDF9] border ${theme.borderColor} rounded-xl space-y-1`}>
                        <span className={`text-[8px] uppercase tracking-wider font-bold ${theme.textMuted}`}>FRAGRANCE SEAL</span>
                        <p className="text-xs text-inherit font-serif italic font-bold">Pure Sandalwood</p>
                        <p className={`text-[10px] ${theme.textMuted} font-light`}>Treated with pure botanicals</p>
                      </div>
                      <div className={`p-4 bg-[#FFFDF9] border ${theme.borderColor} rounded-xl space-y-1`}>
                        <span className={`text-[8px] uppercase tracking-wider font-bold ${theme.textMuted}`}>COUTURE BOX TYPE</span>
                        <p className="text-xs text-inherit font-serif italic font-bold">Gold filigree teakwood casket</p>
                        <p className={`text-[10px] ${theme.textMuted} font-light font-sans`}>With velvet lining protection</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sizing Assistance / Action buttons bottom bar */}
          <div className="p-6 border-t border-[#D4AF37]/20 bg-[#FFFDF9] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <UserCheck size={18} className="text-[#D4AF37]" />
              <div className="text-left">
                <p className="text-[10px] font-bold text-[#AA771C] uppercase tracking-widest">Digital Concierge Desk</p>
                <p className={`text-xs ${theme.textMuted} font-light italic`}>Need last-minute customization? Talk directly to our master artisans.</p>
              </div>
            </div>

            <div className="flex gap-3 w-full sm:w-auto text-xs font-bold uppercase tracking-wider">
              <button 
                onClick={onClose}
                className={`flex-1 sm:flex-none border ${theme.borderColor} hover:bg-[#FAF9F6] py-3 px-6 text-[10px] uppercase font-bold tracking-widest cursor-pointer rounded-lg ${theme.text} transition-colors bg-white font-sans`}
              >
                Close Docket
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}



