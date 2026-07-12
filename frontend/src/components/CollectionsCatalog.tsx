import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Heart, ShoppingBag, Eye, Maximize2, Palette, RefreshCw, Compass, BookOpen, Layers } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- 3D PROCEDURAL DRESS COMPONENT FOR HERO & STUDIO ---
function ProceduralDress({ color = '#BF953F', fabricDetail = false, isSpinning = true }) {
  const groupRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    loader.load(
      'https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=1200',
      (loadedTexture) => {
        loadedTexture.wrapS = THREE.RepeatWrapping;
        loadedTexture.wrapT = THREE.RepeatWrapping;
        loadedTexture.repeat.set(2.2, 3);
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        setTexture(loadedTexture);
      },
      undefined,
      (err) => {
        console.error('Failed to load fabric texture:', err);
      }
    );
  }, []);
  
  // Custom points for the dress skirt flare (Kalidar Lehenga)
  const skirtPoints = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 20; i++) {
      const y = 0.5 - i * 0.08; 
      const r = 0.22 + Math.pow(i * 0.08, 1.8) * 0.72; // Flare
      pts.push(new THREE.Vector2(r, y));
    }
    return pts;
  }, []);

  // Under-skirt lining peeking out at the bottom
  const liningPoints = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 20; i++) {
      const y = 0.5 - i * 0.083; // Slightly longer
      const r = 0.21 + Math.pow(i * 0.083, 1.8) * 0.70; // Slightly narrower
      pts.push(new THREE.Vector2(r, y));
    }
    return pts;
  }, []);

  // Custom points for the bodice/torso (Choli)
  const bodicePoints = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 12; i++) {
      const y = 1.15 - i * 0.06; 
      const r = 0.16 + Math.sin(i * 0.3) * 0.04; // Bust and waist contour
      pts.push(new THREE.Vector2(r, y));
    }
    return pts;
  }, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      if (isSpinning) {
        groupRef.current.rotation.y = elapsed * 0.25;
      }
      // Floating breathe effect
      groupRef.current.position.y = Math.sin(elapsed * 1.5) * 0.04 - 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      
      {/* 1. UNDER-SKIRT LINING (Gold Peeking Border) */}
      <mesh castShadow receiveShadow position={[0, -0.1, 0]}>
        <latheGeometry args={[liningPoints, 40]} />
        <meshPhysicalMaterial
          color="#D4AF37"
          roughness={0.2}
          metalness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. PLEATED KALIDAR LEHENGA OUTER SKIRT (16 panels) */}
      <mesh castShadow receiveShadow position={[0, -0.09, 0]}>
        <latheGeometry args={[skirtPoints, 16]} />
        <meshPhysicalMaterial
          map={texture || undefined}
          color={color}
          roughness={fabricDetail ? 0.9 : 0.3}
          metalness={fabricDetail ? 0.05 : 0.4}
          side={THREE.DoubleSide}
          clearcoat={0.3}
          clearcoatRoughness={0.4}
        />
      </mesh>

      {/* 3. HEAVY GOLD HEM BORDER (Zari Border) */}
      <mesh position={[0, -1.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.93, 0.025, 16, 100]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 4. BRIDAL CHOLI (BODICE) */}
      <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
        <latheGeometry args={[bodicePoints, 40]} />
        <meshPhysicalMaterial
          map={texture || undefined}
          color={color}
          roughness={fabricDetail ? 0.9 : 0.25}
          metalness={fabricDetail ? 0.05 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 5. GOLD EMBROIDERED NECKLINE BORDER */}
      <mesh position={[0, 1.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.155, 0.012, 16, 100]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 6. SWEETHEART SHOULDERS/SLEEVES BORDERS */}
      <mesh position={[-0.14, 0.95, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.07, 0.01, 16, 100]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.14, 0.95, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.07, 0.01, 16, 100]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 7. CINCHED GOLD WAIST BELT */}
      <mesh position={[0, 0.52, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.17, 0.015, 16, 100]} />
        <meshStandardMaterial 
          color="#D4AF37" 
          metalness={0.9} 
          roughness={0.1} 
        />
      </mesh>

      {/* 8. LUXURY MANNEQUIN STAND & HANGER (Polished Gold/Brass) */}
      <group>
        {/* Baseplate */}
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.3, 0.32, 0.03, 32]} />
          <meshStandardMaterial color="#B38728" metalness={0.9} roughness={0.15} />
        </mesh>
        
        {/* Upright Center Rod */}
        <mesh position={[0, 0.0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 2.4, 16]} />
          <meshStandardMaterial color="#B38728" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Neck collar cap */}
        <mesh position={[0, 1.22, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.06, 16]} />
          <meshStandardMaterial color="#B38728" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 1.26, 0]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color="#B38728" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Hanger Shoulder Crossbar */}
        <mesh position={[0, 1.18, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.38, 16]} />
          <meshStandardMaterial color="#B38728" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>
      
    </group>
  );
}

// Camera Mouse-tilt helper
function CameraController() {
  const { camera } = useThree();
  useFrame((state) => {
    // Soft camera glide based on mouse pointer coordinate (-1 to 1)
    const targetX = state.pointer.x * 1.2;
    const targetY = state.pointer.y * 0.8 + 0.5;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.lookAt(0, 0.3, 0);
  });
  return null;
}

// --- MAIN CATALOG COMPONENT ---
interface CollectionsCatalogProps {
  products: any[];
  wishlist: string[];
  handleToggleWishlist: (id: string) => void;
  handleAddToCart: (product: any, size: string) => void;
  theme: any;
  setActiveTab: (tab: string) => void;
  filterCategory?: string;
  setFilterCategory?: (cat: string) => void;
}

