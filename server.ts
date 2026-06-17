import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DB_FILE = path.join(process.cwd(), "database.json");

app.use(express.json());

// Lazy-loaded Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      try {
        aiClient = new GoogleGenAI({
          apiKey: key,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });
      } catch (e) {
        console.error("Failed to initialize GoogleGenAI:", e);
      }
    }
  }
  return aiClient;
}

// Ensure database.json exists and is seeded with gorgeous luxury items
function initializeDatabase() {
  // Always execute seeding to ensure newest mock data, beautiful past order history, and elegant wedding presets are up to date

  // Beautiful luxury Indian fashion designers
  const designers = [
    {
      id: "aditi_deshmukh",
      name: "Aditi Deshmukh",
      city: "Mumbai",
      specialty: "Royal Banarasi & Bridal Couture",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400",
      coverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800",
      bio: "Aditi Deshmukh celebrates the pristine beauty of Banarasi weave. Based in Mumbai, she is a revivalist of handloom heritages, transforming ancient Indian artistry into highly contemporary, dramatic bridal and wedding silhouettes with gold zardozi.",
      achievements: [
        "Vogue India Designer of the Year (Heritage Revival) 2024",
        "Showcased at India Couture Week 2025",
        "Costume Designer for National Award-winning Period Film",
        "Empaneled with the Craft Council of India Artisans Guild"
      ],
      history: [
        { year: "2018", event: "Launched flagship luxury atelier in Colaba, Mumbai." },
        { year: "2020", event: "Designed the acclaimed 'Benares Royals' bridal line featured in Harper's Bazaar." },
        { year: "2022", event: "Established India's first silk weaver-collaborative fair-trade initiative." },
        { year: "2025", event: "Selected to present the cultural opening showcase at Mumbai Fashion Week." }
      ],
      rating: 4.9,
      reviewsCount: 142,
      consultationFee: 4500
    },
    {
      id: "meera_khanna",
      name: "Meera Khanna",
      city: "New Delhi",
      specialty: "Minimal Luxury & Structural Office Wear",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400",
      coverImage: "https://images.unsplash.com/photo-1548624149-f7b3e6432b42?q=80&w=800",
      bio: "Meera Khanna defines modern structure for the dynamic young professional woman. From her studio in New Delhi, her focus is pristine tailoring, sculptural linen, fine crepes, and elegant workwear and sharp drapes with smart custom adjustments.",
      achievements: [
        "Elle India 'Power dressing' Design Award 2023",
        "Designed the 'Nouveau Boardroom' series for Global Leaders Summit",
        "Pioneer of ultra-high-thread-count anti-crease linen blend patent"
      ],
      history: [
        { year: "2019", event: "Graduated with top honors from NIFT Delhi and launched 'KHANNA' minimal line." },
        { year: "2021", event: "Launched structural power blazer dresses that went viral among India's tech co-founders." },
        { year: "2024", event: "Collaborated with standard business icons for sustainable workwear lines." }
      ],
      rating: 4.8,
      reviewsCount: 96,
      consultationFee: 3500
    },
    {
      id: "pooja_nair",
      name: "Pooja Nair",
      city: "Bengaluru",
      specialty: "Sustainable Resort & Premium Casuals",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400",
      coverImage: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800",
      bio: "Pooja Nair blends southern Indian weaves with fluid, elegant casual geometry. Her Bengaluru atelier works exclusively with local weavers, organic colors, and relaxed silks, catering to young Indian women who seek effortless, elevated elegance everyday.",
      achievements: [
        "National Green Fashion Catalyst Award 2024",
        "Featured globally in Eco-Fashion London showcase",
        "Collaborated on signature hand-block patterns with Mysore organic mills"
      ],
      history: [
        { year: "2017", event: "Started with a boutique capsule in Indiranagar, Bengaluru." },
        { year: "2021", event: "Introduced the 'Elysiana' hand-loomed luxury kaftan series." },
        { year: "2023", event: "Awarded top eco-impact luxury status by India Clean-Fashion consortium." }
      ],
      rating: 4.7,
      reviewsCount: 110,
      consultationFee: 3000
    }
  ];

  // Beautiful high-end Indian luxury fashion products
  const products = [
    // Wedding Collection
    {
      id: "prod_wedding_01",
      name: "The Gilded Marigold Lehenga",
      price: 185000,
      category: "Wedding Collection",
      description: "A breathtaking bridal lehenga woven in rich Banarasi silk, featuring meticulous hand-embroidered zardozi work, gold plated threads, and hand-stitched sequin borders. Comes with a pure silk organza dupatta in royal marigold. Inspired by ancient heritage patterns.",
      designerId: "aditi_deshmukh",
      designerName: "Aditi Deshmukh",
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
      designerId: "aditi_deshmukh",
      designerName: "Aditi Deshmukh",
      images: [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600",
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600"
      ],
      sizes: ["S", "M", "L", "XL", "Custom Measure"],
      stock: 6,
      rating: 4.8
    },

    // Office Wear
    {
      id: "prod_office_01",
      name: "The Ivory Power Crepe Blazer Suit",
      price: 42000,
      category: "Office Wear",
      description: "A tailored double-breasted power blazer paired with matching straight-leg trousers, styled for ambitious women. Crafted with Italian luxury crepe, structured shoulder pads, and discreet luxury gold buttons. Full satin lining.",
      designerId: "meera_khanna",
      designerName: "Meera Khanna",
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
      description: "A sharp, breathable, high-thread-count linen jumpsuit with sharp collars, structured waist belt, and deep pleats. Handcrafted to deliver effortless transition from high-stakes board meetings to premium dining.",
      designerId: "meera_khanna",
      designerName: "Meera Khanna",
      images: [
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=600",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600"
      ],
      sizes: ["S", "M", "L"],
      stock: 15,
      rating: 4.6
    },

    // Casual Wear
    {
      id: "prod_casual_01",
      name: "The Monsoon Breeze Silk Kaftan",
      price: 24000,
      category: "Casual Wear",
      description: "A floating casual masterpiece created from pure hand-blocked mulberry silk, showcasing organic hand-drawn Indian motifs, and subtle gold thread stitching along the dynamic high-low hemline. Comfortable yet luxurious.",
      designerId: "pooja_nair",
      designerName: "Pooja Nair",
      images: [
        "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=600",
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600"
      ],
      sizes: ["XS/S", "M/L", "XL", "Free Size"],
      stock: 18,
      rating: 4.8,
      isTrending: true
    },
    {
      id: "prod_casual_02",
      name: "Champagne Organic Cotton Midi",
      price: 18500,
      category: "Casual Wear",
      description: "Woven in high-quality organic cotton with a soft champagne tint, this flared daily dress features structured gathers, delicate back ribbon closures, and internal pockets. Simple, luxurious, everyday dressing.",
      designerId: "pooja_nair",
      designerName: "Pooja Nair",
      images: [
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600",
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600"
      ],
      sizes: ["S", "M", "L", "XL"],
      stock: 20,
      rating: 4.5
    },

    // Designer Collections
    {
      id: "prod_designer_01",
      name: "The Crimson Empress Cape Gown",
      price: 160000,
      category: "Designer Collections",
      description: "Designed in collaboration with Aditi Deshmukh, this masterpiece is a modern floor-length hand-loomed silk gown draped with an over-the-shoulder Crimson Silk organza cape entirely hand-embroidered with classic motif beads.",
      designerId: "aditi_deshmukh",
      designerName: "Aditi Deshmukh",
      images: [
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600",
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600"
      ],
      sizes: ["S", "M", "L", "Custom Measure"],
      stock: 3,
      rating: 5.0,
      isTrending: true
    },

    // Premium Limited Editions
    {
      id: "prod_limited_01",
      name: "Banarasi Gold Thread Heirloom Saree",
      price: 245000,
      category: "Premium Limited Editions",
      description: "An authentic, serial-numbered legacy saree hand-loomed over 3 months using genuine silver-plated zari threads dipped in premium 24k gold. Highly exclusive collectors item. Number 07 of 15 produced.",
      designerId: "aditi_deshmukh",
      designerName: "Aditi Deshmukh",
      images: [
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600",
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600"
      ],
      sizes: ["One Size (Saree) + Custom Blouse"],
      stock: 2,
      rating: 5.0,
      isTrending: true
    }
  ];

  const defaultUsers = [
    {
      id: "user_01",
      email: "codewithvibe64@gmail.com",
      name: "Vasantika Sen",
      role: "admin",
      phone: "+91 98765 43210",
      savedAddresses: [
        {
          id: "addr_01",
          name: "Vasantika Sen",
          street: "Flat 402, Royal Residency, Juhu Tara Road",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400049",
          phone: "+91 98765 43210"
        }
      ],
      createdAt: new Date().toISOString()
    }
  ];

  const defaultOrders = [
    {
      id: "ANVAA-827419",
      userId: "user_01",
      items: [
        {
          product: {
            id: "prod_wedding_01",
            name: "The Gilded Marigold Lehenga",
            price: 185000,
            category: "Wedding Collection",
            description: "A breathtaking bridal lehenga woven in rich Banarasi silk, featuring meticulous hand-embroidered zardozi work, gold plated threads, and hand-stitched sequin borders. Comes with a pure silk organza dupatta in royal marigold.",
            designerId: "aditi_deshmukh",
            designerName: "Aditi Deshmukh",
            images: [
              "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600"
            ],
            sizes: ["XS", "S", "M", "L", "XL", "Custom Measure"],
            stock: 4,
            rating: 4.9,
            isTrending: true
          },
          quantity: 1,
          selectedSize: "Custom Measure"
        }
      ],
      subtotal: 185000,
      discount: 18500,
      shipping: 0,
      total: 166500,
      address: {
        id: "addr_01",
        name: "Vasantika Sen",
        street: "Flat 402, Royal Residency, Juhu Tara Road",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400049",
        phone: "+91 98765 43210"
      },
      paymentMethod: "UPI Block Secure",
      status: "Delivered",
      createdAt: "2026-02-14T11:20:00.000Z",
      trackingTimeline: [
        { status: "Order Placed", date: "14/02/2026, 11:20:00 AM", description: "Your premium order has been recorded at the central salon.", done: true },
        { status: "In Crafting", date: "16/02/2026, 2:15:00 PM", description: "Artisans commencing precise weaving and drape alignment.", done: true },
        { status: "Quality Check", date: "22/02/2026, 4:40:00 PM", description: "Micro inspect for fit and gold thread perfection.", done: true },
        { status: "Dispatched", date: "24/02/2026, 10:00:00 AM", description: "Placed in luxury premium boxes with custom notes.", done: true },
        { status: "Delivered", date: "27/02/2026, 3:30:00 PM", description: "Pristine physical handover complete.", done: true }
      ]
    },
    {
      id: "ANVAA-195821",
      userId: "user_01",
      items: [
        {
          product: {
            id: "prod_office_01",
            name: "The Ivory Power Crepe Blazer Suit",
            price: 42000,
            category: "Office Wear",
            description: "A tailored double-breasted power blazer paired with matching straight-leg trousers, styled for ambitious women. Crafted with Italian luxury crepe, structured shoulder pads, and gold accents.",
            designerId: "meera_khanna",
            designerName: "Meera Khanna",
            images: [
              "https://images.unsplash.com/photo-1548624149-f7b3e6432b42?q=80&w=600"
            ],
            sizes: ["XS", "S", "M", "L", "XL"],
            stock: 12,
            rating: 4.7,
            isTrending: true
          },
          quantity: 1,
          selectedSize: "S"
        }
      ],
      subtotal: 42000,
      discount: 4200,
      shipping: 0,
      total: 37800,
      address: {
        id: "addr_01",
        name: "Vasantika Sen",
        street: "Flat 402, Royal Residency, Juhu Tara Road",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400049",
        phone: "+91 98765 43210"
      },
      paymentMethod: "Credit Card Elite",
      status: "Delivered",
      createdAt: "2026-04-05T09:12:00.000Z",
      trackingTimeline: [
        { status: "Order Placed", date: "05/04/2026, 09:12:00 AM", description: "Your premium order has been recorded at the central salon.", done: true },
        { status: "In Crafting", date: "06/04/2026, 11:30:00 AM", description: "Artisans commencing precise weaving and drape alignment.", done: true },
        { status: "Quality Check", date: "08/04/2026, 4:10:00 PM", description: "Micro inspect for fit and gold thread perfection.", done: true },
        { status: "Dispatched", date: "09/04/2026, 02:00:00 PM", description: "Placed in luxury premium boxes with custom notes.", done: true },
        { status: "Delivered", date: "11/04/2026, 1:15:00 PM", description: "Pristine physical handover complete.", done: true }
      ]
    }
  ];
  const defaultChats = [
    {
      id: "chat_thread_aditi",
      customerId: "user_01",
      customerName: "Vasantika Sen",
      designerId: "aditi_deshmukh",
      designerName: "Aditi Deshmukh",
      messages: [
        {
          id: "msg_init_1",
          sender: "designer",
          content: "Welcome to ANVAA, Vasantika. I am Aditi. I look forward to telling premium stories through your attire. How can I guide you today? Would you like a wedding design consultation or custom sizing advice?",
          timestamp: new Date().toISOString()
        }
      ],
      lastUpdated: new Date().toISOString()
    }
  ];
  
  const defaultConsultations = [];

  const initialDB = {
    users: defaultUsers,
    designers: designers,
    products: products,
    orders: defaultOrders,
    chats: defaultChats,
    consultations: defaultConsultations,
    reviews: [
      {
        id: "rev_1",
        productId: "prod_wedding_01",
        userName: "Preeti Sharma",
        rating: 5,
        comment: "An absolute masterpiece! Wore this for my sangeet and received hundreds of compliments. The gold thread is gorgeous.",
        date: "2026-05-12"
      }
    ],
    wishlist: ["prod_wedding_01", "prod_office_01"]
  };

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2), "utf-8");
    console.log("Database seeded successfully.");
  } catch (err) {
    console.error("Failed to seed database:", err);
  }
}