export default function CollectionsCatalog({
  products,
  wishlist,
  handleToggleWishlist,
  handleAddToCart,
  theme,
  setActiveTab,
  filterCategory,
  setFilterCategory
}: CollectionsCatalogProps) {
  // Fallback products in case backend fetch is empty or loading
  const fallbackProducts = useMemo(() => {
    return [
      {
        id: "prod_wedding_01",
        name: "The Gilded Marigold Lehenga",
        price: 185000,
        category: "Wedding Collection",
        description: "A breathtaking bridal lehenga woven in rich Banarasi silk, featuring meticulous hand-embroidered zardozi work, gold plated threads, and hand-stitched sequin borders. Comes with a pure silk organza dupatta in royal marigold. Inspired by ancient heritage patterns.",
        images: [
          "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600",
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600",
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600"
        ],
        sizes: ["XS", "S", "M", "L", "XL", "Custom Measure"],
        stock: 4,
        rating: 4.9,
        isTrending: true
      },
      {
        id: "prod_wedding_02",
        name: "Rose Quartz Zardozi Anarkali",
        price: 125000,
        category: "Wedding Collection",
        description: "Crafted in ultra-premium raw silk, this heavy flared Anarkali features stunning rose gold hand-embroidery along the chest, cuffs, and floor-sweeping hem. Imbued with Indian craftsmanship.",
        images: [
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600",
          "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600"
        ],
        sizes: ["S", "M", "L", "XL", "Custom Measure"],
        stock: 6,
        rating: 4.8
      },
      {
        id: "prod_office_01",
        name: "The Ivory Power Crepe Suit",
        price: 42000,
        category: "Office Wear",
        description: "A tailored double-breasted power blazer paired with matching straight-leg trousers, styled for ambitious women. Crafted with Italian luxury crepe, structured shoulder pads, and discreet luxury gold buttons. Full satin lining.",
        images: [
          "https://images.unsplash.com/photo-1548624149-f7b3e6432b42?q=80&w=600",
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600"
        ],
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 12,
        rating: 4.7,
        isTrending: true
      },
      {
        id: "prod_office_02",
        name: "Midnight Structural Linen Jumpsuit",
        price: 28500,
        category: "Office Wear",
        description: "A sharp, breathable, high-thread-count linen jumpsuit with sharp collars, structured waist belt, and deep pleats. Handcrafted to deliver effortless transition from meetings to dining.",
        images: [
          "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=600",
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600"
        ],
        sizes: ["S", "M", "L"],
        stock: 15,
        rating: 4.6
      },
      {
        id: "prod_casual_01",
        name: "Monsoon Breeze Silk Kaftan",
        price: 24000,
        category: "Casual Wear",
        description: "A floating casual masterpiece created from pure hand-blocked mulberry silk, showcasing organic hand-drawn Indian motifs, and subtle gold thread stitching along the dynamic high-low hemline. Comfortable yet luxurious.",
        images: [
          "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=600",
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600"
        ],
        sizes: ["S", "M", "L", "XL"],
        stock: 8,
        rating: 4.5
      },
      {
        id: "prod_casual_02",
        name: "Terracotta Pleated Crepe Draped Saree",
        price: 36000,
        category: "Casual Wear",
        description: "A ready-to-wear modern pleated drape saree in warm terracotta crepe, paired with an elegant floral organic blouse.",
        images: [
          "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600",
          "https://images.unsplash.com/photo-1548624149-f7b3e6432b42?q=80&w=600"
        ],
        sizes: ["S", "M", "L", "Custom Measure"],
        stock: 5,
        rating: 4.7
      }
    ];
  }, []);

  const displayProducts = useMemo(() => {
    return products && products.length > 0 ? products : fallbackProducts;
  }, [products, fallbackProducts]);

  // States for 3D Product Viewer
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [viewerColor, setViewerColor] = useState<string>('#BF953F'); // Gold default
  const [viewerFabricDetail, setViewerFabricDetail] = useState<boolean>(false);
  const [viewerSpin, setViewerSpin] = useState<boolean>(true);
  const [viewerCameraAngle, setViewerCameraAngle] = useState<'front' | 'back' | 'free'>('free');
  const [isFullscreenViewer, setIsFullscreenViewer] = useState<boolean>(false);

  // Interactive Explosion Grid State
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Mobile detection for hover states and layout variations
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // References for GSAP Scrolling
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalSectionRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const brandStoryRef = useRef<HTMLDivElement>(null);

  // Set default selected product once products load
  useEffect(() => {
    if (displayProducts.length > 0 && !selectedProduct) {
      setSelectedProduct(displayProducts[0]);
      // Attempt to map category to color
      if (displayProducts[0].category.includes('Wedding')) {
        setViewerColor('#A62B2B'); // Crimson red
      }
    }
  }, [displayProducts]);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // GSAP ScrollTrigger Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Brand Story parallax masks
      if (brandStoryRef.current) {
        gsap.fromTo('.gsap-story-line', 
          { opacity: 0, y: 50, skewY: 3 },
          { 
            opacity: 1, 
            y: 0, 
            skewY: 0,
            duration: 1.2,
            stagger: 0.15,
            scrollTrigger: {
              trigger: brandStoryRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // 2. Horizontal Scroll gallery binding (desktop only)
      const track = horizontalTrackRef.current;
      const section = horizontalSectionRef.current;
      if (track && section && window.innerWidth >= 768) {
        const scrollWidth = track.scrollWidth - window.innerWidth;
        gsap.fromTo(track, 
          { x: 0 },
          {
            x: -scrollWidth - 100, // Offset buffer
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              pin: true,
              scrub: 1,
              start: 'top top',
              end: () => `+=${track.scrollWidth}`,
              invalidateOnRefresh: true
            }
          }
        );
      }

      // 3. Editorial Lookbook scroll masks
      gsap.utils.toArray('.gsap-lookbook-img-wrapper').forEach((wrapper: any) => {
        gsap.fromTo(wrapper,
          { clipPath: 'polygon(15% 0%, 85% 0%, 85% 100%, 15% 100%)', scale: 0.9 },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: wrapper,
              start: 'top 85%',
              end: 'top 30%',
              scrub: true
            }
          }
        );
      });

      // 4. Floating Collection scattered cards reveal timeline (scroll-linked)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.gsap-floating-collection-trigger',
          start: 'top 65%',
          end: 'bottom 45%',
          scrub: 1
        }
      });

      // Center Main Dress (Card 0) - Float from top to bottom
      if (document.querySelector('.gsap-floating-card-center')) {
        tl.fromTo('.gsap-floating-card-center',
          { opacity: 0, y: -60, scale: 0.95, xPercent: -50 },
          { opacity: 1, y: 0, scale: 1, xPercent: -50, ease: 'power2.out' }
        );
      }

      // Left card (Card 1) - Reveal from left to right
      if (document.querySelector('.gsap-floating-card-left')) {
        tl.fromTo('.gsap-floating-card-left',
          { opacity: 0, x: -60 },
          { opacity: 1, x: 0, ease: 'power2.out' },
          "+=0.25"
        );
      }

      // Right card (Card 2) - Reveal from right to left
      if (document.querySelector('.gsap-floating-card-right')) {
        tl.fromTo('.gsap-floating-card-right',
          { opacity: 0, x: 60 },
          { opacity: 1, x: 0, ease: 'power2.out' },
          "+=0.25"
        );
      }

      // Bottom card / Jumpsuit (Card 3) - Reveal from bottom to top
      if (document.querySelector('.gsap-floating-card-bottom')) {
        tl.fromTo('.gsap-floating-card-bottom',
          { opacity: 0, y: 60, xPercent: -50 },
          { opacity: 1, y: 0, xPercent: -50, ease: 'power2.out' },
          "+=0.25"
        );
      }
    });

    return () => {
      ctx.revert();
    };
  }, [displayProducts]);

  // Color options mapped to products
  const handleProductSelect = (prod: any) => {
    if (!prod) return;
    setSelectedProduct(prod);
    const category = prod.category || '';
    if (category.includes('Wedding')) {
      setViewerColor('#A62B2B'); // Crimson red
    } else if (category.includes('Office')) {
      setViewerColor('#E5E0DB'); // Ivory white
    } else if (category.includes('Casual')) {
      setViewerColor('#4C6B73'); // Slate green
    } else {
      setViewerColor('#BF953F'); // Gold
    }
    // Scroll smoothly to studio viewer
    document.getElementById('atelier-3d-viewer')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="w-full bg-white text-[#1A1A18] overflow-x-hidden font-sans">
      
      {/* SECTION 1: HERO 3D ENTRANCE */}
      <section className="relative w-full h-screen bg-white flex items-center justify-center overflow-hidden">
        {/* Three.js Canvas Backdrop */}
        <div className="absolute inset-0 z-0">
          <Canvas shadows camera={{ position: [0, 0.5, 3], fov: 45 }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
            <spotLight 
              position={[0, 4, 3]} 
              angle={0.4} 
              penumbra={1} 
              intensity={4} 
              color="#BF953F" 
              castShadow 
            />
            <ProceduralDress color="#BF953F" />
            <CameraController />
          </Canvas>
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center select-none pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <span className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#AA771C] font-bold mb-4 font-mono">
              ANVAA ATELIER PRESENTS
            </span>
            <h1 className="font-serif italic font-light text-6xl md:text-8xl lg:text-[10rem] tracking-wide leading-none text-[#1A1A18]">
              Vasantika
            </h1>
            <h2 className="font-sans font-light tracking-[0.25em] text-xs md:text-sm uppercase text-[#AA771C] mt-3">
              The 3D Spatial Haute Couture Catalog
            </h2>
            <div className="w-12 h-[1px] bg-[#AA771C]/50 mt-10 animate-pulse"></div>
          </motion.div>
        </div>

        {/* Fullscreen Inspect button for Hero */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex justify-center pointer-events-auto">
          <button
            onClick={() => setIsFullscreenViewer(true)}
            className="bg-white/80 backdrop-blur-md border border-neutral-300/50 hover:bg-[#D4AF37] hover:text-black text-neutral-800 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest cursor-pointer shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <Maximize2 size={13} className="animate-pulse" />
            Inspect 3D Mannequin
          </button>
        </div>

        {/* Parallax bottom fade */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent z-10"></div>
      </section>

      {/* SECTION 2: LUXURY BRAND STORY */}
      <section ref={brandStoryRef} className="relative py-16 md:py-40 max-w-6xl mx-auto px-6 border-b border-black/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#AA771C] font-bold block font-mono">
              THE WEAVE CHRONICLES
            </span>
            <h2 className="gsap-story-line font-serif italic text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-neutral-900">
              A story woven in pure metal threads.
            </h2>
          </div>
          <div className="lg:col-span-7 text-neutral-600 font-light text-sm md:text-base leading-relaxed space-y-6 pt-2">
            <p className="gsap-story-line">
              ANVAA brings forth the architectural beauty of traditional Indian drapes, sculpted dynamically in three-dimensional virtual space. Each line of code represents a silk fiber; each light reflection mirrors the hand-stitched silver zari threads dipped in 24k gold.
            </p>
            <p className="gsap-story-line">
              Explore the collection through our digital studio, featuring continuous 360-degree rotation, microscopic fabric close-ups, and color switches tailored for high-fashion connoisseurs.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: HORIZONTAL SCROLL GALLERY */}
      <section ref={horizontalSectionRef} className="relative w-full min-h-[auto] md:min-h-screen bg-white flex flex-col justify-start overflow-hidden pt-20 md:pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-6 pt-6 md:pt-8 pb-4 w-full">
          <div className="flex justify-between items-end border-b border-black/5 pb-4">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#AA771C] font-bold block font-mono mb-2">
                CURATED CAPSULES
              </span>
              <h2 className="font-serif italic text-3xl md:text-4xl text-neutral-900">Horizontal Look</h2>
            </div>
            <span className="text-neutral-500 text-xs hidden md:block">Scroll down to slide left →</span>
          </div>
        </div>

        {/* Scrollable Track */}
        <div className="flex items-center flex-grow overflow-x-auto md:overflow-hidden py-4 scrollbar-none snap-x snap-mandatory w-full">
          <div ref={horizontalTrackRef} className="flex gap-6 md:gap-10 px-6 md:px-16 w-max">
            {displayProducts.map((p) => (
              <div 
                key={`scroll-card-${p.id}`}
                className="w-72 md:w-96 bg-white border border-neutral-200/60 rounded-xl overflow-hidden shadow-2xl flex-shrink-0 group hover:border-[#D4AF37]/50 transition-all duration-500 snap-center"
              >
                <div className="h-[200px] md:h-[280px] overflow-hidden relative">
                  <img 
                    src={p.images?.[0] || ''} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                  
                  {/* Quick view trigger */}
                  <button 
                    onClick={() => handleProductSelect(p)}
                    className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md hover:bg-[#D4AF37] hover:text-black p-3 rounded-full cursor-pointer text-neutral-800 shadow transition-all duration-300"
                  >
                    <Compass size={16} className="animate-spin-slow" />
                  </button>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-[#AA771C] font-bold">
                    <span>{p.category.toUpperCase()}</span>
                    <span>₹{p.price.toLocaleString('en-IN')}</span>
                  </div>
                  <h3 className="font-serif italic text-lg text-[#1A1A18] group-hover:text-[#AA771C] transition-all truncate">
                    {p.name}
                  </h3>
                  <p className="text-xs text-neutral-600 font-light line-clamp-2">
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: INTERACTIVE 3D PRODUCT VIEWER */}
      <section id="atelier-3d-viewer" className="relative w-full py-12 md:py-32 bg-white border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10 md:mb-16 space-y-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#AA771C] font-bold block font-mono">
              ANVAA DIGITAL STUDIO
            </span>
            <h2 className="font-serif italic text-4xl md:text-5xl text-neutral-900">3D Product Viewer</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            
            {/* 3D Canvas Box (Col 7) */}
            <div className="lg:col-span-7 bg-white border border-neutral-200/60 rounded-2xl h-[350px] sm:h-[450px] md:h-[600px] overflow-hidden relative shadow-inner">
              <Canvas shadows camera={{ position: [0, 0.6, 2.5], fov: 42 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[3, 8, 3]} intensity={1.5} castShadow />
                <spotLight 
                  position={[0, 4, 2.5]} 
                  angle={0.4} 
                  penumbra={1} 
                  intensity={3} 
                  color="#BF953F" 
                  castShadow 
                />
                
                <ProceduralDress 
                  color={viewerColor} 
                  fabricDetail={viewerFabricDetail}
                  isSpinning={viewerSpin}
                />
                
                <OrbitControls 
                  enablePan={false} 
                  enableZoom={true} 
                  minDistance={1.2} 
                  maxDistance={3.5}
                />
              </Canvas>

              {/* Fullscreen Expand Trigger Button */}
              <button
                onClick={() => setIsFullscreenViewer(true)}
                className="absolute top-4 right-4 bg-white/70 hover:bg-[#D4AF37] text-neutral-800 hover:text-black p-2.5 rounded-full border border-neutral-200/50 cursor-pointer shadow transition-all duration-300 z-10 flex items-center justify-center pointer-events-auto"
                title="Open Full Clear View"
              >
                <Maximize2 size={15} />
              </button>

              {/* Orbit Overlay Helper */}
              <div className="absolute top-4 left-4 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-200/50 flex items-center gap-2 pointer-events-none text-[10px] font-mono text-[#AA771C]">
                <RefreshCw size={10} className="animate-spin-slow" />
                <span className="hidden md:inline">Drag to orbit 360° | Scroll to zoom</span>
                <span className="inline md:hidden">Drag to rotate 360°</span>
              </div>

              {/* Bottom Angle Controls */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-200/80 flex items-center gap-2 md:gap-4 z-10 max-w-[90%] justify-center">
                <button
                  onClick={() => {
                    setViewerSpin(false);
                    setViewerCameraAngle('front');
                  }}
                  className={`text-[9px] md:text-[10px] uppercase tracking-wider font-bold px-2.5 md:px-3 py-1 md:py-1.5 rounded-md cursor-pointer transition-all ${
                    !viewerSpin && viewerCameraAngle === 'front' 
                      ? 'bg-[#D4AF37] text-black' 
                      : 'hover:bg-black/5 text-neutral-600 hover:text-black'
                  }`}
                >
                  Front
                </button>
                <button
                  onClick={() => {
                    setViewerSpin(false);
                    setViewerCameraAngle('back');
                  }}
                  className={`text-[9px] md:text-[10px] uppercase tracking-wider font-bold px-2.5 md:px-3 py-1 md:py-1.5 rounded-md cursor-pointer transition-all ${
                    !viewerSpin && viewerCameraAngle === 'back' 
                      ? 'bg-[#D4AF37] text-black' 
                      : 'hover:bg-black/5 text-neutral-600 hover:text-black'
                  }`}
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setViewerSpin(true);
                    setViewerCameraAngle('free');
                  }}
                  className={`text-[9px] md:text-[10px] uppercase tracking-wider font-bold px-2.5 md:px-3 py-1 md:py-1.5 rounded-md cursor-pointer transition-all flex items-center gap-1.5 ${
                    viewerSpin 
                      ? 'bg-[#D4AF37] text-black' 
                      : 'hover:bg-black/5 text-neutral-600 hover:text-black'
                  }`}
                >
                  <RefreshCw size={9} className={viewerSpin ? 'animate-spin-slow' : ''} />
                  Auto
                </button>
              </div>
            </div>

            {/* Customizer Panel (Col 5) */}
            <div className="lg:col-span-5 space-y-8">
              {selectedProduct ? (
                <>
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono tracking-widest text-[#AA771C] uppercase bg-[#D4AF37]/10 px-3 py-1 rounded-full w-max block font-bold">
                      {selectedProduct.category}
                    </span>
                    <h3 className="font-serif italic text-3xl md:text-4xl font-light text-neutral-900">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-neutral-600 font-light text-sm leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Configurator Controls */}
                  <div className="space-y-6 pt-4 border-t border-black/5">
                    
                    {/* Color switcher */}
                    <div className="space-y-3">
                      <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 flex items-center gap-1.5 font-bold">
                        <Palette size={12} />
                        Select Luxury Shade
                      </label>
                      <div className="flex gap-4">
                        {[
                          { name: 'Heritage Gold', hex: '#BF953F' },
                          { name: 'Maison Crimson', hex: '#A62B2B' },
                          { name: 'Atelier Ivory', hex: '#E5E0DB' },
                          { name: 'Saree Emerald', hex: '#0D483E' }
                        ].map((c) => (
                          <button
                            key={c.hex}
                            onClick={() => setViewerColor(c.hex)}
                            className="cursor-pointer group flex flex-col items-center gap-1.5"
                          >
                            <span 
                              className={`w-7 h-7 rounded-full border transition-all duration-300 ${
                                viewerColor === c.hex 
                                  ? 'border-[#D4AF37] scale-110 shadow-lg' 
                                  : 'border-neutral-300 hover:border-neutral-600'
                              }`}
                              style={{ backgroundColor: c.hex }}
                            />
                            <span className="text-[9px] font-mono text-neutral-500 group-hover:text-black transition-colors">{c.name.split(' ')[1]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Fabric close up */}
                    <div className="flex items-center justify-between bg-white border border-neutral-200/60 p-4 rounded-xl shadow-sm">
                      <div className="space-y-1">
                        <label className="text-xs font-bold flex items-center gap-1.5 text-neutral-800">
                          <Layers size={13} className="text-[#AA771C]" />
                          Micro Fabric Detail
                        </label>
                        <p className="text-[10px] text-neutral-500">Inspect the intricate weave of metal and silk</p>
                      </div>
                      <button
                        onClick={() => setViewerFabricDetail(!viewerFabricDetail)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          viewerFabricDetail 
                            ? 'bg-[#D4AF37] text-black shadow-md' 
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black'
                        }`}
                      >
                        {viewerFabricDetail ? 'ON (Zoomed)' : 'OFF'}
                      </button>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pt-6 border-t border-black/5 mt-4">
                    <div>
                      <p className="text-[10px] text-neutral-500 font-mono">ESTIMATED COUTURE PRICE</p>
                      <p className="text-2xl font-serif text-[#AA771C] font-bold mt-1">
                        ₹{selectedProduct.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                    
                    <div className="flex gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => handleToggleWishlist(selectedProduct.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          wishlist.includes(selectedProduct.id)
                            ? 'border-[#B76E79] text-[#B76E79] bg-[#B76E79]/5'
                            : 'border-neutral-200 text-neutral-500 hover:text-black hover:border-neutral-400'
                        }`}
                      >
                        <Heart size={16} className={wishlist.includes(selectedProduct.id) ? "fill-[#B76E79]" : ""} />
                      </button>
                      
                      <button
                        onClick={() => handleAddToCart(selectedProduct, selectedProduct.sizes?.[0] || 'M')}
                        className="gold-glow-button cursor-pointer bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-[#4A1525] text-xs font-black uppercase tracking-widest px-6 py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 flex-grow sm:flex-grow-0 w-full sm:w-auto"
                      >
                        <ShoppingBag size={14} />
                        Enlist Bag
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-neutral-500 font-serif italic">
                  Initializing luxury configurator...
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: LUXURY EDITORIAL LOOKBOOK */}
      <section className="relative py-16 md:py-40 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-12 md:mb-24 space-y-3">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#AA771C] font-bold block font-mono">
              MAISON COLLECTION BOOK
            </span>
            <h2 className="font-serif italic text-4xl md:text-5xl font-light text-neutral-900">Luxury Lookbook</h2>
          </div>

          <div className="space-y-16 md:space-y-48">
            {/* Lookbook Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
              <div className="lg:col-span-7">
                <div className="gsap-lookbook-img-wrapper h-[300px] sm:h-[450px] md:h-[600px] overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=1200" 
                    alt="Fabric Flow" 
                    className="w-full h-full object-cover scale-110"
                  />
                </div>
              </div>
              <div className="lg:col-span-5 space-y-4 md:space-y-6 lg:pl-6">
                <span className="text-[10px] tracking-[0.2em] font-mono text-[#AA771C] font-bold">VOLUME I / DRAPES</span>
                <h3 className="font-serif italic text-2xl md:text-4xl font-light leading-snug text-neutral-900">
                  The architecture of cascading folds.
                </h3>
                <p className="text-neutral-600 font-light text-xs md:text-base leading-relaxed">
                  Sculpted in premium Italian luxury crepe and micro-textured silk, our collection represents drapes that flow structurally. Scrolling reveals dynamic clipping masks that expand the fabric to full bleed, matching the scale of luxury editorial magazines.
                </p>
              </div>
            </div>

            {/* Lookbook Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
              <div className="lg:col-span-5 order-2 lg:order-1 space-y-4 md:space-y-6 lg:pr-6">
                <span className="text-[10px] tracking-[0.2em] font-mono text-[#AA771C] font-bold">VOLUME II / CRAFT</span>
                <h3 className="font-serif italic text-2xl md:text-4xl font-light leading-snug text-neutral-900">
                  Gold zari threads dipped in heirloom metal.
                </h3>
                <p className="text-neutral-600 font-light text-xs md:text-base leading-relaxed">
                  Hand-loomed over months by master artisans, our drapes combine authentic Indian patterns with contemporary silhouettes. The physical look is mirrored perfectly in the digital studio, where spot lighting dynamically highlights metallic embroideries.
                </p>
              </div>
              <div className="lg:col-span-7 order-1 lg:order-2">
                <div className="gsap-lookbook-img-wrapper h-[300px] sm:h-[450px] md:h-[600px] overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200" 
                    alt="Artisan Craft" 
                    className="w-full h-full object-cover scale-110"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 6: PRODUCT CATEGORIES */}
      <section className="relative py-16 md:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
          
          {/* Category Tabs at the top */}
          <div className="text-center mb-12 md:mb-16 space-y-3">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#AA771C] font-bold block font-mono font-bold">
              CURATED COLLECTION
            </span>
            <h2 className="font-serif italic text-4xl md:text-5xl font-light text-neutral-900">Collections Salon</h2>
            <p className="text-neutral-500 text-xs font-mono mb-6">
              Select a collection or browse our spatial archives below
            </p>
            {setFilterCategory && filterCategory && (
              <div className="flex flex-wrap justify-center gap-3 select-none pt-2">
                {['All', 'Wedding Collection', 'Office Wear', 'Casual Wear'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border cursor-pointer ${
                      filterCategory === cat
                        ? 'bg-neutral-900 border-neutral-900 text-white shadow-md'
                        : 'bg-white border-neutral-200 text-neutral-500 hover:text-neutral-950 hover:border-neutral-400'
                    }`}
                  >
                    {cat === 'All' ? 'All Masterpieces' : cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 1. Wedding Dress Collection Section */}
          {(filterCategory === 'All' || filterCategory === 'Wedding Collection') && (
            <div className="space-y-8">
              <div className="border-b border-black/5 pb-4">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#AA771C] font-bold block font-mono">
                  THE BRIDAL SALON
                </span>
                <h3 className="font-serif italic text-2xl md:text-3xl font-light text-neutral-900 mt-1">
                  Wedding Dress Collection
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
                {displayProducts.filter(p => p.category === 'Wedding Collection').map((p) => (
                  <div 
                    key={p.id} 
                    className="group relative w-full h-[470px] [perspective:1200px] cursor-pointer"
                    onClick={() => handleProductSelect(p)}
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
                        onClick={(e) => { e.stopPropagation(); handleProductSelect(p); }}
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
                        </div>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 h-32 bg-neutral-50 rounded-xl border border-neutral-100 transition-all duration-700 ease-out origin-bottom group-hover:[transform:rotateX(90deg)_translateZ(4px)] z-15"></div>

                      <div className="absolute bottom-4 left-4 right-4 p-5 bg-white border border-neutral-100 rounded-xl shadow-sm transition-all duration-700 ease-out origin-bottom [transform-style:preserve-3d] group-hover:[transform:rotateY(10deg)_rotateX(-60deg)_translateZ(65px)_translateY(-15px)] group-hover:bg-[#FAF5EF] group-hover:border-[#D4AF37]/35 group-hover:shadow-xl z-30">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] uppercase font-bold tracking-widest text-[#B76E79] font-mono">{p.category}</span>
                          </div>
                          
                          <h4 
                            onClick={(e) => { e.stopPropagation(); handleProductSelect(p); }}
                            className="font-serif italic text-base font-bold text-neutral-900 cursor-pointer hover:text-[#D4AF37] transition-all truncate"
                          >
                            {p.name}
                          </h4>

                          <div className="overflow-hidden transition-all duration-[600ms]" style={{
                            maxHeight: '45px',
                            opacity: 0.6
                          }}>
                            <p className="text-xs text-neutral-600 font-light leading-relaxed line-clamp-2">
                              {p.description}
                            </p>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-neutral-100">
                            <p className="text-sm font-bold text-neutral-900 font-mono">₹{p.price.toLocaleString('en-IN')}</p>
                            <div className="flex gap-1.5">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleProductSelect(p); }}
                                className="bg-neutral-100 hover:bg-[#D4AF37]/10 hover:text-[#AA771C] border border-neutral-200 hover:border-[#D4AF37]/30 text-neutral-800 px-2.5 py-1.5 rounded-lg cursor-pointer transition-all text-[10px] flex items-center gap-1 font-bold uppercase tracking-wider"
                              >
                                <Compass size={11} />
                                Studio
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleAddToCart(p, p.sizes?.[0] || 'M'); }}
                                className="gold-glow-button cursor-pointer bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-[#4A1525] text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg"
                              >
                                Enlist
                              </button>
                            </div>
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
            </div>
          )}

          {/* 2. Office Wear Collection Section */}
          {(filterCategory === 'All' || filterCategory === 'Office Wear') && (
            <div className="space-y-8 pt-10 border-t border-black/5">
              <div className="border-b border-black/5 pb-4">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#AA771C] font-bold block font-mono">
                  STRUCTURED CREPES
                </span>
                <h3 className="font-serif italic text-2xl md:text-3xl font-light text-neutral-900 mt-1">
                  Office Wear Collection
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
                {displayProducts.filter(p => p.category === 'Office Wear').map((p) => (
                  <div 
                    key={p.id} 
                    className="group relative w-full h-[470px] [perspective:1200px] cursor-pointer"
                    onClick={() => handleProductSelect(p)}
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
                        onClick={(e) => { e.stopPropagation(); handleProductSelect(p); }}
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
                        </div>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 h-32 bg-neutral-50 rounded-xl border border-neutral-100 transition-all duration-700 ease-out origin-bottom group-hover:[transform:rotateX(90deg)_translateZ(4px)] z-15"></div>

                      <div className="absolute bottom-4 left-4 right-4 p-5 bg-white border border-neutral-100 rounded-xl shadow-sm transition-all duration-700 ease-out origin-bottom [transform-style:preserve-3d] group-hover:[transform:rotateY(10deg)_rotateX(-60deg)_translateZ(65px)_translateY(-15px)] group-hover:bg-[#FAF5EF] group-hover:border-[#D4AF37]/35 group-hover:shadow-xl z-30">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] uppercase font-bold tracking-widest text-[#B76E79] font-mono">{p.category}</span>
                          </div>
                          
                          <h4 
                            onClick={(e) => { e.stopPropagation(); handleProductSelect(p); }}
                            className="font-serif italic text-base font-bold text-neutral-900 cursor-pointer hover:text-[#D4AF37] transition-all truncate"
                          >
                            {p.name}
                          </h4>

                          <div className="overflow-hidden transition-all duration-[600ms]" style={{
                            maxHeight: '45px',
                            opacity: 0.6
                          }}>
                            <p className="text-xs text-neutral-600 font-light leading-relaxed line-clamp-2">
                              {p.description}
                            </p>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-neutral-100">
                            <p className="text-sm font-bold text-neutral-900 font-mono">₹{p.price.toLocaleString('en-IN')}</p>
                            <div className="flex gap-1.5">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleProductSelect(p); }}
                                className="bg-neutral-100 hover:bg-[#D4AF37]/10 hover:text-[#AA771C] border border-neutral-200 hover:border-[#D4AF37]/30 text-neutral-800 px-2.5 py-1.5 rounded-lg cursor-pointer transition-all text-[10px] flex items-center gap-1 font-bold uppercase tracking-wider"
                              >
                                <Compass size={11} />
                                Studio
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleAddToCart(p, p.sizes?.[0] || 'M'); }}
                                className="gold-glow-button cursor-pointer bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-[#4A1525] text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg"
                              >
                                Enlist
                              </button>
                            </div>
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
            </div>
          )}

          {/* 3. Classic & Casual Collection Section */}
          {(filterCategory === 'All' || filterCategory === 'Casual Wear') && (
            <div className="space-y-8 pt-10 border-t border-black/5">
              <div className="border-b border-black/5 pb-4">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#AA771C] font-bold block font-mono">
                  EFFORTLESS CASUALS
                </span>
                <h3 className="font-serif italic text-2xl md:text-3xl font-light text-neutral-900 mt-1">
                  Classic & Casual Collection
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
                {displayProducts.filter(p => p.category === 'Casual Wear').map((p) => (
                  <div 
                    key={p.id} 
                    className="group relative w-full h-[470px] [perspective:1200px] cursor-pointer"
                    onClick={() => handleProductSelect(p)}
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
                        onClick={(e) => { e.stopPropagation(); handleProductSelect(p); }}
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
                        </div>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 h-32 bg-neutral-50 rounded-xl border border-neutral-100 transition-all duration-700 ease-out origin-bottom group-hover:[transform:rotateX(90deg)_translateZ(4px)] z-15"></div>

                      <div className="absolute bottom-4 left-4 right-4 p-5 bg-white border border-neutral-100 rounded-xl shadow-sm transition-all duration-700 ease-out origin-bottom [transform-style:preserve-3d] group-hover:[transform:rotateY(10deg)_rotateX(-60deg)_translateZ(65px)_translateY(-15px)] group-hover:bg-[#FAF5EF] group-hover:border-[#D4AF37]/35 group-hover:shadow-xl z-30">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] uppercase font-bold tracking-widest text-[#B76E79] font-mono">{p.category}</span>
                          </div>
                          
                          <h4 
                            onClick={(e) => { e.stopPropagation(); handleProductSelect(p); }}
                            className="font-serif italic text-base font-bold text-neutral-900 cursor-pointer hover:text-[#D4AF37] transition-all truncate"
                          >
                            {p.name}
                          </h4>

                          <div className="overflow-hidden transition-all duration-[600ms]" style={{
                            maxHeight: '45px',
                            opacity: 0.6
                          }}>
                            <p className="text-xs text-neutral-600 font-light leading-relaxed line-clamp-2">
                              {p.description}
                            </p>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-neutral-100">
                            <p className="text-sm font-bold text-neutral-900 font-mono">₹{p.price.toLocaleString('en-IN')}</p>
                            <div className="flex gap-1.5">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleProductSelect(p); }}
                                className="bg-neutral-100 hover:bg-[#D4AF37]/10 hover:text-[#AA771C] border border-neutral-200 hover:border-[#D4AF37]/30 text-neutral-800 px-2.5 py-1.5 rounded-lg cursor-pointer transition-all text-[10px] flex items-center gap-1 font-bold uppercase tracking-wider"
                              >
                                <Compass size={11} />
                                Studio
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleAddToCart(p, p.sizes?.[0] || 'M'); }}
                                className="gold-glow-button cursor-pointer bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-[#4A1525] text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg"
                              >
                                Enlist
                              </button>
                            </div>
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
            </div>
          )}

        </div>
      </section>

      {/* SECTION 7: FLOATING COLLECTION GRID */}
      <section className="relative py-16 md:py-40 bg-white overflow-hidden gsap-floating-collection-trigger">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-24 space-y-3">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#AA771C] font-bold block font-mono">
              SPATIAL DISPLAY
            </span>
            <h2 className="font-serif italic text-4xl md:text-5xl font-light text-neutral-900">Floating Collection</h2>
            <p className="text-neutral-500 text-xs font-mono">
              <span className="hidden md:inline">Products float scattered in spatial layout</span>
              <span className="inline md:hidden">Swipe to explore products</span>
            </p>
          </div>

          <div className="w-full">
            {/* Mobile swipe layout */}
            <div className="flex md:hidden overflow-x-auto gap-6 pb-6 w-full snap-x snap-mandatory scrollbar-none">
              {displayProducts.slice(0, 4).map((p) => (
                <div 
                  key={`floating-mobile-${p.id}`}
                  onClick={() => handleProductSelect(p)}
                  className="w-64 bg-white border border-neutral-200/60 p-4 rounded-2xl shadow-xl flex-shrink-0 snap-center cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <img src={p.images?.[0] || ''} alt={p.name} className="w-full h-64 object-cover rounded-xl" />
                  <h3 className="font-serif italic text-lg mt-3 text-center text-neutral-800">{p.name}</h3>
                  <p className="text-[#AA771C] text-xs font-mono font-bold text-center mt-1">₹{p.price.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>

            {/* Desktop scattered layout */}
            <div className="hidden md:flex relative min-h-[900px] items-center justify-center">
              {/* Center Main Dress */}
              {displayProducts[0] && (
                <div 
                  className="gsap-floating-card-center absolute z-10 w-64 md:w-80 left-1/2 -translate-x-1/2 cursor-pointer group opacity-0"
                  style={{ top: '5%' }}
                  onClick={() => handleProductSelect(displayProducts[0])}
                >
                  <div className="bg-white border border-neutral-200/60 p-4 rounded-2xl shadow-2xl hover:border-[#D4AF37]/35 transition-all">
                    <img src={displayProducts[0].images?.[0] || ''} alt={displayProducts[0].name} className="w-full h-72 object-cover rounded-xl group-hover:scale-103 transition-transform duration-500" />
                    <h3 className="font-serif italic text-lg mt-3 text-center text-neutral-700 group-hover:text-[#AA771C] transition-all">{displayProducts[0].name}</h3>
                  </div>
                </div>
              )}

              {/* Float left-top */}
              {displayProducts[1] && (
                <div 
                  className="gsap-floating-card-left absolute z-0 w-48 md:w-60 left-4 md:left-[10%] cursor-pointer group opacity-0"
                  style={{ top: '40%' }}
                  onClick={() => handleProductSelect(displayProducts[1])}
                >
                  <div className="bg-white border border-neutral-200/60 p-3 rounded-2xl shadow-xl hover:border-[#D4AF37]/35 transition-all">
                    <img src={displayProducts[1].images?.[0] || ''} alt={displayProducts[1].name} className="w-full h-48 object-cover rounded-xl" />
                    <h3 className="font-serif italic text-sm mt-2 text-center text-neutral-600 group-hover:text-[#AA771C] transition-all">{displayProducts[1].name}</h3>
                  </div>
                </div>
              )}

              {/* Float right-mid */}
              {displayProducts[2] && (
                <div 
                  className="gsap-floating-card-right absolute z-0 w-48 md:w-60 right-4 md:right-[10%] cursor-pointer group opacity-0"
                  style={{ top: '30%' }}
                  onClick={() => handleProductSelect(displayProducts[2])}
                >
                  <div className="bg-white border border-neutral-200/60 p-3 rounded-2xl shadow-xl hover:border-[#D4AF37]/35 transition-all">
                    <img src={displayProducts[2].images?.[0] || ''} alt={displayProducts[2].name} className="w-full h-48 object-cover rounded-xl" />
                    <h3 className="font-serif italic text-sm mt-2 text-center text-neutral-600 group-hover:text-[#AA771C] transition-all">{displayProducts[2].name}</h3>
                  </div>
                </div>
              )}

              {/* Float bottom */}
              {displayProducts[3] && (
                <div 
                  className="gsap-floating-card-bottom absolute z-10 w-52 md:w-64 left-1/2 -translate-x-1/2 cursor-pointer group opacity-0"
                  style={{ bottom: '3%' }}
                  onClick={() => handleProductSelect(displayProducts[3])}
                >
                  <div className="bg-white border border-neutral-200/60 p-3 rounded-2xl shadow-2xl hover:border-[#D4AF37]/35 transition-all">
                    <img src={displayProducts[3].images?.[0] || ''} alt={displayProducts[3].name} className="w-full h-52 object-cover rounded-xl" />
                    <h3 className="font-serif italic text-sm mt-2 text-center text-neutral-600 group-hover:text-[#AA771C] transition-all">{displayProducts[3].name}</h3>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: LUXURY CHECKOUT CTA */}
      <section className="relative py-16 md:py-40 bg-white text-center border-t border-black/5">
        <div className="max-w-4xl mx-auto px-6 space-y-6 md:space-y-8 select-none">
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#AA771C] font-bold block font-mono">
            SECURE CHECKOUT REGISTRY
          </span>
          <h2 className="font-serif italic text-3xl md:text-6xl font-light leading-tight text-neutral-900">
            Finalize Your Bespoke Order Inquiries
          </h2>
          <p className="text-neutral-600 font-light text-xs md:text-base max-w-xl mx-auto leading-relaxed">
            Ready to convert digital art into physical reality? Secure your selection bag and arrange high-fashion measurements with our leading bridal advisors.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('home')}
              className="px-8 py-3.5 rounded-xl border border-neutral-300 hover:border-black text-xs font-bold uppercase tracking-widest cursor-pointer transition-all duration-300 text-neutral-800 w-full sm:w-auto justify-center"
            >
              Back to Atelier Salon
            </button>
            <button
              onClick={() => {
                // Open Selection Bag drawer simulation
                const bagButton = document.querySelector('[aria-label="Toggle Bag"]') as HTMLButtonElement;
                if (bagButton) bagButton.click();
              }}
              className="gold-glow-button cursor-pointer bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-[#4A1525] text-xs font-black uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-2xl w-full sm:w-auto justify-center"
            >
              Inspect Selection Bag
            </button>
          </div>
        </div>
      </section>

      {/* FULL SCREEN WEBGL 3D RUNWAY MODAL OVERLAY */}
      <AnimatePresence>
        {isFullscreenViewer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-neutral-950/98 backdrop-blur-xl flex flex-col justify-between p-6 select-none text-white pointer-events-auto"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center w-full max-w-7xl mx-auto border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37] font-bold block font-mono">
                  ANVAA COUTURE 3D RUNWAY INSPECTION
                </span>
                <h3 className="font-serif italic text-2xl text-white mt-1">
                  {selectedProduct ? selectedProduct.name : "Vasantika Heirloom Gown"}
                </h3>
              </div>
              
              <button
                onClick={() => setIsFullscreenViewer(false)}
                className="bg-white/10 hover:bg-white/20 text-white hover:text-[#D4AF37] px-5 py-2.5 rounded-full border border-white/15 text-xs uppercase tracking-wider font-bold cursor-pointer transition-all duration-300 flex items-center justify-center"
              >
                Close Runway ✕
              </button>
            </div>

            {/* Immersive 3D Viewport */}
            <div className="flex-grow w-full max-w-6xl mx-auto my-6 relative rounded-2xl overflow-hidden bg-neutral-900/40 border border-white/5 shadow-inner">
              <Canvas shadows camera={{ position: [0, 0.7, 2.3], fov: 38 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
                <spotLight 
                  position={[0, 4, 2.5]} 
                  angle={0.4} 
                  penumbra={1} 
                  intensity={4} 
                  color="#BF953F" 
                  castShadow 
                />
                
                <ProceduralDress 
                  color={viewerColor} 
                  fabricDetail={viewerFabricDetail}
                  isSpinning={viewerSpin}
                />
                
                <OrbitControls 
                  enablePan={true} 
                  enableZoom={true} 
                  minDistance={0.8} 
                  maxDistance={3.5}
                />
              </Canvas>

              {/* Float Assist Overlay */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 pointer-events-none text-xs font-mono text-[#D4AF37]">
                <RefreshCw size={12} className="animate-spin-slow" />
                Drag to orbit 360° | Scroll / Pinch to zoom | Drag with Right-Click to pan
              </div>
            </div>

            {/* Bottom Configurator Control Board */}
            <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md mb-4">
              
              {/* Shade Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 font-bold">
                  <Palette size={12} />
                  Change Shade
                </label>
                <div className="flex gap-4">
                  {[
                    { name: 'Heritage Gold', hex: '#BF953F' },
                    { name: 'Maison Crimson', hex: '#A62B2B' },
                    { name: 'Atelier Ivory', hex: '#E5E0DB' },
                    { name: 'Saree Emerald', hex: '#0D483E' }
                  ].map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setViewerColor(c.hex)}
                      className="cursor-pointer group flex flex-col items-center gap-1"
                    >
                      <span 
                        className={`w-6 h-6 rounded-full border transition-all duration-300 ${
                          viewerColor === c.hex 
                            ? 'border-[#D4AF37] scale-110 shadow-lg' 
                            : 'border-white/20 hover:border-white/60'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive config settings */}
              <div className="flex gap-4 items-center">
                <button
                  onClick={() => setViewerFabricDetail(!viewerFabricDetail)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                    viewerFabricDetail 
                      ? 'bg-[#D4AF37] text-black border-[#D4AF37]' 
                      : 'bg-white/5 text-neutral-300 hover:bg-white/15 border-white/15'
                  }`}
                >
                  Weave Detail: {viewerFabricDetail ? "ON (Zoomed)" : "OFF"}
                </button>

                <button
                  onClick={() => setViewerSpin(!viewerSpin)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border flex items-center gap-2 ${
                    viewerSpin 
                      ? 'bg-[#D4AF37] text-black border-[#D4AF37]' 
                      : 'bg-white/5 text-neutral-300 hover:bg-white/15 border-white/15'
                  }`}
                >
                  <RefreshCw size={12} className={viewerSpin ? 'animate-spin-slow' : ''} />
                  Auto-Rotate
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