initializeDatabase();

// Load local database helper
function getDB() {
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database", err);
    return null;
  }
}

function saveDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving database", err);
  }
}

// REST end-points
app.get("/api/products", (req, res) => {
  const db = getDB();
  res.json(db ? db.products : []);
});

app.get("/api/products/:id", (req, res) => {
  const db = getDB();
  const product = db ? db.products.find((p: any) => p.id === req.params.id) : null;
  if (product) {
    // Attach reviews
    const reviews = db.reviews ? db.reviews.filter((r: any) => r.productId === product.id) : [];
    res.json({ ...product, reviews });
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// Admin product management (Add / Update / Delete)
app.post("/api/admin/products", (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "Database not loaded" });

  const newProduct = req.body;
  if (!newProduct.id) {
    newProduct.id = "prod_" + Date.now();
  }
  
  const index = db.products.findIndex((p: any) => p.id === newProduct.id);
  if (index !== -1) {
    db.products[index] = { ...db.products[index], ...newProduct };
  } else {
    db.products.push({
      rating: 5.0,
      ...newProduct
    });
  }
  saveDB(db);
  res.json({ success: true, product: newProduct });
});

app.delete("/api/admin/products/:id", (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "Database error" });
  db.products = db.products.filter((p: any) => p.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

app.get("/api/designers", (req, res) => {
  const db = getDB();
  res.json(db ? db.designers : []);
});

// Admin designer management
app.post("/api/admin/designers", (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "DB error" });
  const designer = req.body;
  const index = db.designers.findIndex((d: any) => d.id === designer.id);
  if (index !== -1) {
    db.designers[index] = { ...db.designers[index], ...designer };
  } else {
    db.designers.push(designer);
  }
  saveDB(db);
  res.json({ success: true });
});

app.delete("/api/admin/designers/:id", (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "DB error" });
  db.designers = db.designers.filter((d: any) => d.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// Admin customer list & database metrics
app.get("/api/admin/customers", (req, res) => {
  const db = getDB();
  res.json(db ? db.users : []);
});

app.get("/api/admin/analytics", (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "DB load failure" });

  const totalSales = db.orders.reduce((acc: number, o: any) => acc + (o.status !== "Cancelled" ? o.total : 0), 0);
  const totalOrders = db.orders.length;
  const orderCountByStatus = db.orders.reduce((acc: any, o: any) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const revenueByCategory = db.orders.reduce((acc: any, o: any) => {
    o.items?.forEach((item: any) => {
      const cat = item.product.category;
      acc[cat] = (acc[cat] || 0) + (item.product.price * item.quantity);
    });
    return acc;
  }, {});

  res.json({
    totalSales,
    totalOrders,
    orderCountByStatus,
    revenueByCategory,
    productsCount: db.products.length,
    designersCount: db.designers.length,
    usersCount: db.users.length,
    consultationsCount: db.consultations.length
  });
});

// POST Review
app.post("/api/products/:id/review", (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "Database error" });

  const { rating, comment, userName } = req.body;
  const newReview = {
    id: "rev_" + Date.now(),
    productId: req.params.id,
    userName: userName || "Anonymous Guest",
    rating: Number(rating) || 5,
    comment: comment || "",
    date: new Date().toISOString().substring(0, 10)
  };

  db.reviews.push(newReview);

  // Recount average product rating
  const pReviews = db.reviews.filter((r: any) => r.productId === req.params.id);
  const avg = pReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / pReviews.length;
  const prodIndex = db.products.findIndex((p: any) => p.id === req.params.id);
  if (prodIndex !== -1) {
    db.products[prodIndex].rating = parseFloat(avg.toFixed(1));
  }

  saveDB(db);
  res.json({ success: true, reviews: pReviews, rating: db.products[prodIndex]?.rating });
});

// Chats
app.get("/api/chats/:customerId", (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "DB error" });
  const custId = req.params.customerId;
  const userChats = db.chats.filter((c: any) => c.customerId === custId);
  res.json(userChats);
});

// Send Chat message and use Gemini for AI automated Stylist replies!
app.post("/api/chats/message", async (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "DB error" });

  const { customerId, customerName, designerId, designerName, content, sender } = req.body;
  
  let thread = db.chats.find((c: any) => c.customerId === customerId && c.designerId === designerId);

  if (!thread) {
    thread = {
      id: `chat_${customerId}_${designerId}`,
      customerId,
      customerName,
      designerId,
      designerName,
      messages: [],
      lastUpdated: new Date().toISOString()
    };
    db.chats.push(thread);
  }

  const userMessage = {
    id: "msg_" + Date.now(),
    sender: sender || "customer",
    content: content,
    timestamp: new Date().toISOString()
  };

  thread.messages.push(userMessage);
  thread.lastUpdated = new Date().toISOString();
  saveDB(db);

  // Auto response logic using Gemini API or dynamic elegant responses
  const gemini = getGeminiClient();
  const designerObj = db.designers.find((d: any) => d.id === designerId);
  const designerBio = designerObj ? designerObj.bio : `${designerName} is an elite premium haute couture designer at ANVAA.`;
  const designerStyle = designerObj ? designerObj.specialty : "Luxury Premium Attire";

  if (sender === "customer") {
    let responseText = "";

    if (gemini) {
      try {
        const systemPrompt = `
You are the elite fashion designer "${designerName}" at the luxury women-fashion e-commerce brand "ANVAA".
Your bio: ${designerBio}.
Your structural expertise: ${designerStyle}.
You are interacting with a highly valued customer named "${customerName}" who is exploring your custom-fit designer collections.
Respond elegantly in a super-premium, supportive, professional, warm and respectful tone. Inject Indian fashion heritage terminology when appropriate (like silhouettes, drapes, zardozi embroidery, weaves, custom curation).
Ensure the reply feels personal, premium, inspirational, and modern Gen Z compatible.
Keep the reply brief (around 2-4 sentences max), guiding them to either checkout their premium collections, make a customized fit consultation request, or answer their specific fit issue.
No markdown or emojis that feel cheap. Use only premium typography phrasing.
`;

        const responseObj = await gemini.models.generateContent({
          model: "gemini-3.5-flash",
          contents: content,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          }
        });

        responseText = responseObj.text || "";
      } catch (gemError) {
        console.error("Gemini stylist generation failed:", gemError);
      }
    }

    // Default high-fashion fallback response if Gemini is not initialized
    if (!responseText) {
      const fallbacks = [
        `Dear ${customerName}, I adore your taste! The texture of our custom weaves has been refined specifically to match such elegant standards. Shall we schedule a virtual design fit-test?`,
        `Ah, ${customerName}. For this specific style, I definitely recommend pairing it with a customized organza drape. It maintains structure while flowing beautifully.`,
        `Greetings ${customerName}. An exquisite query. Every thread in this premium design is selected meticulously over 14 craftsmanship days. We would love to alter the length exactly to your waistline specifications.`
      ];
      responseText = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    // Create a delayed response from the designer
    const designerMessage = {
      id: "msg_" + (Date.now() + 10),
      sender: "designer",
      content: responseText.trim(),
      timestamp: new Date().toISOString()
    };

    thread.messages.push(designerMessage);
    thread.lastUpdated = new Date().toISOString();
    saveDB(db);
  }

  res.json(thread);
});

// Admin message reply from general backend
app.post("/api/admin/chats/reply", (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "DB Error" });
  const { threadId, content } = req.body;
  const thread = db.chats.find((c: any) => c.id === threadId);
  if (thread) {
    thread.messages.push({
      id: "msg_" + Date.now(),
      sender: "designer",
      content,
      timestamp: new Date().toISOString()
    });
    thread.lastUpdated = new Date().toISOString();
    saveDB(db);
    res.json(thread);
  } else {
    res.status(404).json({ error: "Chat thread not found" });
  }
});

// Consultations
app.get("/api/consultations/:userId", (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "DB error" });
  const userConsultations = db.consultations.filter((c: any) => c.userId === req.params.userId);
  res.json(userConsultations);
});

// Admin consultations list
app.get("/api/admin/consultations", (req, res) => {
  const db = getDB();
  res.json(db ? db.consultations : []);
});

// Update consultation status (Admin / Designer)
app.post("/api/admin/consultations/status", (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "DB error" });
  const { consultationId, status } = req.body;
  const index = db.consultations.findIndex((c: any) => c.id === consultationId);
  if (index !== -1) {
    db.consultations[index].status = status;
    saveDB(db);
    res.json({ success: true, consultation: db.consultations[index] });
  } else {
    res.status(404).json({ error: "Consultation not found" });
  }
});

app.post("/api/consultations", (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "DB error" });

  const { userId, userName, designerId, designerName, date, timeSlot, notes, amount } = req.body;

  const newConsultation = {
    id: "consult_" + Date.now(),
    userId,
    userName,
    designerId,
    designerName,
    date,
    timeSlot,
    status: "Requested",
    notes: notes || "",
    amount: Number(amount) || 3000,
    createdAt: new Date().toISOString()
  };

  db.consultations.push(newConsultation);

  // Auto initialize a chat thread when booking a consultation
  let thread = db.chats.find((c: any) => c.customerId === userId && c.designerId === designerId);
  if (!thread) {
    thread = {
      id: `chat_${userId}_${designerId}`,
      customerId: userId,
      customerName: userName,
      designerId,
      designerName,
      messages: [],
      lastUpdated: new Date().toISOString()
    };
    db.chats.push(thread);
  }

  thread.messages.push({
    id: "msg_cons_" + Date.now(),
    sender: "designer",
    content: `I received your custom luxury consultation booking for ${date} at ${timeSlot}. Warm greetings! Our atelier is already preparing beautiful visual inspiration panels to show you.`,
    timestamp: new Date().toISOString()
  });
  thread.lastUpdated = new Date().toISOString();

  saveDB(db);
  res.json({ success: true, consultation: newConsultation });
});

// Wishlists
app.get("/api/wishlist", (req, res) => {
  const db = getDB();
  res.json(db ? db.wishlist || [] : []);
});

app.post("/api/wishlist/toggle", (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "DB error" });

  const { productId } = req.body;
  if (!db.wishlist) db.wishlist = [];

  const idx = db.wishlist.indexOf(productId);
  if (idx !== -1) {
    db.wishlist.splice(idx, 1);
  } else {
    db.wishlist.push(productId);
  }

  saveDB(db);
  res.json({ success: true, wishlist: db.wishlist });
});

// Authentication Simulator (Fully stateful for user email session)
app.post("/api/auth/register", (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "DB error" });

  const { email, name, phone } = req.body;
  let user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

  if (user) {
    return res.status(400).json({ error: "Email is already registered. Please login." });
  }

  const newUser = {
    id: "user_" + Date.now(),
    email: email.toLowerCase(),
    name,
    role: "customer",
    phone: phone || "",
    savedAddresses: [],
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDB(db);
  res.json({ success: true, user: newUser });
});

app.post("/api/auth/login", (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "DB error" });

  const { email } = req.body;
  let user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    // Auto-create a guest user if login with any email is done, for friendly UX!
    const newUser = {
      id: "user_" + Date.now(),
      email: email.toLowerCase(),
      name: email.split("@")[0].toUpperCase() + " / Premium Member",
      role: email.toLowerCase().includes("admin") || email.toLowerCase() === "codewithvibe64@gmail.com" ? "admin" : "customer",
      phone: "+91 99999 88888",
      savedAddresses: [
        {
          id: "addr_default",
          name: "My Silk Villa",
          street: "18 Orchard Boulevard, Sector 15",
          city: "New Delhi",
          state: "Delhi",
          pincode: "110001",
          phone: "+91 99999 88888"
        }
      ],
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    saveDB(db);
    user = newUser;
  }

  res.json({ success: true, user });
});

app.post("/api/auth/save-address", (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "DB error" });

  const { userId, address } = req.body;
  const userIndex = db.users.findIndex((u: any) => u.id === userId);
  if (userIndex !== -1) {
    if (!db.users[userIndex].savedAddresses) {
      db.users[userIndex].savedAddresses = [];
    }
    
    if (!address.id) {
      address.id = "addr_" + Date.now();
    }

    const addrIdx = db.users[userIndex].savedAddresses.findIndex((a: any) => a.id === address.id);
    if (addrIdx !== -1) {
      db.users[userIndex].savedAddresses[addrIdx] = address;
    } else {
      db.users[userIndex].savedAddresses.push(address);
    }
    
    saveDB(db);
    res.json({ success: true, address, user: db.users[userIndex] });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Orders & Payments
app.get("/api/orders/user/:userId", (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "DB error" });
  const userOrders = db.orders.filter((o: any) => o.userId === req.params.userId);
  res.json(userOrders);
});

// Admin orders endpoint
app.get("/api/admin/orders", (req, res) => {
  const db = getDB();
  res.json(db ? db.orders : []);
});

// Admin order status update
app.post("/api/admin/orders/status", (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "DB error" });
  
  const { orderId, status } = req.body;
  const index = db.orders.findIndex((o: any) => o.id === orderId);
  if (index !== -1) {
    db.orders[index].status = status;
    
    // Push updates to tracking timeline
    const timelineDesc = {
      "Order Placed": "Your exclusive order has been received at the central salon.",
      "In Crafting": "Our artisans have commenced precise weaving and tailoring of your size.",
      "Quality Check": "Your garments are going through standard and micro inspection for fit and quality.",
      "Dispatched": "Your luxury order is packaged in premium ANVAA boxes and handed over to elite transit partners.",
      "Out for Delivery": "The delivery agent is arriving with secure handover instructions.",
      "Delivered": "Handed over safely to the premium member. Thank you for your confidence in ANVAA."
    };

    const targetMsg = timelineDesc[status as keyof typeof timelineDesc] || `Status updated to ${status}.`;
    
    // Set matching tracking timeline events to done
    const statuses = ["Order Placed", "In Crafting", "Quality Check", "Dispatched", "Out for Delivery", "Delivered"];
    const currentIdx = statuses.indexOf(status);

    db.orders[index].trackingTimeline = db.orders[index].trackingTimeline.map((item: any) => {
      const itemIdx = statuses.indexOf(item.status);
      if (itemIdx <= currentIdx) {
        return { ...item, done: true, date: new Date().toLocaleString() };
      }
      return item;
    });

    saveDB(db);
    res.json({ success: true, order: db.orders[index] });
  } else {
    res.status(404).json({ error: "Order not found" });
  }
});

app.post("/api/orders", (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "DB error" });

  const { userId, items, subtotal, discount, shipping, total, address, paymentMethod } = req.body;

  const orderId = "ANVAA-" + Math.floor(100000 + Math.random() * 900000);

  const newOrder = {
    id: orderId,
    userId,
    items,
    subtotal,
    discount,
    shipping,
    total,
    address,
    paymentMethod,
    status: "Order Placed",
    createdAt: new Date().toISOString(),
    trackingTimeline: [
      { status: "Order Placed", date: new Date().toLocaleString(), description: "Your premium order has been recorded at the central salon.", done: true },
      { status: "In Crafting", date: "--", description: "Artisans commencing precise weaving and drape alignment.", done: false },
      { status: "Quality Check", date: "--", description: "Micro inspect for fit and gold thread perfection.", done: false },
      { status: "Dispatched", date: "--", description: "Placed in luxury premium boxes with custom notes.", done: false },
      { status: "Delivered", date: "--", description: "Prisintine physical handover complete.", done: false }
    ]
  };

  if (!db.orders) db.orders = [];
  db.orders.push(newOrder);

  // Decrement stock levels
  items.forEach((item: any) => {
    const prodIndex = db.products.findIndex((p: any) => p.id === item.product.id);
    if (prodIndex !== -1) {
      db.products[prodIndex].stock = Math.max(0, db.products[prodIndex].stock - item.quantity);
    }
  });

  saveDB(db);
  res.json({ success: true, order: newOrder });
});

// Serve frontend build or dev mode with Vite server
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: path.join(process.cwd(), "frontend"),
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ANVAA fullstack luxury server is runnning at http://127.0.0.1:${PORT}`);
  });
}

start();
